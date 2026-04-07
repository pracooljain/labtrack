const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.session.userId
    }).sort({ createdAt: -1 });

    res.render('notifications/index', {
      notifications,
      user: req.session
    });

  } catch (err) {
    console.error(err);
    res.send('Something went wrong');
  }
});

router.get('/unread', isLoggedIn, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.session.userId,
      isRead: false
    }).sort({ createdAt: -1 }).limit(10);

    res.json(notifications);

  } catch (err) {
    res.json([]);
  }
});

router.post('/read/:id', isLoggedIn, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

router.post('/read-all', isLoggedIn, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.session.userId, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

router.get('/api', isLoggedIn, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.session.userId
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;