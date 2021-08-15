const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/user');
const cardsRouter = require('./routes/card');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');
const Error404 = require('./errors/ErrorNotFound');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(auth);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([a-zA-z0-9%$&=?/.-]+)\.([a-zA-z0-9%$&=?/.-]+)([a-zA-z0-9%$&=?/.-]+)?(#)?$/),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
  }),
}), createUser);

app.all('*', (req, res, next) => next(new Error404('Ресурс не найден')));

app.listen(PORT);
