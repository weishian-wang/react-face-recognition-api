require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const knex = require('knex');
const helmet = require('helmet');

const signinController = require('./controllers/signin');
const registerController = require('./controllers/register');
const profileController = require('./controllers/profile');
const imageController = require('./controllers/image');

const app = express();
const port = process.env.PORT;
const db = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});

app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());
app.use(helmet());

app.post(
  '/signin',
  signinController.validate(),
  signinController.handleSingIn(db)
);

app.post(
  '/register',
  registerController.validate(),
  registerController.handleRegister(db)
);

app.get('/profile/:id', profileController.handleGetProfile(db));

app.post(
  '/imageurl',
  imageController.validate('imageUrl'),
  imageController.handleApiCall
);

app.put(
  '/image',
  imageController.validate('userID'),
  imageController.handleImage(db)
);

app.listen(port, () => console.log(`Server is running on port ${port}`));
