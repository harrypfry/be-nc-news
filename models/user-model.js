const connection = require("../db/connection");

exports.selectUserByUserName = ({ params }) => {
  return (
    connection
      .first("users.*")
      .from("users")
      .where(params)

      //=== NOT SUMMING CORRECTLY
      .sumDistinct({ comment_score: "comments.votes" })
      .join("comments", "users.username", "comments.author")
      .sumDistinct({ article_score: "articles.votes" })
      .join("articles", "users.username", "articles.author")
      .groupBy("users.username")
      .then(user => {
        if (!user) {
          return Promise.reject({ status: 404, msg: "Error: User not found" });
        } else {
          return user;
        }
      })
  );
};

exports.postUser = user => {
  return connection("users").insert(user, "*");
};

exports.selectUsers = ({ limit }) => {
  return (
    connection
      .select("users.*")
      .from("users")
      .join("comments", "users.username", "comments.author")

      //=== HERE - SUM VOTES OF comments.votes & articles.votes
      // .sum({ sum: ["comments.votes", 4] })

      .sum({ total_score: "comments.votes" })
      .groupBy("users.username")
      .orderBy("total_score", "desc")
      .limit(limit || "1000")
  );
};
