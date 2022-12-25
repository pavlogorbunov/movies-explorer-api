const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { OK_CODE, MONGO_DB_CONFLICT_CODE } = require('../constants/constants');

const { JWT_SECRET = 'dev-key' } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const cookieSettings = ((process.env.NODE_ENV === 'production') ? { httpOnly: true, sameSite: false, secure: false } : { httpOnly: true, sameSite: false, secure: false });

// console.log(cookieSettings);

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(OK_CODE)
          .send(user);
      }
      next(new NotFoundError());
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
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
      next(new NotFoundError());
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
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
        next(new ConflictError());
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
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
      next(new NotFoundError());
      return null;
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        next(new BadRequestError());
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
