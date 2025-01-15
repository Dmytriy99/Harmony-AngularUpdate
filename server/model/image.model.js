const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Collegamento all'utente
  data: { type: Buffer, required: true }, // Dati binari dell'immagine
  contentType: { type: String, required: true }, // Tipo MIME dell'immagine (es. image/jpeg)
  createdAt: { type: Date, default: Date.now }, // Data di caricamento
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;