import mongoose, { Schema } from 'mongoose'

const CategorySchema = new Schema(
  {
    title: String,
    img: Buffer
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model('Category', CategorySchema);

export default Category
