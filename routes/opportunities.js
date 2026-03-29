const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const { isLoggedIn, isProfessor } = require('../middleware/auth');


router.get('/', isLoggedIn, async (req, res) => {
  try {
    
    const { domain, hasStipend, search } = req.query;

    
    let filter = { isActive: true };
    if (domain) filter.domain = domain;
    if (hasStipend) filter.hasStipend = true;
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; 
    }

    
    const opportunities = await Opportunity.find(filter)
      .populate('postedBy', 'name professorProfile')
      .sort({ createdAt: -1 }); 

    res.render('opportunities/board', {
      opportunities,
      user: req.session,
      query: req.query
    });

  } catch (err) {
    console.error(err);
    res.send('Something went wrong');
  }
});


router.get('/post', isLoggedIn, isProfessor, (req, res) => {
  res.render('opportunities/post', { error: null, user: req.session });
});


router.post('/post', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const {
      title, domain, description,
      requiredSkills, duration,
      hasStipend, slotsAvailable
    } = req.body;

    await Opportunity.create({
      postedBy: req.session.userId,
      title,
      domain,
      description,
      
      requiredSkills: requiredSkills.split(',').map(s => s.trim()),
      duration,
      hasStipend: hasStipend === 'on',
      slotsAvailable: parseInt(slotsAvailable)
    });

    res.redirect('/opportunities');

  } catch (err) {
    console.error(err);
    res.render('opportunities/post', { 
      error: 'Something went wrong', 
      user: req.session 
    });
  }
});


router.get('/search', isLoggedIn, async (req, res) => {
  try {
    const { q } = req.query;
    const results = await Opportunity.find({
      isActive: true,
      title: { $regex: q, $options: 'i' }
    })
    .populate('postedBy', 'name')
    .limit(10);

    
    res.json(results);

  } catch (err) {
    res.json([]);
  }
});

// GET /opportunities/api — JSON endpoint for AngularJS
router.get('/api', isLoggedIn, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ isActive: true })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (err) {
    res.json([]);
  }
});
module.exports = router;