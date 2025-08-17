const mongoose = require("mongoose");
const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

let token;
let user;

describe("/posts", () => {
  beforeAll(async () => {
    user = new User({
      email: "post-test@test.com",
      password: "12345678",
    });
    await user.save();
    await Post.deleteMany({});
    token = createToken(user.id);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      expect(response.status).toEqual(201);
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World!!");
      expect(posts[0].author.toString()).toEqual(user._id.toString()); // ObjectId converted to string for comparison
    });

    test("returns a new token", async () => {
      const testApp = request(app);
      const response = await testApp
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world" });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({
        message: "I love all my children equally",
        author: user._id,
      });
      const post2 = new Post({
        message: "I've never cared for GOB",
        author: user._id,
      });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection", async () => {
      const post1 = new Post({ message: "howdy!", author: user._id });
      const post2 = new Post({ message: "hola!", author: user._id });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      const firstPost = posts[0];
      const secondPost = posts[1];

      expect(firstPost.message).toEqual("howdy!");
      expect(secondPost.message).toEqual("hola!");
    });

    test("returns a new token", async () => {
      const post1 = new Post({ message: "First Post!", author: user._id });
      const post2 = new Post({ message: "Second Post!", author: user._id });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("the response code is 401", async () => {
      const post1 = new Post({ message: "howdy!", author: user._id });
      const post2 = new Post({ message: "hola!", author: user.id });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const post1 = new Post({ message: "howdy!", author: user._id });
      const post2 = new Post({ message: "hola!", author: user._id });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({ message: "howdy!", author: user._id });
      const post2 = new Post({ message: "hola!", author: user._id });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET /posts/:id", () => {
    describe("when token is present", () => {
      test("responds 200 and returns the post", async () => {
        const post = new Post({ message: "Hello, world!"});
        await post.save();

        const res = await request(app)
          .get(`/posts/${post._id}`)
          .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200);
        expect(res.body.post._id).toEqual(post._id.toString());
        expect(res.body.post.message).toEqual("Hello, world!");
      })

      test("returns a new token", async () => {
        const post = await new Post({ message: "Token check"}).save();

        const response = await request(app)
          .get(`/posts/${post._id}`)
          .set("Authorization", `Bearer ${token}`);

        const newToken = response.body.token;
        const newDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newDecoded.iat > oldDecoded.iat).toEqual(true);
      });
    })

    describe("error cases", () => {
      test("400 when id format is invalid", async () => {
        const res = await request(app)
          .get("/posts/abc")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Invalid post id");
      });

      test("404 when post does not exist", async () => {
        const nonexistentId = new mongoose.Types.ObjectId().toString();

        const res = await request(app)
          .get(`/posts/${nonexistentId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual("Post not found");
      });
    });

    describe("when token is missing", () => {
      test("responds 401 and no token returned", async () => {
        const p = await new Post({ message: "Will be blocked" }).save();

        const res = await request(app).get(`/posts/${p._id}`);

        expect(res.status).toEqual(401);
        expect(res.body.token).toEqual(undefined);
      });
    });
  })
});
