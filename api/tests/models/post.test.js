require("../mongodb_helper");

const Post = require("../../models/post");
const User = require("../../models/user");

describe("Post model", () => {
  let user; // test need user IDs to use as authors, but users don't exit yet so we create this variable

  // Clean database and create a fresh user for each test
  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    user = new User({
      email: "test@example.com",
      password: "password123",
    });
    await user.save();
  });

  it("has a message and author", () => {
    const post = new Post({
      message: "some message",
      author: user._id,
    });
    expect(post.message).toEqual("some message");
    expect(post.author.toString()).toEqual(user._id.toString());
  });

  // NEW: Test that posts can have images
  it("can have an image", () => {
    const post = new Post({
      message: "some message with image",
      author: user._id,
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    });
    expect(post.image).toBeTruthy();
    expect(post.image).toContain("data:image/png;base64");
  });

  // NEW: Test that posts work without images
  it("works without an image", () => {
    const post = new Post({
      message: "some message without image",
      author: user._id,
    });
    expect(post.image).toBeUndefined();
  });

  it("can list all posts", async () => {
    const posts = await Post.find();
    expect(posts).toEqual([]);
  });

  it("can save a post", async () => {
    const post = new Post({
      message: "some message",
      author: user._id,
    });

    await post.save();
    const posts = await Post.find();
    expect(posts[0].message).toEqual("some message");
  });

  // NEW: Test saving posts with images
  it("can save a post with an image", async () => {
    const imageData =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    const post = new Post({
      message: "post with image",
      author: user._id,
      image: imageData,
    });

    await post.save();
    const posts = await Post.find();
    expect(posts[0].message).toEqual("post with image");
    expect(posts[0].image).toEqual(imageData);
  });
});
