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
