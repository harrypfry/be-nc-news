const {
  updateCommentById,
  removeCommentById
} = require("../models/comment-model");

exports.patchCommentById = (req, res, next) => {
  updateCommentById(req.params, req.body)
    .then(comment => {
      res.status(201).send(comment);
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
