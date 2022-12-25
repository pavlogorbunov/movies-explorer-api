const { CONFLICT_ERROR_CODE, CONFLICT_ERROR_MESSAGE } = require('../constants/constants');

class ConflictError extends Error {
  constructor() {
    super();
    this.message = CONFLICT_ERROR_MESSAGE;
    this.statusCode = CONFLICT_ERROR_CODE;
  }
}

module.exports = ConflictError;
