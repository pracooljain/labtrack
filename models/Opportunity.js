const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  title:       { type: String, required: true },
  domain:      { type: String, required: true },
  description: { type: String, required: true },

  
  requiredSkills: [String],

  
  duration: String,

 
  hasStipend: { type: Boolean, default: false },

 
  slotsAvailable: { type: Number, default: 1 },

  
  isActive: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);