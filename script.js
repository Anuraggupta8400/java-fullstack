/* ==========================================================================
   John Doe Portfolio — Shared behavior
   Handles: theme persistence, mobile nav, back-to-top, contact form
   ========================================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------------------
     Theme toggle (persisted in localStorage, respects OS preference)
     ------------------------------------------------------------------- */
  var THEME_KEY = 'portfolio-theme';
  var root = document.documentElement;
  var themeToggle = document.querySelector('.theme-toggle');

  function getPreferredTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
      );
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  /* -------------------------------------------------------------------
     Mobile navigation toggle
     ------------------------------------------------------------------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var primaryNav = document.getElementById('primary-nav');
  var navMenu = primaryNav ? primaryNav.querySelector('.nav-menu') : null;

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu after a link is activated (mobile)
    navMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        navMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape for keyboard users
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  }

  /* -------------------------------------------------------------------
     Back-to-top button
     ------------------------------------------------------------------- */
  var backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    var toggleBackToTop = function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------------------------
     Contact form: accessible client-side validation
     ------------------------------------------------------------------- */
  var contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    var statusBox = contactForm.querySelector('.form-status');

    var showStatus = function (state, message) {
      if (!statusBox) return;
      statusBox.dataset.state = state;
      statusBox.textContent = message;
      statusBox.setAttribute('role', state === 'error' ? 'alert' : 'status');
    };

    var setFieldError = function (field, message) {
      var errorEl = document.getElementById(field.id + '-error');
      if (message) {
        field.setAttribute('aria-invalid', 'true');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.hidden = false;
        }
      } else {
        field.removeAttribute('aria-invalid');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.hidden = true;
        }
      }
    };

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = contactForm.querySelector('#name');
      var email = contactForm.querySelector('#email');
      var message = contactForm.querySelector('#message');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var hasError = false;
      var firstInvalid = null;

      if (!name.value.trim()) {
        setFieldError(name, 'Enter your name.');
        hasError = true;
        firstInvalid = firstInvalid || name;
      } else {
        setFieldError(name, '');
      }

      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        setFieldError(email, 'Enter a valid email address.');
        hasError = true;
        firstInvalid = firstInvalid || email;
      } else {
        setFieldError(email, '');
      }

      if (!message.value.trim()) {
        setFieldError(message, 'Enter a message.');
        hasError = true;
        firstInvalid = firstInvalid || message;
      } else {
        setFieldError(message, '');
      }

      if (hasError) {
        showStatus('error', 'Please fix the highlighted fields and resubmit.');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // No backend is wired up — this simulates a successful submission.
      showStatus('success', 'Thanks, ' + name.value.trim() + '. Your message has been sent.');
      contactForm.reset();
    });
  }
})();
