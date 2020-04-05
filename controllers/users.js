const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const secretKey = require('../utils/secretKey');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// Получаем всех пользователей из базы
const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// Возвращаем пользователя с указанным Id
const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Такой пользователь не найден');
      }
      return res.send({ data: result });
    })
    .catch(next);
};

// Создаем нового пользоввателя
const userCreate = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new BadRequestError('Такой пользователь уже существует');
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
        .catch(next);
    });
};

// Вход в систему (логин)
const login = (req, res, next) => {
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
    .catch(next);
};

module.exports = {
  getUserById, getUsers, login, userCreate,
};
