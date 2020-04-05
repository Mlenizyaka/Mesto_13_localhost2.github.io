const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUserById,
  getUsers,
} = require('../controllers/users.js');

router.use(auth);

router.get('/', getUsers);
router.get('/:id', celebrate({
  params: Joi.string().alphanum().length(24),
}), getUserById);

module.exports = router;
