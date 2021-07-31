const express = require('express');
const mongoose = require("mongoose");

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});


const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "60f7fc8d4ad9275388218471",
  };

  next();
});

app.use("/", usersRoute);
app.use("/", cardsRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});