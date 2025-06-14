/**
 * Blog functionality for loading and displaying Markdown blog posts
 */

// Array to store loaded blog posts
let blogPosts = [];

/**
 * Fetches and parses a Markdown blog post
 * @param {string} filePath - Path to the Markdown file
 * @returns {Promise<Object>} - Blog post data
 */
async function fetchMarkdownPost(filePath) {
  try {
    // Use absolute path from server root
    const response = await fetch(`/${filePath}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load post: ${response.status} ${response.statusText}`);
    }
    
    const markdown = await response.text();
    return parseMarkdownPost(markdown, filePath);
  } catch (error) {
    console.error(`Error loading blog post from ${filePath}:`, error);
    return null;
  }
}

/**
 * Calculates the estimated reading time for a blog post
 * @param {string} content - Raw markdown content
 * @returns {number} - Reading time in minutes
 */
function calculateReadingTime(content) {
  // Strip markdown syntax
  const text = content
    .replace(/#+\s+/g, '') // Remove headings
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image references
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`.*?`/g, '') // Remove inline code
    .replace(/\*\*.*?\*\*/g, '$1') // Bold to plain text
    .replace(/\*.*?\*/g, '$1') // Italic to plain text
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
    
  // Count words (split by spaces)
  const words = text.split(/\s+/).filter(Boolean).length;
  
  // Average reading speed is ~200-250 words per minute
  // We use 230 as a middle ground
  const readingTimeMinutes = Math.max(1, Math.round(words / 230));
  
  return readingTimeMinutes;
}

/**
 * Parses a Markdown blog post with front matter
 * @param {string} markdown - Markdown content
 * @param {string} filePath - Original file path
 * @returns {Object} - Parsed blog post
 */
function parseMarkdownPost(markdown, filePath) {
  // Parse front matter
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = markdown.match(frontMatterRegex);
  
  if (!match) {
    console.error(`No front matter found in ${filePath}`);
    return null;
  }
  
  const frontMatter = match[1];
  const content = markdown.slice(match[0].length);
  
  // Parse front matter into key-value pairs
  const metadata = {};
  const frontMatterLines = frontMatter.split('\n');
  
  frontMatterLines.forEach(line => {
    if (line.trim() === '') return;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Parse arrays in front matter (like tags: [tag1, tag2])
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map(item => item.trim());
      }
      
      metadata[key] = value;
    }
  });
  
  // Parse date string into Date object
  if (metadata.date) {
    metadata.date = new Date(metadata.date);
  }
  
  // Compute URL slug from filename
  const slug = filePath.split('/').pop().replace('.md', '');
    // Calculate reading time
  const readingTime = calculateReadingTime(content);
  
  // Return parsed post
  return {
    ...metadata,
    slug,
    content,
    filePath,
    readingTime,
    html: window.marked ? window.marked.parse(content) : content
  };
}

/**
 * Loads all blog posts from the blog-posts directory
 * @returns {Promise<Array>} - Array of blog posts
 */
async function loadBlogPosts() {
  try {
    // Fetch the index of blog posts
    const response = await fetch('/blog-posts/index.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load blog index: ${response.status} ${response.statusText}`);
    }
    
    const index = await response.json();
    const postPromises = index.posts.map(post => fetchMarkdownPost(`blog-posts/${post}`));
    
    blogPosts = (await Promise.all(postPromises))
      .filter(post => post !== null)
      .sort((a, b) => b.date - a.date); // Sort by date descending
    
    console.log('Successfully loaded blog posts:', blogPosts);
    return blogPosts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
      // Fallback: try to load some known posts
    const knownPosts = [
      'modern-css-features.md',
      'setting-up-dual-stack-vpc.md',
      'react-18-features.md'
    ];
    
    const postPromises = knownPosts.map(post => fetchMarkdownPost(`/blog-posts/${post}`));
    
    blogPosts = (await Promise.all(postPromises))
      .filter(post => post !== null)
      .sort((a, b) => b.date - a.date);
    
    return blogPosts;
  }
}

/**
 * Renders blog posts to the specified container
 * @param {HTMLElement} container - Container element for blog posts
 */
async function renderBlogPosts(container) {
  if (!container) return;
  
  // Show loading state
  container.innerHTML = '<div class="loading-posts">Loading blog posts...</div>';
  
  // Load blog posts if not already loaded
  if (blogPosts.length === 0) {
    await loadBlogPosts();
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Render each post
  blogPosts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'post-card';
    
    if (blogPosts.indexOf(post) === 0) {
      article.classList.add('featured');
    }
    
    article.innerHTML = `
      <div class="post-content">
        <div class="post-meta">
          <span class="post-date">${post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span class="post-category">${post.category}</span>
        </div>
        <h3 class="post-title">
          <a href="/blog/${post.slug}" data-blog-slug="${post.slug}">${post.title}</a>
        </h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="post-reading-time">
          Estimated reading time: ${calculateReadingTime(post.content)} minute${calculateReadingTime(post.content) !== 1 ? 's' : ''}
        </div>
        <div class="post-share">
          <button class="share-post-btn" title="Share this post">
            <i class="fas fa-share"></i> Share
          </button>
        </div>
      </div>
    `;
    
    // Add click handler to load individual post
    const titleLink = article.querySelector('.post-title a');
    titleLink.addEventListener('click', function(e) {
      e.preventDefault();
      const slug = this.getAttribute('data-blog-slug');
      showBlogPost(slug);
    });
    
    // Add share button handler
    const shareButton = article.querySelector('.share-post-btn');
    shareButton.addEventListener('click', (e) => {
      handleSharePost(e, post.title, window.location.href + '/blog/' + post.slug);
    });
    
    container.appendChild(article);
  });
}

/**
 * Handles sharing of a blog post
 * @param {Event} event - Click event
 * @param {string} title - Post title
 * @param {string} url - Post URL
 */
function handleSharePost(event, title, url) {
  event.preventDefault();
  event.stopPropagation();
  
  // Use Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    })
    .then(() => console.log('Shared successfully'))
    .catch((error) => console.error('Error sharing:', error));
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        const shareBtn = event.target.closest('.share-post-btn');
        const originalText = shareBtn.innerHTML;
        
        shareBtn.innerHTML = '<i class="fas fa-check"></i> Link copied!';
        
        setTimeout(() => {
          shareBtn.innerHTML = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy link. URL: ' + url);
      });
  }
}

/**
 * Shows a single blog post
 * @param {string} slug - Post slug
 */
function showBlogPost(slug) {
  console.log(`Attempting to show blog post with slug: ${slug}`);
  
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    console.error(`Blog post with slug '${slug}' not found`);
    return;
  }
  
  console.log(`Found post:`, post);
  
  // Hide blogs section and show individual post section
  const blogsSection = document.getElementById('blog');
  const postSection = document.getElementById('blog-post') || createBlogPostSection();
  
  blogsSection.style.display = 'none';
  postSection.style.display = 'block';
  
  // Update browser URL without page refresh
  window.history.pushState({}, '', `/blog/${slug}`);
  
  // Render post content
  const postContent = postSection.querySelector('.blog-post-content');
    postContent.innerHTML = `
    <h1>${post.title}</h1>
    <div class="blog-post-meta">
      <span class="post-date">${post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      <span class="post-category">${post.category}</span>
      <span class="post-reading-time"><i class="far fa-clock"></i> ${post.readingTime} min read</span>
    </div>
    <div class="blog-post-tags">
      ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    <div class="blog-post-body">
      ${post.html}
    </div>    <div class="blog-post-footer">
      <div class="blog-post-actions">
        <button class="back-to-posts">← Back to all posts</button>
        <button class="share-post-btn" onclick="window.blogModule.handleSharePost(event, '${post.title}', window.location.href)">
          <i class="fas fa-share-alt"></i> Share Post
        </button>
      </div>
    </div>
  `;
  
  // Add back button handler
  const backButton = postContent.querySelector('.back-to-posts');
  backButton.addEventListener('click', () => {
    blogsSection.style.display = 'block';
    postSection.style.display = 'none';
    window.history.pushState({}, '', '/#blog');
  });
  
  // Scroll to top of post
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Highlight code blocks if Prism.js is available
  if (window.Prism) {
    window.Prism.highlightAll();
    
    // Add language indicator to code blocks
    const codeBlocks = postContent.querySelectorAll('pre code');
    codeBlocks.forEach(codeBlock => {
      const parent = codeBlock.parentElement;
      const lang = codeBlock.className.match(/language-([^\s]*)/);
      
      if (lang && lang[1]) {
        // Set a data attribute on the parent pre element
        parent.setAttribute('data-lang', lang[1]);
      } else {
        // Set a default if language is not specified
        parent.setAttribute('data-lang', 'code');
      }
    });
  }
}

/**
 * Creates a blog post section if it doesn't exist
 * @returns {HTMLElement} - Created section element
 */
function createBlogPostSection() {
  const section = document.createElement('section');
  section.id = 'blog-post';
  section.innerHTML = `
    <div class="section-container">
      <div class="blog-post-content"></div>
    </div>
  `;
  
  // Insert after blog section
  const blogsSection = document.getElementById('blog');
  blogsSection.parentNode.insertBefore(section, blogsSection.nextSibling);
  
  return section;
}

/**
 * Initialize blog functionality when DOM is loaded
 */
function initializeBlog() {
  console.log('Blog initialization starting...');
  
  const postsContainer = document.querySelector('#blog .posts-grid');
  if (postsContainer) {
    console.log('Found posts container, loading blog posts...');
    renderBlogPosts(postsContainer)
      .then(() => console.log('Blog posts rendered successfully'))
      .catch(err => console.error('Error rendering blog posts:', err));
  } else {
    console.error('Blog posts container not found in DOM');
  }
  
  // Handle direct navigation to blog posts
  if (window.location.pathname.startsWith('/blog/')) {
    const slug = window.location.pathname.split('/').pop();
    loadBlogPosts().then(() => showBlogPost(slug));
  }
  
  // Handle browser back/forward navigation
  window.addEventListener('popstate', () => {
    if (window.location.pathname.startsWith('/blog/')) {
      const slug = window.location.pathname.split('/').pop();
      showBlogPost(slug);
    } else {
      // Show blog listing
      const blogsSection = document.getElementById('blog');
      const postSection = document.getElementById('blog-post');
      
      if (blogsSection && postSection) {
        blogsSection.style.display = 'block';
        postSection.style.display = 'none';
      }
    }
  });
}

// Export functions for use in other scripts
window.blogModule = {
  loadBlogPosts,
  renderBlogPosts,
  showBlogPost,
  initializeBlog,
  handleSharePost
};
