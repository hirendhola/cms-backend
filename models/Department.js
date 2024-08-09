const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HOD'
  },
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }]
});

const Department = mongoose.model('Department', DepartmentSchema);

module.exports = { Department };