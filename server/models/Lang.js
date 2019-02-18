const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* ------------------------------------------------------------------- */
/*                             Lang Schema
/* ------------------------------------------------------------------- */

const LangSchema = new Schema(
  {
    title: String,
    constants: Object
  },
  {
    timestams: true
  }
);

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

module.exports = mongoose.model('Lang', LangSchema);
