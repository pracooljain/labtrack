const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isLoggedIn } = require('../middleware/auth');

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/resumes/');
  },
  filename: function (req, file, cb) {
    
    cb(null, req.session.userId + '_' + Date.now() + '.pdf');
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


router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});


router.get('/register', (req, res) => {
  res.render('auth/register', { error: null });
});


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'Email already registered' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.name = user.name;

    
    res.redirect('/opportunities');

  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Something went wrong' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.name = user.name;

    res.redirect('/opportunities');

  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Something went wrong' });
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});


router.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('auth/profile', { user, session: req.session, error: null, success: null });
  } catch (err) {
    console.error(err);
    res.redirect('/opportunities');
  }
});


router.post('/profile', isLoggedIn, upload.single('resume'), async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (user.role === 'student') {
  user.studentProfile = {
    skills: req.body.skills.split(',').map(s => s.trim()),
    cgpa: parseFloat(req.body.cgpa),
    department: req.body.department,
    year: parseInt(req.body.year),
    // If a new resume was uploaded, save its path. Otherwise keep the old one
    resumeUrl: req.file 
      ? '/uploads/resumes/' + req.file.filename 
      : (user.studentProfile ? user.studentProfile.resumeUrl : null)
  };
}

    if (user.role === 'professor') {
      user.professorProfile = {
        labName: req.body.labName,
        domains: req.body.domains.split(',').map(d => d.trim()),
        publications: req.body.publications.split(',').map(p => p.trim())
      };
    }

    await user.save();

    res.render('auth/profile', { 
      user, 
      session: req.session, 
      error: null, 
      success: 'Profile updated successfully!' 
    });

  } catch (err) {
    console.error(err);
    const user = await User.findById(req.session.userId);
    res.render('auth/profile', { user, session: req.session, error: 'Something went wrong', success: null });
  }
});

module.exports = router;