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


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//
// const personSchema = Schema({
//   _id: Schema.Types.ObjectId,
//   name: String,
//   age: Number,
//   stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
// });
//
// const storySchema = Schema({
//   author: { type: Schema.Types.ObjectId, ref: 'Person' },
//   title: String,
//   fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
// });
//
// const Story = mongoose.model('Story', storySchema);
// const Person = mongoose.model('Person', personSchema);
