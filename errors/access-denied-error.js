const { ACCES_DENIED_CODE } = require('../constants/constants');

class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ACCES_DENIED_CODE;
  }
}

module.exports = AccessDeniedError;
