const mongoose = require('mongoose');
const passwordHelper = require('../helpers/passwordHelper');

const HODSchema = new mongoose.Schema({
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
  }
});

passwordHelper.addPasswordFieldToSchema(HODSchema);

const HOD = mongoose.model('HOD', HODSchema);

module.exports = { HOD };