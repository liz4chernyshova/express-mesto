const Card = require('../models/card');
const error400 = require('../errors/ErrorBadRequest');
const error403 = require('../errors/ErrorForbidden');
const error404 = require('../errors/ErrorNotFound');
const error500 = require('../errors/ServerError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      next(new error500('На сервере произошла ошибка'));
    });
};

const addCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new error400('Переданы некорректные данные'));
      } else {
        next(new error500('Ошибка на сервере'));
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new error404('Карточка не найдена');
    })
    .then((cards) => {
      if (req.user._id !== cards.owner.toString()) {
        next(new error403('Чужая карточка'));
      } else {
        cards.remove();
        res.status(200).send(cards);
      }
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new error400('Ошибка в запросе.'));
      } else if (err.statusCode === 404) {
        next(new error404('Карточка не найдена'));
      } else {
        next(new error500('Ошибка на сервере.'));
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(() => {
      throw new error404('Карточка не найдена');
    })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new error400('Ошибка в запросе.'));
      } else if (err.statusCode === 404) {
        next(new error404('Карточка не найдена'));
      } else {
        next(new error500('Ошибка на сервере.'));
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(() => {
      throw new error404('Карточка не найдена');
    })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new error400('Ошибка в запросе.'));
      } else if (err.statusCode === 404) {
        next(new error404('Карточка не найдена'));
      } else {
        next(new error500('Ошибка на сервере.'));
      }
    });
};

module.exports = { getCards, addCard, deleteCard, likeCard, dislikeCard };
