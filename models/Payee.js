// models/Payee.js
const mongoose = require('mongoose');

const payeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who is adding the payee
  beneficiaryName: String,
  beneficiaryAccountNumber: String,
  nickname: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payee', payeeSchema);
