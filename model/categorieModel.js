const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;
