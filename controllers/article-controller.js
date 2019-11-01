const {
  selectArticleById,
  updateArticleById,
  insertCommentOnArticle,
  selectCommentsByArticle,
  selectArticles
} = require("../models/article-model");

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentOnArticle = (req, res, next) => {
  insertCommentOnArticle(req.params, req.body)
    .then(([comments]) => {
      res.status(201).send({ comments });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  selectCommentsByArticle(req.params, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
