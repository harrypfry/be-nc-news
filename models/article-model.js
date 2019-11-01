const connection = require("../db/connection");

const { checkArticleExists } = require("../db/utils/utils");
const { selectUserByUserName } = require("./user-model");

const checkUserByUserName = username => {
  return connection
    .first("*")
    .from("users")
    .where({ username })
    .then(user => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "Error: User not found" });
      } else {
        return user;
      }
    });
};
const checkTopicExists = slug => {
  return connection("topics")
    .select("*")
    .where({ slug })
    .then(([slug]) => {
      if (!slug) {
        return Promise.reject({ status: 404, msg: "Error: Topic not found" });
      } else {
        return slug;
      }
    });
};

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

exports.updateArticleById = (article_id, body) => {
  if (!Object.keys(body).length) {
    return connection
      .select("*")
      .from("articles")
      .where(article_id)
      .returning("*")
      .then(([article]) => {
        if (!article) {
          return Promise.reject({ status: 404, msg: "Error: ID not found" });
        } else {
          return article;
        }
      });
  } else {
    return connection
      .select("*")
      .from("articles")
      .where(article_id)
      .increment({ votes: body.inc_votes })
      .returning("*")
      .then(([article]) => {
        if (!article) {
          return Promise.reject({ status: 404, msg: "Error: ID not found" });
        } else {
          return article;
        }
      });
  }
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

  if (!["asc", "desc", undefined].includes(order)) {
    return Promise.reject({ status: 400, msg: "Error: invalid order" });
  }

  const commentPromise = connection("comments")
    .select("*")
    .where("article_id", article_id)
    .returning("*")
    .orderBy(sort_by || "created_at", order || "desc");

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

exports.selectArticles = ({ sort_by, order, author, topic }) => {
  if (!["asc", "desc", undefined].includes(order)) {
    return Promise.reject({ status: 400, msg: "Error: invalid order" });
  }

  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    })
    .then(articles => {
      if (!articles.length) {
        const userPromise = author ? checkUserByUserName(author) : true;
        const topicPromise = topic ? checkTopicExists(topic) : true;
        return Promise.all([articles, userPromise, topicPromise]);
      } else {
        return [articles];
      }
    })
    .then(([articles]) => {
      return articles;
    });
};
