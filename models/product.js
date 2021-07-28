const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  price: Number,
  name: String,
  description: String,
});

module.exports = mongoose.model('Product', ProductSchema);
