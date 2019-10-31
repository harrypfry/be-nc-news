const apiRouter = require("express").Router();

const topicRouter = require("./topic-router");
const userRouter = require("./user-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);
// apiRouter.use("/comments", () => {
//   console.log(1);
// });

module.exports = apiRouter;
