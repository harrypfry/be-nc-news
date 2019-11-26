const connection = require("../db/connection");

exports.selectAllTopics = () => {
  return connection
    .select("topics.*")
    .from("topics")
    .count({ article_count: "article_id" })
    .leftJoin("articles", "topics.slug", "articles.topic")
    .groupBy("topics.slug");
};

exports.insertTopic = ({ body }) => {
  return connection("topics").insert(body, "*");
};
