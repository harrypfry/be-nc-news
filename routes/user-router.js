const userRouter = require("express").Router();

const { getUserByUsername } = require("../controllers/user-controller");

const { send405 } = require("../errors/error");

userRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405);

module.exports = userRouter;
