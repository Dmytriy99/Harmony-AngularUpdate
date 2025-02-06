require("dotenv").config(); // Carica le variabili d'ambiente
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Importa la connessione al DB
const Post = require("./model/post.model");
const Comment = require("./model/comment.model");

const updateCommentCounts = async () => {
  try {
    await connectDB(); // Connessione al database
    console.log("Database connesso, inizio aggiornamento...");

    const posts = await Post.find();

    for (const post of posts) {
      const count = await Comment.countDocuments({ postId: post._id }); // Conta i commenti
      post.commentCount = count; // Aggiorna il campo
      await post.save(); // Salva nel database
    }

    console.log("Aggiornamento completato!");
  } catch (err) {
    console.error("Errore nell'aggiornamento:", err);
  } finally {
    mongoose.disconnect(); // Disconnetti il database dopo l'aggiornamento
  }
};

updateCommentCounts();