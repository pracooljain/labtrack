const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  // Which project/opportunity this file belongs to
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },

  // Who uploaded this file
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Original file name
  originalName: {
    type: String,
    required: true
  },

  // Path where file is stored
  fileUrl: {
    type: String,
    required: true
  },

  // Type of file — resource (professor uploads) or report (student uploads)
  fileType: {
    type: String,
    enum: ['resource', 'report'],
    required: true
  },

  // Short description of the file
  description: {
    type: String,
    default: ''
  }

}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);