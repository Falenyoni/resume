// Create particle effect for hero section
document.addEventListener('DOMContentLoaded', function() {
  const heroSection = document.querySelector('#profile');
  
  if (!heroSection) return;
  
  // Create particle container
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  heroSection.appendChild(particleContainer);
  
  // Configuration
  const particleCount = 30;
  const particleColors = [
    'rgba(59, 130, 246, 0.5)',   // Blue (accent color)
    'rgba(99, 102, 241, 0.3)',    // Indigo
    'rgba(79, 70, 229, 0.3)'      // Purple
  ];
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    createParticle(particleContainer, particleColors);
  }
  
  // Handle mouse movement
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create occasional particle at mouse position with 5% chance
    if (Math.random() < 0.05 && isMouseInHero(mouseX, mouseY)) {
      createParticleAtMouse(particleContainer, mouseX, mouseY, particleColors);
    }
  });
  
  function isMouseInHero(x, y) {
    const rect = heroSection.getBoundingClientRect();
    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  }
});

// Function to create a particle
function createParticle(container, colors) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random properties
  const size = Math.random() * 5 + 2;
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Position (random within container)
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  
  // Style
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.backgroundColor = color;
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();
  
  // Animation is now handled by CSS classes
  // We'll use nth-child selectors in CSS to apply different animations
  
  // Add to container
  container.appendChild(particle);
}

// Create particle at mouse position
function createParticleAtMouse(container, x, y, colors) {
  const rect = container.getBoundingClientRect();
  const particle = document.createElement('div');
  particle.className = 'particle mouse-particle';
  
  // Properties
  const size = Math.random() * 4 + 2;
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Convert mouse position to relative position in container
  const posX = ((x - rect.left) / rect.width) * 100;
  const posY = ((y - rect.top) / rect.height) * 100;
  
  // Style
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.backgroundColor = color;
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  particle.style.opacity = '0.7';
  
  // Animation is now handled via the class
  particle.style.animationName = 'fadeOutUp';
  particle.style.animationDuration = '2s';
  particle.style.animationFillMode = 'forwards';
  
  // Add to container
  container.appendChild(particle);
  
  // Remove after animation completes
  setTimeout(() => {
    if (particle.parentNode === container) {
      container.removeChild(particle);
    }
  }, 2000);
}

// Function to add float keyframes - now just checks if they exist
function addFloatKeyframes() {
  // No longer dynamically creates keyframes
  // These are now pre-defined in the CSS file
  return;
}

// No longer needed as animations are now in CSS
