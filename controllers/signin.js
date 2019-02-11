exports.handleSingIn = (req, res, next, db, bcrypt) => {
  const { email, password } = req.body;

  db('login')
    .where({ email })
    .select('hash')
    .then(data => {
      const hashedPassword = data[0].hash;
      const isValid = bcrypt.compareSync(password, hashedPassword);
      if (isValid) {
        return db('users')
          .where({ email })
          .select()
          .then(userData => res.json(userData[0]))
          .catch(err => res.status(404).json('Unable to get user.'));
      } else {
        res.status(400).json('Wrong credentials.');
      }
    })
    .catch(err => res.status(400).json('Unable to login.'));
};
