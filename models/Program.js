const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
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
  duration: {
    type: Number,
    required: true // Duration in years, e.g., 4 for BE, 2 for ME
  },
  semesters: {
    type: Number,
    required: true // Total number of semesters, e.g., 8 for BE, 4 for ME
  }
});

const Program = mongoose.model('Program', ProgramSchema);

module.exports = { Program };
