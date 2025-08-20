const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true, // Every comment must have content - validation will fail if missing
      maxlength: 500, // Prevents users from posting excessively long comments
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // References another document's _id field
      ref: "User", // Tells Mongoose this ObjectId points to a User document
      required: true, // Every comment must have an author
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
