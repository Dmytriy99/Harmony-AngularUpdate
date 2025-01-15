const Comment = require("../model/comment.model");
const Post = require("../model/post.model");
const User = require("../model/user.model");
exports.createComment = async (req, res) => {
  try {
    const content = req.body.content;
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found.");
    }

    const user = await User.findById(userId);
    const name = user.name;
    const email = user.email;

    const comment = await Comment.create({
      content: content,
      userId: userId,
      postId: postId,
      name: name,
      email: email,
    });

    // post.commentCount += 1;
    // await post.save()

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getComment = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ postId: postId });
    const reversedComments = comments.reverse();

    res.status(200).json(reversedComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
