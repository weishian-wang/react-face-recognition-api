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
    res.status(200).json({
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

  db('users')
    .insert({ name: name, email: email, joined: new Date() })
    .then(result => {
      return db('login').insert({ hash: hashedPassword, email: email });
    })
    .then(result => {
      res.status(200).json('You have successfully registered.');
    })
    .catch(err => res.status(400).json('Unable to register.'));
});

app.get('/profile/:id', (req, res, next) => {
  const userId = req.params.id;
  let user;

  database.users.forEach(u => {
    if (u.id === userId) {
      user = u;
    }
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json('User not found.');
  }
});

app.put('/image', (req, res, next) => {
  const { id } = req.body;
  let user;

  database.users.forEach(u => {
    if (u.id === id) {
      u.entries++;
      user = u;
    }
  });

  if (user) {
    res.status(200).json(user.entries);
  } else {
    res.status(404).json('User not found.');
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
