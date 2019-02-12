const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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

app.post('/signin', (req, res, next) => {
  signin.handleSingIn(req, res, next, db, bcrypt);
});

app.post('/register', (req, res, next) => {
  register.handleRegister(req, res, next, db, bcrypt);
});

app.get('/profile/:id', (req, res, next) => {
  profile.handleGetProfile(req, res, next, db);
});

app.post('/imageurl', (req, res, next) => {
  image.handleApiCall(req, res, next);
});

app.put('/image', (req, res, next) => {
  image.handleImage(req, res, next, db);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
