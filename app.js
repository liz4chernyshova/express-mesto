const express = require('express');
const mongoose = require("mongoose");

const usersRouter = require('./routes/user');
const cardsRouter = require('./routes/card');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});


app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "60f7fc8d4ad9275388218471",
  };

  next();
});

app.use("/", usersRouter);
app.use("/", cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});