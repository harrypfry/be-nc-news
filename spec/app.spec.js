process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics", () => {
    describe("GET:", () => {
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
    describe("ERRORS:", () => {
      it("POST 405: Method not allowed", () => {
        return request(app)
          .post("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error: method not allowed");
          });
      });
    });
  });

  describe("users/:username", () => {
    describe("GET:", () => {
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
            expect(body).to.have.keys(["username", "name", "avatar_url"]);
          });
      });
    });

    describe("ERRORS", () => {
      it.only("GET 404: User not found", () => {
        return request(app)
          .get("/api/users/harryfry")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error: User not found");
          });
      });
      it("DELETE 405: Method not allowed", () => {
        return request(app)
          .delete("/api/users/butter_bridge")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error: method not allowed");
          });
      });
    });
  });

  describe("articles/:article_id", () => {
    describe("GET:", () => {
      it("200: Returned user data is an object", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(({ body }) => expect(body).to.be.an("object"));
      });
      it("200: Returned user data has correct keys", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body }) =>
            expect(body).to.have.keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            ])
          );
      });
    });
    describe("ERRORS:", () => {
      it.only("GET 404: Article not found", () => {
        return request(app)
          .get("/api/articles/384")
          .expect(404)
          .then(({ body: { msg } }) => {
            // console.log(msg);
          });
      });
    });
  });
});
