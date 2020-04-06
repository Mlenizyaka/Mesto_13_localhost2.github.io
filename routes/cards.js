const router = require('express').Router();
const auth = require('../middlewares/auth');

const { getCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:id', auth, deleteCard);

module.exports = router;
