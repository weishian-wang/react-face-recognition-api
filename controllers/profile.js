const handleError = require('../util/handleError');

exports.handleGetProfile = db => (req, res, next) => {
  const user_id = req.params.id;

  db('users')
    .where({ user_id })
    .select()
    .then(users => {
      if (users.length) {
        return res.json(users[0]);
      }
      next(handleError('User not found.', 404, null));
    })
    .catch(err => next(handleError('Unable to get user info.', 500, null)));
};
