// routes/transfer.js
const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) next();
  else res.redirect('/login');
};

router.get('/add-payee', isAuthenticated, transferController.addPayeePage);
router.post('/add-payee', isAuthenticated, transferController.addPayee);

router.get('/fund-transfer', isAuthenticated, transferController.fundTransferPage);
router.post('/fund-transfer', isAuthenticated, transferController.fundTransfer);

module.exports = router;
