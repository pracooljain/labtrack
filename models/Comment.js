const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // Which milestone this comment is on
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone',
    required: true
  },

  // Who wrote the comment
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // The comment text
  text: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);