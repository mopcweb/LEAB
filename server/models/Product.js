const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    link: String,
    img: Buffer,
    amount: Number,
    price: Number,
    proteins: Number,
    fats: Number,
    carbs: Number,
    ccal: String,
    unit: String,
    category: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', ProductSchema);
