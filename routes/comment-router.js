const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/comment-controller");

const { send405 } = require("../errors/error");

const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(send405);

module.exports = commentRouter;
