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

exports.selectCommentsByArticle = ({ article_id }, { sort_by, order }) => {
  const articleExists = checkArticleExists(article_id);

  // if (order !== "asc" && order !== "desc" && order !== undefined) {
  //   console.log("promise reject");
  //   return Promise.reject({ status: 400, msg: "Error: invalid order" });
  // }
  if (!["asc", "desc", undefined].includes(order)) {
    return Promise.reject({ status: 400, msg: "Error: invalid order" });
  }

  const commentPromise = connection("comments")
    .select("*")
    .where("article_id", article_id)
    .returning("*")
    .orderBy(sort_by || "created_at", order || "asc");

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
