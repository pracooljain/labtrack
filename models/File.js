const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },

  
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  
  originalName: {
    type: String,
    required: true
  },

  
  fileUrl: {
    type: String,
    required: true
  },

  
  fileType: {
    type: String,
    enum: ['resource', 'report'],
    required: true
  },


  description: {
    type: String,
    default: ''
  }

}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);