const { ACCES_DENIED_CODE, ACCES_DENIED_MESSAGE } = require('../constants/constants');

class AccessDeniedError extends Error {
  constructor() {
    super(ACCES_DENIED_MESSAGE);
    this.statusCode = ACCES_DENIED_CODE;
  }
}

module.exports = AccessDeniedError;
