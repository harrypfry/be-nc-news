const articleRouter = require("express").Router();

const {
  getArticleById,
  patchArticleById,
  postCommentByArticle
} = require("../controllers/article-controller");

const { send405 } = require("../errors/error");

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(send405);

articleRouter.route("/:article_id/comments").post(postCommentByArticle);

module.exports = articleRouter;
