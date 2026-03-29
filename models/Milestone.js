const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  // Which opportunity this milestone belongs to
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },

  // Which student this milestone is for
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Milestone title
  title: {
    type: String,
    required: true
  },

  // Description of what needs to be done
  description: {
    type: String,
    default: ''
  },

  // Deadline for this milestone
  deadline: {
    type: Date,
    required: true
  },

  // Has the student marked this as complete?
  isCompleted: {
    type: Boolean,
    default: false
  },

  // When the student completed it
  completedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);