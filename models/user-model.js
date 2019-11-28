const connection = require("../db/connection");

exports.selectUserByUserName = ({ params }) => {
  const userPromise = connection
    .first("*")
    .from("users")
    .where(params);

  const commentsVotesPromise = connection
    .select("users.*")
    .from("users")
    .where(params)
    .sum({ comment_score: "comments.votes" })
    .leftJoin("comments", "users.username", "comments.author")
    .groupBy("users.username");

  const articleVotesPromise = connection
    .select("users.*")
    .from("users")
    .where(params)
    .sum({ article_score: "articles.votes" })
    .leftJoin("articles", "users.username", "articles.author")
    .groupBy("users.username");

  return Promise.all([
    userPromise,
    commentsVotesPromise,
    articleVotesPromise
  ]).then(([userPromise, [commentsVotesPromise], [articleVotesPromise]]) => {
    const { avatar_url, name, username } = userPromise;
    return {
      avatar_url,
      name,
      username,
      comment_score: commentsVotesPromise.comment_score,
      article_score: articleVotesPromise.article_score
    };
  });

  // return (
  //   connection
  //     .first("users.*")
  //     .from("users")
  //     .where(params)

  //     //=== NOT SUMMING CORRECTLY

  //     .sum({ comment_score: "comments.votes" })
  //     .join("comments", "users.username", "comments.author")
  //     // .sumDistinct({ article_score: "articles.votes" })
  //     // .join("articles", "users.username", "articles.author")
  //     .groupBy("users.username")
  //     .then(user => {
  //       if (!user) {
  //         return Promise.reject({ status: 404, msg: "Error: User not found" });
  //       } else {
  //         return user;
  //       }
  //     })
  // );
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
      // .sum({ sum: ["comments.votes", 4] }).raw()

      .sum({ total_score: ["comments.votes", "articles.votes"] })
      .groupBy("users.username")
      .orderBy("total_score", "desc")
      .limit(limit || "1000")
  );
};
