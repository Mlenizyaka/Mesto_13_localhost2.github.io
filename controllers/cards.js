const Card = require('../models/card');

// Возвращает список всех карточек
const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Создает новую карточку
const createCard = (req, res) => {
  const { name, link, likes } = req.body;
  const userId = req.user._id;

  Card.create({
    name,
    link,
    owner: userId,
    likes,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

// Удаляет карточку с указанным id
const deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: `Карточка с id ${req.params.id} не найдена` });
      }
      if (card.owner._id.toString() === req.user._id) {
        return Card.findByIdAndRemove(req.params.id)
          .then((result) => res.status(200).send({ message: `Карточка с id ${result._id} удалена` }))
          .catch((err) => res.status(400).send({ message: err.message }));
      }
      return res.status(403).send({ message: 'Необходимо авторизоваться чтобы удалить карточку' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  deleteCard,
  createCard,
  getCards,
};
