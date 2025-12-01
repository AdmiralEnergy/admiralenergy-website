// public/scripts/shared-utils.js
// Shared utilities for all Admiral Energy pages
(function() {
  'use strict';
  
  // Mobile menu toggle (used on all pages)
  function initMobileMenu() {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (button && menu) {
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('hidden');
      });
    }
  }
  
  // Exit intent tracking (used on multiple pages)
  function initExitIntent() {
    let exitIntentFired = false;
    let pageLoadTime = Date.now();
    
    document.addEventListener('mouseleave', function(e) {
      // Only fire if mouse leaves from top of page (indicating tab switch or close)
      if (e.clientY <= 0 && !exitIntentFired) {
        exitIntentFired = true;
        const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000); // seconds
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'exit_intent',
          page_url: window.location.href,
          time_on_page: timeOnPage,
          page_title: document.title
        });
        console.log('✅ exit_intent event pushed to dataLayer', {
          page_url: window.location.href,
          time_on_page: timeOnPage
        });
      }
    });
  }
  
  // Smooth scrolling for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMobileMenu();
      initExitIntent();
      initSmoothScroll();
    });
  } else {
    initMobileMenu();
    initExitIntent();
    initSmoothScroll();
  }
})();

