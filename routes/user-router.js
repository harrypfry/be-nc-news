const userRouter = require("express").Router();

const {
  getUserByUsername,
  postUser
} = require("../controllers/user-controller");

const { send405 } = require("../errors/error");

userRouter
  .route("/")
  .post(postUser)
  .all(send405);

userRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405);

module.exports = userRouter;
