const {
  selectArticleById,
  updateArticleById,
  insertCommentByArticle
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

exports.postCommentByArticle = (req, res, next) => {
  insertCommentByArticle(req.params, req.body).then(([comment]) => {
    res.status(201).send(comment);
  });
};
