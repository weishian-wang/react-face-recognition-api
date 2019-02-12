const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'f1e09f227ca843f29d7c628d9a25eeff'
});

exports.handleApiCall = (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to work with API.'));
};

exports.handleImage = (req, res, next, db) => {
  const id = req.body.id;

  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(data => res.json(Number(data[0])))
    .catch(err => res.status(400).json('Unable to get user entries.'));
};
