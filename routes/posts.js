'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const router = express.Router();

// ─── Helper ───────────────────────────────────────────────────────────────────
/**
 * Returns true when `id` is a valid MongoDB ObjectId string.
 * Used by every route that accepts an :id parameter.
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ─── POST /api/posts ──────────────────────────────────────────────────────────
/**
 * TODO: Create a new blog post document in MongoDB.
 *
 * Steps:
 *  1. Build a new Post from req.body  (title, content, author)
 *  2. Call post.save() to persist it
 *  3. Respond HTTP 201 + the saved document as JSON
 *  4. Catch Mongoose ValidationError → HTTP 400 + error message
 *  5. Catch any other error           → HTTP 500 + error message
 */
router.post('/', async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    });

    const saved = await post.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      // Collect all validation messages into a readable string
      const messages = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ error: messages });
    }
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/posts ───────────────────────────────────────────────────────────
/**
 * TODO: Fetch all posts from MongoDB.
 *
 * Steps:
 *  1. Call Post.find() sorted newest-first (-createdAt)
 *  2. Respond HTTP 200 + array of posts as JSON
 *  3. Catch any error → HTTP 500 + error message
 */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/posts/:id ───────────────────────────────────────────────────────
/**
 * TODO: Fetch one post by MongoDB ObjectId.
 *
 * Steps:
 *  1. Validate :id format → HTTP 400 if invalid
 *  2. Call Post.findById(id)
 *  3. If null → HTTP 404 "Post not found"
 *  4. Otherwise → HTTP 200 + post JSON
 *  5. Catch any error → HTTP 500
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid post ID format' });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/posts/:id ───────────────────────────────────────────────────────
/**
 * TODO: Replace/update one post by id.
 *
 * Steps:
 *  1. Validate :id format → HTTP 400 if invalid
 *  2. Call Post.findByIdAndUpdate with { runValidators: true, new: true }
 *  3. If null → HTTP 404
 *  4. Otherwise → HTTP 200 + updated post JSON
 *  5. Catch ValidationError → HTTP 400
 *  6. Catch any other error → HTTP 500
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid post ID format' });
  }

  try {
    const updated = await Post.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
      },
      {
        new: true,          // return the updated document
        runValidators: true, // apply schema validation on update
      }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ error: messages });
    }
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/posts/:id ────────────────────────────────────────────────────
/**
 * TODO: Remove one post by id.
 *
 * Steps:
 *  1. Validate :id format → HTTP 400 if invalid
 *  2. Call Post.findByIdAndDelete(id)
 *  3. If null → HTTP 404
 *  4. Otherwise → HTTP 200 + success message JSON
 *  5. Catch any error → HTTP 500
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid post ID format' });
  }

  try {
    const deleted = await Post.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
