const mongoose = require('mongoose');

const showcaseSchema = new mongoose.Schema({
  // Which opportunity this showcase is for
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },

  // Student who did the research
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Professor who supervised
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Research title
  title: {
    type: String,
    required: true
  },

  // Short abstract of the research
  abstract: {
    type: String,
    required: true
  },

  // Number of appreciations (likes)
  appreciations: {
    type: Number,
    default: 0
  },

  // List of user IDs who appreciated
  appreciatedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, { timestamps: true });

module.exports = mongoose.model('Showcase', showcaseSchema);