const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AuthorizationError = require('../errors/AuthorizationError');

// Возвращает список всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создает новую карточку
const createCard = (req, res, next) => {
  const { name, link, likes } = req.body;
  const userId = req.user._id;

  Card.create({
    name,
    link,
    owner: userId,
    likes,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

// Удаляет карточку с указанным id
const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      if (card.owner._id.toString() === req.user._id) {
        return Card.findByIdAndRemove(req.params.id)
          .then((result) => res.status(200).send({ message: `Карточка с id ${result._id} удалена` }))
          .catch((err) => next(new BadRequestError(err.message)));
      }
      throw new AuthorizationError('Необходимо авторизоваться чтобы удалить карточку');
    })
    .catch(next);
};

module.exports = {
  deleteCard,
  createCard,
  getCards,
};
