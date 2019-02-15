const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    title: String,
    img: Buffer
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Category', CategorySchema);
