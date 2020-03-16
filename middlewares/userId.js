// временное решение для авторизации
const userId = (req, res, next) => {
  req.user = {
    _id: "5e6fb69340fe6feaffa34a33"
  };

  next();
};

module.exports = userId;
