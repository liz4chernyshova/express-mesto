const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/user');
const cardsRouter = require('./routes/card');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(auth);

app.use("/", usersRouter);
app.use("/", cardsRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден.' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});