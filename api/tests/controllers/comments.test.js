const mongoose = require("mongoose");
const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Comment = require("../../models/comment");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

let token;
let user;
let post;

describe("/comments", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    user = new User({
      email: "comment-test@test.com",
      password: "12345678",
    });
    await user.save();

    post = new Post({
      message: "Test post for comments",
      author: user._id,
    });
    await post.save();

    token = createToken(user.id);
  });

  describe("POST /comments, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is a test comment",
          post: post._id,
        });

      expect(response.status).toEqual(201);
    });

    test("creates a new comment", async () => {
      await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is a test comment",
          post: post._id,
        });

      const comments = await Comment.find();
      expect(comments.length).toEqual(1);
      expect(comments[0].content).toEqual("This is a test comment");
      expect(comments[0].author.toString()).toEqual(user._id.toString());
      expect(comments[0].post.toString()).toEqual(post._id.toString());
    });

    test("returns the created comment", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "Test comment return",
          post: post._id,
        });

      expect(response.body.comment.content).toEqual("Test comment return");
      expect(response.body.comment.author).toEqual(user._id.toString());
      expect(response.body.comment.post).toEqual(post._id.toString());
    });

    test("returns a new token", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "Token test comment",
          post: post._id,
        });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST /comments, validation errors", () => {
    test("responds with 400 when content is missing", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({ post: post._id });

      expect(response.status).toEqual(400);

      // using regular expression pattern e.g. /content/i to check if the response message contains the word content (case insensitive) e.g the error message sent back mentions something about "content" (like content is required, or content is missing)
      expect(response.body.message).toMatch(/content/i);
    });

    test("responds with 400 when post is missing", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Missing post test" });

      expect(response.status).toEqual(400);
      expect(response.body.message).toMatch(/post/i);
    });

    test("responds with 400 when content exceeds 500 characters", async () => {
      const longContent = "a".repeat(501);
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: longContent,
          post: post._id,
        });

      expect(response.status).toEqual(400);
    });

    test("responds with 404 when post doesn't exist", async () => {
      const fakePostId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "Comment on non-existent post",
          post: fakePostId,
        });

      expect(response.status).toEqual(404);
      expect(response.body.message).toMatch(/post not found/i);
    });
  });

  describe("POST /comments, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app).post("/comments").send({
        content: "Unauthorized comment",
        post: post._id,
      });

      expect(response.status).toEqual(401);
    });

    test("a comment is not created", async () => {
      await request(app).post("/comments").send({
        content: "Unauthorized comment",
        post: post._id,
      });

      const comments = await Comment.find();
      expect(comments.length).toEqual(0);
    });
  });

  describe("GET /comments", () => {
    describe("when token is present", () => {
      test("responds with 200", async () => {
        const response = await request(app)
          .get("/comments")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(200);
      });

      test("returns all comments", async () => {
        const comment1 = new Comment({
          content: "First comment",
          author: user._id,
          post: post._id,
        });
        const comment2 = new Comment({
          content: "Second comment",
          author: user._id,
          post: post._id,
        });
        await comment1.save();
        await comment2.save();

        const response = await request(app)
          .get("/comments")
          .set("Authorization", `Bearer ${token}`);

        const comments = response.body.comments;
        expect(comments.length).toEqual(2);
        // Chnaged the order here as test was failing - in getAllComments the .sort({ createdAt: -1 }) sorts comments by creation date with newest first - changed test to match this behaviour
        expect(comments[1].content).toEqual("First comment");
        expect(comments[0].content).toEqual("Second comment");
      });

      test("returns a new token", async () => {
        const response = await request(app)
          .get("/comments")
          .set("Authorization", `Bearer ${token}`);

        const newToken = response.body.token;
        const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
      });
    });

    describe("when token is missing", () => {
      test("responds with 401", async () => {
        const response = await request(app).get("/comments");
        expect(response.status).toEqual(401);
      });
    });
  });

  describe("GET /comments/post/:postId", () => {
    describe("when token is present", () => {
      test("responds with 200 and returns comments for specific post", async () => {
        const anotherPost = new Post({
          message: "Another post",
          author: user._id,
        });
        await anotherPost.save();

        const comment1 = new Comment({
          content: "Comment on first post",
          author: user._id,
          post: post._id,
        });
        const comment2 = new Comment({
          content: "Comment on second post",
          author: user._id,
          post: anotherPost._id,
        });
        await comment1.save();
        await comment2.save();

        const response = await request(app)
          .get(`/comments/post/${post._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(response.body.comments.length).toEqual(1);
        expect(response.body.comments[0].content).toEqual(
          "Comment on first post"
        );
      });

      test("responds with 400 when postId is invalid", async () => {
        const response = await request(app)
          .get("/comments/post/invalid-id")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(400);
        expect(response.body.message).toMatch(/invalid.*post.*id/i);
      });
    });
  });

  describe("PUT /comments/:id", () => {
    describe("when token is present", () => {
      test("responds with 200 and updates the comment", async () => {
        const comment = new Comment({
          content: "Original content",
          author: user._id,
          post: post._id,
        });
        await comment.save();

        const response = await request(app)
          .put(`/comments/${comment._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ content: "Updated content" });

        expect(response.status).toEqual(200);
        expect(response.body.comment.content).toEqual("Updated content");

        const updatedComment = await Comment.findById(comment._id);
        expect(updatedComment.content).toEqual("Updated content");
      });

      test("responds with 403 when trying to update another user's comment", async () => {
        const anotherUser = new User({
          email: "another@test.com",
          password: "12345678",
        });
        await anotherUser.save();

        const comment = new Comment({
          content: "Another user's comment",
          author: anotherUser._id,
          post: post._id,
        });
        await comment.save();

        const response = await request(app)
          .put(`/comments/${comment._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ content: "Hacking attempt" });

        expect(response.status).toEqual(403);
        expect(response.body.message).toMatch(
          /can only edit your own comments/i
        );
      });

      test("responds with 404 when comment doesn't exist", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .put(`/comments/${fakeId}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ content: "Update non-existent" });

        expect(response.status).toEqual(404);
        expect(response.body.message).toMatch(/comment not found/i);
      });
    });
  });

  describe("DELETE /comments/:id", () => {
    describe("when token is present", () => {
      test("responds with 200 and deletes the comment", async () => {
        const comment = new Comment({
          content: "To be deleted",
          author: user._id,
          post: post._id,
        });
        await comment.save();

        const response = await request(app)
          .delete(`/comments/${comment._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("Comment deleted successfully.");

        const deletedComment = await Comment.findById(comment._id);
        expect(deletedComment).toBeNull();
      });

      test("responds with 403 when trying to delete another user's comment", async () => {
        const anotherUser = new User({
          email: "another@test.com",
          password: "12345678",
        });
        await anotherUser.save();

        const comment = new Comment({
          content: "Another user's comment",
          author: anotherUser._id,
          post: post._id,
        });
        await comment.save();

        const response = await request(app)
          .delete(`/comments/${comment._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(403);
        expect(response.body.message).toMatch(
          /can only delete your own comments/i
        );
      });

      test("responds with 404 when comment doesn't exist", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .delete(`/comments/${fakeId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(404);
        expect(response.body.message).toMatch(/comment not found/i);
      });

      test("responds with 400 when comment id is invalid format", async () => {
        const response = await request(app)
          .delete("/comments/invalid-id")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(400);
        expect(response.body.message).toMatch(/invalid.*comment.*id/i);
      });
    });
  });
});
