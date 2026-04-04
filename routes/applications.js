const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const sendMail = require('../config/mailer');
const { isLoggedIn, isProfessor, isStudent } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/resumes/');
  },
  filename: function (req, file, cb) {
    cb(null, 'doc_' + req.session.userId + '_' + Date.now() + '.pdf');
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  }
});

router.post('/apply/:opportunityId', isLoggedIn, isStudent, upload.single('document'), async (req, res) => {
  try {
    const { sop } = req.body;
    const opportunityId = req.params.opportunityId;

    const existing = await Application.findOne({
      student: req.session.userId,
      opportunity: opportunityId
    });

    if (existing) {
      return res.redirect('/applications/my?error=already_applied');
    }

    const application = await Application.create({
      student: req.session.userId,
      opportunity: opportunityId,
      sop: sop,
      documentUrl: req.file ? '/uploads/resumes/' + req.file.filename : null
    });

    const opportunity = await Opportunity.findById(opportunityId).populate('postedBy');

    await Notification.create({
      recipient: opportunity.postedBy._id,
      message: `New application received for "${opportunity.title}" from ${req.session.name}`,
      type: 'application',
      link: '/applications/manage'
    });

    await sendMail(
      opportunity.postedBy.email,
      `New Application for ${opportunity.title}`,
      `<h3>New Application Received</h3>
       <p>Student <strong>${req.session.name}</strong> has applied for <strong>${opportunity.title}</strong>.</p>
       <p>Login to LabTrack to review the application.</p>`
    );

    res.redirect('/applications/my?success=applied');

  } catch (err) {
    console.error(err);
    res.redirect('/opportunities');
  }
});

router.get('/my', isLoggedIn, isStudent, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.session.userId })
      .populate('opportunity')
      .sort({ createdAt: -1 });

    res.render('applications/my-applications', {
      applications,
      user: req.session,
      error: req.query.error,
      success: req.query.success
    });

  } catch (err) {
    console.error(err);
    res.send('Something went wrong');
  }
});

router.get('/manage', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ postedBy: req.session.userId });
    const opportunityIds = opportunities.map(o => o._id);

    const applications = await Application.find({ opportunity: { $in: opportunityIds } })
      .populate('student', 'name email studentProfile')
      .populate('opportunity', 'title domain')
      .sort({ createdAt: -1 });

    res.render('applications/manage', {
      applications,
      user: req.session
    });

  } catch (err) {
    console.error(err);
    res.send('Something went wrong');
  }
});

router.get('/apply/:opportunityId', isLoggedIn, isStudent, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.opportunityId)
      .populate('postedBy', 'name');

    if (!opportunity) return res.redirect('/opportunities');

    res.render('applications/apply', {
      opportunity,
      user: req.session,
      error: null
    });

  } catch (err) {
    console.error(err);
    res.redirect('/opportunities');
  }
});

router.post('/status/:applicationId', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const application = await Application.findById(req.params.applicationId)
      .populate('student')
      .populate('opportunity');

    if (!application) return res.redirect('/applications/manage');

    const previousStatus = application.status;

    application.status = status;
    application.feedback = feedback || null;
    await application.save();

    if (status === 'Accepted' && previousStatus !== 'Accepted') {
      await Opportunity.findByIdAndUpdate(
        application.opportunity._id,
        { $inc: { slotsAvailable: -1 } }
      );
    }

    await Notification.create({
      recipient: application.student._id,
      message: `Your application for "${application.opportunity.title}" is now ${status}`,
      type: 'status_change',
      link: '/applications/my'
    });

    await sendMail(
      application.student.email,
      `Application Update — ${application.opportunity.title}`,
      `<h3>Application Status Updated</h3>
       <p>Your application for <strong>${application.opportunity.title}</strong> 
       has been updated to <strong>${status}</strong>.</p>
       ${feedback ? `<p>Feedback: ${feedback}</p>` : ''}
       <p>Login to LabTrack to view details.</p>`
    );

    res.redirect('/applications/manage');

  } catch (err) {
    console.error(err);
    res.redirect('/applications/manage');
  }
});

router.get('/api', isLoggedIn, isStudent, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.session.userId })
      .populate('opportunity')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;