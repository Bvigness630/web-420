const request = require("supertest");
const app = require("../src/app");

describe("Chapter 4: API Tests", () => {

  it("should return a 201-status code when adding a new book", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({
        id: 6,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien"
      });

    expect(res.statusCode).toBe(201);
  });

  it("should return a 400-status code when adding a new book with missing title", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({
        id: 7,
        author: "J.R.R. Tolkien"
      });

    expect(res.statusCode).toBe(400);
  });

  it("should return a 204-status code when deleting a book", async () => {
    const res = await request(app)
      .delete("/api/books/1");

    expect(res.statusCode).toBe(204);
  });

});