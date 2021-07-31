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
    .catch(() =>
      res
        .status(500)
        .send({ message: `Ошибка: карточка не создана.` })
    );
};


const deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .then((card) => res.status(200).send(card))
    .catch(() =>
      res
        .status(500)
        .send({ message: `Ошибка: карточка не удалена.` })
    );
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.status(200).send(card))
    .catch(() =>
      res
        .status(500)
        .send({
          message: `Ошибка: лайк не поставлен.`,
        })
    );
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.status(200).send(card))
    .catch(() =>
      res
        .status(500)
        .send({
          message: `Ошибка: лайк не стнят.`,
        })
    );
};


module.exports = { getCards, addCard, deleteCard, likeCard, dislikeCard };