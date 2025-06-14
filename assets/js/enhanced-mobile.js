// Enhanced mobile experience

document.addEventListener('DOMContentLoaded', function() {
  // Initialize improved mobile menu
  initEnhancedMobileMenu();
  
  // Fix iOS-specific issues
  fixIOSSpecificIssues();
  
  // Improve link behavior on touch devices
  enhanceTouchInteractions();
  
  // Handle orientation changes properly
  handleOrientationChanges();
});

/**
 * Initialize enhanced mobile menu behavior
 */
function initEnhancedMobileMenu() {
  const hamburgerButton = document.querySelector('.hamburger-button');
  const menuLinks = document.querySelector('.menu-links');
  const mobileNavLinks = document.querySelectorAll('#hamburger-nav .menu-links a');
  const headerElement = document.querySelector('.main-header');
  
  if (!hamburgerButton || !menuLinks) return;
  
  // Enhanced toggle function with aria-expanded state
  function toggleMobileMenu(event) {
    event.preventDefault();
    
    const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true';
    hamburgerButton.setAttribute('aria-expanded', !isExpanded);
    
    if (!isExpanded) {
      menuLinks.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      // Add focus trap
      setTimeout(() => {
        mobileNavLinks[0].focus();
      }, 100);
    } else {
      menuLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  
  // Attach the enhanced toggle function to the button
  hamburgerButton.addEventListener('click', toggleMobileMenu);
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isMenuOpen = menuLinks.classList.contains('open');
    
    if (isMenuOpen && 
        !menuLinks.contains(event.target) && 
        !hamburgerButton.contains(event.target)) {
      menuLinks.classList.remove('open');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuLinks.classList.remove('open');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  
  // Change header background on scroll for mobile
  window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) {
      if (window.scrollY > 30) {
        headerElement.classList.add('mobile-header-scrolled');
      } else {
        headerElement.classList.remove('mobile-header-scrolled');
      }
    }
  });
}

/**
 * Fix common iOS-specific issues
 */
function fixIOSSpecificIssues() {
  // Check if the device is running iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS) {
    // Fix the 100vh issue on iOS
    const appHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', appHeight);
    window.addEventListener('orientationchange', appHeight);
    appHeight();
    
    // Fix the input zoom issue on iOS
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover');
    }
    
    // Fix double-tap issue on iOS
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
      link.addEventListener('touchend', function(e) {
        const now = Date.now();
        const lastTap = link.getAttribute('data-last-tap') || 0;
        const delta = now - lastTap;
        
        if (delta < 300 && delta > 0) {
          e.preventDefault();
        }
        
        link.setAttribute('data-last-tap', now);
      });
    });
  }
}

/**
 * Enhance touch interactions
 */
function enhanceTouchInteractions() {
  // Add touch feedback to all interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .skill-tab, .tag');
  
  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    }, { passive: true });
    
    ['touchend', 'touchcancel'].forEach(event => {
      element.addEventListener(event, function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
  });
  
  // Add pull-to-refresh prevention
  document.body.addEventListener('touchmove', function(e) {
    if (window.scrollY === 0 && e.touches[0].screenY > 0) {
      e.preventDefault();
    }
  }, { passive: false });
}

/**
 * Handle orientation changes properly
 */
function handleOrientationChanges() {
  window.addEventListener('orientationchange', function() {
    // Fix layout after orientation change
    setTimeout(() => {
      // Update navbar height
      const navbarHeight = document.querySelector('#desktop-nav').offsetHeight;
      document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
      
      // Reset mobile menu if open
      const menuLinks = document.querySelector('.menu-links');
      const hamburgerButton = document.querySelector('.hamburger-button');
      
      if (menuLinks && menuLinks.classList.contains('open')) {
        menuLinks.classList.remove('open');
        hamburgerButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
      
      // Force browser to redraw/repaint
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    }, 300); // Wait for the orientation change to complete
  });
}
