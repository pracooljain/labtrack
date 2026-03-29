const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/File');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const { isLoggedIn, isProfessor, isStudent } = require('../middleware/auth');

// Configure multer for resource uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/resumes/');
  },
  filename: function (req, file, cb) {
    cb(null, 'resource_' + Date.now() + '_' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET /resources/:opportunityId — show resource vault for a project
router.get('/:opportunityId', isLoggedIn, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.opportunityId)
      .populate('postedBy', 'name');

    if (!opportunity) return res.redirect('/opportunities');

    // Get all files for this opportunity
    const files = await File.find({ opportunity: req.params.opportunityId })
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    // Separate resources and reports
    const resources = files.filter(f => f.fileType === 'resource');
    const reports = files.filter(f => f.fileType === 'report');

    res.render('resources/vault', {
      opportunity,
      resources,
      reports,
      user: req.session
    });

  } catch (err) {
    console.error(err);
    res.redirect('/opportunities');
  }
});

// POST /resources/:opportunityId/upload — upload a file
router.post('/:opportunityId/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  try {
    const { description, fileType } = req.body;

    if (!req.file) {
      return res.redirect('/resources/' + req.params.opportunityId);
    }

    await File.create({
      opportunity: req.params.opportunityId,
      uploadedBy: req.session.userId,
      originalName: req.file.originalname,
      fileUrl: '/uploads/resumes/' + req.file.filename,
      fileType: fileType || (req.session.role === 'professor' ? 'resource' : 'report'),
      description: description || ''
    });

    res.redirect('/resources/' + req.params.opportunityId);

  } catch (err) {
    console.error(err);
    res.redirect('/resources/' + req.params.opportunityId);
  }
});

// POST /resources/delete/:fileId — delete a file
router.post('/delete/:fileId', isLoggedIn, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.redirect('/opportunities');

    const opportunityId = file.opportunity;
    await File.findByIdAndDelete(req.params.fileId);

    res.redirect('/resources/' + opportunityId);

  } catch (err) {
    console.error(err);
    res.redirect('/opportunities');
  }
});

module.exports = router;