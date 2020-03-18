const router = require('express').Router();

const {
  userCreate,
  getUsers,
  getUserById,
} = require('../controllers/users.js');

router.get('/', getUsers); // получаем всех пользователей
router.get('/:id', getUserById); // получаем конкретного пользователя по id
router.post('/', userCreate); // создаем пользователя

module.exports = router;
