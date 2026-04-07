const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');
const Comment = require('../models/Comment');
const Opportunity = require('../models/Opportunity');
const { isLoggedIn, isProfessor, isStudent } = require('../middleware/auth');

router.get('/:opportunityId', isLoggedIn, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.opportunityId)
      .populate('postedBy', 'name');

    if (!opportunity) return res.redirect('/opportunities');

    let milestones;

    if (req.session.role === 'professor') {
      milestones = await Milestone.find({ opportunity: req.params.opportunityId })
        .populate('student', 'name email')
        .sort({ deadline: 1 });
    } else {
      milestones = await Milestone.find({
        opportunity: req.params.opportunityId,
        student: req.session.userId
      }).sort({ deadline: 1 });
    }

    const milestoneIds = milestones.map(m => m._id);
    const comments = await Comment.find({ milestone: { $in: milestoneIds } })
      .populate('author', 'name role')
      .sort({ createdAt: 1 });

    const commentsByMilestone = {};
    comments.forEach(c => {
      const key = c.milestone.toString();
      if (!commentsByMilestone[key]) commentsByMilestone[key] = [];
      commentsByMilestone[key].push(c);
    });

    res.render('milestones/dashboard', {
      opportunity,
      milestones,
      commentsByMilestone,
      user: req.session
    });

  } catch (err) {
    console.error(err);
    res.redirect('/opportunities');
  }
});

router.post('/:opportunityId/add', isLoggedIn, isProfessor, async (req, res) => {
  try {
    const { title, description, deadline, studentId } = req.body;

    await Milestone.create({
      opportunity: req.params.opportunityId,
      student: studentId,
      title,
      description,
      deadline: new Date(deadline)
    });

    res.redirect('/milestones/' + req.params.opportunityId);

  } catch (err) {
    console.error(err);
    res.redirect('/milestones/' + req.params.opportunityId);
  }
});

router.post('/complete/:milestoneId', isLoggedIn, isStudent, async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId);
    if (!milestone) return res.redirect('/opportunities');

    milestone.isCompleted = true;
    milestone.completedAt = new Date();
    await milestone.save();

    res.redirect('/milestones/' + milestone.opportunity);

  } catch (err) {
    console.error(err);
    res.redirect('/opportunities');
  }
});

router.post('/comment/:milestoneId', isLoggedIn, async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      milestone: req.params.milestoneId,
      author: req.session.userId,
      text
    });

    await comment.populate('author', 'name role');

    res.json({
      success: true,
      comment: {
        _id: comment._id,
        text: comment.text,
        author: comment.author,
        createdAt: comment.createdAt
      }
    });

  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;