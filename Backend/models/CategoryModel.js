const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  cat: {
    type: String,
    required: true,
    unique: true,
  },
  catimg: {
    type: String,
    required: true,
  }
});

const categoryData = mongoose.model("category", CategorySchema);
module.exports = categoryData;
