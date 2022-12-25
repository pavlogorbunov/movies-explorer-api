const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-key' } = process.env;
const AuthorizationError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    next(new AuthorizationError());
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthorizationError());
    return;
  }

  req.user = payload;

  next();
};
