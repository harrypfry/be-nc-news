process.env.NODE_ENV = "test";

const request = require("supertest");

const chai = require("chai");
const expect = chai.expect;
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  xdescribe("/", () => {
    it("returns all available endpoint", () => {
      return request(app)
        .get("/api")
        .expect(200);
      // .then(() => {});
    });
  });

  describe("/topics", () => {
    describe("GET:", () => {
      it("200: Get request responds with status 200", () => {
        return request(app)
          .get("/api/topics")
          .expect(200);
      });
      it("200: Return all topics", () => {
        const expectedBody = {
          topics: [
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" }
          ]
        };
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.deep.equal(expectedBody);
          });
      });
    });
    describe("GENERAL ERRORS:", () => {
      it("POST 405: Method not allowed", () => {
        return request(app)
          .post("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error: Method not allowed");
          });
      });
    });
  });

  describe("/users/:username", () => {
    describe("GET:", () => {
      it("200: Get request responds with status 200", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200);
      });
      it("200: Returned user data is an object", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.be.an("object");
          });
      });
      it("200: Returned user data has correct keys", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.contain.keys(["username", "name", "avatar_url"]);
          });
      });
      describe("GET ERRORS:", () => {
        it("GET 404: User not found", () => {
          return request(app)
            .get("/api/users/harryfry")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: User not found");
            });
        });
      });
    });

    describe("GENERAL ERRORS", () => {
      it("DELETE 405: Method not allowed", () => {
        return request(app)
          .delete("/api/users/butter_bridge")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error: Method not allowed");
          });
      });
    });
  });

  describe("/articles/:article_id", () => {
    describe("GET:", () => {
      it("200: Get request responds with status 200", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200);
      });
      it("200: Returned article data is an object", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(({ body }) => expect(body).to.be.an("object"));
      });
      it("200: Returned article data has correct keys", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.contain.keys([
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
          });
      });
      describe("GET ERRORS:", () => {
        it("GET 400: Invalid Article ID", () => {
          return request(app)
            .get("/api/articles/northcoders")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "northcoders"'
              );
            });
        });
        it("GET 404: Article not found", () => {
          return request(app)
            .get("/api/articles/384")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: Article not found");
            });
        });
      });
    });

    describe("PATCH:", () => {
      const patchBody = { inc_votes: 50 };
      it("200: Patch request responds with status 201", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(patchBody)
          .expect(200);
      });
      it("200: Returned article data is an object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(patchBody)
          .expect(200)
          .then(article => {
            expect(article).to.be.an("object");
          });
      });
      it("200: Returned article data has correct keys", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(patchBody)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.contain.keys([
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes"
            ]);
          });
      });
      it("200: Returned article has updated vote value", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(patchBody)
          .expect(200)
          .then(({ body: { article } }) => expect(article.votes).to.equal(150));
      });
      describe("PATCH ERRORS:", () => {
        it("PATCH 400: Invalid ID", () => {
          return request(app)
            .patch("/api/articles/harry")
            .send({ inc_votes: 50 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "harry"'
              );
            });
        });
        it("PATCH 400: Invalid body key", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ wrongKey: 50 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "NaN"'
              );
            });
        });
        it("PATCH 400: Invalid body value", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "banana" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "NaN"'
              );
            });
        });
        it("PATCH 404: Article not found", () => {
          return request(app)
            .patch("/api/articles/432")
            .send({ inc_votes: 50 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: ID not found");
            });
        });
      });
    });

    describe("GENERAL ERRORS:", () => {
      it("DELETE 405: Method not allowed", () => {
        return request(app)
          .delete("/api/articles/2")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error: Method not allowed");
          });
      });
    });
  });

  describe("/articles/:article_id/comments", () => {
    describe("POST:", () => {
      const newComment = {
        created_by: "icellusedkars",
        body: "That was a rubbish article"
      };
      it("201: Post request responds with status code 201", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(201);
      });
      it("201: Post request returns posted comment", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.contain.keys([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            ]);
          });
      });
      describe("POST ERRORS:", () => {
        it("400: Invalid ID", () => {
          return request(app)
            .post("/api/articles/banana/comments")
            .send({
              created_by: "icellusedkars",
              body: "something interesting"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "banana"'
              );
            });
        });
        it("400: Invalid key on body", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({
              created_by: "icellusedkars",
              not_a_column: "something interesting"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'null value in column "body" violates not-null constraint'
              );
            });
        });
        it("404: Invalid user ID", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({
              created_by: "notAUser",
              body: "something not so interesting"
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'insert or update on table "comments" violates foreign key constraint "comments_author_foreign"'
              );
            });
        });
        it("404: ID not found", () => {
          return request(app)
            .post("/api/articles/3324/comments")
            .send({
              created_by: "icellusedkars",
              body: "this is a valid body!"
            })
            .expect(404)
            .then(({ body: { msg } }) => {});
        });
      });
    });

    describe("GET:", () => {
      it("200: Get request reponds with status code 200", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200);
      });
      it("200: Get request returns an array", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            // console.log(body);
            expect(comments).to.be.an("array");
          });
      });
      it("200: Array returned from get request has correct keys", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body: { comments } }) =>
            expect(comments[0]).to.contain.keys([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            ])
          );
      });
      it("200: Array of length 0 return when request is correct, but article has no comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.deep.equal([]);
          });
      });

      it("200: Returns array sorted by votes", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.ascendingBy("votes");
          });
      });
      it("200: Returns array sorted by created_at & ascending by default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.ascendingBy("created_at");
          });
      });
      it("200: Returns array sorted by votes at in descending order", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes&order=desc")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.descendingBy("votes");
          });
      });

      describe("GET ERRORS:", () => {
        it("400: Invalid article ID", () => {
          return request(app)
            .get("/api/articles/banana/comments")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "banana"'
              );
            });
        });
        it("404: Article not found", () => {
          return request(app)
            .get("/api/articles/5345/comments")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: Article not found");
            });
        });
        it("404: Sort by unknown column", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=notAColumn")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('column "notAColumn" does not exist');
            });
        });
        it("400: Sort by invalid order", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=rogueOrder")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: invalid order");
            });
        });
      });
    });

    describe("GENERAL ERRORS:", () => {
      it("DELETE 405: Method not allowed", () => {
        return request(app)
          .delete("/api/articles/:article_id/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error: Method not allowed");
          });
      });
    });
  });

  describe("/articles", () => {
    describe("GET:", () => {
      it("200: Returns array of all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            body.forEach(article => {
              expect(article).to.contain.keys([
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              ]);
            });
          });
      });
      it("200: Can sort by any valid column when specified", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.ascendingBy("votes");
          });
      });
      it("200: Sorts by date as default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.ascendingBy("created_at");
          });
      });
      it("200: Sorts order is ascending by default ", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.ascendingBy("votes");
          });
      });
      it("200: Sort order can be specified by descending", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.descendingBy("article_id");
          });
      });
      it("200: Filter articles by author", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body }) => {
            body.forEach(article => {
              expect(article.author).to.equal("icellusedkars");
            });
          });
      });
      it("200: Returns empty array when author exists but hasn't written any articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.deep.equal([]);
          });
      });
      it("200: Returns empty array when topic exists but no articles assigned", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.deep.equal([]);
          });
      });
      it("200: Filter articles by topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            body.forEach(article => {
              expect(article.topic).to.equal("cats");
            });
          });
      });
      describe("GET ERRORS:", () => {
        it("400: Sort by invalid order", () => {
          return request(app)
            .get("/api/articles?order=gobbledygook")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: invalid order");
            });
        });
        it("404: Sort by column that doesn't exist", () => {
          return request(app)
            .get("/api/articles?sort_by=not_a_column")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('column "not_a_column" does not exist');
            });
        });
        it("404: Filter by unknown author", () => {
          return request(app)
            .get("/api/articles?author=notANAuthor")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: User not found");
            });
        });
        it("404: Filter by unknown topic", () => {
          return request(app)
            .get("/api/articles?topic=notATopic")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: Topic not found");
            });
        });
      });
    });

    describe("GENERAL ERRORS", () => {
      it("DELETE 405: Method not allowed", () => {
        return request(app)
          .delete("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error: Method not allowed");
          });
      });
    });
  });

  describe("/comments/:comment_id", () => {
    describe("PATCH:", () => {
      const votesInc = { inc_votes: 5 };
      it("200: Patch request responds with status 200", () => {
        return request(app)
          .patch("/api/comments/5")
          .send(votesInc)
          .expect(200);
      });
      it("200: Patch request updates the number of votes", () => {
        return request(app)
          .patch("/api/comments/4")
          .send(votesInc)
          .expect(200)
          .then(({ body: { comment: { votes } } }) => {
            expect(votes).to.equal(-95);
          });
      });
      it("200: Patch request returns the updated comment", () => {
        return request(app)
          .patch("/api/comments/4")
          .send(votesInc)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.contain.keys([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            ]);
          });
      });
      describe("PATCH ERRORS:", () => {
        it("400: Invalid ID", () => {
          return request(app)
            .patch("/api/comments/hola")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "hola"'
              );
            });
        });
        it("400: Invalid Key", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ hastaManana: 3 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "NaN"'
              );
            });
        });
        it("400: Invalid Value", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: "notAnInteger" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "NaN"'
              );
            });
        });
        it("404: Unknown ID", () => {
          return request(app)
            .patch("/api/comments/5243")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error: ID not found");
            });
        });
      });
    });
    describe("DELETE:", () => {
      it("204: Delete request responds with status 204", () => {
        return request(app)
          .delete("/api/comments/3")
          .expect(204);
      });
      it("204: Returns empty object", () => {
        return request(app)
          .delete("/api/comments/3")
          .expect(204)
          .then(({ body }) => {
            expect(body).to.deep.equal({});
          });
      });
      describe("DELETE ERRORS:", () => {
        it("400: Invalid ID", () => {
          return request(app)
            .delete("/api/comments/banana")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'invalid input syntax for type integer: "banana"'
              );
            });
        });
        it("404: ID not found", () => {
          return request(app)
            .delete("/api/comments/3423")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Error:ID not found");
            });
        });
      });
    });
    describe("GENERAL ERRORS:", () => {
      return request(app)
        .get("/api/comments/2")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Error: Method not allowed");
        });
    });
  });
});
