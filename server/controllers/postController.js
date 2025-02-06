const Post = require("../model/post.model");
const Comment = require("../model/comment.model");
const User = require("../model/user.model")
const ImagePost = require("../model/imagePost.model");
const { getIO } = require("../soket"); // Importa Socket.IO
exports.getPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const title = req.query.title;
    let query = {};
    // ricerca post kay insensitive
    if (title) {
      query.title = { $regex: `\\b${title}`, $options: "i" }; //ricerca tramite titolo key insensitive
    }

    // trova post con l'array invertito per ottenere i post dall'ultimo inserito
    const post = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });
    const totalPosts = await Post.countDocuments(query);
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
    res.status(200).json(reversedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.imageId) {
      await ImagePost.findByIdAndDelete(post.imageId);
    }

    // Cancellare tutti i commenti associati al post
    await Comment.deleteMany({ postId: postId });

     // Invia un evento a tutti i client con l'ID del post eliminato
     getIO().emit("postDeleted", { postId });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    
    const user = await User.findById(userId)
    const post = await Post.findById(postId);

    const userName = user.name
    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.likedBy.includes(userId)) {
      return res.status(400).send("You have already liked this post");
    }

    post.likedBy.push(userId);
    post.likedByName.push(userName);
    
    post.likes += 1;

    await post.save();

    getIO().emit("Like", { postId: postId, likes: post.likes });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.PostPost = async (req, res) => {
  try {
    console.log("Inizio della funzione");
    console.log("req.userId:", req.userId);
    const user = await User.findById(req.userId)
    console.log("Utente trovato:", user);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    req.body.userId = req.userId;
    req.body.userName = user.name;
    req.body.email = user.email
    console.log("req.body:", req.body);
    console.log("Creazione del post");
    const post = await Post.create(req.body);

    if (req.body.image === "false"){
    getIO().emit("newPost", post); // Notifica tutti i client con il nuovo post
    }

    
    console.log("Post creato:", post);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePostImage = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found.");
    }

    if (!req.file) {
      return res.status(400).send("No image file uploaded.");
    }

    // Crea un nuovo documento immagine per il post
    const newImage = new ImagePost({
      postId,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    // Salva l'immagine nel database
    const savedImage = await newImage.save();

    // Aggiungi l'ID dell'immagine al post
    post.imageId = savedImage._id;
    await post.save();

    getIO().emit("newPost", post);

    res.status(200).send({
      message: "Post image uploaded successfully.",
      imageId: savedImage._id,
    });
  } catch (error) {
    res.status(500).send("Error uploading post image.");
  }
};


exports.getPostImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;

    // Trova l'immagine nel database
    const image = await ImagePost.findById(imageId);
    if (!image) {
      return res.status(404).send("Image not found.");
    }

    // Imposta il tipo di contenuto e invia l'immagine
    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error) {
    res.status(500).send("Error retrieving post image.");
  }
};