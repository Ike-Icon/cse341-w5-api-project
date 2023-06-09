const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const User = require('../controllers/users');

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
    const user = await User.findOne({ email: req.user.email }).lean();
    res.render('dashboard', {
      name: req.user.name,
      user
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
