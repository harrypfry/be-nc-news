const connection = require("../db/connection");

exports.selectUserByUserName = ({ params }) => {
  const userPromise = connection
    .first("*")
    .from("users")
    .where(params);

  const commentsVotesPromise = connection
    .select("users.*")
    .from("users")
    .where(params)
    .sum({ comment_score: "comments.votes" })
    .leftJoin("comments", "users.username", "comments.author")
    .groupBy("users.username");

  const articleVotesPromise = connection
    .select("users.*")
    .from("users")
    .where(params)
    .sum({ article_score: "articles.votes" })
    .leftJoin("articles", "users.username", "articles.author")
    .groupBy("users.username");

  return Promise.all([userPromise, commentsVotesPromise, articleVotesPromise])
    .then(([userPromise, [commentsVotesPromise], [articleVotesPromise]]) => {
      const { avatar_url, name, username } = userPromise;

      return {
        avatar_url,
        name,
        username,
        comment_score: commentsVotesPromise.comment_score,
        article_score: articleVotesPromise.article_score
      };
    })
    .catch(err => {
      return Promise.reject({ status: 404, msg: "Error: User not found" });
    });
};

exports.postUser = user => {
  return connection("users").insert(user, "*");
};

exports.selectUsers = ({ limit }) => {
  const usersPromise = connection.select("*").from("users");

  const commentsVotesPromise = connection
    .select("users.*")
    .from("users")
    .sum({ comment_score: "comments.votes" })
    .leftJoin("comments", "users.username", "comments.author")
    .groupBy("users.username").orderBy;

  const articleVotesPromise = connection
    .select("users.*")
    .from("users")
    .sum({ article_score: "articles.votes" })
    .leftJoin("articles", "users.username", "articles.author")
    .groupBy("users.username");

  return Promise.all([commentsVotesPromise, articleVotesPromise]).then(
    ([commentsVotesPromise, articlesVotesPromise]) => {
      let mergedScores = [];

      for (let i = 0; i < commentsVotesPromise.length; i++) {
        mergedScores.push({
          ...commentsVotesPromise[i],
          ...articlesVotesPromise.find(
            itmInner => itmInner.username === commentsVotesPromise[i].username
          )
        });
      }

      mergedScores.forEach(user => {
        user.total_score =
          Number(user.comment_score) + Number(user.article_score);
      });

      mergedScores.sort((a, b) => {
        let comparison = 0;
        if (a.total_score > b.total_score) {
          comparison = 1;
        } else if (a.total_score < b.total_score) {
          comparison = -1;
        }
        return comparison;
      });

      return mergedScores;
    }
  );
};
