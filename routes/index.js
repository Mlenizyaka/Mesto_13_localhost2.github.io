const router = require('express').Router();

const { errors } = require('celebrate');
const errorHandler = require('../middlewares/errorHandler');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const authorization = require('./authorization');
const registration = require('./registration');
const users = require('./users');
const cards = require('./cards');
const error = require('./error');
const crashTest = require('./crashTest');

router.use(requestLogger); // логгер запросов

router.use('/crash-test', crashTest);
router.use('/signin', authorization);
router.use('/signup', registration);
router.use('/users', users);
router.use('/cards', cards);
router.use('*', error);

router.use(errorLogger); // логгер ошибок
router.use(errors()); // обработчик ошибок celebrate
router.use(errorHandler); // централизованный обработчик ошибок

module.exports = router;
