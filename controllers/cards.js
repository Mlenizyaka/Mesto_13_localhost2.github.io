const Card = require('../models/card');

// Возвращает список всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Создает новую карточку
module.exports.createCard = (req, res) => {
  const { name, link, likes } = req.body;
  const userId = req.user._id;

  // eslint-disable-next-line object-curly-newline
  Card.create({ name, link, owner: userId, likes })
    .then((card) => res.status(201).send({ data: card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: err.message });
    });
};

// Удаляет карточку с указанным id
module.exports.deleteCard = (req, res, err) => {
  Card.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((result) => {
      if (!result) {
        return res.status(404).send({
          message: 'Карточка с таким id отсутствует',
          err: err.message,
        });
      }
      res.send({ data: result });
    })
    // eslint-disable-next-line no-shadow
    .catch((err) => res.status(500).send({ message: err.message }));
};
