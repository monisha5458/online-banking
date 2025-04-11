// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET Routes - Render EJS Views
router.get('/', (req, res) => res.render('home'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/open-account', (req, res) => res.render('open-account'));
router.get('/forgot-userid', (req, res) => res.render('forgot-userid'));
router.get('/forgot-password', (req, res) => res.render('forgot-password'));
router.get('/reset-password/:userId', (req, res) => res.render('reset-password', { userId: req.params.userId }));
router.get('/account-locked', authController.accountLockedPage);

// POST Routes - Actions
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-userid', authController.forgotUserId);
router.post('/reset-password', authController.resetPassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:userId', authController.resetPassword);

module.exports = router;

