const router = require("express").Router();
const { getAllUsers, getUser, getCurrentUser, createUser, updateUserInfo, updateAvatar } = require("../controllers/user");

router.get("/users", getAllUsers);

router.get("/users/:userId", getUser);

router.get("/users/me", getCurrentUser);

router.patch("/users/me", createUser);

router.patch("/users/me", updateUserInfo);

router.patch("/user/me/avatar", updateAvatar);

module.exports = router;