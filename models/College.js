const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./Admin')
const Department = require('./Department')

const CollegeSchema = new mongoose.Schema({
  uniName: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    required: true,
    unique: true
  },
  collegeCode: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  principal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }]
});

const College = mongoose.model('College', CollegeSchema);

module.exports = { College };