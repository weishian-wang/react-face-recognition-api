const Clarifai = require('clarifai');
const { body, validationResult } = require('express-validator/check');

const app = new Clarifai.App({
  apiKey: 'f1e09f227ca843f29d7c628d9a25eeff'
});

exports.handleApiCall = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(e => {
      return { msg: e.msg };
    });
    return res.status(422).json(errorMessages);
  }

  const imageUrl = req.body.imageUrl;
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to work with API.'));
};

exports.handleImage = db => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(e => {
      return { msg: e.msg };
    });
    return res.status(422).json(errorMessages);
  }

  const user_id = req.body.user_id;
  db('users')
    .where({ user_id })
    .increment('entries', 1)
    .returning('entries')
    .then(data => res.json(Number(data[0])))
    .catch(err => res.status(400).json('Unable to update user entries.'));
};

exports.validate = method => {
  switch (method) {
    case 'imageUrl': {
      return [
        body('imageUrl')
          .isURL()
          .withMessage('Please enter a valid image URL.')
      ];
    }
    case 'userID': {
      return [body('user_id', 'Not valid.').isUUID()];
    }
  }
};
