const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator/check');

const handleError = require('../util/handleError');

exports.handleRegister = db => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw handleError('Validation failed.', 422, errors.array());
  }

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
          .then(result => res.status(200).json('You have successfully registered.'));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => next(handleError('Unable to register user.', 500, null)));
};

exports.validate = () => {
  return [
    body('name')
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage(
        'Your name must at least be 2 characters long and not exceed 50 characters.'
      )
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must at least be 8 characters long.')
      .trim()
  ];
};
