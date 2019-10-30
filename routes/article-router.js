const articleRouter = require("express").Router();

const {
  getArticleById,
  patchArticleById,
  postCommentOnArticle,
  getCommentsByArticle
} = require("../controllers/article-controller");

const { send405 } = require("../errors/error");

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(send405);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postCommentOnArticle)
  .all(send405);

module.exports = articleRouter;
