const { errors } = require('celebrate');
const router = require('express').Router();

const errorHandler = require('../middlewares/errorHandler');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const authorization = require('./authorization');
const registration = require('./registration');
const users = require('./users');
const cards = require('./cards');
const error = require('./error');

router.use(requestLogger); // логгер запросов

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/signin', authorization);
router.use('/signup', registration);
router.use('/users', users);
router.use('/cards', cards);
router.use('*', error);

router.use(errorLogger); // логгер ошибок
router.use(errors()); // обработчик ошибок celebrate
router.use(errorHandler); // централизованный обработчик ошибок

module.exports = router;
