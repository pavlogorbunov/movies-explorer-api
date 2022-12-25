const movies = require('express').Router();
const {
  celebrate, Joi, errors,
} = require('celebrate');
const {
  getMovies, postMovie, deleteMovie,
} = require('../controllers/movies');

const { LINK_REG_EXP } = require('../constants/validators');

movies.get('/', getMovies);

movies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(LINK_REG_EXP),
    trailerLink: Joi.string().required().pattern(LINK_REG_EXP),
    thumbnail: Joi.string().required().pattern(LINK_REG_EXP),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);

movies.delete('/:movieId', deleteMovie);

movies.use(errors());

module.exports = movies;
