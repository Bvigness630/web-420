const request = require("supertest");
const app = require("../src/app");


describe("Chapter 6: API Tests", () => {


  it("should log a user in and return a 200-status with Authentication successful message", async () => {

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "harry@hogwarts.edu",
        password: "potter"
      });


    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Authentication successful");

  });



  it("should return a 401-status code with Unauthorized message when logging in with incorrect credentials", async () => {

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "harry@hogwarts.edu",
        password: "wrongpassword"
      });


    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");

  });



  it("should return a 400-status code with Bad Request when missing email or password", async () => {

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "harry@hogwarts.edu"
      });


    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");

  });


});