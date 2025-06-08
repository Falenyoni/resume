function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Theme toggling functionality
const themeToggle = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

// Function to get the user's theme preference
const getPreferredTheme = () => {
  // First check localStorage
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    return storedTheme;
  }
  
  // Then check system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Function to set theme
const setTheme = (theme) => {
  // Update data-theme attribute
  htmlElement.setAttribute("data-theme", theme);
  
  // Store the preference
  localStorage.setItem("theme", theme);
};

// Initialize theme on load
const initializeTheme = () => {
  // Set initial theme
  const theme = getPreferredTheme();
  setTheme(theme);
};

// Handle theme toggle click
themeToggle.addEventListener("click", () => {
  // Get current theme
  const currentTheme = htmlElement.getAttribute("data-theme");
  
  // Toggle theme
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  // Apply new theme
  setTheme(newTheme);
});

// Handle system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {  // Only react if user hasn't set a preference
    setTheme(e.matches ? "dark" : "light");
  }
});

// Initialize theme and services when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initEmailJS();
  setupContactForm();
});

// Initialize EmailJS service
function initEmailJS() {
  // Public Key from EmailJS Account > API Keys
  // This is different from your service ID
  emailjs.init("S-C4CkPysSARSZqIc"); // Replace with your actual public key if different
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
        message: formDataObject.message,
      };      // Send email using EmailJS
      try {
        const response = await emailjs.send("service_v2nktbe", "template_gmbr202", emailParams);
        console.log("Email sent successfully:", response);
      } catch (emailError) {
        console.error("EmailJS error:", emailError);
        throw new Error("Failed to send email. Please try again later or contact directly via email.");
      }
      
      // Success state
      contactForm.reset();
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitBtn.classList.add("success");
      
      // Show success message
      formMessage.innerHTML = "Thank you for your message! I'll get back to you as soon as possible.";
      formMessage.className = "form-group full-width form-message success";
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("success");
      }, 3000);
      
      // Hide message after 5 seconds
      setTimeout(() => {
        formMessage.style.display = "none";
        formMessage.innerHTML = "";
        formMessage.className = "form-group full-width form-message";
      }, 5000);
      
    } catch (error) {
      // Error state
      console.error("Form submission error:", error);
      submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed';
      submitBtn.classList.add("error");
      
      // Show error message
      formMessage.innerHTML = error.message || "Sorry, there was a problem sending your message. Please try again later.";
      formMessage.className = "form-group full-width form-message error";
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("error");
      }, 3000);
      
      // Keep error message visible
    }
  });
}