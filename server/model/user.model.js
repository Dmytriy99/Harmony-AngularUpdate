const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  gender: { type: String, enum: ["male", "female"] },
  age: String,
  description: String,
  address: String,
  status: { type: String, enum: ["online", "offline"] },
  image: {
    contentType: String,
    data: Buffer,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
