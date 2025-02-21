const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    comments: [{ text: String, date: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);
