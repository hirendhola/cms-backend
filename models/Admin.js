const mongoose = require('mongoose');
const passwordHelper = require('../helpers/passwordHelper');

// Admin Schema
const AdminSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  }
});

passwordHelper.addPasswordFieldToSchema(AdminSchema);

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = { Admin };