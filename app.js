const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userId = require("./middlewares/userId");
const routers = require("./routes/index");

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(userId);
app.use(routers);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
