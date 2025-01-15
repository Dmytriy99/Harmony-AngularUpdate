const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    title: String,
    post: String,
    userId: String,
    userName: String,
    email: String,
    likes: { type: Number, default: 0 },
    likedBy: [{  type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likedByName: [String],
   // commentCount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
