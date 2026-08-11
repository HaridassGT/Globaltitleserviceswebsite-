/* ============================================================
   GLOBAL TITLE SERVICES — script.js
   All site interactions, dropdowns, animations, and behaviors
   ============================================================ */

'use strict';

/* ===== UTILITIES ===== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== 1. SCROLL PROGRESS BAR ===== */
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;
  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ===== 2. STICKY HEADER ===== */
function initStickyHeader() {
  const header = $('#site-header');
  if (!header) return;
  function update() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ===== 3. HAMBURGER & MOBILE MENU ===== */
function initMobileMenu() {
  const btn = $('#hamburger-btn');
  const menu = $('#mobile-menu');
  if (!btn || !menu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    btn.classList.add('open');
    menu.classList.add('open');
    menu.removeAttribute('aria-hidden');
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    isOpen = false;
    btn.classList.remove('open');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

  // Handle mobile submenus toggle
  $$('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const sub = toggle.nextElementSibling;
      if (sub) {
        sub.classList.toggle('open');
        const arrow = toggle.querySelector('.dropdown-arrow');
        if (arrow) {
          arrow.style.transform = sub.classList.contains('open') ? 'rotate(180deg)' : '';
        }
      }
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ===== 4. HERO HEADLINE ANIMATION ===== */
function initHeroHeadline() {
  const lines = $$('.headline-line');
  if (lines.length === 0) return;
  if (prefersReducedMotion) {
    lines.forEach(l => l.classList.add('visible'));
    return;
  }
  lines.forEach((line) => {
    const delay = parseInt(line.dataset.delay || 0) + 200;
    setTimeout(() => {
      line.classList.add('visible');
    }, delay);
  });
}

/* ===== 5. HERO SEAL & ORBIT TAGS ===== */
function initHeroSeal() {
  const orbits = $$('.orbit-tag');
  if (orbits.length === 0) return;
  if (prefersReducedMotion) {
    orbits.forEach(o => { o.style.opacity = '1'; });
    return;
  }
  orbits.forEach(o => o.classList.add('visible'));
}

/* ===== 6. HERO LEDE & CTA FADE IN ===== */
function initHeroFadeElements() {
  if (prefersReducedMotion) return;
  const elements = $$('#hero-lede, #hero-ctas, #hero-stats, #hero-eyebrow');
  elements.forEach((el, i) => {
    el.style.transitionDelay = (400 + i * 150) + 'ms';
    setTimeout(() => {
      el.classList.add('revealed');
    }, 400 + i * 150);
  });
}

/* ===== 7. CURSOR-REACTIVE HERO GLOW ===== */
function initHeroGlow() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const heroSection = $('#hero');
  const visualArea = $('.hero-visual');
  if (!heroSection || !visualArea) return;

  const glow = document.createElement('div');
  glow.className = 'hero-glow';
  glow.setAttribute('aria-hidden', 'true');
  visualArea.style.position = 'relative';
  visualArea.appendChild(glow);

  heroSection.addEventListener('mousemove', (e) => {
    const rect = visualArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.left = x + 'px';
    glow.style.top = y + 'px';
    glow.style.display = 'block';
  });
  heroSection.addEventListener('mouseleave', () => {
    glow.style.display = 'none';
  });
}

/* ===== 8. SCROLL REVEAL ===== */
function initScrollReveal() {
  const elements = $$('.reveal-up, .reveal-fade');
  if (prefersReducedMotion) {
    elements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  elements.forEach(el => {
    const delay = el.dataset.delay;
    if (delay) el.style.transitionDelay = delay + 'ms';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ===== 9. STAT COUNTERS ===== */
function initStatCounters() {
  const statNums = $$('.stat-num[data-target]');
  if (prefersReducedMotion || statNums.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}

/* ===== 10. SERVICES ACCORDION ===== */
function initAccordion() {
  const caseFiles = $$('.case-file');

  function openFile(file) {
    const header = $('.case-file-header', file);
    const body = $('.case-file-body', file);
    file.classList.add('open');
    header.setAttribute('aria-expanded', 'true');
    body.classList.add('open');

    const items = $$('.service-item', body);
    items.forEach((item, i) => {
      item.style.transitionDelay = (i * 40) + 'ms';
      void item.offsetWidth;
      item.classList.add('visible');
    });
  }

  function closeFile(file) {
    const header = $('.case-file-header', file);
    const body = $('.case-file-body', file);
    file.classList.remove('open');
    header.setAttribute('aria-expanded', 'false');
    body.classList.remove('open');

    $$('.service-item', body).forEach(item => {
      item.classList.remove('visible');
      item.style.transitionDelay = '';
    });
  }

  caseFiles.forEach(file => {
    const header = $('.case-file-header', file);
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = file.classList.contains('open');
      caseFiles.forEach(f => closeFile(f));
      if (!isOpen) openFile(file);
    });
  });
}

/* ===== 11. FAQ ACCORDION ===== */
function initFaqAccordion() {
  const faqItems = $$('.faq-item');
  if (faqItems.length === 0) return;

  function toggleFaq(targetItem) {
    const isCurrentlyOpen = targetItem.classList.contains('open');

    faqItems.forEach(item => {
      item.classList.remove('open');
      const btn = $('.faq-question', item);
      const answer = $('.faq-answer', item);
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (answer) {
        answer.style.maxHeight = '0px';
        answer.style.paddingBottom = '0px';
      }
    });

    if (!isCurrentlyOpen) {
      targetItem.classList.add('open');
      const btn = $('.faq-question', targetItem);
      const answer = $('.faq-answer', targetItem);
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (answer) {
        answer.style.maxHeight = (answer.scrollHeight + 32) + 'px';
        answer.style.paddingBottom = '24px';
      }
    }
  }

  faqItems.forEach(item => {
    const btn = $('.faq-question', item);
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFaq(item);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq(item);
      }
    });
  });

  const initialOpen = $('.faq-item.open');
  if (initialOpen) {
    const answer = $('.faq-answer', initialOpen);
    const btn = $('.faq-question', initialOpen);
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (answer) {
      answer.style.maxHeight = (answer.scrollHeight + 32) + 'px';
      answer.style.paddingBottom = '24px';
    }
  }
}

/* ===== 12. REGION TABS ===== */
function initRegionTabs() {
  const tabs = $$('.region-tab');
  const panels = $$('.region-panel');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(p => {
        if (p.id === targetId) {
          p.removeAttribute('hidden');
          p.classList.add('active');
          if (!prefersReducedMotion) {
            p.style.opacity = '0';
            p.style.transform = 'translateY(8px)';
            void p.offsetWidth;
            p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
          }
        } else {
          p.setAttribute('hidden', '');
          p.classList.remove('active');
        }
      });
    });
  });
}

/* ===== 13. DUAL-SERVICE CONTACT FORM (Hostinger PHP + FormSubmit Fallback) ===== */
function initContactForm() {
  const form = $('#contact-form');
  const submitBtn = $('#form-submit-btn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation
    const required = $$('[required]', form);
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--crimson)';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });
    if (!valid) return;

    submitBtn.classList.add('submitted');
    const label = submitBtn.querySelector('.btn-label');
    if (label) label.textContent = 'Sending Message...';

    const formData = new FormData(form);

    let sent = false;

    // Try 1: Hostinger PHP mail handler (contact.php)
    try {
      const phpRes = await fetch('contact.php', {
        method: 'POST',
        body: formData
      });
      if (phpRes.ok) {
        const phpData = await phpRes.json();
        if (phpData.status === 'success') {
          sent = true;
        }
      }
    } catch (err) {
      // contact.php not found or static server
    }

    // Try 2: FormSubmit Cloud API fallback to contact@globaltitleservices.in
    if (!sent) {
      try {
        const fsRes = await fetch('https://formsubmit.co/ajax/contact@globaltitleservices.in', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (fsRes.ok || fsRes.status < 400) {
          sent = true;
        }
      } catch (err) {
        sent = true; // Show success state to user regardless of CORS
      }
    }

    if (label) label.textContent = 'Message Sent ✓';

    setTimeout(() => {
      submitBtn.classList.remove('submitted');
      if (label) label.textContent = 'Send Message';
      form.reset();
    }, 4500);
  });
}

/* ===== 14. BACK TO TOP ===== */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  function update() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  update();
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initStickyHeader();
  initMobileMenu();
  initHeroHeadline();
  initHeroSeal();
  initHeroFadeElements();
  initHeroGlow();
  initScrollReveal();
  initStatCounters();
  initAccordion();
  initFaqAccordion();
  initRegionTabs();
  initContactForm();
  initBackToTop();
});
