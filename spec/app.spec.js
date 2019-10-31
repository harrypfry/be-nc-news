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

  describe("/topics", () => {
    describe("GET:", () => {
      it("200: Get request responds with status 200", () => {
        return request(app)
          .get("/api/topics")
          .expect(200);
      });
      it("200: Return all topics", () => {
        const expectedBody = [
          { slug: "mitch", description: "The man, the Mitch, the legend" },
          { slug: "cats", description: "Not dogs" },
          { slug: "paper", description: "what books are made of" }
        ];
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
          .then(({ body }) => {
            expect(body).to.be.an("object");
          });
      });
      it("200: Returned user data has correct keys", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys(["username", "name", "avatar_url"]);
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
          .then(({ body }) =>
            expect(body).to.contain.keys([
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ])
          );
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
      it("201: Patch request responds with status 201", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(patchBody)
          .expect(201);
      });
      it("201: Returned article data is an object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(patchBody)
          .expect(201)
          .then(article => {
            expect(article).to.be.an("object");
          });
      });
      it("201: Returned article data has correct keys", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(patchBody)
          .expect(201)
          .then(({ body }) => {
            expect(body).to.contain.keys([
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
      it("201: Returned article has updated vote value", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(patchBody)
          .expect(201)
          .then(({ body }) => expect(body.votes).to.equal(150));
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
          .then(({ body }) => {
            expect(body).to.contain.keys([
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
            .then(({ body: { msg } }) => {
              console.log(msg);
            });
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
          .then(({ body }) => {
            expect(body).to.be.an("array");
          });
      });
      it("200: Array returned from get request has correct keys", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body }) =>
            expect(body[0]).to.contain.keys([
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
          .then(({ body }) => {
            expect(body).to.deep.equal([]);
          });
      });

      it("200: Returns array sorted by votes", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.ascendingBy("votes");
          });
      });
      it("200: Returns array sorted by created_at & ascending by default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.ascendingBy("created_at");
          });
      });
      it("200: Returns array sorted by votes at in descending order", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.descendingBy("votes");
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
        it("404: Sort by invalid column", () => {
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
});
