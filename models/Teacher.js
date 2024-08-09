const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeacherSchema = new mongoose.Schema({
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
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }]
});

passwordHelper.addPasswordFieldToSchema(AdminSchema);

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = { Teacher };