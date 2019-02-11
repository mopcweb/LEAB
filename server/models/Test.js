import mongoose, { Schema } from 'mongoose';

const TestSchema = new Schema(
  {
    title: String,
    products: Array
  },
  {
    timestamps: true
  }
);

const Test = mongoose.model('Test', TestSchema);

export default Test
