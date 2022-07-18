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
    studentID: {
      type: Number,
      required: true,
      min_length: 5,
      max_length: 5
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

// userSchema
//   .virtual('friendCount')
//   .get(function() {
//     return this.friends.length
//   })

const User = model('user', userSchema);

module.exports = User;
