const express = require("express");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const router = express.Router();

/**
 * @route   POST /api/create
 * @desc    Create a new blog post
 */
router.post(
  "/create",
  [
    check("title", "Title is required").not().isEmpty(),
    check("content", "Content is required").not().isEmpty(),
    check("author", "Author is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, author } = req.body;
      const newPost = new Blog({ title, content, author, comments: [] });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * @route   GET /api/posts
 * @desc    Get all blog posts (with pagination)
 */
router.get("/posts", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await Blog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalPosts = await Blog.countDocuments();

    res.status(200).json({
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route   PUT /api/update/:id
 * @desc    Update a blog post by ID
 */
router.put(
  "/update/:id",
  [
    check("title", "Title is required").not().isEmpty(),
    check("content", "Content is required").not().isEmpty(),
  ],
  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Blog ID" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content } = req.body;
      const updatedPost = await Blog.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true, runValidators: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * @route   DELETE /api/delete/:id
 * @desc    Delete a blog post by ID
 */
router.delete("/delete/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid Blog ID" });
  }

  try {
    const deletedPost = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route   POST /api/comment/:id
 * @desc    Add a comment to a post
 */
router.post(
  "/comment/:id",
  [
    check("author", "Author is required").not().isEmpty(),
    check("text", "Comment text is required").not().isEmpty(),
  ],
  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Blog ID" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { author, text } = req.body;
      const updatedPost = await Blog.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: { author, text, date: new Date() } } },
        { new: true, runValidators: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
