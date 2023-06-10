module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login'); // Redirect to the login page if not authenticated
    }
  },
  ensureGuest: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/dashboard'); // Redirect to the dashboard if authenticated
    }
  }
};
