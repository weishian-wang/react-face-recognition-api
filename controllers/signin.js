const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

const handleError = require('../util/handleError');

exports.handleSingIn = db => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw handleError('Validation failed.', 422, errors.array());
  }

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
          .then(userData => {
            const token = jwt.sign(
              { user_id: userData[0].user_id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '1h' }
            );
            return res.status(200).json({ token: token, userData: userData[0] });
          })
          .catch(err => next(handleError('Unable to get user info.', 500, null)));
      } else {
        next(handleError('Wrong email or password.', 422, null));
      }
    })
    .catch(err => next(handleError('Unable to login.', 500, null)));
};

exports.validate = () => {
  return [
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
