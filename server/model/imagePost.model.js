const mongoose = require('mongoose');

const imagePostSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

module.exports = mongoose.model('ImagePost', imagePostSchema);