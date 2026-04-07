const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const User = require('../models/User');
const { isLoggedIn } = require('../middleware/auth');

const multer = require('multer');
const path = require('path');
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'resumes');

function deleteStoredResume(resumeUrl) {
  if (!resumeUrl) return;

  const fileName = path.basename(resumeUrl);
  const filePath = path.join(uploadDir, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
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
    req.session.email = user.email;

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
    req.session.email = user.email;

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

router.get('/profile/api', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password -resetToken -resetTokenExpiry');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.post('/profile', isLoggedIn, upload.single('resume'), async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (user.role === 'student') {
      const existingStudentProfile = user.studentProfile || {};
      const previousResumeUrl = existingStudentProfile.resumeUrl || null;
      const newResumeUrl = req.file
        ? '/uploads/resumes/' + req.file.filename
        : previousResumeUrl;

      if (req.file && previousResumeUrl && previousResumeUrl !== newResumeUrl) {
        deleteStoredResume(previousResumeUrl);
      }

      user.studentProfile = {
        skills: (req.body.skills || '').split(',').map(s => s.trim()).filter(Boolean),
        cgpa: parseFloat(req.body.cgpa),
        department: req.body.department,
        year: parseInt(req.body.year),
        resumeUrl: newResumeUrl || null
      };
    }

    if (user.role === 'professor') {
      const existingProfessorProfile = user.professorProfile || {};
      user.professorProfile = {
        ...existingProfessorProfile,
        labName: req.body.labName,
        domains: (req.body.domains || '').split(',').map(d => d.trim()).filter(Boolean),
        publications: (req.body.publications || '').split(',').map(p => p.trim()).filter(Boolean)
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


router.get('/forgot-password', (req, res) => {
  res.render('auth/forgot-password', {
    step: 'form',
    error: null
  });
});

router.post('/forgot-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/forgot-password', {
        step: 'form',
        error: 'No account found with that email'
      });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.render('auth/forgot-password', {
      step: 'done',
      error: null
    });

  } catch (err) {
    console.error(err);
    res.render('auth/forgot-password', {
      step: 'form',
      error: 'Something went wrong. Try again.'
    });
  }
});

module.exports = router;
