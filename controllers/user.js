const User = require("../models/user");

const getAllUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' })
  );
  


const getUser = (req, res) =>
  User.findById(req.params.id)
    .then((users) => {
      if (!users) {
        res.status(404).json({ message: 'Пользователь не найден.' });
      } else {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
       res.status(400).send({ message: 'Ошибка в запросе.' });
     } else {
       res.status(500).send({ message: 'Ошибка на сервере.' });
     }
   });


const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return (
    User.create({ name, about, avatar })
      .then((users) => {
        if (!users) {
          res.status(404).json({ message: 'Пользователь не найден.' });
        } else {
          res.status(200).send(users);
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные.' });
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
    .then((users) => {
      if (!users) {
        res.status(404).json({ message: 'Пользователь не найден.' });
      } else {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { runValidators: true })
    .then((users) => {
      if (!users) {
        res.status(404).json({ message: 'Пользователь не найден.' });
      } else {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
    });
};


module.exports = {getAllUsers, getUser, createUser, updateUserInfo, updateAvatar};