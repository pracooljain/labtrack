const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const { isLoggedIn } = require('../middleware/auth');

const isAdmin = (req, res, next) => {
  if (req.session.email === process.env.ADMIN_EMAIL) {
    next();
  } else {
    res.redirect('/opportunities');
  }
};

router.get('/', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalProfessors = await User.countDocuments({ role: 'professor' });
    const totalOpportunities = await Opportunity.countDocuments();
    const totalApplications = await Application.countDocuments();
    const activeProjects = await Opportunity.countDocuments({ isActive: true });

    const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 });
    const opportunities = await Opportunity.find()
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.render('admin/index', {
      user: req.session,
      stats: {
        totalUsers,
        totalStudents,
        totalProfessors,
        totalOpportunities,
        totalApplications,
        activeProjects
      },
      users,
      opportunities
    });

  } catch (err) {
    console.error(err);
    res.send('Something went wrong');
  }
});

router.post('/remove-user/:id', isLoggedIn, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    res.redirect('/admin');
  }
});

router.post('/toggle-opportunity/:id', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    opp.isActive = !opp.isActive;
    await opp.save();
    res.redirect('/admin');
  } catch (err) {
    res.redirect('/admin');
  }
});

module.exports = router;