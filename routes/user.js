const router = require("express").Router();
const { getAllUsers, getUser, createUser, updateUserInfo, updateAvatar } = require("../controllers/user");

router.get("/users", getAllUsers);

router.get("/users/:userId", getUser);

router.post("/users", createUser);

router.patch("/users/me", updateUserInfo);

router.patch("/user/me/avatar", updateAvatar);

module.exports = router;