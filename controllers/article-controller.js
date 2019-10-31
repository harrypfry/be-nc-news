const {
  selectArticleById,
  updateArticleById,
  insertCommentOnArticle,
  selectCommentsByArticle
} = require("../models/article-model");

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then(article => {
      res.status(201).send(article);
    })
    .catch(next);
};

exports.postCommentOnArticle = (req, res, next) => {
  insertCommentOnArticle(req.params, req.body)
    .then(([comment]) => {
      res.status(201).send(comment);
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  selectCommentsByArticle(req.params, req.query)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch(next);
};
