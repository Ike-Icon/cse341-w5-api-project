const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Task = require('../models/task');

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/tasks', require('./tasks'));
router.use('/auth', require('./auth'));

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login'
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const taskAssignedTo = req.user._id; // Fetch tasks assigned to the logged-in user
    const tasks = await Task.find({ assignedTo: taskAssignedTo }).lean();
    res.render('dashboard', {
      name: req.user.firstName,
      tasks
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});



// Redirect after successful login with Google or email
router.get('/auth/success', (req, res) => {
  res.redirect('/dashboard');
});

module.exports = router;
