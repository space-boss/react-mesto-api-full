/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { isURL } = require('validator');

const auth = require('./middlewares/auth');

const { PORT = 2000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const { createUser, login } = require('./controllers/users');
const { usersRoutes } = require('./routes/users.js');
const { cardsRoutes } = require('./routes/cards.js');
const NotFoundError = require('./errors/not-found-err');

mongoose.set('debug', false);

const app = express();

router.use(bodyParser.json());

router.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const validateUrl = (value, helpers) => {
  if (!isURL(value, { require_protocol: true })) {
    return helpers.message('В данном поле допустимы только валидные ссылки');
  }
  return value;
};

const methodNotAllowed = (req, res, next) => res.status(404).send();

router.use(cors({
  origin: 'https://spaceboss.mesto.nomoredomains.club',
  credentials: true,
}));

router.route('/crash-test').get(() => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.route('/signin').post(celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login).all(methodNotAllowed);

router.route('/signup').post(celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.string().custom(validateUrl, 'Ссылка не валидна').default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }),
}), createUser).all(methodNotAllowed);

router.use('/', auth, usersRoutes);
router.use('/', auth, cardsRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

router.use(errors());

router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

module.exports = router;
