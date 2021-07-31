const User = require("../models/user");

const getAllUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(500)
        .send({ message: `Ошибка: ресурс не найден.` })
    );


const getUser = (req, res) =>
  User.findById(req.params.id)
    .then((user) => res.status(200).send(user))
    .catch(() =>
      res
        .status(500)
        .send({
          message: `Ошибка: пользователь не найден.`,
        })
    );


const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return (
    User.create({ name, about, avatar })
      .then((user) => res.status(200).send(user))
      .catch(() =>
        res
          .status(500)
          .send({ message: `Ошибка: пользователь не создан.` })
      )
  );
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { new: true }
  )
    .then((user) => res.status(200).send(user))
    .catch(() =>
      res
        .status(500)
        .send({
          message: `Ошибка: профиль пользоавателя не обновлен.`,
        })
    );
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch(() =>
      res
        .status(500)
        .send({
          message: `Ошибка: аватар пользоавателя не обновлен.`,
        })
    );
};


module.exports = {getAllUsers, getUser, createUser, updateUserInfo, updateAvatar};