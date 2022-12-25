const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AuthorizationError = require('../errors/auth-error');
const { EMAIL_REG_EXP } = require('../constants/validators');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Вит',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: EMAIL_REG_EXP,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError());
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError());
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
