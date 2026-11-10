'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());                          // parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/', require('./routes/pages'));           // browser/HTML routes
app.use('/api/posts', require('./routes/posts')); // REST API routes

// ─── 404 Fallback ────────────────────────────────────────────────────────────
// Must be registered AFTER all other routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ─── connectToDatabase ───────────────────────────────────────────────────────
/**
 * TODO: Connect the app to MongoDB before starting the server.
 *
 * Implementation checklist:
 *  1. Verify process.env.MONGODB_URI exists; log a clear warning if missing.
 *  2. Call mongoose.connect(process.env.MONGODB_URI, { dbName: 'blog' }).
 *  3. Log a success message when the connection is established.
 *  4. Wrap everything in try/catch and log any connection error.
 */
async function connectToDatabase() {
  // 1. Guard – make sure the environment variable is present
  if (!process.env.MONGODB_URI) {
    console.error(
      '⚠️  MONGODB_URI is not set. ' +
      'Copy .env.example to .env and add your connection string.'
    );
    process.exit(1); // cannot continue without a database connection
  }

  try {
    // 2. Connect to MongoDB (Mongoose will use the 'blog' database)
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'blog' });

    // 3. Success feedback
    console.log('✅  Connected to MongoDB (database: blog)');
  } catch (err) {
    // 4. Surface the real error so the developer knows what went wrong
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// ─── Startup ─────────────────────────────────────────────────────────────────
// Server only starts AFTER the database connection is ready
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Server running at http://localhost:${PORT}`);
  });
});
