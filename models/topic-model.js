const connection = require("../db/connection");

exports.selectAllTopics = () => {
  return connection.select("*").from("topics");
};

exports.insertTopic = ({ body }) => {
  return connection("topics").insert(body, "*");
};
