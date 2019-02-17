# Face Recognition App - Back End

Face Recognition App is an app for registered user to submit a publicly accessible URL of image, displays the image along with blue bounding boxes around each human faces it detects.

## Built With

* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [Clarifai Face Detection API](https://clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection) - API used to detect human faces in a image
* [node-postgres](https://github.com/brianc/node-postgres) - A PostgreSQL client for Node.js
* [Knex.js](https://knexjs.org/) - Used to build SQL query for PostgresSQL
* [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - A optimized bcrypt library used to help hash passwords
* [express-validator](https://express-validator.github.io/docs/) - Used to validator and sanitizer user input on the server side
* [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Used JSON Web Tokens to authenticate user login

## Application Link

My [Face Recognition App](https://react-face-detection.herokuapp.com/) is hosting by Heroku.

## Screenshots

[![Front-End-screenshot.png](https://i.postimg.cc/hPv5G4rd/Front-End-screenshot.png)](https://postimg.cc/RNrRsB2S)