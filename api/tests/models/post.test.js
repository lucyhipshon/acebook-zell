require("../mongodb_helper");

const Post = require("../../models/post");
const User = require("../../models/user");

describe("Post model", () => {
  let user; // test need user IDs to use as authors, but users don't exit yet so we create this variable

  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    user = new User({
      email: "test@example.com",
      password: "password123",
    });
    await user.save();
  });

  // create the user for each of the tests

  it("has a message and author", () => {
    const post = new Post({
      message: "some message",
      author: user._id,
    });
    expect(post.message).toEqual("some message");
    expect(post.author.toString()).toEqual(user._id.toString());
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
});
