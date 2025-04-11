// controllers/adminController.js
const User = require('../models/User');
const { generateAccountNumber } = require('../utils/generateAccountNumber');

exports.adminHome = (req, res) => {
  res.render('admin-home');
};

exports.viewRequests = async (req, res) => {
  const pendingUsers = await User.find({ isApproved: false, accountNumber: null });
  res.render('admin-requests', { users: pendingUsers });
};

exports.approveUser = async (req, res) => {
  const userId = req.params.id;

  const accountNumber = generateAccountNumber();

  await User.findByIdAndUpdate(userId, {
    isApproved: true,
    accountNumber
  });

  res.redirect('/admin/requests');
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
