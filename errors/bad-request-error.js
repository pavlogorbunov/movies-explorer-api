const { BAD_REQUEST_CODE, BAD_REQUEST_MESSAGE } = require('../constants/constants');

class BadRequestError extends Error {
  constructor() {
    super(BAD_REQUEST_MESSAGE);
    this.statusCode = BAD_REQUEST_CODE;
  }
}

module.exports = BadRequestError;
