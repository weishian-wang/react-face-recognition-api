exports.handleRegister = (req, res, next, db, bcrypt) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 12);

  db.transaction(trx => {
    trx
      .insert({ hash: hashedPassword, email: email })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(result => res.json('You have successfully registered.'));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('Unable to register.'));
};
