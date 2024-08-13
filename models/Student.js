const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true 
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
    unique: true,
    index: true 
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
    index: true // Adding an index here
  },
  // other fields...
});
