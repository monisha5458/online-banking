// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Protect routes (basic session check)
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', isAuthenticated, dashboardController.dashboard);
router.get('/account-statement', isAuthenticated, dashboardController.accountStatement);
router.post('/change-password', isAuthenticated, dashboardController.changePassword);

module.exports = router;
