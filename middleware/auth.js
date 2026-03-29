
const isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    
    next();
  } else {
    
    res.redirect('/auth/login');
  }
};


const isProfessor = (req, res, next) => {
  if (req.session.role === 'professor') {
    next();
  } else {
    res.redirect('/opportunities');
  }
};


const isStudent = (req, res, next) => {
  if (req.session.role === 'student') {
    next();
  } else {
    res.redirect('/opportunities');
  }
};

module.exports = { isLoggedIn, isProfessor, isStudent };