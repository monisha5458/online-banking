// controllers/dashboardController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

exports.dashboard = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect('/login');

    const recentTxns = await Transaction.find({ fromUser: user._id }).sort({ createdAt: -1 }).limit(5);
    const dbUser = await User.findById(user._id);

    res.render('dashboard', {
      user: dbUser,
      transactions: recentTxns
    });
  } catch (err) {
    res.status(500).send('Dashboard error');
  }
};

exports.accountStatement = async (req, res) => {
    try {
      const user = req.session.user;
      const { from, to } = req.query;
  
      if (!user) return res.redirect('/login');
  
      // 👇 Defensive checks
      if (!from || !to) {
        return res.render('account-statement', {
          transactions: [],
          error: 'Please select both dates.'
        });
      }
  
      const transactions = await Transaction.find({
        fromUser: user._id,
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to)
        }
      });
  
      res.render('account-statement', {
        transactions,
        error: null
      });
    } catch (err) {
      console.error('Account statement error:', err);
      res.status(500).render('account-statement', {
        transactions: [],
        error: 'Error fetching statement'
      });
    }
  };
  

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.session.user._id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.send('Current password is incorrect');
    if (newPassword !== confirmPassword) return res.send('New passwords do not match');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send('Password updated successfully');
  } catch (err) {
    res.status(500).send('Error changing password');
  }
};
