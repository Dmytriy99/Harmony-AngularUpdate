const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: String,
  post: String,
  userId: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const post = mongoose.model("post", PostSchema);

module.exports = post;
