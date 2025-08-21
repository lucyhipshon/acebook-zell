const mongoose = require("mongoose");
const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  const searchTerm = req.query.q;

  let query = {}; 
  if (searchTerm) {
    query = {
      message: { $regex: new RegExp(searchTerm, 'i') } 
    };
  }

  const posts = await Post.find(query).populate(
    "author",
    "email firstName lastName profileImage"
  );
  
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
}

async function getPostById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const token = generateToken(req.user_id);
    return res.status(400).json({ message: "Invalid post id", token });
  }

  const post = await Post.findById(id).populate(
    "author",
    "email firstName lastName profileImage"
  );

  if (!post) {
    const token = generateToken(req.user_id);
    return res.status(404).json({ message: "Post not found", token });
  }

  const newToken = generateToken(req.user_id);
  return res.status(200).json({ post, token: newToken });
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
    if (req.body.message.length > 2000) {
      return res.status(400).json({
        error: "message must be 2000 characters or less",
      });
    }

    const postData = {
      message: req.body.message.trim(),
      author: req.user_id, // this is coming from the token checker middleware
    };

    // NEW: Add image of provided
    if (req.body.image) {
      postData.image = req.body.image;
    }

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
      return res.status(400).json({
        message: "Unable to delete the post. Invalid post id.",
        token,
      });
    }
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (userId !== post.author.toString()) {
      return res.status(403).json({
        message:
          "Unable to delete the post. You can only delete your own posts.",
      });
    }
    await Post.deleteOne({ _id: postId });
    return res.status(200).send({ message: "Post deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong. Please try deleting the post again.",
    });
  }
}

async function likePost(req, res) {
  const userId = req.user_id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const token = generateToken(userId);
    return res.status(400).json({ message: "Invalid post id", token });
  }

  // $addToSet is a mongodb update operator. This means it can only be added once
  // { new: true } returns the updated document
  const updated = await Post.findByIdAndUpdate(
    // <- Mongodb method
    id,
    { $addToSet: { likes: userId } },
    { new: true }
  );

  if (!updated) {
    const token = generateToken(userId);
    return res.status(404).json({ message: "Post not found", token });
  }

  // create a per-user flag for whether they liked it (not stored in database)
  const likedByCurrentUser = Array.isArray(updated.likes) // If the likes array contains the userId, likedByCurrentUser is true
    ? updated.likes.some((u) => String(u) === String(userId))
    : false;

  // spread updated.JSON() so virtuals like likesCount are included in the payload
  const token = generateToken(userId);
  return res.status(200).json({
    post: { ...updated.toJSON(), likedByCurrentUser },
    token,
  });
}

async function unlikePost(req, res) {
  const userId = req.user_id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const token = generateToken(userId);
    return res.status(400).json({ message: "Invalid post id", token });
  }

  const updated = await Post.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true } // <- Uses $pull to remove the userId form the array if it is present
  );

  if (!updated) {
    const token = generateToken(userId);
    return res.status(404).json({ message: "Post not found", token });
  }

  const likedByCurrentUser = Array.isArray(updated.likes)
    ? updated.likes.some((u) => String(u) === String(userId))
    : false;

  const token = generateToken(userId);
  return res.status(200).json({
    post: { ...updated.toJSON(), likedByCurrentUser },
    token,
  });
}


// new function for getting all posts by a logged in user
async function getMyPosts(req, res) {
  console.log("req.user_id:", req.user_id);
  try {
    if (!req.user_id) {
      console.error("No user_id found on request");
      return res.status(400).json({message: "User ID missing from request"});
    }

    const posts = await Post.find({ author: req.user_id })
      .sort({ createdAt: -1});
    
    res.status(200).json(posts);
  } catch (err) {
    console.error('Failed to get user posts:', err);
    res.status(500).json({ message: 'Failed to get user posts'});
  }
};



const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getPostById: getPostById,
  deletePostById: deletePostById,
  likePost: likePost,
  unlikePost: unlikePost,
};

module.exports = PostsController;
