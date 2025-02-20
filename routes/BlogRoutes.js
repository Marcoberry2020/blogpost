const express = require('express');
const Blog = require('../models/Blog'); // Import the Blog model
const router = express.Router();

/**
 * @route   POST /api/create
 * @desc    Create a new blog post
 */
router.post('/create', async (req, res) => {
    try {
        const newPost = new Blog(req.body); // Create new post from request body
        await newPost.save(); // Save post to database
        res.status(201).json(newPost); // Return newly created post
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
});

/**
 * @route   GET /api/posts
 * @desc    Get all blog posts
 */
router.get('/posts', async (req, res) => {
    try {
        const posts = await Blog.find(); // Retrieve all posts from DB
        res.json(posts);
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
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
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
        const post = await Blog.findById(req.params.id);
        post.comments.push(req.body); // Add comment to post
        await post.save(); // Save updated post
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export Routes
module.exports = router;
