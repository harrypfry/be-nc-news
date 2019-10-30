const connection = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection
    .first("*")
    .from("articles")
    .where(article_id)
    .then(article => {
      if (!article) {
        console.log("rejected");
        return Promise.reject({ status: 404, msg: "Error: Article not found" });
      } else {
        return article;
      }
    });
};
