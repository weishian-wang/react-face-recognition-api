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
  const { email, password } = req.body;

  db('login')
    .where({ email })
    .select('hash')
    .then(data => {
      const hashedPassword = data[0].hash;
      const isValid = bcrypt.compareSync(password, hashedPassword);
      if (isValid) {
        return db('users')
          .where({ email })
          .select()
          .then(userData => res.json(userData[0]))
          .catch(err => res.status(404).json('Unable to get user.'));
      } else {
        res.status(400).json('Wrong credentials.');
      }
    })
    .catch(err => res.status(400).json('Unable to login.'));
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
          .then(result => res.json('You have successfully registered.'));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('Unable to register.'));
});

app.get('/profile/:id', (req, res, next) => {
  const id = req.params.id;

  db('users')
    .where({ id })
    .select('name', 'email', 'entries', 'joined')
    .then(users => {
      if (users.length) {
        return res.json(users[0]);
      } else {
        res.status(404).json('User not found.');
      }
    })
    .catch(err => res.status(400).json('Unable to get user profile.'));
});

app.put('/image', (req, res, next) => {
  const { id } = req.body;

  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(data => res.json(Number(data[0])))
    .catch(err => res.status(400).json('Unable to get user entries.'));
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
