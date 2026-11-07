/* Portfolio interactions — lightweight, accessible, and motion-aware. */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktopQuery = window.matchMedia('(min-width: 769px)');
  const prefersReducedMotion = () => motionQuery.matches;

  // Pointer spotlight: update only while the pointer is moving.
  if (finePointerQuery.matches && !prefersReducedMotion()) {
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.25;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;

    const renderSpotlight = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      root.style.setProperty('--mouse-x', currentX.toFixed(1) + 'px');
      root.style.setProperty('--mouse-y', currentY.toFixed(1) + 'px');

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frame = requestAnimationFrame(renderSpotlight);
      } else {
        frame = 0;
      }
    };

    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!frame) frame = requestAnimationFrame(renderSpotlight);
    }, { passive: true });
  }

  // Header state, throttled to one update per animation frame.
  const header = document.querySelector('.site-header');
  let scrollFrame = 0;
  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
    scrollFrame = 0;
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
  }, { passive: true });
  updateHeader();

  // Mobile navigation drawer.
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

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', (event) => {
        if (event.matches) setMenuOpen(false);
      });
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener((event) => {
        if (event.matches) setMenuOpen(false);
      });
    }

    setMenuOpen(false);
  }

  // Highlight the navigation item for the section currently in view.
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => ({ link, section: document.getElementById(link.getAttribute('href').slice(1)) }))
    .filter((item) => item.section);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.removeAttribute('aria-current'));
        const active = sections.find((item) => item.section === entry.target);
        if (active) active.link.setAttribute('aria-current', 'page');
      });
    }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 });

    sections.forEach(({ section }) => sectionObserver.observe(section));
  }

  // Reveal content as it enters the viewport. Fall back to visible content.
  const revealItems = document.querySelectorAll('[data-reveal]');
  const revealAll = () => revealItems.forEach((item) => item.classList.add('is-visible'));

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    revealAll();
  } else if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Small pointer response on desktop only; no continuous animation loop.
  if (finePointerQuery.matches && !prefersReducedMotion()) {
    document.querySelectorAll('.btn-primary, .btn-warm, .btn-ghost, .btn-project-cta').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = Math.max(-3, Math.min(3, (event.clientX - rect.left - rect.width / 2) * 0.07));
        const y = Math.max(-3, Math.min(3, (event.clientY - rect.top - rect.height / 2) * 0.08));
        button.style.transform = 'translate3d(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px, 0)';
      });
      button.addEventListener('pointerleave', () => {
        button.style.transform = '';
      });
    });
  }
})();
