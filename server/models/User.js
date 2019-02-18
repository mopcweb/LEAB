const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* ------------------------------------------------------------------- */
/*                               Models
/* ------------------------------------------------------------------- */

// =====> Product model
const Product = require('./Product');

/* ------------------------------------------------------------------- */
/*                             User Schema
/* ------------------------------------------------------------------- */

// =====> Schema
const UserSchema = new Schema(
  {
    username: String,
    email: String,
    img: Buffer,
    currency: String,
    standart: Number,
    big: Number
  },
  {
    timestamps: true
  }
);

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

module.exports = mongoose.model('User', UserSchema);
