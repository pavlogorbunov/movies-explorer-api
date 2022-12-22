const OK_CODE = 200;
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AccessDeniedError = require('../errors/access-denied-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.postMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image,
    trailerLink, thumbnail, movieId,
    nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(OK_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для создания записи о фильме.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOneAndDelete({ _id: req.params.movieId, owner: req.user._id })
    .then((movie) => {
      if (movie) {
        return res
          .status(OK_CODE)
          .send({ message: 'DELETED' });
      }
      Movie.findById(req.params.movieId)
        .then((movieWithId) => {
          if (movieWithId) {
            next(new AccessDeniedError('Нельзя удалять чужие записи о фильмах!'));
            return;
          }
          next(new NotFoundError('Запись о фильме с таким id не найдена.'));
        })
        .catch(next);
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id для поиска записи о фильме.'));
        return;
      }
      next(err);
    });
};
