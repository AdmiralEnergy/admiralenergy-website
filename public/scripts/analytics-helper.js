/**
 * Admiral Energy - Universal Analytics Helper
 * Include this on ALL pages before GTM loads
 */

(function() {
  'use strict';

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // 1. Capture landing page (first page of session)
  if (!sessionStorage.getItem('ae_landing_page')) {
    sessionStorage.setItem('ae_landing_page', location.pathname);
    sessionStorage.setItem('ae_landing_url', location.href);
    sessionStorage.setItem('ae_session_start', Date.now());
  }

  // 2. Capture referrer (first time only)
  if (!sessionStorage.getItem('ae_referrer')) {
    sessionStorage.setItem('ae_referrer', document.referrer || 'direct');
  }

  // 3. Capture UTM parameters (if present)
  const urlParams = new URLSearchParams(location.search);
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmParams.forEach(function(param) {
    const value = urlParams.get(param);
    if (value) {
      sessionStorage.setItem('ae_' + param, value);
    }
  });

  // 4. Push session data to dataLayer for GTM to use
  dataLayer.push({
    event: 'ae_session_data',
    session_data: {
      landing_page: sessionStorage.getItem('ae_landing_page'),
      referrer: sessionStorage.getItem('ae_referrer'),
      utm_source: sessionStorage.getItem('ae_utm_source') || '(not set)',
      utm_medium: sessionStorage.getItem('ae_utm_medium') || '(not set)',
      utm_campaign: sessionStorage.getItem('ae_utm_campaign') || '(not set)',
      pages_viewed: parseInt(sessionStorage.getItem('ae_pages_viewed') || '0') + 1
    }
  });

  // 5. Track page count
  const currentCount = parseInt(sessionStorage.getItem('ae_pages_viewed') || '0') + 1;
  sessionStorage.setItem('ae_pages_viewed', currentCount);

  // 6. Track scroll depth (useful for engagement)
  let maxScroll = 0;
  let scrollTracked = {25: false, 50: false, 75: false, 100: false};

  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
    }

    // Track scroll milestones
    [25, 50, 75, 100].forEach(function(milestone) {
      if (scrollPercent >= milestone && !scrollTracked[milestone]) {
        scrollTracked[milestone] = true;
        dataLayer.push({
          event: 'scroll_depth',
          scroll_depth: milestone,
          page: location.pathname
        });
      }
    });
  });

  // 7. Track outbound links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Check if external link
    if (href.startsWith('http') && !href.includes(location.hostname)) {
      dataLayer.push({
        event: 'outbound_click',
        link_url: href,
        link_text: link.textContent.trim(),
        link_domain: new URL(href).hostname
      });
    }

    // Track specific actions
    if (href.includes('tel:')) {
      dataLayer.push({
        event: 'phone_click',
        phone_number: href.replace('tel:', '')
      });
    }

    if (href.includes('mailto:')) {
      dataLayer.push({
        event: 'email_click',
        email_address: href.replace('mailto:', '')
      });
    }

    if (href.includes('calendly.com')) {
      dataLayer.push({
        event: 'calendly_click',
        calendar_url: href
      });
    }
  });

  // 8. Track time on page (fire on page unload)
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - parseInt(sessionStorage.getItem('ae_page_start') || Date.now())) / 1000);
    
    dataLayer.push({
      event: 'page_timing',
      time_on_page: timeOnPage,
      page: location.pathname,
      max_scroll: maxScroll
    });
  });

  // Set page start time
  sessionStorage.setItem('ae_page_start', Date.now());

  // Debug mode (if ?debug=1 in URL)
  if (urlParams.get('debug') === '1') {
    console.log('🔍 Admiral Energy Analytics Debug:', {
      landing_page: sessionStorage.getItem('ae_landing_page'),
      referrer: sessionStorage.getItem('ae_referrer'),
      utm_source: sessionStorage.getItem('ae_utm_source'),
      pages_viewed: currentCount,
      dataLayer: window.dataLayer
    });
  }
})();
