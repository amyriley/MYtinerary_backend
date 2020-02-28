const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  authWithGoogle: {
    type: Boolean
  },
  password: {
    type: String
    // required: true
  },
  profilePicture: {
    type: String
  }
});

module.exports = mongoose.model("user", userSchema);
