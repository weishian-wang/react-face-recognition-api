const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

exports.handleSingIn = db => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(e => {
      return { msg: e.msg };
    });
    return res.status(422).json(errorMessages);
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
            return res.json({ token: token, userData: userData[0] });
          })
          .catch(err => res.status(404).json('Unable to get user.'));
      } else {
        res.status(400).json('Wrong credentials.');
      }
    })
    .catch(err => res.status(400).json('Unable to login.'));
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
