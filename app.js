const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { PORT = 4000 } = process.env;
const users = require('./routes/users');
const movies = require('./routes/movies');
const { addUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { handleError, handleError404 } = require('./errors/error-handlers');
const { limiter, createAccountLimiter } = require('./middlewares/rate-limiters');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: [
    '*'
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Origin', 'Authorization'],
  credentials: true,
};

const app = express();

mongoose.connect('mongodb://localhost:27017/movies', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('*', cors(options));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', createAccountLimiter, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), addUser);

app.post('/logout', auth, logout);

app.use('/users', auth, users);
app.use('/movies', auth, movies);
app.use('/*', handleError404);

app.use(errorLogger);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
