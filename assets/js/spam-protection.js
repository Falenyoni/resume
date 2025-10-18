// Enhanced Contact Form with Spam Protection
class ContactFormProtection {
  constructor() {
    this.submitAttempts = 0;
    this.lastSubmitTime = 0;
    this.rateLimitDelay = 30000; // 30 seconds between submissions
    this.captchaAnswer = 0;
    this.spamPatterns = [
      /(.)\1{3,}/g, // Repeated characters (4 or more) - lowered from 5
      /https?:\/\//gi, // URLs
      /\b(?:buy|sell|cheap|free|money|bitcoin|crypto|casino|loan|debt|viagra|cialis)\b/gi, // Spam keywords
      /[^\w\s@.-]/g, // Special characters (except common punctuation)
      /^\s*[a-z]{1,20}\s*$/i, // Single word only (like "EpUHmuqQxMrnRwg")
      /(.{2,4})\1{4,}/gi, // Repetitive patterns like "asasasas" or "dadada"
    ];

    this.init();
  }

  init() {
    this.generateCaptcha();
    this.setupFormValidation();
    this.setupCharacterCounter();

    console.log("Spam protection initialized");
  }

  generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    this.captchaAnswer = num1 + num2;

    const captchaQuestion = document.getElementById("captcha-question");
    if (captchaQuestion) {
      captchaQuestion.textContent = `What is ${num1} + ${num2}?`;
    }
  }

  setupCharacterCounter() {
    const messageTextarea = document.getElementById("message");
    const charCount = document.getElementById("char-count");

    if (messageTextarea && charCount) {
      messageTextarea.addEventListener("input", (e) => {
        const count = e.target.value.length;
        charCount.textContent = count;

        // Update color based on count
        const parent = charCount.parentElement;
        parent.classList.remove("warning", "error");

        if (count < 20) {
          parent.classList.add("error");
        } else if (count > 1800) {
          parent.classList.add("warning");
        }
      });
    }
  }

  setupFormValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmission(form);
    });
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Run all validation checks
    const validationResult = this.validateSubmission(data);

    if (!validationResult.isValid) {
      this.showError(validationResult.message);
      return;
    }

    // If validation passes, proceed with EmailJS submission
    await this.submitForm(data, form);
  }

  validateSubmission(data) {
    // Check honeypot field
    if (data.website && data.website.trim() !== "") {
      console.log("Spam detected: Honeypot field filled");
      return { isValid: false, message: "Spam detected. Submission blocked." };
    }

    // Rate limiting
    const now = Date.now();
    if (now - this.lastSubmitTime < this.rateLimitDelay) {
      const remainingTime = Math.ceil(
        (this.rateLimitDelay - (now - this.lastSubmitTime)) / 1000
      );
      return {
        isValid: false,
        message: `Please wait ${remainingTime} seconds before submitting again.`,
      };
    }

    // Basic field validation
    if (!data.name || data.name.trim().length < 2) {
      return {
        isValid: false,
        message: "Please enter a valid name (at least 2 characters).",
      };
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { isValid: false, message: "Please enter a valid email address." };
    }

    if (!data.message || data.message.trim().length < 20) {
      return {
        isValid: false,
        message: "Please enter a message with at least 20 characters.",
      };
    }

    if (data.message.length > 2000) {
      return {
        isValid: false,
        message: "Message is too long (maximum 2000 characters).",
      };
    }

    // CAPTCHA validation
    const captchaValue = parseInt(data.captcha);
    if (isNaN(captchaValue) || captchaValue !== this.captchaAnswer) {
      this.generateCaptcha(); // Generate new captcha
      return {
        isValid: false,
        message: "Incorrect security answer. Please try again.",
      };
    }

    // Spam content detection
    const spamCheck = this.detectSpam(
      data.message,
      data.name,
      data.subject || ""
    );
    if (!spamCheck.isValid) {
      return { isValid: false, message: spamCheck.message };
    }

    return { isValid: true };
  }

  detectSpam(message, name, subject) {
    const content = `${name} ${subject} ${message}`.toLowerCase();

    // Check for spam patterns
    for (const pattern of this.spamPatterns) {
      if (pattern.test(content)) {
        console.log("Spam pattern detected:", pattern);
        return {
          isValid: false,
          message:
            "Your message appears to contain spam content. Please revise and try again.",
        };
      }
    }

    // Enhanced repetitive character detection
    const repetitiveCheck = this.checkRepetitiveContent(message);
    if (!repetitiveCheck.isValid) {
      return repetitiveCheck;
    }

    // Check message quality and structure
    const qualityCheck = this.checkMessageQuality(message);
    if (!qualityCheck.isValid) {
      return qualityCheck;
    }

    // Check for excessive repeated words
    const words = content.split(/\s+/);
    const wordCount = {};
    for (const word of words) {
      if (word.length > 3) {
        // Only count words longer than 3 characters
        wordCount[word] = (wordCount[word] || 0) + 1;
        if (wordCount[word] > 5) {
          // Same word repeated more than 5 times
          return {
            isValid: false,
            message:
              "Your message contains excessive repetition. Please revise and try again.",
          };
        }
      }
    }

    // Check for random character sequences (like "EpUHmuqQxMrnRwg")
    const randomPattern = /^[a-zA-Z]{8,}$/;
    if (
      randomPattern.test(name.replace(/\s/g, "")) ||
      randomPattern.test(message.replace(/\s/g, ""))
    ) {
      const hasVowels = /[aeiou]/i.test(name + message);
      const consonantRatio =
        (name + message).replace(/[aeiou\s]/gi, "").length /
        (name + message).replace(/\s/g, "").length;

      if (!hasVowels || consonantRatio > 0.8) {
        return {
          isValid: false,
          message: "Please provide a valid name and message.",
        };
      }
    }

    return { isValid: true };
  }

  checkRepetitiveContent(text) {
    const cleanText = text.toLowerCase().replace(/\s/g, "");

    // Check for patterns like "asasasasa" or "dadadadada"
    const patterns = [
      /(.{1,3})\1{6,}/g, // 1-3 character patterns repeated 6+ times
      /(.{1,2})\1{8,}/g, // 1-2 character patterns repeated 8+ times
      /(..)\1{5,}/g, // 2 character patterns repeated 5+ times
    ];

    for (const pattern of patterns) {
      if (pattern.test(cleanText)) {
        return {
          isValid: false,
          message:
            "Please write a meaningful message without repetitive patterns.",
        };
      }
    }

    // Check for excessive character repetition (like "aaaaaaaaaa")
    const charCount = {};
    for (const char of cleanText) {
      if (char.match(/[a-z]/)) {
        charCount[char] = (charCount[char] || 0) + 1;
      }
    }

    const totalChars = Object.values(charCount).reduce((a, b) => a + b, 0);
    for (const [char, count] of Object.entries(charCount)) {
      if (count / totalChars > 0.4) {
        // If any character makes up more than 40% of the message
        return {
          isValid: false,
          message:
            "Please write a meaningful message without excessive character repetition.",
        };
      }
    }

    return { isValid: true };
  }

  checkMessageQuality(message) {
    const cleanMessage = message.trim().toLowerCase();

    // Require at least 3 words for meaningful communication
    const words = cleanMessage.split(/\s+/).filter((word) => word.length > 0);
    if (words.length < 3) {
      return {
        isValid: false,
        message: "Please write a message with at least 3 words.",
      };
    }

    // Check for proper vowel distribution (basic language structure)
    const vowels = cleanMessage.match(/[aeiou]/g) || [];
    const consonants = cleanMessage.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

    if (vowels.length === 0) {
      return {
        isValid: false,
        message: "Please write a meaningful message.",
      };
    }

    const vowelRatio = vowels.length / (vowels.length + consonants.length);
    if (vowelRatio < 0.15 || vowelRatio > 0.7) {
      // Normal text has 20-50% vowels
      return {
        isValid: false,
        message: "Please write a meaningful message.",
      };
    }

    // Check for keyboard patterns (qwerty, asdf, etc.)
    const keyboardPatterns = [
      /qwerty|asdf|zxcv|123456|abcdef/gi,
      /qwertyuiop|asdfghjkl|zxcvbnm/gi,
    ];

    for (const pattern of keyboardPatterns) {
      if (pattern.test(cleanMessage)) {
        return {
          isValid: false,
          message:
            "Please avoid keyboard patterns and write a meaningful message.",
        };
      }
    }

    // Check for alternating character patterns that are too long
    const alternatingPattern = /^(.)(.)(\1\2){3,}/;
    if (alternatingPattern.test(cleanMessage.replace(/\s/g, ""))) {
      return {
        isValid: false,
        message:
          "Please write a meaningful message without repetitive patterns.",
      };
    }

    // Check average word length (spam often has very short or very long "words")
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;
    if (avgWordLength < 2 || avgWordLength > 15) {
      return {
        isValid: false,
        message: "Please write a meaningful message with proper words.",
      };
    }

    return { isValid: true };
  }

  async submitForm(data, form) {
    const submitBtn = document.getElementById("submit-btn");
    const formMessage = document.getElementById("form-message");
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      // Prepare email parameters (excluding honeypot and captcha fields)
      const emailParams = {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject || "Portfolio Contact Form",
        message: data.message,
      };

      console.log("Sending email with params:", emailParams);
      const response = await emailjs.send(
        "service_v2nktbe",
        "template_gmbr202",
        emailParams
      );
      console.log("Email sent successfully:", response);

      // Update submission tracking
      this.lastSubmitTime = Date.now();
      this.submitAttempts++;

      // Success state
      form.reset();
      this.generateCaptcha(); // Generate new captcha for next use

      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitBtn.classList.add("success");

      this.showSuccess(
        "Thank you for your message! I'll get back to you as soon as possible."
      );

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("success");
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);

      submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed';
      submitBtn.classList.add("error");

      this.showError(
        "Sorry, there was a problem sending your message. Please try again later."
      );

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("error");
      }, 3000);
    }
  }

  showSuccess(message) {
    this.showMessage(message, "success", "fas fa-check-circle");
  }

  showError(message) {
    this.showMessage(message, "error", "fas fa-exclamation-circle");
  }

  showMessage(message, type, icon) {
    const formMessage = document.getElementById("form-message");
    if (!formMessage) return;

    formMessage.innerHTML = `<i class='${icon}' style='margin-right: 8px;'></i> ${message}`;
    formMessage.className = `form-group full-width form-message ${type}`;
    formMessage.style.display = "block";

    // Hide message after 8 seconds
    setTimeout(() => {
      formMessage.style.opacity = "0";
      setTimeout(() => {
        formMessage.style.display = "none";
        formMessage.innerHTML = "";
        formMessage.className = "form-group full-width form-message";
        formMessage.style.opacity = "1";
      }, 300);
    }, 8000);
  }
}

// Initialize spam protection when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Wait for EmailJS to be loaded
  if (typeof emailjs !== "undefined") {
    new ContactFormProtection();
  } else {
    // Wait for EmailJS to load
    const checkEmailJS = setInterval(() => {
      if (typeof emailjs !== "undefined") {
        clearInterval(checkEmailJS);
        new ContactFormProtection();
      }
    }, 100);
  }
});
