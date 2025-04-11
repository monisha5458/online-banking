// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { accountNumber, userId, password, confirmPassword, transactionPassword } = req.body;

  try {
    const user = await User.findOne({ accountNumber });

    if (!user) return res.send('Account not found');
    if (user.isInternetBankingRegistered) return res.send('Already registered');
    if (password !== confirmPassword) return res.send('Passwords do not match');

    const hashedLoginPassword = await bcrypt.hash(password, 10);
    const hashedTxnPassword = await bcrypt.hash(transactionPassword, 10);

    user.userId = userId;
    user.password = hashedLoginPassword;
    user.transactionPassword = hashedTxnPassword;
    user.isInternetBankingRegistered = true;
    await user.save();

    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId });

    if (!user) return res.send('User not found');
    if (!user.isInternetBankingRegistered) return res.send('Not registered for Internet Banking');
    if (user.isLocked) return res.redirect('/account-locked');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 3) {
        user.isLocked = true;
      }
      await user.save();
      return res.send('Invalid credentials');
    }

    user.loginAttempts = 0;
    await user.save();

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Login error');
  }
};

exports.forgotUserId = async (req, res) => {
  const { accountNumber } = req.body;
  // Simulating OTP & email step
  try {
    const user = await User.findOne({ accountNumber });
    if (!user) return res.send('Account not found');

    // Normally you would verify OTP first
    res.send(`Your User ID is: ${user.userId}`);
  } catch (err) {
    res.status(500).send('Error retrieving user ID');
  }
};


// controllers/authController.js
exports.forgotPassword = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findOne({ userId });
  if (!user) return res.send('Invalid user ID');

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP and expiry (10 mins)
  user.otp = otp;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  console.log(`🔐 OTP for ${userId}: ${otp}`); // Simulated OTP output

  res.render('verify-otp', { userId });
};

exports.resetPassword = async (req, res) => {
  const { userId } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) return res.send('Passwords do not match');

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ userId }, { password: hashed, isLocked: false, loginAttempts: 0 });

  res.redirect('/login');
};
exports.verifyOtp = async (req, res) => {
  const { userId } = req.params;
  const { otp } = req.body;

  const user = await User.findOne({ userId });

  if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
    return res.send('Invalid or expired OTP');
  }

  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  res.redirect(`/reset-password/${userId}`);
};

exports.accountLockedPage = (req, res) => {
  res.render('account-locked');
};
