const express = require("express");
const router = express.Router();
const tokenChecker = require('../middleware/tokenChecker');

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.post("/", PostsController.createPost);
// new route
router.get('/me', tokenChecker, PostsController.getMyPosts);
router.get("/:id", PostsController.getPostById);
router.delete("/:id", PostsController.deletePostById);
router.post("/:id/like", PostsController.likePost);
router.delete("/:id/like", PostsController.unlikePost);

module.exports = router;
