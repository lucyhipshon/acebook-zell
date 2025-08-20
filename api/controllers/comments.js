const Comment = require("../models/comment");
const Post = require("../models/post");
const { generateToken } = require("../lib/token");

const createComment = async (req, res) => {
  try {
    const { content, post } = req.body; // destructuring from req.body object to only get post and content e.g. req.body.content & req.body.post

    if (!content || !post) {
      return res.status(400).json({
        message: "Content and post are required",
      });
    }

    // Check if post exists
    const existingPost = await Post.findById(post);
    if (!existingPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = new Comment({
      content,
      author: req.user_id,
      post,
    });

    await comment.save();

    const newToken = generateToken(req.user_id);
    res.status(201).json({
      comment,
      token: newToken,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Error creating comment",
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("author", "email") // Populates author field with email only
      .populate("post", "message") // Populates post field with message only
      .sort({ createdAt: -1 }); // sorts by creation date

    const newToken = generateToken(req.user_id);
    res.status(200).json({
      comments,
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments",
    });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      // Validates postId format (24-character MongoDB ObjectId)
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const comments = await Comment.find({ post: postId }) // "find all documents in the Comment collection where the post field equals the value stored in postId."
      .populate("author", "email")
      .sort({ createdAt: 1 }); // Sorts chronologically (oldest first)

    const newToken = generateToken(req.user_id);
    res.status(200).json({
      comments,
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== req.user_id) {
      return res.status(403).json({
        message: "You can only edit your own comments",
      });
    }

    comment.content = content;
    await comment.save();

    const newToken = generateToken(req.user_id);
    res.status(200).json({
      comment,
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating comment",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== req.user_id) {
      return res.status(403).json({
        message: "You can only delete your own comments",
      });
    }

    await Comment.findByIdAndDelete(id);

    const newToken = generateToken(req.user_id);
    res.status(200).json({
      message: "Comment deleted successfully.",
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting comment",
    });
  }
};

module.exports = {
  createComment,
  getAllComments,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
