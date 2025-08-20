const express = require("express");
const router = express.Router();

const CommentsController = require("../controllers/comments");

router.get("/", CommentsController.getAllComments);
router.post("/", CommentsController.createComment);
router.get("/post/:postId", CommentsController.getCommentsByPost);
router.put("/:id", CommentsController.updateComment);
router.delete("/:id", CommentsController.deleteComment);

module.exports = router;
