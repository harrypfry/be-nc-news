const { selectArticleById } = require("../models/article-model");

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params)
    .then(([article]) => {
      res.status(200).send(article);
    })
    .catch(next);
};
