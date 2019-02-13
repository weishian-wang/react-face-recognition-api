exports.handleGetProfile = db => (req, res, next) => {
  const user_id = req.params.id;

  db('users')
    .where({ user_id })
    .select('name', 'email', 'entries', 'joined')
    .then(users => {
      if (users.length) {
        return res.json(users[0]);
      }
      res.status(404).json('User not found.');
    })
    .catch(err => res.status(400).json('Unable to get user profile.'));
};
