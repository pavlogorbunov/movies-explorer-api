const users = require('express').Router();
const {
  celebrate, Joi, errors,
} = require('celebrate');
const {
  patchUser, getMe,
} = require('../controllers/users');

users.get('/me', getMe);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
  }),
}), patchUser);

users.use(errors());

module.exports = users;
