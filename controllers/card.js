const Card = require('../models/card');
const Error400 = require('../errors/ErrorBadRequest');
const Error403 = require('../errors/ErrorForbidden');
const Error404 = require('../errors/ErrorNotFound');
const Error500 = require('../errors/ServerError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      next(new Error500('На сервере произошла ошибка'));
    });
};

const addCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорректные данные'));
      } else {
        next(new Error500('Ошибка на сервере'));
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error404('Карточка не найдена');
    })
    .then((cards) => {
      if (req.user._id !== cards.owner.toString()) {
        next(new Error403('Чужая карточка'));
      } else {
        cards.remove();
        res.status(200).send(cards);
      }
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new Error400('Ошибка в запросе.'));
      } else if (err.statusCode === 404) {
        next(new Error404('Карточка не найдена'));
      } else {
        next(new Error500('Ошибка на сервере.'));
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(() => {
      throw new Error404('Карточка не найдена');
    })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Ошибка в запросе.'));
      } else if (err.statusCode === 404) {
        next(new Error404('Карточка не найдена'));
      } else {
        next(new Error500('Ошибка на сервере.'));
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(() => {
      throw new Error404('Карточка не найдена');
    })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Ошибка в запросе.'));
      } else if (err.statusCode === 404) {
        next(new Error404('Карточка не найдена'));
      } else {
        next(new Error500('Ошибка на сервере.'));
      }
    });
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
