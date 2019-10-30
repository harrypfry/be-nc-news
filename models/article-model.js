const connection = require("../db/connection");

exports.selectArticleById = ({ article_id }) => {
  const whereObj = { "articles.article_id": article_id };
  return connection
    .first("articles.*")
    .from("articles")
    .where(whereObj)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Error: Article not found"
        });
      } else {
        return article;
      }
    });
};
