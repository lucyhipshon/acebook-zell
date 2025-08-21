const request = require("supertest");
const path = require("path");
const app = require("../../app");
const User = require("../../models/user");
const { generateToken } = require("../../lib/token");

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

    test("returns a token on successful signup", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "newuser@email.com", password: "12345678", firstName: "New", lastName: "User" });

      expect(response.statusCode).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe("string");
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

  describe("GET, get all users.", () => {
    test("response code is 200", async () => {
      const response = await request(app).get("/users");
      expect(response.statusCode).toBe(200);
    });

    test("response code is 404 if endpoint is invalid", async () => {
      const response = await request(app).get("/userssss")
      expect(response.statusCode).toBe(404);
    })
  });

  describe("POST, when only required fields are provided", () => {
    test("user is created with optional fields missing", async () => {
      const response = await request(app)
        .post("/users")
        .field("email", "mandatory@test.com")
        .field("password", "12345678")
        .field("firstName", "Mandatory")
        .field("lastName", "Field");

      expect(response.statusCode).toBe(201);

      const users = await User.find({ email: "mandatory@test.com" });
      expect(users.length).toBe(1);
      const newUser = users[0];

      // Optional fields should exist but be empty or undefined
      expect(newUser.bio).toBeFalsy();
      expect(newUser.job).toBeFalsy();
      expect(newUser.gender).toBeFalsy();
      expect(newUser.location).toBeFalsy();
      expect(newUser.relationshipStatus).toBeFalsy();
      expect(newUser.birthdate).toBeFalsy();
      expect(newUser.profileImage).toEqual("uploads/default.jpg");
    });

    test("sets default profile image if none uploaded", async () => {
      await request(app)
      .post("/users")
      .send({ email: "imgtest@email.com", password: "12345678" });

      const user = await User.findOne({ email: "imgtest@email.com" });
      expect(user.profileImage).toBe("uploads/default.jpg");
    });
  });


  // profile tests - would need to be changed if more info was called on the profile page
  describe('GET /users/profile', () => {
    let user;
    let token;

    beforeEach(async () => {
      user = new User({
        email: 'profile@test.com',
        password: '12345678',
        firstName: 'Test',
        lastName: 'User',
        bio: 'Test bio',
        profileImage: '/uploads/default.jpg',
        backgroundImage: '/uploads/bg.jpg',
        job: 'Developer',
        location: 'London',
        relationshipStatus: 'Single',
      });
      await user.save();

      token = generateToken(user._id.toString());
    });

    test('returns user profile with valid token', async () => {
      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.firstName).toBe(user.firstName);
      expect(res.body.lastName).toBe(user.lastName);
      expect(res.body.bio).toBe(user.bio);
      expect(res.body.profileImage).toBe(user.profileImage);
      expect(res.body.backgroundImage).toBe(user.backgroundImage);
      expect(res.body.email).toBe(user.email);
      expect(res.body.job).toBe(user.job);
      expect(res.body.location).toBe(user.location);
      expect(res.body.relationshipStatus).toBe(user.relationshipStatus);
    });

    test('returns 401 if no token provided', async () => {
      await request(app)
        .get('/users/profile')
        .expect(401);
    });

    test('returns 404 if user not found', async () => {
      const fakeToken = generateToken("507f1f77bcf86cd799439011"); 

      await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${fakeToken}`)
        .expect(404);
    });
  });

  // background image tests
  describe("POST /users/upload-background/:userId", () => {
    let user;

    beforeEach(async () => {
      user = new User({
        email: "bgtest@example.com",
        password: "password123",
        firstName: "BG",
        lastName: "User"
      });
      await user.save();
    });

    test("uploads background image and updates user", async () => {
      const imagePath = path.join(__dirname, "../uploads/test-background.jpg");

      const response = await request(app)
        .post(`/users/upload-background/${user._id}`)
        .attach("backgroundImage", imagePath)
        .expect(200);

      // Check the response includes the expected fields
      expect(response.body.backgroundImage).toMatch(/^\/uploads\/.+\.(jpg|jpeg|png)$/);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.backgroundImage).toBe(response.body.backgroundImage);

      // Check the user was updated in DB
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.backgroundImage).toBe(response.body.backgroundImage);
    });

    test("returns 400 if no file uploaded", async () => {
      const response = await request(app)
        .post(`/users/upload-background/${user._id}`)
        .expect(400);

      expect(response.body.error).toBe("No image file uploaded");
    });

    test("returns 404 if user does not exist", async () => {
      const fakeUserId = "507f1f77bcf86cd799439011"; 
      const imagePath = path.join(__dirname, "../uploads/test-background.jpg");

      const response = await request(app)
        .post(`/users/upload-background/${fakeUserId}`)
        .attach("backgroundImage", imagePath)
        .expect(404); 
        
      expect(response.body.error).toBe("User not found");
    });
  });

})
