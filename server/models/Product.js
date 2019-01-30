import mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema(
  {
    title: String,
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

const Product = mongoose.model('Product', ProductSchema);

export default Product
