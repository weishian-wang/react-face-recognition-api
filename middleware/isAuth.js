const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ errorMsg: 'Not authenticated.' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(500).json({ errorMsg: 'Not valid.' });
  }
  if (!decodedToken) {
    return res.status(401).json({ errorMsg: 'Not authenticated.' });
  }
  next();
};
