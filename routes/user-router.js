const userRouter = require("express").Router();

const {
  getUserByUsername,
  postUser,
  getUsers
} = require("../controllers/user-controller");

const { send405 } = require("../errors/error");

userRouter
  .route("/")
  .get(getUsers)
  .post(postUser)
  .all(send405);

userRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405);

module.exports = userRouter;
