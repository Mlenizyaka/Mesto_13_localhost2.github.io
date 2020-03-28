const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const { NODE_ENV, JWT_SECRET } = process.env;

// Получаем всех пользователей из базы
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err: err.message }));
};

// Возвращаем пользователя с указанным Id
module.exports.getUserById = (req, res, err) => {
  User.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .send({ message: 'Такой пользователь не найден', err: err.message });
      }
      res.send({ data: result });
    })
    // eslint-disable-next-line no-shadow
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err: err.message }));
};

// Создаем нового пользоввателя
module.exports.userCreate = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        return res.status(400).send({ message: 'Такой пользователь уже существует' });
      }
      // хешируем пароль
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash, // записываем хеш в базу
          name,
          about,
          avatar,
        }))
        // eslint-disable-next-line no-shadow
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => res.status(400).send({ message: 'Произошла ошибка', error: err.name }));
    });
};

// Вход в систему (логин)
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
