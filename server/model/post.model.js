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
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImagePost' },
   // commentCount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
