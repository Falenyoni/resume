function toggleMenu(event) {
  if (event) {
    event.stopPropagation();
  }
  
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
  
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
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  
  // Check if click is outside the menu and hamburger icon
  if (!hamburgerMenu.contains(event.target)) {
    menu.classList.remove("open");
    icon.classList.remove("open");
    document.removeEventListener("click", closeMenuOnClickOutside);
  }
}

function handleMenuItemClick(event) {
  // Close menu after clicking a menu item
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  
  // Small delay to allow the navigation to happen first
  setTimeout(() => {
    menu.classList.remove("open");
    icon.classList.remove("open");
    document.removeEventListener("click", closeMenuOnClickOutside);
  }, 100);
}

// Theme toggling functionality
const themeToggle = document.getElementById("theme-toggle");
const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
const htmlElement = document.documentElement;

function toggleTheme() {
  if (htmlElement.getAttribute("data-theme") === "light") {
    htmlElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    htmlElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

// Initialize theme from localStorage or set default
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  htmlElement.setAttribute("data-theme", savedTheme);
}

// Theme buttons now use onclick in HTML for better handling with the mobile menu

// Initialize theme on page load
initializeTheme();

// Initialize EmailJS service
function initEmailJS() {
  try {
    // Public Key from EmailJS Account > API Keys
    // This is different from your service ID
    emailjs.init("S-C4CkPysSARSZqIc"); // Replace with your actual public key if different
    console.log("EmailJS initialized successfully");
  } catch (error) {
    console.error("Error initializing EmailJS:", error);
  }
}

// Contact Form Functionality
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formDataObject = Object.fromEntries(formData.entries());
    
    // Dismiss keyboard on mobile devices
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => input.blur());
    
    // Form message element
    const formMessage = document.getElementById("form-message");
    
    // Show loading state
    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
      // Form validation
      if (!formDataObject.name || !formDataObject.email || !formDataObject.message) {
        throw new Error("Please fill out all required fields.");
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formDataObject.email)) {
        throw new Error("Please enter a valid email address.");
      }
        // Prepare email parameters
      const emailParams = {        
        from_name: formDataObject.name,
        from_email: formDataObject.email,
        subject: formDataObject.subject || "Portfolio Contact Form",
        message: formDataObject.message,      };
      
      // Send email using EmailJS
      try {
        console.log("Sending email with params:", emailParams);
        const response = await emailjs.send("service_v2nktbe", "template_gmbr202", emailParams);
        console.log("Email sent successfully:", response);
        
        // Log successful response
        if (response && response.status === 200) {
          console.log("Email successfully delivered with status:", response.status);
        }
      } catch (emailError) {
        console.error("EmailJS error:", emailError);
        // Show detailed error for debugging
        console.error("Error details:", JSON.stringify(emailError));
        throw new Error("Failed to send email. Please try again later or contact directly via email.");
      }
      
      // Success state
      contactForm.reset();
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitBtn.classList.add("success");      // Show success message
      formMessage.innerHTML = "<i class='fas fa-check-circle' style='margin-right: 8px;'></i> Thank you for your message! I'll get back to you as soon as possible.";
      formMessage.className = "form-group full-width form-message success";
      formMessage.style.display = "block"; // Explicitly set display to block
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("success");
      }, 3000);
      
      // Hide message after 8 seconds
      setTimeout(() => {
        // Fade out effect
        formMessage.style.opacity = "0";
        setTimeout(() => {
          formMessage.style.display = "none";
          formMessage.innerHTML = "";
          formMessage.className = "form-group full-width form-message";
          formMessage.style.opacity = "1";
        }, 300);
      }, 8000);
      
    } catch (error) {
      // Error state
      console.error("Form submission error:", error);
      submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed';
      submitBtn.classList.add("error");      // Show error message
      formMessage.innerHTML = "<i class='fas fa-exclamation-circle' style='margin-right: 8px;'></i> " + (error.message || "Sorry, there was a problem sending your message. Please try again later.");
      formMessage.className = "form-group full-width form-message error";
      formMessage.style.display = "block"; // Explicitly set display to block
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("error");
      }, 3000);
      
      // Hide error message after 8 seconds
      setTimeout(() => {
        // Fade out effect
        formMessage.style.opacity = "0";
        setTimeout(() => {
          formMessage.style.display = "none";
          formMessage.innerHTML = "";
          formMessage.className = "form-group full-width form-message";
          formMessage.style.opacity = "1";
        }, 300);
      }, 8000);
    }
  });
}

// Scroll to top functionality
function setupScrollToTop() {
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  if (!scrollToTopBtn) return;
  
  // Show button when page is scrolled down
  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  }
  
  // Scroll to top when button is clicked
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  
  // Listen for scroll events
  window.addEventListener("scroll", toggleScrollButton);
  
  // Initial check
  toggleScrollButton();
}

// Prevent closing the menu when clicking on the theme toggle
function handleThemeToggleClick(event) {
  // Prevent the menu from closing when toggling theme
  if (event) {
    event.stopPropagation();
  }
  
  // Toggle the theme
  toggleTheme();
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initializeTheme();
  
  // Initialize EmailJS
  initEmailJS();
  
  // Setup contact form
  setupContactForm();
  
  // Setup scroll to top button
  setupScrollToTop();
  
  console.log('All scripts initialized successfully');
});