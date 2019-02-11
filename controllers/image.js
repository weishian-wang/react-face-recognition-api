exports.handleImage = (req, res, next, db) => {
  const id = req.body.id;

  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(data => res.json(Number(data[0])))
    .catch(err => res.status(400).json('Unable to get user entries.'));
};
