const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
let posts = [
    {
        id: "1",
        title: "hello haha this is a real post",
        author: "pranav",
        category: "tech",
        body: "This is the body of the first post, and it needs to be at least fifty characters long to pass validation."
    }
];
let comments = []; // each: { id, postId, text, commenter }
let nextPostId = 2;
let nextCommentId = 1;

// CREATE a post
app.post('/posts', (req, res) => {
    const { title, author, category, body } = req.body;
    const newPost = { id: String(nextPostId++), title, author, category, body };
    posts.push(newPost);
    res.json(newPost);
});

// LIST all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// GET one specific post by id
app.get('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

// UPDATE a specific post
app.put('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { title, author, category, body } = req.body;
    if (title !== undefined) post.title = title;
    if (author !== undefined) post.author = author;
    if (category !== undefined) post.category = category;
    if (body !== undefined) post.body = body;
    res.json(post);
});

// DELETE a specific post (also deletes its comments)
app.delete('/posts/:id', (req, res) => {
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Post not found' });

    posts.splice(index, 1);
    comments = comments.filter(c => c.postId !== req.params.id);
    res.json({ deleted: true, id: req.params.id });
});

// CREATE a comment on a specific post
app.post('/posts/:postId/comments', (req, res) => {
    const post = posts.find(p => p.id === req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { text, commenter } = req.body;
    const newComment = { id: String(nextCommentId++), postId: req.params.postId, text, commenter };
    comments.push(newComment);
    res.json(newComment);
});

// LIST comments for a specific post
app.get('/posts/:postId/comments', (req, res) => {
    const post = posts.find(p => p.id === req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const postComments = comments.filter(c => c.postId === req.params.postId);
    res.json(postComments);
});

// simple health check -- useful for deployment platforms to verify the service is alive
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Posts API running on port ${PORT}`);
});
