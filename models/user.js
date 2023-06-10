const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    required: true
  },
  additionalFields: {
    contactNumber: {
      type: String,
      default: null
    },
    profilePicture: {
      type: String,
      default: null
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
