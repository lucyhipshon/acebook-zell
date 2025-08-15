const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  const posts = await Post.find();
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
}

async function getPostById(req, res) {
  const {id} = req.params;
  console.log("getPostById called with id =", id);

  const post = await Post.findById(id);
  console.log("found post: ", post);

  const newToken = generateToken(req.user_id);
  return res.status(200).json({post, token: newToken});
}

async function createPost(req, res) {
  const post = new Post(req.body);
  post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token: newToken });
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getPostById: getPostById,
};

module.exports = PostsController;
