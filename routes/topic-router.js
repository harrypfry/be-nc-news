const topicRouter = require("express").Router();

const { getAllTopics, postTopic } = require("../controllers/topic-controller");

const { send405 } = require("../errors/error");

topicRouter
  .route("/")
  .get(getAllTopics)
  .post(postTopic)
  .all(send405);

module.exports = topicRouter;
