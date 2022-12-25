const index = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createAccountLimiter } = require('../middlewares/rate-limiters');
const { addUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');
const { handleError404 } = require('../errors/error-handlers');

// index.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

index.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

index.post('/signup', createAccountLimiter, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), addUser);

index.post('/logout', auth, logout);

index.use('/users', auth, users);
index.use('/movies', auth, movies);
index.use('/*', handleError404);

module.exports = index;
