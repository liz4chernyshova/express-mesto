const User = require("../models/user");

const getAllUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка в запросе.' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
  });
  


const getUser = (req, res) =>
  User.findById(req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
       res.status(400).send({ message: 'Ошибка в запросе.' });
     } else if (err.name === 'Error') {
       res.status(404).send({ message: 'Карточка не найдена.' });
     } else {
       res.status(500).send({ message: 'Ошибка на сервере.' });
     }
   });


const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return (
    User.create({ name, about, avatar })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки.' });
        } else if (err.name === 'Error') {
          res.status(404).send({ message: 'Карточка не найдена.' });
        } else {
          res.status(500).send({ message: 'Ошибка на сервере.' });
        }
    })
  )};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { runValidators: true }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки.' });
      } else if (err.name === 'Error') {
        res.status(404).send({ message: 'Карточка не найдена.' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки.' });
      } else if (err.name === 'Error') {
        res.status(404).send({ message: 'Карточка не найдена.' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
    });
};


module.exports = {getAllUsers, getUser, createUser, updateUserInfo, updateAvatar};