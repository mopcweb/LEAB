const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* ------------------------------------------------------------------- */
/*                           Product Schema
/* ------------------------------------------------------------------- */

// =====> Schema
const ProductSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      lowercase: true,
      required: 'userId is required',
    },
    title: String,
    link: String,
    img: Buffer,
    amount: Number,
    price: Number,
    proteins: Number,
    fats: Number,
    carbs: Number,
    ccal: String,
    ccalUnified: Number,
    unit: Object,
    category: String
  },
  {
    timestamps: true
  }
);

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

module.exports = mongoose.model('Product', ProductSchema);
