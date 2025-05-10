const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: String,
  otp: String,
  isVerified: {
    type: Boolean,
    default: false
  },
});
module.exports = mongoose.model("User", UserSchema);
