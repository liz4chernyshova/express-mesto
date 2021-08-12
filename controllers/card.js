const Card = require("../models/card");


const getCards = (req, res) =>
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() =>
      res
        .status(500)
        .send({ message: `Ошибка: ресурс не найден.` })
    );


const addCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
    });
};


const deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .orFail(new Error('Error'))
    .then((cards) => {
      if (req.user._id !== cards.owner.toString()) {
        res.status(403).send({ message: 'Чужая карточка.' });
      }
      cards.remove();
      if (!cards) {
        res.status(404).json({ message: 'Карточка не найдена.' });
      } else {
        res.status(200).send(cards);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
       res.status(400).send({ message: 'Ошибка в запросе.' });
      } else {
       res.status(500).send({ message: 'Ошибка на сервере.' });
     }
   });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((cards) => {
      if (!cards) {
        res.status(404).json({ message: 'Карточка не найдена.' });
      } else {
        res.status(200).send(cards);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка в запросе.' });
      }  else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((cards) => {
      if (!cards) {
        res.status(404).json({ message: 'Карточка не найдена.' });
      } else {
        res.status(200).send(cards);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка в запросе.' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
    });
};


module.exports = { getCards, addCard, deleteCard, likeCard, dislikeCard };