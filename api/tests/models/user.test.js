require("../mongodb_helper");
const User = require("../../models/user");
const mongoose = require("mongoose");

describe("User model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  }); //added 

  it("has an email address", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
    });
    expect(user.email).toEqual("someone@example.com");
  });

  it("has a password", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
    });
    expect(user.password).toEqual("password");
  });

  it("can list all users", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });

  it("can save a user", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
    });

    await user.save();
    const users = await User.find();

    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
  });
  
  // new tests added below to match updated user model
  it("creates a user with required fields", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "12345678",
    });

    const savedUser = await user.save();
    expect(savedUser.email).toBe("someone@example.com");
    expect(savedUser.password).toBe("12345678");
  });

  it("throws an error if email is missing", async () => {
    const user = new User({ password: "12345678" });

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("throws an error if password is missing", async () => {
    const user = new User({ email: "test@example.com" });

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("enforces unique email addresses", async () => {
    const user1 = new User({ email: "test@example.com", password: "12345678" });
    const user2 = new User({ email: "test@example.com", password: "87654321" });

    await user1.save();
    await expect(user2.save()).rejects.toThrow(); // Could be a MongoError
  });

  it("can store and retrieve all optional fields", async () => {
    const userData = {
      email: "optional@example.com",
      password: "12345678",
      firstName: "Optional",
      lastName: "User",
      bio: "Hello, I'm a bio!",
      job: "Engineer",
      location: "London",
      relationshipStatus: "Complicated",
      birthdate: "1990-01-01",
      gender: "Female",
      profileImage: "/uploads/profile.jpg",
      backgroundImage: "/uploads/bg.jpg",
    };
    const user = new User(userData);
    const savedUser = await user.save();

    const foundUser = await User.findById(savedUser._id);
    for (const key in userData) {
      expect(foundUser[key]).toBe(userData[key]);
    }
  });

  it("defaults backgroundImage to null", async () => {
    const user = new User({ email: "default@example.com", password: "12345678" });
    const savedUser = await user.save();

    expect(savedUser.backgroundImage).toBeNull();
  });

  it("lists all users", async () => {
    await User.create([
      { email: "one@example.com", password: "12345678" },
      { email: "two@example.com", password: "87654321" }
    ]);

    const users = await User.find();
    expect(users.length).toBe(2);
    expect(users.map(u => u.email)).toContain("one@example.com");
    expect(users.map(u => u.email)).toContain("two@example.com");
  });

  // test for password validation
  it("throws a validation error if password is shorter than 8 characters", async () => {
    const user = new User({
      email: "shortpass@example.com",
      password: "1234567", // 7 characters
    });

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  // password is 8 characters
  it("saves successfully if password is exactly 8 characters", async () => {
    const user = new User({
      email: "validpass@example.com",
      password: "12345678", // exactly 8 characters
    });

    const savedUser = await user.save();
    expect(savedUser.password).toBe("12345678");
  });
});
