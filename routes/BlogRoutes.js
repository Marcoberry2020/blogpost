const express = require('express');
const Blog = require('../models/Blog'); // Import the Blog model
const router = express.Router();

/**
 * @route   POST /api/create
 * @desc    Create a new blog post
 */
router.post('/create', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            return res.status(400).json({ error: 'Title, content, and author are required' });
        }
        const newPost = new Blog({ title, content, author, comments: [] }); // Initialize comments as an empty array
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /api/posts
 * @desc    Get all blog posts
 */
router.get('/posts', async (req, res) => {
    try {
        const posts = await Blog.find().sort({ createdAt: -1 }); // Get posts sorted by newest first
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   DELETE /api/delete/:id
 * @desc    Delete a blog post by ID
 */
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedPost = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   POST /api/comment/:id
 * @desc    Add a comment to a post
 */
router.post('/comment/:id', async (req, res) => {
    try {
        const { author, text } = req.body;
        if (!author || !text) {
            return res.status(400).json({ error: 'Author and text are required' });
        }
        const updatedPost = await Blog.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { author, text, date: new Date() } } },
            { new: true, runValidators: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
