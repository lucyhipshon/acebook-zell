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
    // NEW: Add image field
    image: {
      type: String, // storing image data as base64 encoded --> simple approach for first iteration - can migrate to more robust based on app scaling
      required: false,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      }
    ]
  },

  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

PostSchema.virtual("likesCount").get(function () {
  return Array.isArray(this.likes) ? this.likes.length : 0
});

PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

/*

What post should look like in an API response:

{
  "_id": "POST_ID",
  "message": "Hello world",
  "author": "USER_ID",
  "createdAt": "2025-08-18T12:34:56.000Z",
  "updatedAt": "2025-08-18T12:34:56.000Z",
  "likesCount": 3,
  "likedByCurrentUser": true
}

*/
