require("../mongodb_helper");

const Comment = require("../../models/comment");
const User = require("../../models/user");
const Post = require("../../models/post");

describe("Comment model", () => {
  let user, post;

  beforeEach(async () => {
    await Comment.deleteMany({});
    await User.deleteMany({});
    await Post.deleteMany({});

    user = new User({
      email: "test@example.com",
      password: "12345678",
    });
    await user.save();

    post = new Post({
      message: "Test post",
      author: user._id,
    });
    await post.save();
  });

  // when we create a Comment object with data,
  // the data is properly stored in the object's properties

  it("has a content field", () => {
    const comment = new Comment({
      content: "This is a test comment",
      author: user._id,
      post: post._id,
    });

    // testing that the content field holds the value we assigned
    expect(comment.content).toEqual("This is a test comment");
  });

  // testing that the author field holds the user ID we assigned
  it("has an author field", () => {
    const comment = new Comment({
      content: "Test comment",
      author: user._id,
      post: post._id,
    });

    expect(comment.author).toEqual(user._id);
  });

  it("has a post field", () => {
    const comment = new Comment({
      content: "Test comment",
      author: user._id,
      post: post._id,
    });

    //   testing that the post field holds the post ID we assigned
    expect(comment.post).toEqual(post._id);
  });

  //   verifies that we can actually save a comment to the database --> get it back with the same data
  it("can save a valid comment", async () => {
    const comment = new Comment({
      content: "Valid comment",
      author: user._id,
      post: post._id,
    });

    await comment.save(); // save to databse

    // Fetch the comment back from database to verify it was saved correctly
    const savedComment = await Comment.findById(comment._id);
    expect(savedComment.content).toEqual("Valid comment");
  });

  //   Testing validation
  it("cannot save a comment without content", async () => {
    const comment = new Comment({
      author: user._id,
      post: post._id,
    });

    // expect this to throw an error because content is required
    await expect(comment.save()).rejects.toThrow();
  });

  it("cannot save a comment without author", async () => {
    const comment = new Comment({
      content: "Test comment",
      post: post._id,
    });

    await expect(comment.save()).rejects.toThrow();
  });

  it("cannot save a comment without post", async () => {
    const comment = new Comment({
      content: "Test comment",
      author: user._id,
    });

    await expect(comment.save()).rejects.toThrow();
  });

  it("cannot save a comment with content longer than 500 characters", async () => {
    const longContent = "a".repeat(501);
    const comment = new Comment({
      content: longContent,
      author: user._id,
      post: post._id,
    });

    await expect(comment.save()).rejects.toThrow();
  });

  it("automatically adds timestamps", async () => {
    const comment = new Comment({
      content: "Test comment",
      author: user._id,
      post: post._id,
    });

    await comment.save();
    expect(comment.createdAt).toBeDefined();
    expect(comment.updatedAt).toBeDefined();
  });

  it("can populate author information", async () => {
    const comment = new Comment({
      content: "Test comment",
      author: user._id,
      post: post._id,
    });
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "author"
    );
    expect(populatedComment.author.email).toEqual("test@example.com");
  });

  it("can populate post information", async () => {
    const comment = new Comment({
      content: "Test comment",
      author: user._id,
      post: post._id,
    });
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "post"
    );
    expect(populatedComment.post.message).toEqual("Test post");
  });
});
