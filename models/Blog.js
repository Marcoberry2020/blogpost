const mongoose = require('mongoose');

// Define Blog Schema
const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    comments: [{ username: String, text: String }], // Array of comments
    date: { type: Date, default: Date.now }
});

// Export Model
module.exports = mongoose.model('Blog', BlogSchema);
