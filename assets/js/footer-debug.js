// Footer visibility debugging

document.addEventListener('DOMContentLoaded', function() {
  // Debug the footer visibility
  debugFooterVisibility();
});

/**
 * Debug footer visibility issues
 */
function debugFooterVisibility() {
  const footer = document.querySelector('footer');
  
  if (footer) {
    console.log('Footer found in DOM');
    
    // Check computed styles
    const footerStyles = window.getComputedStyle(footer);
    console.log('Footer display:', footerStyles.display);
    console.log('Footer visibility:', footerStyles.visibility);
    console.log('Footer opacity:', footerStyles.opacity);
    console.log('Footer position:', footerStyles.position);
    console.log('Footer z-index:', footerStyles.zIndex);
    
    // Force the footer to be visible after a delay
    setTimeout(() => {
      footer.style.display = 'block';
      footer.style.visibility = 'visible';
      footer.style.opacity = '1';
      footer.style.zIndex = '10';
      console.log('Footer visibility forced');
    }, 1000);
    
    // Also check if any parent elements might be hiding it
    let parent = footer.parentElement;
    while (parent && parent !== document.body) {
      const parentStyles = window.getComputedStyle(parent);
      console.log('Parent element:', parent.tagName, 'Display:', parentStyles.display, 'Visibility:', parentStyles.visibility, 'Overflow:', parentStyles.overflow);
      parent = parent.parentElement;
    }
  } else {
    console.error('Footer element not found in DOM!');
  }
}
