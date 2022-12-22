const movies = require('express').Router();
const {
  celebrate, Joi, errors,
} = require('celebrate');
const {
  getMovies, postMovie, deleteMovie,
} = require('../controllers/movies');

const linkRegExp = /https?:\/\/[a-z0-9-.]{2,}.[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/i;

movies.get('/', getMovies);

movies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkRegExp),
    trailerLink: Joi.string().required().pattern(linkRegExp),
    thumbnail: Joi.string().required().pattern(linkRegExp),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);

movies.delete('/:movieId', deleteMovie);

movies.use(errors());

module.exports = movies;
