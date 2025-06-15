// Intersection Observer polyfill
// This ensures the animation triggering works in all browsers

(function() {
  'use strict';

  if ('IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // If browser supports Intersection Observer natively, do nothing
    return;
  }

  // Simple polyfill implementation for browsers that don't support IntersectionObserver
  window.IntersectionObserver = function(callback, options) {
    const elements = [];
    let observer = null;
    const threshold = options && options.threshold || 0;
    
    function checkIntersections() {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Consider element as intersecting if it's in viewport
        const isIntersecting = (
          rect.top <= windowHeight * (1 - threshold) &&
          rect.bottom >= windowHeight * threshold
        );
        
        if (isIntersecting) {
          callback([{
            isIntersecting: true,
            intersectionRatio: 1,
            target: el
          }]);
        }
      });
    }
    
    // Use scroll event as a proxy for checking visibility
    function setupObserver() {
      if (observer) {
        window.removeEventListener('scroll', checkIntersections);
        window.removeEventListener('resize', checkIntersections);
        observer = null;
      }
      
      if (elements.length > 0) {
        window.addEventListener('scroll', checkIntersections, { passive: true });
        window.addEventListener('resize', checkIntersections, { passive: true });
        observer = true;
        
        // Run initial check
        setTimeout(checkIntersections, 100);
      }
    }
    
    return {
      observe: function(el) {
        if (!elements.includes(el)) {
          elements.push(el);
          setupObserver();
        }
      },
      unobserve: function(el) {
        const index = elements.indexOf(el);
        if (index > -1) {
          elements.splice(index, 1);
          if (elements.length === 0) {
            setupObserver();
          }
        }
      },
      disconnect: function() {
        elements.length = 0;
        setupObserver();
      }
    };
  };
})();
