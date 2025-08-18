const mongoose = require("mongoose");
const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  const posts = await Post.find().populate("author", "email"); // using email for now, dont want to add changes to the user schema that will affect work that other will be doing
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
}

async function getPostById(req, res) {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const token = generateToken(req.user_id);
    return res.status(400).json({ message: "Invalid post id", token });
  }

  const post = await Post.findById(id);

  if (!post) {
    const token = generateToken(req.user_id);
    return res.status(404).json({ message: "Post not found", token });
  }

  const newToken = generateToken(req.user_id);
  return res.status(200).json({post, token: newToken});
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

async function deletePostById(req, res) {
  const postId = req.params.id;
  const userId = req.user_id;
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      const token = generateToken(userId);
      return res.status(400).json({ message: "Unable to delete the post. Invalid post id.", token})
    }
    const post = await Post.findOne({_id: postId});
    if (!post) {
      return res.status(404).json({message: "Post not found."})
    }
    if (userId !== post.author.toString()) {
      return res.status(403).json({message: "Unable to delete the post. You can only delete your own posts."})
    }
    await Post.deleteOne({_id: postId})
    return res.status(200).send({message: "Post deleted successfully."})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Something went wrong. Please try deleting the post again."});
  }
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getPostById: getPostById,
  deletePostById: deletePostById,
};

module.exports = PostsController;
