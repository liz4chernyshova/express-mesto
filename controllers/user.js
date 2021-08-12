const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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


const getCurrentUser = (req, res) => {
    User.findById(req.user._id)
    .orFail(new Error('NotFound'))
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
  };


const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, 
    }))
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
      } else if (err.name === "MongoError" && err.code === 11000) {
        res.status(409).send({ massage: 'Данный пользователь уже зарегистрирован.' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере.' });
      }
  })
};

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

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Заполните поля' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: 'Пользователь не авторезирован' });
    });
};



module.exports = {getAllUsers, getUser, createUser, updateUserInfo, getCurrentUser, updateAvatar, login};