const { Admin } = require('../models/Admin')
const mongoose = require('mongoose')

exports.profile = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email }).select('-password');

    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred while fetching the profile' });
  }
};
