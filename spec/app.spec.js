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
  });

  describe.only("users/:username", () => {
    const expectedBody = {
      username: "icellusedkars",
      name: "sam",
      avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
    };

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

    describe.only("ERRORS", () => {
      it("GET 404: User not found", () => {
        return request(app)
          .get("/api/users/harryfry")
          .expect(404)
          .then(({ error: { text } }) => {
            expect(text).to.equal("Error: User not found");
          });
      });
    });
  });
});
