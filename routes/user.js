const router = require("express").Router();
const { getAllUsers, getUser, getCurrentUser, updateUserInfo, updateAvatar } = require("../controllers/user");
const { celebrate, Joi } = require('celebrate');

router.get("/users", getAllUsers);

router.get("/users/:userId", celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
}), getUser);
  

router.get("/users/me", getCurrentUser);

router.patch("/users/me", celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
}), updateUserInfo);

router.patch("/users/me/avatar", celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/^(https?:\/\/)?([a-zA-z0-9%$&=?/.-]+)\.([a-zA-z0-9%$&=?/.-]+)([a-zA-z0-9%$&=?/.-]+)?(#)?$/,),
    }),
}), updateAvatar);

module.exports = router;