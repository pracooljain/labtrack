const mongoose = require('mongoose');

const showcaseSchema = new mongoose.Schema({

  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },

  
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  
  title: {
    type: String,
    required: true
  },

  
  abstract: {
    type: String,
    required: true
  },

  
  appreciations: {
    type: Number,
    default: 0
  },

  
  appreciatedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, { timestamps: true });

module.exports = mongoose.model('Showcase', showcaseSchema);