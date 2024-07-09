const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    title: String,
    post: String,
    userId: String,
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
