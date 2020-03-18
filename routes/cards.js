const router = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/', getCards); // получить все карточки
router.post('/', createCard); // создать карточку
router.delete('/:id', deleteCard); // удалить карточку

module.exports = router;
