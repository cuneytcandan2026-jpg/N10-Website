// ── Nav scroll state ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const bar1 = document.getElementById('bar1');
const bar2 = document.getElementById('bar2');
const bar3 = document.getElementById('bar3');
let menuOpen = false;

if (hamburger) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.setAttribute('aria-expanded', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    bar1.style.transform = menuOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    bar2.style.opacity = menuOpen ? '0' : '1';
    bar3.style.transform = menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
}

window.closeMobileMenu = function () {
  menuOpen = false;
  if (hamburger) hamburger.setAttribute('aria-expanded', false);
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (bar1) { bar1.style.transform = ''; }
  if (bar2) { bar2.style.opacity = '1'; }
  if (bar3) { bar3.style.transform = ''; }
};

// ── Active nav link detection ──
(function () {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  let slug = filename.replace('.html', '') || 'index';
  if (slug === '' || slug === 'N10-Website') slug = 'index';
  document.querySelectorAll('[data-nav="' + slug + '"]').forEach(function (el) {
    el.classList.add('nav-active');
  });
})();

// ── Scroll reveals ──
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { observer.observe(el); });
})();

// ── FAQ accordion ──
(function () {
  document.querySelectorAll('.faq-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const panel = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isOpen = panel.classList.toggle('open');
      if (item) item.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
      if (icon) icon.textContent = isOpen ? '×' : '+';
    });
  });
})();

// ── Contact form submit feedback ──
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const successMsg = document.getElementById('form-success');
    if (btn) {
      btn.textContent = 'Enquiry Sent!';
      btn.disabled = true;
      btn.style.background = '#1a7a3c';
      btn.style.borderColor = '#1a7a3c';
    }
    if (successMsg) successMsg.classList.remove('hidden');
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.disabled = true;
    });
  });
})();
