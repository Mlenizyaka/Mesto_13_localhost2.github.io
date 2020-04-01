const router = require('express').Router();

const bodyParser = require('./bodyParser');
const cookieParser = require('./cookieParser');
const helmet = require('./helmet');
const limiter = require('./limiter');

router.use(bodyParser);
router.use(cookieParser);
router.use(helmet);
router.use(limiter);

module.exports = router;
