'use strict';

const express = require('express');
const path = require('path');
const router = express.Router();

const PUBLIC = path.join(__dirname, '..', 'public');

/**
 * TODO: Serve the four static HTML pages.
 *
 * Each route must:
 *   - Match the correct GET path
 *   - Send the matching HTML file from the public/ folder
 *   - Return HTTP 200 (sendFile does this automatically on success)
 */

// GET /  →  public/index.html
router.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC, 'index.html'));
});

// GET /about  →  public/about.html
router.get('/about', (req, res) => {
  res.sendFile(path.join(PUBLIC, 'about.html'));
});

// GET /contact  →  public/contact.html
router.get('/contact', (req, res) => {
  res.sendFile(path.join(PUBLIC, 'contact.html'));
});

// GET /blog  →  public/blog.html
router.get('/blog', (req, res) => {
  res.sendFile(path.join(PUBLIC, 'blog.html'));
});

module.exports = router;
