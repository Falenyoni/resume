// Modern Navigation and Section Transitions

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation functionality
  initNavigation();
  
  // Initialize section transitions
  initSectionTransitions();
  
  // Initialize scroll-based animations
  initScrollAnimations();
});

// Navigation functionality
function initNavigation() {
  const header = document.querySelector('.main-header');
  const desktopNav = document.getElementById('desktop-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const progressBar = document.getElementById('navProgressBar');
  let lastScrollTop = 0;
  
  if (!header || !progressBar) return;

  // Update navigation on scroll
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Handle header appearance
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update progress bar
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrollProgress}%`;
    
    // Update active section in navigation
    updateActiveNavLink();
    
    // Show/hide header based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 300) {
      // Scrolling down
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
  
  // Add click event to navigation links for smooth scrolling
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Smooth scroll to section
        smoothScrollTo(targetSection);
      }
    });
  });
  
  // Update active navigation link based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to corresponding link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }
  
  // Initialize active link on page load
  updateActiveNavLink();
}

// Function to smooth scroll to target element
function smoothScrollTo(target) {
  const headerOffset = 80;
  const elementPosition = target.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Section transitions functionality
function initSectionTransitions() {
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    // Add transition elements to each section
    addSectionTransitions(section);
  });
  
  // Add scroll indicator to first section
  const firstSection = document.querySelector('#profile');
  if (firstSection) {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    firstSection.appendChild(scrollIndicator);
    
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('#experience');
      if (nextSection) {
        smoothScrollTo(nextSection);
      }
    });
  }
}

// Add transition elements to section
function addSectionTransitions(section) {
  // Don't add transitions to contact section
  if (section.id === 'contact') return;
  
  // Create section divider
  const divider = document.createElement('div');
  divider.className = 'section-divider';
  
  // Add wave to divider
  const wave = document.createElement('div');
  wave.className = 'divider-wave divider-wave-1';
  divider.appendChild(wave);
  
  // Insert divider after section
  section.parentNode.insertBefore(divider, section.nextSibling);
  
  // Add animation class to section for scroll animations
  section.classList.add('section-animate');
}

// Scroll-based animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.section-animate');
  
  // Set up Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Enhanced mobile menu functionality
function toggleMenu(event) {
  if (event) {
    event.stopPropagation();
  }
  
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const hamburgerButton = document.querySelector(".hamburger-button");
  
  menu.classList.toggle("open");
  icon.classList.toggle("open");
  
  // Update aria-expanded attribute
  const isExpanded = menu.classList.contains("open");
  hamburgerButton.setAttribute("aria-expanded", isExpanded);
  
  // Close menu when clicking outside
  if (menu.classList.contains("open")) {
    document.addEventListener("click", closeMenuOnClickOutside);
  } else {
    document.removeEventListener("click", closeMenuOnClickOutside);
  }
}

function closeMenuOnClickOutside(event) {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const hamburgerButton = document.querySelector(".hamburger-button");
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  
  // Check if click is outside the menu and hamburger icon
  if (!hamburgerMenu.contains(event.target)) {
    menu.classList.remove("open");
    icon.classList.remove("open");
    hamburgerButton.setAttribute("aria-expanded", false);
    document.removeEventListener("click", closeMenuOnClickOutside);
  }
}

function handleMenuItemClick(event) {
  // Get the target section
  const targetHref = event.currentTarget.getAttribute('href');
  const targetSection = document.querySelector(targetHref);
  
  if (targetSection) {
    // Prevent default to handle scrolling ourselves
    event.preventDefault();
    
    // Close menu
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const hamburgerButton = document.querySelector(".hamburger-button");
    
    menu.classList.remove("open");
    icon.classList.remove("open");
    hamburgerButton.setAttribute("aria-expanded", false);
    document.removeEventListener("click", closeMenuOnClickOutside);
    
    // Scroll to section with slight delay to allow menu to close
    setTimeout(() => {
      smoothScrollTo(targetSection);
    }, 100);
  }
}

function handleThemeToggleClick(event) {
  event.stopPropagation();
  toggleTheme();
}
