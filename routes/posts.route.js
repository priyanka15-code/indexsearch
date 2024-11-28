const express = require('express');
const User = require('../models/user.model');
const Post = require('../models/posts.model');
const router = express.Router();

router.post('/', async (req, res) => {
  const { title, content, authorId } = req.body;

  try {
   
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const post = new Post({
      title,
      content,
      authorId,
      authorName: user.Name,
      authorEmail: user.Email,
    });

    await post.save();

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/', async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.get('/test', async (req, res) => {
    const start = Date.now();
    
    try {
        const results = await Post.aggregate([
            { $group: { _id: "$authorName", userCount: { $sum: 1 } } },
            { $project: { Name: "$_id", userCount: 1, _id: 0 } }
        ]);
        
        const end = Date.now();
        res.json({
            message: 'Query executed successfully',
            executionTime: `${end - start} ms`,
            data: results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

  
  module.exports = router;