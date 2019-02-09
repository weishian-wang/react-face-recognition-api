const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const app = express();
const port = 8080;
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test',
    database: 'smart-brain'
  }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res, next) => {
  res.json(database.users);
});

app.post('/signin', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;

  database.users.forEach(u => {
    // if (email === u.email && bcrypt.compareSync(password, u.password)) {
    //   user = u;
    // }
    if (email === u.email && password === u.password) {
      user = u;
    }
  });

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      entries: user.entries,
      joined: user.joined
    });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

app.post('/register', (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 12);

  db.transaction(trx => {
    trx
      .insert({ hash: hashedPassword, email: email })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(result => {
            res.json('You have successfully registered.');
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('Unable to register.'));
});

app.get('/profile/:id', (req, res, next) => {
  const id = req.params.id;
  let user;

  db('users')
    .where({ id })
    .select('name', 'email', 'entries', 'joined')
    .then(users => {
      if (users.length) {
        user = users[0];
        return res.json(user);
      }
      res.status(404).json('User not found.');
    })
    .catch(err => res.status(400).json('Unable to get user profile.'));
});

app.put('/image', (req, res, next) => {
  const { id } = req.body;
  let user;

  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(data => res.json(Number(data[0])))
    .catch(err => res.status(400).json('Unable to get user entries.'));
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
