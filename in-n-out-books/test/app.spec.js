const request = require("supertest");
const app = require("../src/app");

describe("Assignment 4.2 API Tests", () => {

  // Should return an array of books
  it("should return an array of books", async () => {
    const res = await request(app).get("/api/books");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Should return a single book
  it("should return a single book", async () => {
    const res = await request(app).get("/api/books/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  // Should return 400 if id is not a number
  it("should return 400 if id is not a number", async () => {
    const res = await request(app).get("/api/books/abc");

    expect(res.statusCode).toBe(400);
  });

});