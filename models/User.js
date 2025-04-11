// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  mobile: { type: String, required: true },
  dob: { type: Date, required: true },
  aadhar: { type: String, unique: true },
  address: {
    residential: String,
    permanent: String
  },
  occupation: String,

  accountNumber: { type: String, unique: true },
  userId: { type: String, unique: true }, // for login
  password: String,
  transactionPassword: String,

  isInternetBankingRegistered: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false }, // Admin approval
  isLocked: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },

  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
