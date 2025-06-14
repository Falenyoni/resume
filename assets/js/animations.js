// Scroll animation for the hero section
document.addEventListener('DOMContentLoaded', function() {
  // Set up intersection observer for animations
  const animateOnScroll = () => {
    // Elements to animate
    const elements = document.querySelectorAll('.stat-card, .hero-tags .tag, .hero-name, .hero-title, .profile-bio p');
    
    // Observer options
    const options = {
      threshold: 0.2,
      rootMargin: '0px'
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class to the element
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // Stop observing element after it's animated
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Apply initial styles and start observing
    elements.forEach((element, index) => {
      // Set initial styles
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = `all 0.5s ease ${index * 0.1}s`;
      
      // Observe element
      observer.observe(element);
    });
  };
  
  // Initialize animations
  animateOnScroll();
  
  // Enhance background shapes behavior
  const enhanceBackgroundShapes = () => {
    const shapes = document.querySelectorAll('.shape');
    let mouseX = 0;
    let mouseY = 0;
    
    // Update shapes on mouse move
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      
      shapes.forEach((shape, index) => {
        const offsetX = (mouseX - 0.5) * (20 + index * 10);
        const offsetY = (mouseY - 0.5) * (20 + index * 10);
        const delay = index * 0.05;
        
        shape.style.transition = `transform 1s ease ${delay}s`;
        shape.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    });
  };
  
  // Initialize background shape enhancements
  enhanceBackgroundShapes();
  
  // Counter animation for stat values
  const animateStatCounters = () => {
    const stats = document.querySelectorAll('.stat-value');
    
    stats.forEach(stat => {
      const target = parseInt(stat.textContent);
      if (isNaN(target)) return;
      
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 25));
      const duration = 1500; // 1.5 seconds
      const stepTime = Math.max(30, duration / (target / increment));
      
      // Save original text if it contains a plus sign
      const originalText = stat.textContent;
      const hasPlusSign = originalText.includes('+');
      
      const updateCounter = () => {
        current += increment;
        if (current > target) current = target;
        
        // Add plus sign if original had it
        stat.textContent = hasPlusSign ? `${current}+` : current;
        
        if (current < target) {
          setTimeout(updateCounter, stepTime);
        }
      };
      
      // Start the animation with a small delay
      setTimeout(updateCounter, 500);
    });
  };
  
  // Initialize counter animations
  setTimeout(animateStatCounters, 800);
});
