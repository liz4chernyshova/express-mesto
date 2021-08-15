const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const error400 = require('../errors/ErrorBadRequest');
const error401 = require('../errors/ErrorAuthorization');
const error404 = require('../errors/ErrorNotFound');
const error409 = require('../errors/ErrorConflict');
const error500 = require('../errors/ServerError');
const { JWT_SECRET } = require('../utils/key');

const getAllUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      next(new error500('Ошибка на сервере.'));
    });
  

const getUser = (req, res, next) =>
  User.findById(req.params.userId)
    .orFail(() => {
      throw (new error404('Пользователь не найден'));
    })
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === "CastError") {
        next(new error400('Переданы некорректные данные'));
      } else if (err.statusCode === 404) {
        next(new error404('Пользователь не найден'));
      } else {
        next(new error500('Ошибка на сервере.'));
      }
    });


const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw (new error404('Пользователь не найден'));
    })
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === "CastError") {
        next(new error400('Переданы некорректные данные'));
      } else if (err.statusCode === 404) {
        next(new error404('Пользователь не найден'));
      } else {
        next(new error500('Ошибка на сервере.'));
      }
    });
};


const createUser = (req, res, next) => {
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
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new error400('Переданы некорректные данные.'));
      } else if (err.name === "MongoError" && err.code === 11000) {
        next(new error409('Пользователь уже зарегистрирован.'));
      } else {
        next(new error500('Ошибка на сервере.'));
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate( req.user._id,
    { name: name, about: about },
    { new: true, runValidators: true }
  )
  .orFail(() => {
    next(new error404('Пользователь не найден'));
  })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === "CastError") {
      next(new error400('Переданы некорректные данные.'));
    } else if (err.statusCode === 404) {
      next(new error404('Пользователь не найден'));
    } else {
      next(new error500('Ошибка на сервере.'));
    }
  });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, 
    { avatar: avatar },
    { runValidators: true })
  .orFail(() => {
    next(new error404('Пользователь не найден'));
  })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === "CastError") {
      next(new error400('Переданы некорректные данные.'));
    } else if (err.statusCode === 404) {
      next(new error404('Пользователь не найден'));
    } else {
      next(new error500('Ошибка на сервере.'));
    }
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new error400('Переданы некорректные данные.');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d', });
      res
        .cookie('jwt', token, 
        { httpOnly: true, sameSite: true, })
        .send({ token });
    })
    .catch(() => {
      throw new error401('Необходимо авторизоваться.');
    })
    .catch(next);
}

module.exports = {getAllUsers, getUser, createUser, updateUserInfo, getCurrentUser, updateAvatar, login};