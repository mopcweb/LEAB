const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* ------------------------------------------------------------------- */
/*                               Models
/* ------------------------------------------------------------------- */

// =====> User model
const User = require('./User');

/* ------------------------------------------------------------------- */
/*                          Category Schema
/* ------------------------------------------------------------------- */

const CategorySchema = new Schema(
  {
    userId: {
      type: String,
      lowercase: true,
      required: 'userId is required',
    },
    title: String,
    img: Buffer
  },
  {
    timestamps: true
  }
);

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

module.exports = mongoose.model('Category', CategorySchema);
