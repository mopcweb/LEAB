const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    img: Buffer,
    currency: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);
