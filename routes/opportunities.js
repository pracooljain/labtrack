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
      title, domain, customDomain, description,
      requiredSkills, duration,
      hasStipend, slotsAvailable
    } = req.body;
    const finalDomain = domain === '__custom__'
      ? (customDomain || '').trim()
      : (domain || '').trim();

    if (!finalDomain) {
      return res.render('opportunities/post', {
        error: 'Please select or enter a domain',
        user: req.session
      });
    }

    await Opportunity.create({
      postedBy: req.session.userId,
      title,
      domain: finalDomain,
      description,
      
      requiredSkills: (requiredSkills || '').split(',').map(s => s.trim()).filter(Boolean),
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

router.post('/delete/:id', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.redirect('/opportunities');
    }

    if (opportunity.postedBy.toString() !== req.session.userId) {
      return res.redirect('/opportunities');
    }

    await Opportunity.findByIdAndDelete(req.params.id);
    res.redirect('/opportunities');
  } catch (err) {
    console.error(err);
    res.redirect('/opportunities');
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
