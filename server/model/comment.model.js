const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: String,
  postId: String,
  userId: String,
  name: String,
  email: String,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
