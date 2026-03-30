const express = require('express');
const router = express.Router();
const Showcase = require('../models/Showcase');
const { isLoggedIn, isProfessor } = require('../middleware/auth');

// GET /showcase — public showcase wall
router.get('/', async (req, res) => {
  try {
    // Get all showcases sorted by most appreciated
    const showcases = await Showcase.find()
      .populate('student', 'name')
      .populate('professor', 'name')
      .populate('opportunity', 'title domain')
      .sort({ appreciations: -1 });

    res.render('showcase/wall', {
      showcases,
      user: req.session || null
    });

  } catch (err) {
    console.error(err);
    res.send('Something went wrong');
  }
});

// GET /showcase/add — show form to add showcase (professor only)
router.get('/add', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const Opportunity = require('../models/Opportunity');
    const Application = require('../models/Application');

    const opportunities = await Opportunity.find({ postedBy: req.session.userId });

    // Get all accepted students for this professor's opportunities
    const opportunityIds = opportunities.map(o => o._id);
    const acceptedApplications = await Application.find({
      opportunity: { $in: opportunityIds },
      status: 'Accepted'
    }).populate('student', 'name email')
      .populate('opportunity', 'title');

    res.render('showcase/add', {
      opportunities,
      acceptedApplications,
      user: req.session,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/showcase');
  }
});

// POST /showcase/add — professor publishes research
router.post('/add', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const { title, abstract, opportunityId, studentId } = req.body;

    await Showcase.create({
      opportunity: opportunityId,
      student: studentId,
      professor: req.session.userId,
      title,
      abstract
    });

    res.redirect('/showcase');

  } catch (err) {
    console.error(err);
    res.redirect('/showcase/add');
  }
});

// POST /showcase/appreciate/:id — student appreciates (likes)
router.post('/appreciate/:id', isLoggedIn, async (req, res) => {
  try {
    const showcase = await Showcase.findById(req.params.id);

    if (!showcase) return res.json({ success: false });

    // Check if already appreciated
    const alreadyLiked = showcase.appreciatedBy.includes(req.session.userId);

    if (alreadyLiked) {
      // Unlike
      showcase.appreciations -= 1;
      showcase.appreciatedBy.pull(req.session.userId);
    } else {
      // Like
      showcase.appreciations += 1;
      showcase.appreciatedBy.push(req.session.userId);
    }

    await showcase.save();

    res.json({
      success: true,
      appreciations: showcase.appreciations,
      liked: !alreadyLiked
    });

  } catch (err) {
    res.json({ success: false });
  }
});

// GET /showcase/api — JSON endpoint for React component
router.get('/api', async (req, res) => {
  try {
    const showcases = await Showcase.find()
      .populate('student', 'name')
      .populate('professor', 'name')
      .populate('opportunity', 'title domain')
      .sort({ appreciations: -1 });

    res.json(showcases);

  } catch (err) {
    res.json([]);
  }
});

// POST /showcase/delete/:id — professor deletes showcase
router.post('/delete/:id', isLoggedIn, isProfessor, async (req, res) => {
  try {
    await Showcase.findByIdAndDelete(req.params.id);
    res.redirect('/showcase');
  } catch (err) {
    console.error(err);
    res.redirect('/showcase');
  }
});

module.exports = router;