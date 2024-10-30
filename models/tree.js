// models/tree.js
const mongoose = require('mongoose');

// Define the schema
const treeSchema = new mongoose.Schema({
  treename: { type: String, required: true },
  description: { type: String, required: true },
  image: String, // Image stored as file name or URL
});

// Create the model
const Tree = mongoose.model('TreeCollection', treeSchema);

module.exports = Tree;
