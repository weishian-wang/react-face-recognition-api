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
const isAuth = require('./middleware/isAuth');

const app = express();
const port = process.env.PORT;
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());
app.use(helmet());

app.get('/', (req, res, next) => {
  res.send('Server is running!');
});

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

app.get('/profile/:id', isAuth, profileController.handleGetProfile(db));

app.post(
  '/imageurl',
  isAuth,
  imageController.validate('imageUrl'),
  imageController.handleApiCall
);

app.put(
  '/image',
  isAuth,
  imageController.validate('userID'),
  imageController.handleImage(db)
);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const errorMsg = error.message;
  const errorData = error.data;
  res.status(status).json({ errorMsg: errorMsg, errorData: errorData });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
