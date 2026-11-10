'use strict';

const mongoose = require('mongoose');

/**
 * TODO: Define the Mongoose schema for a blog Post.
 *
 * Required fields  : title, content, author
 * Validation rules : type String, required: true, trim: true
 * Options          : timestamps: true  (adds createdAt / updatedAt automatically)
 *
 * When complete, the schema is used by all CRUD routes in routes/posts.js.
 * Mongoose will return a 400-style ValidationError when required fields are
 * missing or empty, which the route handlers catch and forward to the client.
 */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Post', postSchema);
