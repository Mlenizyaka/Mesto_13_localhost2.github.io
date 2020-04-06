const router = require('express').Router();

const authorization = require('./authorization');
const registration = require('./registration');
const users = require('./users');
const cards = require('./cards');
const error = require('./error');

router.use('/signin', authorization);
router.use('/signup', registration);
router.use('/users', users);
router.use('/cards', cards);
router.use('*', error);

module.exports = router;
