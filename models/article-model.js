const connection = require("../db/connection");

const { checkArticleExists } = require("../db/utils/utils");

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

exports.updateArticleById = (article_id, { inc_votes }) => {
  return connection
    .select("*")
    .from("articles")
    .where(article_id)
    .increment({ votes: inc_votes })
    .returning("*")
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Error: ID not found" });
      } else {
        return article;
      }
    });
};

exports.insertCommentOnArticle = ({ article_id }, comment) => {
  const commentObj = {
    article_id,
    body: comment.body,
    author: comment.created_by
  };

  return connection("comments").insert(commentObj, "*");
};

exports.selectCommentsByArticle = ({ article_id }) => {
  const articleExists = checkArticleExists(article_id);

  const commentPromise = connection("comments")
    .select("*")
    .where("article_id", article_id)
    .returning("*");

  return Promise.all([commentPromise, articleExists]).then(
    ([commentPromise, articleExists]) => {
      if (commentPromise.length || articleExists) {
        return commentPromise;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Error: Article not found"
        });
      }
    }
  );
};
