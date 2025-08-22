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
  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    user = new User({
      email: "test@example.com",
      password: "12345678",
      firstName: "Test",
      lastName: "User",
    });
    await user.save();
    token = createToken(user.id);
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

    test("creates a new post with image", async () => {
      const imageData =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          message: "Hello World with image!",
          image: imageData,
        });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World with image!");
      expect(posts[0].image).toEqual(imageData);
      expect(posts[0].author.toString()).toEqual(user._id.toString());
    });

    test("creates a post without image when image field is not provided", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World without image!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World without image!");
      expect(posts[0].image).toBeUndefined();
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
    test("returns posts with images", async () => {
      const imageData =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

      const post1 = new Post({
        message: "Post with image",
        author: user._id,
        image: imageData,
      });
      const post2 = new Post({
        message: "Post without image",
        author: user._id,
      });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      expect(posts.length).toEqual(2);
      expect(posts[0].image).toEqual(imageData);
      expect(posts[1].image).toBeUndefined();
    });

    test("returns posts with populated author information", async () => {
      const post1 = new Post({ message: "Test post", author: user._id });
      await post1.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      expect(posts.length).toEqual(1);

      // Verify author is populated with correct fields
      expect(posts[0].author.email).toEqual("test@example.com");
      expect(posts[0].author.firstName).toEqual("Test");
      expect(posts[0].author.lastName).toEqual("User");
      expect(posts[0].author._id).toBeDefined();
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
        const post = await new Post({
          message: "Hello, world!",
          author: user._id,
        }).save();
        const res = await request(app)
          .get(`/posts/${post._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(200);
        expect(res.body.post._id).toEqual(post._id.toString());
        expect(res.body.post.message).toEqual("Hello, world!");
      });

      test("returns a new token", async () => {
        const post = await new Post({
          message: "Token check",
          author: user._id,
        }).save();

        const response = await request(app)
          .get(`/posts/${post._id}`)
          .set("Authorization", `Bearer ${token}`);

        const newToken = response.body.token;
        const newDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newDecoded.iat > oldDecoded.iat).toEqual(true);
      });

      test("returns post with populated author information", async () => {
        const post = await new Post({
          message: "Single post test",
          author: user._id,
        }).save();

        const res = await request(app)
          .get(`/posts/${post._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(200);
        expect(res.body.post._id).toEqual(post._id.toString());
        expect(res.body.post.message).toEqual("Single post test");

        // Verify author is populated with correct fields
        expect(res.body.post.author.email).toEqual("test@example.com");
        expect(res.body.post.author.firstName).toEqual("Test");
        expect(res.body.post.author.lastName).toEqual("User");
      });
    });

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
        const post = await new Post({
          message: "Will be blocked",
          author: user._id,
        }).save();

        const res = await request(app).get(`/posts/${post._id}`);

        expect(res.status).toEqual(401);
        expect(res.body.token).toEqual(undefined);
      });
    });
  });

  describe("DELETE /posts/:id", () => {
    test("200: should delete the proper post and respond with a success message", async () => {
      const postResponse = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Test" });

      const postId = postResponse.body.post._id;

      const res = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Post deleted successfully.");
    });

    test("404: should not delete the post if post does not exist", async () => {
      const invalidPostId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/posts/${invalidPostId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Post not found.");
    });

    test("403: should not delete the post if it was created by anoter user", async () => {
      const postResponse = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Test" });

      const postId = postResponse.body.post._id;
      const otherAuthor = await new User({
        email: "otherAuthor@email.com",
        password: "12345678",
        firstName: "Other",
        lastName: "Author",
      }).save();

      const tokenOtherAuthor = createToken(otherAuthor._id);

      const res = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${tokenOtherAuthor}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        "Unable to delete the post. You can only delete your own posts."
      );
    });

    test("400: should return a 400 error if post_id is an invalid data type", async () => {
      const res = await request(app)
        .delete(`/posts/hello`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Unable to delete the post. Invalid post id."
      );
    });
  });

  describe("POST post/:id/like", () => {
    describe("when token is present", () => {
      test("responds 200 and adds a like (likedByCurrentUser is true, likesCount is 1)", async () => {
        const post = await new Post({
          message: "hello",
          author: user._id,
        }).save();

        const res = await request(app)
          .post(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(200);
        expect(res.body.post._id).toEqual(post._id.toString());
        expect(res.body.post.likesCount).toBe(1);
        expect(res.body.post.likedByCurrentUser).toBe(true);
      });

      test("returns a new token", async () => {
        const post = await new Post({
          message: "token check",
          author: user._id,
        }).save();

        const response = await request(app)
          .post(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);

        const newToken = response.body.token;
        const newDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newDecoded.iat > oldDecoded.iat).toEqual(true);
      });

      test("liking twice keeps count at 1", async () => {
        const post = await new Post({
          message: "only one like",
          author: user._id,
        }).save();

        await request(app)
          .post(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);

        const res2 = await request(app)
          .post(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);

        expect(res2.status).toEqual(200);
        expect(res2.body.post.likesCount).toBe(1);
        expect(res2.body.post.likedByCurrentUser).toBe(true);
      });
    });

    describe("when token is missing", () => {
      test("responds 401 and no token returned", async () => {
        const post = await new Post({
          message: "blocked",
          author: user._id,
        }).save();

        const res = await request(app).post(`/posts/${post._id}/like`);

        expect(res.status).toEqual(401);
        expect(res.body.token).toEqual(undefined);
      });
    });

    describe("error cases", () => {
      test("400 when id format is invalid", async () => {
        const res = await request(app)
          .post("/posts/abc/like")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Invalid post id");
        expect(res.body.token).toBeDefined();
      });

      test("404 when post does not exist", async () => {
        const nonexistentId = new mongoose.Types.ObjectId().toString();

        const res = await request(app)
          .post(`/posts/${nonexistentId}/like`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual("Post not found");
        expect(res.body.token).toBeDefined();
      });
    });
  });

  describe("DELETE /posts/:id/like", () => {
    describe("when token is present", () => {
      test("responds 200 and removes the like (likedByCurrentUser is false, likesCount is 0)", async () => {
        const post = await new Post({
          message: "will unlike",
          author: user._id,
        }).save();

        await request(app)
          .post(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
          .delete(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(200);
        expect(res.body.post.likesCount).toBe(0);
        expect(res.body.post.likedByCurrentUser).toBe(false);
      });

      test("unliking twice keeps count at 0", async () => {
        const post = await new Post({
          message: "double unlike",
          author: user._id,
        }).save();

        const res1 = await request(app)
          .delete(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);
        const res2 = await request(app)
          .delete(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);

        expect(res1.status).toEqual(200);
        expect(res2.status).toEqual(200);
        expect(res2.body.post.likesCount).toBe(0);
        expect(res2.body.post.likedByCurrentUser).toBe(false);
      });

      test("returns a new token", async () => {
        const post = await new Post({
          message: "unlike token",
          author: user._id,
        }).save();

        const response = await request(app)
          .delete(`/posts/${post._id}/like`)
          .set("Authorization", `Bearer ${token}`);

        const newToken = response.body.token;
        const newDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newDecoded.iat > oldDecoded.iat).toEqual(true);
      });
    });

    describe("when token is missing", () => {
      test("responds 401 and no token returned", async () => {
        const post = await new Post({
          message: "blocked unlike",
          author: user._id,
        }).save();

        const res = await request(app).delete(`/posts/${post._id}/like`);

        expect(res.status).toEqual(401);
        expect(res.body.token).toEqual(undefined);
      });
    });

    describe("error cases", () => {
      test("400 when id format is invalid", async () => {
        const res = await request(app)
          .delete("/posts/abc/like")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Invalid post id");
        expect(res.body.token).toBeDefined();
      });

      test("404 when post does not exist", async () => {
        const nonexistentId = new mongoose.Types.ObjectId().toString();

        const res = await request(app)
          .delete(`/posts/${nonexistentId}/like`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual("Post not found");
        expect(res.body.token).toBeDefined();
      });
    });
  });


  //
  describe("GET /posts/me", () => {
    test("responds with a 200 and the user's posts", async () => {
      const post1 = new Post({
        message: "Post 1",
        author: user._id,
      });
      const post2 = new Post({
        message: "Post 2",
        author: user._id,
      });

      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts/me")
        .set("Authorization", `Bearer ${token}`);

      console.log("Response body from /posts/me:", response.body);

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].author).toEqual(user._id.toString());
    });


    test("returns only posts belonging to the user", async () => {
      // Create a post by another user
      const otherUser = new User({
        firstName: "Other",
        lastName: "User",
        email: "otheruser@example.com",
        password: "password123",
      });
      await otherUser.save();

      await Post.create({ message: "Other user's post", author: otherUser._id });

      await Post.create({ message: "My post", author: user._id });

      const response = await request(app)
        .get("/posts/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.body.find(post => post.message === "Other user's post")).toBeUndefined();
      expect(response.body.every(post => post.author === user._id.toString())).toBe(true);
    });

    test("returns 401 if no token is provided", async () => {
      const response = await request(app).get("/posts/me");

      expect(response.status).toEqual(401);
      expect(response.body.message).toMatch(/auth error/i);
    });

    test("returns 401 if token is invalid", async () => {
      const response = await request(app)
        .get("/posts/me")
        .set("Authorization", `Bearer invalidtoken`);

      expect(response.status).toEqual(401);
      expect(response.body.message).toMatch(/auth error/i);
    });
  });
});
