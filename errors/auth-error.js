const { AUTH_ERROR_CODE } = require('../constants/constants');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTH_ERROR_CODE;
  }
}

module.exports = AuthorizationError;
