const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Add CORS headers for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve static files
app.use(express.static(__dirname));

// Blog post route handling
app.get('/blog/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle blog-posts index.json
app.get('/blog-posts/index.json', (req, res) => {
  const indexPath = path.join(__dirname, 'blog-posts', 'index.json');
  try {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    res.json(JSON.parse(indexContent));
  } catch (error) {
    console.error('Error reading blog index:', error);
    // Auto-generate index from available markdown files
    const posts = fs.readdirSync(path.join(__dirname, 'blog-posts'))
      .filter(file => file.endsWith('.md'))
      .map(file => file);
    
    res.json({ posts });
  }
});

// Handle direct requests for blog post Markdown files
app.get('/blog-posts/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'blog-posts', req.params.filename);
  try {
    if (fs.existsSync(filePath)) {
      res.type('text/markdown').sendFile(filePath);
    } else {
      res.status(404).send('Blog post not found');
    }
  } catch (error) {
    console.error(`Error serving blog post ${req.params.filename}:`, error);
    res.status(500).send('Server error loading blog post');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Blog posts available at http://localhost:${PORT}/#blog`);
});
