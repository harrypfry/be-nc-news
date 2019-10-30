const articleRouter = require("express").Router();

const {
  getArticleById,
  patchArticleById
} = require("../controllers/article-controller");

const { send405 } = require("../errors/error");

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(send405);

module.exports = articleRouter;
