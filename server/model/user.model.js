const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  gender: { type: String, required: true, enum: ["male", "female"] },
  age: String,
  description: String,
  address: String,
  status: { type: String, enum: ["online", "offline"] },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: "Image", default: null }, // Collegamento all'immagine
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Lista amici
  friendRequests: [{ userId: String, name: String }], // Richieste in sospeso
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Richieste inviate
  // image: {
  //   contentType: String,
  //   data: Buffer,
  // },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
