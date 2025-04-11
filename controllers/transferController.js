// controllers/transferController.js
const Payee = require('../models/Payee');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.addPayeePage = (req, res) => {
  res.render('add-payee');
};

exports.addPayee = async (req, res) => {
  const { beneficiaryName, beneficiaryAccountNumber, nickname } = req.body;
  const userId = req.session.user._id;

  try {
    const payee = new Payee({
      userId,
      beneficiaryName,
      beneficiaryAccountNumber,
      nickname
    });
    await payee.save();
    res.send('Payee added successfully. <a href="/transfer/fund-transfer">Transfer Now</a>');
  } catch (err) {
    res.status(500).send('Error adding payee');
  }
};

exports.fundTransferPage = async (req, res) => {
  const payees = await Payee.find({ userId: req.session.user._id });
  res.render('fund-transfer', { payees });
};

exports.fundTransfer = async (req, res) => {
  const { payeeAccountNumber, amount, mode } = req.body;
  const user = await User.findById(req.session.user._id);

  try {
    if (user.balance < amount) {
      return res.send('Insufficient Balance');
    }

    const transaction = new Transaction({
      fromUser: user._id,
      toAccountNumber: payeeAccountNumber,
      amount,
      mode,
      status: 'SUCCESS'
    });

    user.balance -= amount;
    await user.save();
    await transaction.save();

    res.render('transfer-success', { transaction });
  } catch (err) {
    res.status(500).send('Transfer failed');
  }
};
