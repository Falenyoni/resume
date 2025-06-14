// Enhanced mobile experience and smooth scrolling

document.addEventListener('DOMContentLoaded', function() {
  // Enable passive event listeners for better scroll performance
  addPassiveEventListeners();
  
  // Fix 100vh issue on mobile
  fixMobileVh();
  
  // Enable smooth anchor scrolling
  enableSmoothScroll();
  
  // Add active state to buttons for mobile
  addMobileActiveStates();
  
  // Fix iOS input focus zooming
  fixIOSInputZoom();
});

// Enable passive event listeners
function addPassiveEventListeners() {
  // Use passive listeners when available
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}
  
  // Add passive listeners to common events
  if (supportsPassive) {
    document.addEventListener('touchstart', function(){}, { passive: true });
    document.addEventListener('touchmove', function(){}, { passive: true });
    document.addEventListener('wheel', function(){}, { passive: true });
  }
}

// Fix 100vh issue on mobile
function fixMobileVh() {
  // First we get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // Update on resize
  window.addEventListener('resize', () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
}

// Enable smooth scrolling for anchor links
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href') === '#') return;
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        smoothScrollTo(targetElement);
      }
    });
  });
}

// Smooth scroll to element with offset for header
function smoothScrollTo(element) {
  const headerOffset = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Add active states for touch devices
function addMobileActiveStates() {
  // Only apply these for touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    const touchElements = document.querySelectorAll(
      '.nav-link, .cta-button, .social-link, .skill-tab, .tag, button'
    );
    
    touchElements.forEach(el => {
      el.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      el.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
        
        // Small delay before removing the class
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 300);
      }, { passive: true });
    });
  }
}

// Fix iOS input zoom issue
function fixIOSInputZoom() {
  // Only apply on iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS) {
    // Add viewport meta tag to prevent zooming
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    }
    
    // Add touch-action to form elements
    const formElements = document.querySelectorAll('input, textarea, select');
    formElements.forEach(el => {
      el.style.touchAction = 'manipulation';
    });
  }
}

// Detect if device is in portrait or landscape mode
function getOrientation() {
  if (window.innerWidth > window.innerHeight) {
    return 'landscape';
  }
  return 'portrait';
}

// Handle orientation change
window.addEventListener('resize', function() {
  const orientation = getOrientation();
  document.body.setAttribute('data-orientation', orientation);
});

// Set initial orientation
document.body.setAttribute('data-orientation', getOrientation());
