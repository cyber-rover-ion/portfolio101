/* ==========================================================================
   Jebin Pravinraj | Creative Developer Portfolio Scripts
   Interactive background spotlight, smooth reveals, navigation & micro-interactions.
   ========================================================================== */

(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktopQuery = window.matchMedia('(min-width: 769px)');

  const prefersReducedMotion = () => motionQuery.matches;

  /* ---------- Interactive Background Pointer Tracking ---------- */

  if (finePointerQuery.matches && !prefersReducedMotion()) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight * 0.25;
    let currentX = mouseX;
    let currentY = mouseY;
    let rafActive = false;

    const updatePointer = () => {
      // Smooth interpolation for spotlight movement
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      root.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
      root.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);

      if (Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
        requestAnimationFrame(updatePointer);
      } else {
        rafActive = false;
      }
    };

    window.addEventListener('pointermove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!rafActive) {
        rafActive = true;
        requestAnimationFrame(updatePointer);
      }
    }, { passive: true });
  }

  /* ---------- Header Scroll State ---------- */

  const header = document.querySelector('.site-header');

  const updateHeader = () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }
  };

  // Throttle header scroll updates with requestAnimationFrame to avoid layout thrashing
let scrollTick = false;
window.addEventListener('scroll', () => {
  if (!scrollTick) {
    scrollTick = true;
    requestAnimationFrame(() => {
      updateHeader();
      scrollTick = false;
    });
  }
}, { passive: true });
// Remove the previous direct scroll listener (lines 63-64) – replacement will delete those lines.

  updateHeader();

  /* ---------- Mobile Navigation Drawer ---------- */

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    const setMenuOpen = (open) => {
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
      document.body.classList.toggle('menu-open', open);
    };

    const isMenuOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    toggle.addEventListener('click', () => setMenuOpen(!isMenuOpen()));

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isMenuOpen()) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    desktopQuery.addEventListener('change', (event) => {
      if (event.matches) setMenuOpen(false);
    });

    setMenuOpen(false);
  }

  /* ---------- Active Section Navigation Indicator ---------- */

  const navLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');
  const linkBySection = new Map();

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId !== '#') {
      const section = document.querySelector(targetId);
      if (section) linkBySection.set(section, link);
    }
  });

  if ('IntersectionObserver' in window && linkBySection.size) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = linkBySection.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((item) => item.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'page');
        }
      });
    }, {
      rootMargin: '-35% 0px -50% 0px',
    });

    linkBySection.forEach((_, section) => sectionObserver.observe(section));
  }

  /* ---------- Staggered Scroll Reveals ---------- */

  const revealItems = document.querySelectorAll('[data-reveal]');

  // Removed per-element stagger calculation for performance. Staggering is now handled via CSS using nth-child selectors.


  const revealAll = () => {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  };

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    revealAll();
  } else {
    // Reveal observer with automatic disconnect when all items are visible
let remainingReveals = revealItems.length;
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
    remainingReveals--;
    if (remainingReveals === 0) {
      observer.disconnect();
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px',
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ---------- Subtle Magnetic Button Micro-Interaction ---------- */

  if (finePointerQuery.matches && !prefersReducedMotion()) {
    const buttons = document.querySelectorAll('.btn-primary, .btn-warm, .btn-ghost, .btn-project-cta');

    buttons.forEach((btn) => {
      btn.addEventListener('pointermove', (event) => {
        const rect = btn.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;

        // Subtle, constrained translation (max ~3-4px)
        const moveX = Math.max(-4, Math.min(4, offsetX * 0.1));
        const moveY = Math.max(-4, Math.min(4, offsetY * 0.12));

        btn.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
      });

      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

})();
