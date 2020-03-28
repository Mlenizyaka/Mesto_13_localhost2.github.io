const User = require('../models/user.js');

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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', error: err.name }));
};
