const request = require("supertest");

const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email and password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "poppy@email.com", password: "12345678" });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({ email: "scarconstt@email.com", password: "12345678" });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "12345678" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "12345678" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email already exists and it's already in use.", () => {
    test("response code is 400", async () => {
      await request(app)
        .post("/users")
        .send({ email: "rosssmith@email.com", password: "12345678" });
      const response = await request(app)
        .post("/users")
        .send({ email: "rosssmith@email.com", password: "12345678" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Email is already in use. Try to sign up with another email or log in.")
    });
  });

  describe("POST, when email has an invalid format.", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "rosssmithemail.com", password: "12345678" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid email format.")
    });
  });

  describe("POST, when the password is less than 8 characters long.", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "ross@smithemail.com", password: "1234567" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Password must be at least 8 characters.")
    });
  });
});
