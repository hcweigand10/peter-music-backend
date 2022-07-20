const { Schema, model } = require('mongoose');

// Schema to create Student model
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      max_length: 50,
      unique: true
    },
    studentId: {
      type: String,
      required: true,
      min_length: 5,
      max_length: 5
    },
    name: {
      type: String,
      required: true,
      max_length: 50,
      unique: false
    },
    balance: {
      type: Number,
      required: false,
      default: false
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const User = model('user', userSchema);

module.exports = User;
