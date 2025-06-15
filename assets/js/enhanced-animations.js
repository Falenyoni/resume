// Enhanced animations and transitions

document.addEventListener('DOMContentLoaded', function() {
  // Initialize enhanced section transitions
  initEnhancedSectionTransitions();
  
  // Fix link behavior on touch devices
  enhanceTouchLinks();
  
  // Initialize animated statistics counters
  initStatCounters();
});

/**
 * Enhanced section transitions using Intersection Observer
 * With fallback for environments where observers might be restricted
 */
function initEnhancedSectionTransitions() {
  // Make sure footer is always visible
  const footer = document.querySelector('footer.section-reveal');
  if (footer) {
    footer.classList.add('revealed');
    console.log('Footer revealed class added');
  }
  
  // Set up section reveal animation
  const revealSections = document.querySelectorAll('.section-container, .section-reveal:not(footer)');
  
  // Check if we should use a fallback approach (for S3 or restricted environments)
  const useObserverFallback = window.location.hostname.includes('s3.amazonaws.com') || 
                             window.location.hostname.includes('cloudfront.net');
  
  if (useObserverFallback) {
    // Fallback: Add revealed class to all sections immediately
    console.log('Using animation fallback for S3/CloudFront environment');
    revealSections.forEach(section => {
      section.classList.add('revealed');
    });
  } else {
    // Standard approach: Use Intersection Observer
    // Create observer for section reveal
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, 
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px' 
      }
    );
    
    // Apply observer to sections
    revealSections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
  // Set up staggered animations for elements inside sections
  const staggerContainers = document.querySelectorAll('.stagger-animation');
  
  // Reuse the same fallback check
  if (useObserverFallback) {
    // Fallback: Add revealed class to all stagger containers immediately
    staggerContainers.forEach(container => {
      container.classList.add('revealed');
    });
  } else {
    // Standard approach: Use Intersection Observer
    // Create observer for staggered animations
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            staggerObserver.unobserve(entry.target);
          }
        });
      }, 
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -15% 0px' 
      }
    );
    
    // Apply observer to stagger containers
    staggerContainers.forEach(container => {
      staggerObserver.observe(container);
    });
  }
  
  // Apply parallax effect to backgrounds
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  
  // Only apply parallax if motion is not reduced
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.15;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
}

/**
 * Enhance links for better touch device behavior
 */
function enhanceTouchLinks() {
  // Add active state for touch devices
  const links = document.querySelectorAll('a, button');
  
  links.forEach(link => {
    link.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    });
    
    link.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    });
    
    link.addEventListener('touchcancel', function() {
      this.classList.remove('touch-active');
    });
  });

  // Ensure all links work correctly
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if it's open
        const menuLinks = document.querySelector('.menu-links');
        const hamburgerButton = document.querySelector('.hamburger-button');
        
        if (menuLinks && menuLinks.classList.contains('open')) {
          menuLinks.classList.remove('open');
          hamburgerButton.setAttribute('aria-expanded', 'false');
        }
        
        // Smooth scroll to target
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Initialize animated statistics counters
 * With fallback for S3/CloudFront environments
 */
function initStatCounters() {
  const statValueElements = document.querySelectorAll('.stat-value');
  
  // Check if we should use a fallback approach (for S3 or restricted environments)
  const useObserverFallback = window.location.hostname.includes('s3.amazonaws.com') || 
                             window.location.hostname.includes('cloudfront.net');
  
  // Function to animate a counter
  function animateCounter(element) {
    const targetValue = parseInt(element.textContent);
    
    // Don't animate if it contains non-numeric content
    if (isNaN(targetValue)) return;
    
    // Animate from 0 to target value
    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const increment = Math.ceil(targetValue / (duration / 16)); // 60fps
    
    const counter = setInterval(() => {
      currentValue += increment;
      
      if (currentValue >= targetValue) {
        element.textContent = targetValue + (element.textContent.includes('+') ? '+' : '');
        clearInterval(counter);
      } else {
        element.textContent = currentValue;
      }
    }, 16);
  }
  
  if (useObserverFallback) {
    // Fallback approach: Simply animate all counters after a short delay
    setTimeout(() => {
      statValueElements.forEach(element => {
        animateCounter(element);
      });
    }, 500);
  } else {
    // Standard approach: Use Intersection Observer
    // Create observer for stat counters
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    // Apply observer to stat counters
    statValueElements.forEach(element => {
      statObserver.observe(element);
    });
  }
}
