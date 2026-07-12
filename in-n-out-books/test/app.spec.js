const request = require("supertest");
const app = require("../src/app");

describe("Chapter 5: API Tests", () => {

  it("should update a book and return a 204-status code", async () => {
    const res = await request(app)
      .put("/api/books/1")
      .send({
        title: "Updated Book Title",
        author: "Updated Author"
      });

    expect(res.statusCode).toEqual(204);
  });


  it("should return a 400-status code when using a non-numeric id", async () => {
    const res = await request(app)
      .put("/api/books/foo")
      .send({
        title: "Updated Book Title",
        author: "Updated Author"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });


  it("should return a 400-status code when updating a book with a missing title", async () => {
    const res = await request(app)
      .put("/api/books/1")
      .send({
        author: "Updated Author"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

});