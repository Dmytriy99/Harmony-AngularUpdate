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
  image: {
    contentType: String,
    data: Buffer,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
