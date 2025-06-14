# Local Development Server Configuration

This file contains instructions for setting up a local development server to test your Markdown blog functionality.

## Option 1: Using Node.js (Recommended)

1. First, install the necessary packages:

```bash
npm init -y
npm install express
```

2. Create a file named `server.js` with the following content:

```javascript
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

3. Run the server:

```bash
node server.js
```

## Option 2: Using Python

If you prefer Python, you can use the built-in HTTP server:

```bash
# For Python 3
python -m http.server 3000
```

Note that with this approach, direct navigation to blog post URLs won't work properly as the server doesn't handle client-side routing.

## Option 3: Using VS Code Live Server Extension

If you use VS Code, you can install the "Live Server" extension which provides a simple development server.

## Accessing Your Blog

Once your server is running, you can access your blog at:

- Blog listing: http://localhost:3000/#blog
- Individual post: http://localhost:3000/blog/setting-up-dual-stack-vpc

## Production Deployment Considerations

For production deployment, you'll need to configure your web server (Apache, Nginx, etc.) to handle client-side routing:

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Example Apache .htaccess Configuration

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```
