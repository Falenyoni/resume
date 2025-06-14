// Enhanced scroll-to-top functionality

document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll to top button
  initScrollToTop();
});

/**
 * Initialize scroll to top functionality with enhanced behavior
 */
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const showScrollBtnThreshold = 300; // Show button after scrolling this many pixels
  
  if (!scrollToTopBtn) return;
  
  // Update button visibility on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > showScrollBtnThreshold) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  // Smooth scroll to top with enhanced animation
  scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Check if smooth scroll is supported natively
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for browsers that don't support smooth scroll
      const scrollToTop = function() {
        const currentPosition = window.scrollY;
        if (currentPosition > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, currentPosition - currentPosition / 8);
        }
      };
      scrollToTop();
    }
    
    // Add clicked animation
    scrollToTopBtn.classList.add('clicked');
    setTimeout(() => {
      scrollToTopBtn.classList.remove('clicked');
    }, 300);
  });
  
  // Add touch support
  scrollToTopBtn.addEventListener('touchstart', function() {
    this.classList.add('touch-active');
  }, { passive: true });
  
  ['touchend', 'touchcancel'].forEach(event => {
    scrollToTopBtn.addEventListener(event, function() {
      this.classList.remove('touch-active');
    }, { passive: true });
  });
  
  // Add a11y support
  scrollToTopBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
}

// Update copyright year automatically
document.addEventListener('DOMContentLoaded', function() {
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }
});
