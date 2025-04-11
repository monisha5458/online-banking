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
