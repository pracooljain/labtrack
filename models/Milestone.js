const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  
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

  
  title: {
    type: String,
    required: true
  },

  
  description: {
    type: String,
    default: ''
  },

 
  deadline: {
    type: Date,
    required: true
  },

 
  isCompleted: {
    type: Boolean,
    default: false
  },

 
  completedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);