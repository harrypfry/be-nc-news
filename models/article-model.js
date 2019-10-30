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
  const articleExistsBool = checkArticleExists(article_id);

  // console.log(articleExistsBool);
  Promise.all([articleExistsBool]).then(a => {
    console.log(a);
  });

  // console.log(articleExists/);
  // return connection("comments")
  //   .select("*")
  //   .where(article_id)
  //   .then(([comment]) => {
  //     if (comment) {
  //       return comment;
  //     } else {
  //       return Promise.reject({ status: 404, msg: "Error: Article not found" });
  //     }
  //   });
};

const checkArticleExists = article_id => {
  return connection("articles")
    .select("*")
    .where({ article_id });
};
