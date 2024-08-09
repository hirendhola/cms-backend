const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Student Schema
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accessCode: {
    type: String,
    required: true,
    unique: true
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  tenthMarks: {
    type: Number,
    required: true
  },
  twelfthMarks: {
    type: Number,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
});

passwordHelper.addPasswordFieldToSchema(AdminSchema);

const Student = mongoose.model('Student', StudentSchema);

module.exports = { Student };