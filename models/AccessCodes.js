const mongoose = require('mongoose');

const hodAccessCode = new mongoose.Schema({
  accessCode: {
    type: String,
    required : true,
    unique: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    unique: true
  }
})

const teacherAccessCode = new mongoose.Schema({
  accessCode: {
    type: String,
    required : true
  }
})

const studentAccessCode = new mongoose.Schema({
  accessCode: {
    type: String,
    required : true
  }
})

const HodAccessCode = mongoose.model('HodAccessCode', hodAccessCode)
const TeacherAccessCode = mongoose.model('TeacherAccessCode', teacherAccessCode)
const StudentAccessCode = mongoose.model('StudentAccessCode', studentAccessCode)

module.exports =  { HodAccessCode, TeacherAccessCode, StudentAccessCode }