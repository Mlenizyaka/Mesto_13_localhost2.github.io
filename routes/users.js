const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUserById,
  getUsers,
} = require('../controllers/users.js');

router.use(auth);

router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;
