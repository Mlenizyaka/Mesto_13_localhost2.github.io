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
// eslint-disable-next-line no-unused-vars
module.exports.deleteCard = (req, res, err) => {
  Card.findOne({ _id: req.params.cardId })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner === req.user._id) {
        return Card.findByIdAndRemove(req.params.id)
          // eslint-disable-next-line consistent-return
          .then((result) => {
            res.status(200).send({ data: result });
          })
          // eslint-disable-next-line no-shadow
          .catch((err) => res.status(400).send({ message: err.message }));
      }
      res.status(400).send('Необходимо авторизоваться чтобы удалить карточку');
    })
    // eslint-disable-next-line no-shadow
    .catch((err) => res.status(500).send({ message: err.message }));
};
