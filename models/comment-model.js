const connection = require("../db/connection");

exports.updateCommentById = (comment_id, { inc_votes }) => {
  return connection
    .select("*")
    .from("comments")
    .where(comment_id)
    .increment({ votes: inc_votes })
    .returning("*")
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "Error: ID not found" });
      } else {
        return comment;
      }
    });
};

exports.removeCommentById = comment_id => {
  return connection("comments")
    .where(comment_id)
    .del()
    .returning("*")
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: "Error:ID not found" });
      } else {
        return [];
      }
    });
};
