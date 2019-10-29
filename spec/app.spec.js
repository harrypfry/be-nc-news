process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

describe("/api/topics", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("GET 200: Return all topics", () => {
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

describe("/api/users/:username", () => {
  it("", () => {});
});
