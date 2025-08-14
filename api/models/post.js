const mongoose = require("mongoose");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
// mongoose schema constructor takes --> first parameter: field definitions, second paramter: schema options (e.g. timestamps, collection names etc.)
const PostSchema = new mongoose.Schema(
  {
    message: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // pointing to the user model
      required: true,
    }, // every post must have an author
  },

  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
