const topicRouter = require("express").Router();

const { getAllTopics } = require("../controllers/topic-controller");

const { send405 } = require("../errors/error");

topicRouter
  .route("/")
  .get(getAllTopics)
  .all(send405);

module.exports = topicRouter;
