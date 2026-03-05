const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://adharashivkar17_db_user:adidhara%404523@cluster0.p7qbbly.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI, {
    dbName: 'ai_blog'
})
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Schemas & Models ---

// Blog Post Schema (for likes)
const blogPostSchema = new mongoose.Schema({
    postId: { type: String, required: true, unique: true },
    likes: { type: Number, default: 0 },
    likedIps: [{ type: String }]
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
    postId: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    content: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    likedIps: [{ type: String }]
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

// --- Initialize Blog Post ---
const initBlogPost = async () => {
    try {
        const exists = await BlogPost.findOne({ postId: 'main-blog-post' });
        if (!exists) {
            await BlogPost.create({ postId: 'main-blog-post', likes: 0 });
            console.log('Blog post initialized in DB');
        }
    } catch (err) {
        console.error('Init error:', err);
    }
};
initBlogPost();

// --- Routes ---

// GET post stats (likes count)
app.get('/api/post/stats', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ postId: 'main-blog-post' });
        const commentsCount = await Comment.countDocuments({ postId: 'main-blog-post' });
        res.json({
            likes: post ? post.likes : 0,
            comments: commentsCount
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST - toggle like on blog post
app.post('/api/post/like', async (req, res) => {
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const { sessionId } = req.body; // Use sessionId from client for unique identification
        const identifier = sessionId || clientIp;

        let post = await BlogPost.findOne({ postId: 'main-blog-post' });
        if (!post) {
            post = await BlogPost.create({ postId: 'main-blog-post', likes: 0 });
        }

        const hasLiked = post.likedIps.includes(identifier);
        if (hasLiked) {
            post.likes = Math.max(0, post.likes - 1);
            post.likedIps = post.likedIps.filter(ip => ip !== identifier);
        } else {
            post.likes += 1;
            post.likedIps.push(identifier);
        }
        await post.save();

        res.json({ likes: post.likes, hasLiked: !hasLiked });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET check if user liked post
app.post('/api/post/check-like', async (req, res) => {
    try {
        const { sessionId } = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const identifier = sessionId || clientIp;

        const post = await BlogPost.findOne({ postId: 'main-blog-post' });
        const hasLiked = post ? post.likedIps.includes(identifier) : false;
        res.json({ hasLiked, likes: post ? post.likes : 0 });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all comments
app.get('/api/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: 'main-blog-post' })
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST new comment
app.post('/api/comments', async (req, res) => {
    try {
        const { author, content } = req.body;
        if (!author || !content) {
            return res.status(400).json({ error: 'Author and content are required' });
        }
        if (content.length > 1000) {
            return res.status(400).json({ error: 'Comment too long (max 1000 characters)' });
        }

        // Generate avatar initials-based color
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
        const avatarColor = colors[author.charCodeAt(0) % colors.length];

        const comment = await Comment.create({
            postId: 'main-blog-post',
            author: author.trim(),
            avatar: avatarColor,
            content: content.trim()
        });

        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST toggle like on comment
app.post('/api/comments/:id/like', async (req, res) => {
    try {
        const { sessionId } = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const identifier = sessionId || clientIp;

        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const hasLiked = comment.likedIps.includes(identifier);
        if (hasLiked) {
            comment.likes = Math.max(0, comment.likes - 1);
            comment.likedIps = comment.likedIps.filter(ip => ip !== identifier);
        } else {
            comment.likes += 1;
            comment.likedIps.push(identifier);
        }
        await comment.save();
        res.json({ likes: comment.likes, hasLiked: !hasLiked });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
