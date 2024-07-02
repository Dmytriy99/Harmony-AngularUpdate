const Comment = require("../model/comment.model");
const Post = require("../model/post.model");
const User = require("../model/user.model");
exports.createComment = async (req, res) => {
  try {
    const content = req.body.content;
    const postId = req.params.postId;
    const userId = req.userId;

    // Controlla se il post esiste
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found.");
    }

    //ottieni il nome e email dell'utente autenticato

    const user = await User.findById(userId);
    const name = user.name;
    const email = user.email;

    // Crea il commento associato al post
    const comment = await Comment.create({
      content: content,
      userId: userId,
      postId: postId,
      name: name,
      email: email,
    });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getComment = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Trova i commenti associati al post
    const comments = await Comment.find({ postId: postId });
    const reversedComments = comments.reverse();

    res.status(200).json(reversedComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
