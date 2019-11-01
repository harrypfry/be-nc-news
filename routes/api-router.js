const apiRouter = require("express").Router();

const topicRouter = require("./topic-router");
const userRouter = require("./user-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");

const { getAvailableEndpoints } = require("../controllers/api-controller");

const { send405 } = require("../errors/error");

apiRouter
  .route("/")
  .get(getAvailableEndpoints)
  .all(send405);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
