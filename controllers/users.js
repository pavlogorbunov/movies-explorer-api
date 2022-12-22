const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const OK_CODE = 200;
const MONGO_DB_CONFLICT_CODE = 11000;
const { JWT_SECRET = 'dev-key' } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const cookieSettings = ((process.env.NODE_ENV === 'production') ? { httpOnly: true, sameSite: 'None', secure: true } : { httpOnly: true, sameSite: false, secure: false });

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(OK_CODE)
          .send(user);
      }
      next(new NotFoundError('Пользователь с таким id не найден.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный id для поиска пользователя.'));
        return;
      }
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res
          .status(OK_CODE)
          .send(user);
      }
      next(new NotFoundError('Пользователь с таким id не найден.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный id для поиска пользователя.'));
        return;
      }
      next(err);
    });
};

module.exports.addUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => {
      const newUser = user;
      newUser.password = undefined;
      res.status(OK_CODE).send(newUser);
    })
    .catch((err) => {
      if (err.code === MONGO_DB_CONFLICT_CODE) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        return;
      }
      next(err);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res
          .status(OK_CODE)
          .send(user);
      }
      next(new NotFoundError('Пользователь с таким id не найден.'));
      return null;
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(OK_CODE).cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        ...cookieSettings,
      }).send({ message: 'Authorized' });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('token', {
    ...cookieSettings,
  }).send({ message: 'Loggedout' });
};
