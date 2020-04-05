const router = require('express').Router();

router.get('/', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

module.exports = router;
