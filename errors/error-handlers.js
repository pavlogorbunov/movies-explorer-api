const { SERVER_ERROR_CODE, SERVER_ERROR_MESSAGE } = require('../constants/constants');
const NotFoundError = require('./not-found-error');

const handleError = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR_CODE, message = SERVER_ERROR_MESSAGE } = err;

  res
    .status(statusCode)
    .send(message);

  next();
};

function handleError404(req, res, next) {
  // console.log('________________404________________');
  next(new NotFoundError('Page not found. 404.'));
}

module.exports = { handleError, handleError404 };
