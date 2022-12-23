const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { PORT = 4000 } = process.env;
const { DB_NAME = 'movies' } = process.env;
const { OPTIONS_SUCCESS_STATUS } = require('./constants/constants');
const routes = require('./routes/index');
const { handleError } = require('./errors/error-handlers');
const { limiter } = require('./middlewares/rate-limiters');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: [
    '*',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: OPTIONS_SUCCESS_STATUS,
  allowedHeaders: ['Content-Type', 'Origin', 'Authorization'],
  credentials: true,
};

const app = express();

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('*', cors(options));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

app.use('/', routes);

app.use(errorLogger);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
