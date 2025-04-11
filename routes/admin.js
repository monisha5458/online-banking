// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.adminHome);
router.get('/requests', adminController.viewRequests);
router.get('/approve/:id', adminController.approveUser);

// Account creation from user form
router.post('/open-account', async (req, res) => {
  const { name, email, mobile, dob, aadhar, residential, permanent, occupation } = req.body;

  try {
    const user = new (require('../models/User'))({
      name,
      email,
      mobile,
      dob,
      aadhar,
      address: { residential, permanent },
      occupation,
      isApproved: false
    });
    await user.save();
    res.send('Account request submitted. Awaiting admin approval.');
  } catch (err) {
    res.status(500).send('Error creating account request');
  }
});

module.exports = router;
