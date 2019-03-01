const Clarifai = require('clarifai');
const { body, validationResult } = require('express-validator/check');

const handleError = require('../util/handleError');

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

exports.handleApiCall = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw handleError('Validation failed.', 422, errors.array());
  }

  const imageUrl = req.body.imageUrl;
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
    .then(data => res.json(data))
    .catch(err => next(handleError('Unable to work with API.', 500, null)));
};

exports.handleImage = db => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw handleError('Validation failed.', 422, errors.array());
  }

  const user_id = req.body.user_id;
  db('users')
    .where({ user_id })
    .increment('entries', 1)
    .returning('entries')
    .then(data => res.json(data[0]))
    .catch(err => next(handleError('Unable to update user entries.', 500, null)));
};

exports.validate = method => {
  switch (method) {
    case 'imageUrl': {
      return [
        body('imageUrl')
          .isURL()
          .withMessage('Entered image URL is invalid.')
      ];
    }
    case 'userID': {
      return [body('user_id', 'Invalid user ID.').isUUID()];
    }
  }
};
