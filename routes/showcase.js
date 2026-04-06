const express = require('express');
const router = express.Router();
const Showcase = require('../models/Showcase');
const { isLoggedIn, isProfessor } = require('../middleware/auth');


router.get('/', async (req, res) => {
  try {
    
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


router.get('/add', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const Opportunity = require('../models/Opportunity');
    const Application = require('../models/Application');

    const opportunities = await Opportunity.find({ postedBy: req.session.userId });

    
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

router.post('/add', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const { abstract, opportunityId, studentId } = req.body;

    const opp = await Opportunity.findById(opportunityId);

    await Showcase.create({
      opportunity: opportunityId,
      student: studentId,
      professor: req.session.userId,
      title: opp.title,
      abstract
    });

    res.redirect('/showcase');

  } catch (err) {
    console.error(err);
    res.redirect('/showcase/add');
  }
});


router.post('/appreciate/:id', isLoggedIn, async (req, res) => {
  try {
    const showcase = await Showcase.findById(req.params.id);

    if (!showcase) return res.json({ success: false });

   
    const alreadyLiked = showcase.appreciatedBy.includes(req.session.userId);

    if (alreadyLiked) {
      
      showcase.appreciations -= 1;
      showcase.appreciatedBy.pull(req.session.userId);
    } else {
      
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