const { NOT_FOUND_ERROR_CODE, NOT_FOUND_ERROR_MESSAGE } = require('../constants/constants');

class NotFoundError extends Error {
  constructor() {
    super(NOT_FOUND_ERROR_MESSAGE);
    this.message = NOT_FOUND_ERROR_MESSAGE;
    this.statusCode = NOT_FOUND_ERROR_CODE;
  }
}

module.exports = NotFoundError;
