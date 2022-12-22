const NotFoundError = require('./not-found-error');

const handleError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};

function handleError404(req, res, next) {
  // console.log('________________404________________');
  next(new NotFoundError('Page not found. 404.'));
}

module.exports = { handleError, handleError404 };
