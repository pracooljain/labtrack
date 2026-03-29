
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));


const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const applicationRoutes = require('./routes/applications');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const resourceRoutes = require('./routes/resources');
const milestoneRoutes = require('./routes/milestones');
const showcaseRoutes = require('./routes/showcase');

app.use('/auth', authRoutes);
app.use('/opportunities', opportunityRoutes);
app.use('/applications', applicationRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin', adminRoutes);
app.use('/resources', resourceRoutes);
app.use('/milestones', milestoneRoutes);
app.use('/showcase', showcaseRoutes);

app.get('/', (req, res) => {
  res.redirect('/opportunities');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LabTrack running at http://localhost:${PORT}`);
});