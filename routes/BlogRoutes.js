const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

// Create Blog Post
router.post('/create', async (req, res) => {
    try {
        const newPost = new Blog(req.body);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Blog Posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Blog.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a Blog Post
router.delete('/delete/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
