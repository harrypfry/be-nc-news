const {
  selectArticleById,
  updateArticleById
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
