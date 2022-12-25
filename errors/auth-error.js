const { AUTH_ERROR_CODE, AUTH_ERROR_MESSAGE } = require('../constants/constants');

class AuthorizationError extends Error {
  constructor() {
    super(AUTH_ERROR_MESSAGE);
    this.statusCode = AUTH_ERROR_CODE;
  }
}

module.exports = AuthorizationError;
