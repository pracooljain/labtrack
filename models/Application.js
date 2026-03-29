const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },

 
  sop: {
    type: String,
    required: true
  },

 
  documentUrl: {
    type: String,
    default: null
  },

 
  status: {
    type: String,
    enum: ['Applied', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'],
    default: 'Applied'
  },

  
  feedback: {
    type: String,
    default: null
  }

}, { timestamps: true });


applicationSchema.index({ student: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);