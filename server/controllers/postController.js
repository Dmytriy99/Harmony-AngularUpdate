const Post = require("../model/post.model");

exports.getPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const post = await Post.find().skip(skip).limit(limit).sort({ _id: -1 });
    //const reversedPost = post.reverse();
    const totalPosts = await Post.countDocuments();
    res.status(200).json({
      post,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ userId: userId });
    const reversedPost = posts.reverse();
    // if (posts.length === 0) {
    //   return res.status(404).json({ message: "No posts found for this user." });
    // }

    res.status(200).json(reversedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.likedBy.includes(userId)) {
      return res.status(400).send("You have already liked this post");
    }

    post.likedBy.push(userId);
    post.likes += 1;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.PostPost = async (req, res) => {
  try {
    req.body.userId = req.userId;
    const post = await Post.create(req.body);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
