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
  
  
  module.exports = router;