const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const secretKey = require('../utils/secretKey');

// Получаем всех пользователей из базы
const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err: err.message }));
};

// Возвращаем пользователя с указанным Id
const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .send({ message: 'Такой пользователь не найден' });
      }
      return res.send({ data: result });
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err: err.message }));
};

// Создаем нового пользоввателя
const userCreate = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(400).send({ message: 'Такой пользователь уже существует' });
      }
    });
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        .catch((err) => res.status(500).send({ message: err.message }));
    });
};

// Вход в систему (логин)
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        secretKey,
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

module.exports = {
  getUserById, getUsers, login, userCreate,
};
