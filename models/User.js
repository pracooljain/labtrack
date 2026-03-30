const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: { type: String, required: true },

  email: { type: String, required: true, unique: true, lowercase: true },

  password: { type: String, required: true },

  resetToken: String,
  resetTokenExpiry: Date,

  role: { type: String, enum: ['student', 'professor'], required: true },

  studentProfile: {
    skills:     [String],
    cgpa:       Number,
    department: String,
    year:       Number,
    resumeUrl:  String
  },

  professorProfile: {
    labName:      String,
    domains:      [String],
    publications: [String]
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);