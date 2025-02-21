const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// Create Post
router.post("/", async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Posts
router.get("/", async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// Delete Post
router.delete("/:id", async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
});

// Add Comment
router.post("/:id/comments", async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.comments.push({ text: req.body.text });
    await post.save();
    res.json(post);
});

module.exports = router;
