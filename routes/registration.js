const router = require('express').Router();
const { userCreate } = require('../controllers/users');

router.post('/', userCreate);

module.exports = router;
