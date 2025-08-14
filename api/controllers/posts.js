const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  const posts = await Post.find().populate("author", "email"); // using email for now, dont want to add changes to the user schema that will affect work that other will be doing
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
}

async function createPost(req, res) {
  try {
    // input validation
    if (!req.body.message || req.body.message.trim().length === 0) {
      return res.status(400).json({
        error: "message is required and cannot be empty",
      });
    }

    // Length validaition (matching frontend post requirement)
    if (req.body.message.length > 200) {
      return res.status(400).json({
        error: "message must be 200 characters or less",
      });
    }

    const postData = {
      message: req.body.message.trim(),
      author: req.user_id, // this is coming from the token checker middleware
    };

    const post = new Post(postData);
    await post.save();

    const newToken = generateToken(req.user_id);
    res.status(201).json({
      message: "Post created",
      token: newToken,
      post: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      error: "Failed to create post. Please try again",
    });
  }
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
};

module.exports = PostsController;
