import Post from './models/Post.js';

export const createPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const newPost = new Post({ title, content, author });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { user, text } = req.body;
        const post = await Post.findById(req.params.id);
        post.comments.push({ user, text });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
