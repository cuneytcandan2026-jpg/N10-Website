/* ──────────────────────────────────────────────────────────────
   N10 Academy — cookie consent gate
   GA4 (gtag.js) is NOT loaded until the visitor opts in.
   Choice is stored in localStorage ('granted' | 'denied') and can
   be changed any time via the "Cookie settings" link.
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var GA_ID       = 'G-DW24YN524V';
  var STORAGE_KEY = 'n10-cookie-consent';   // 'granted' | 'denied'
  var PRIVACY_URL = 'privacy.html';

  /* ---- persistence ------------------------------------------------ */
  function readChoice() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* private mode */ }
  }
  function clearGaCookies() {
    var names = ['_ga', '_ga_' + GA_ID.replace(/^G-/, ''), '_gid', '_gat'];
    var host  = location.hostname;
    var domains = [host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    names.forEach(function (n) {
      domains.forEach(function (d) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
      });
      document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  }

  /* ---- GA4 loader ----------------------------------------------- */
  function loadGA() {
    if (window.__n10GaLoaded) return;
    window.__n10GaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  /* ---- styles -------------------------------------------------- */
  function injectStyles() {
    if (document.getElementById('n10cc-styles')) return;
    var css = [
      '.n10cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;',
        'display:flex;justify-content:center;padding:16px;pointer-events:none}',
      '.n10cc-card{pointer-events:auto;max-width:560px;width:100%;',
        'background:#1C1C21;color:#F8F8FA;border:1px solid rgba(248,248,250,.10);',
        'border-top:2px solid #E30513;border-radius:14px;',
        'box-shadow:0 24px 60px rgba(0,0,0,.55),0 4px 14px rgba(227,5,19,.10);',
        'padding:20px 22px;font-family:Inter,system-ui,sans-serif;',
        'transform:translateY(12px);opacity:0;transition:transform .32s cubic-bezier(.22,1,.36,1),opacity .32s cubic-bezier(.22,1,.36,1)}',
      '.n10cc-card.n10cc-in{transform:translateY(0);opacity:1}',
      '.n10cc-title{font-size:15px;font-weight:700;margin:0 0 6px;letter-spacing:.01em}',
      '.n10cc-text{font-size:13px;line-height:1.6;color:#9090A0;margin:0 0 16px}',
      '.n10cc-text a{color:#F8F8FA;text-decoration:underline;text-underline-offset:2px}',
      '.n10cc-text a:hover{color:#F5C518}',
      '.n10cc-actions{display:flex;gap:10px;flex-wrap:wrap}',
      '.n10cc-btn{flex:1 1 140px;min-height:44px;padding:10px 18px;border-radius:9px;',
        'font-size:13px;font-weight:600;cursor:pointer;border:1px solid transparent;',
        'transition:transform .18s cubic-bezier(.22,1,.36,1),background-color .18s ease,border-color .18s ease}',
      '.n10cc-btn:active{transform:translateY(1px)}',
      '.n10cc-btn:focus-visible{outline:2px solid #F5C518;outline-offset:2px}',
      '.n10cc-accept{background:#F5C518;color:#0A0A0B}',
      '.n10cc-accept:hover{background:#ffd53d}',
      '.n10cc-reject{background:transparent;color:#F8F8FA;border-color:rgba(248,248,250,.22)}',
      '.n10cc-reject:hover{background:rgba(248,248,250,.06);border-color:rgba(248,248,250,.4)}',
      '.n10cc-settings{position:fixed;left:12px;bottom:12px;z-index:9998;',
        'min-height:32px;display:inline-flex;align-items:center;gap:6px;',
        'padding:6px 12px;border-radius:999px;font-family:Inter,system-ui,sans-serif;',
        'font-size:11px;font-weight:600;letter-spacing:.02em;cursor:pointer;',
        'background:rgba(28,28,33,.82);color:#9090A0;border:1px solid rgba(248,248,250,.10);',
        'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:.55;',
        'transition:opacity .2s ease,color .2s ease,border-color .2s ease}',
      '.n10cc-settings:hover{opacity:1;color:#F8F8FA;border-color:rgba(248,248,250,.28)}',
      '.n10cc-settings:focus-visible{outline:2px solid #F5C518;outline-offset:2px;opacity:1}',
      '@media (max-width:640px){.n10cc-banner{padding:10px}.n10cc-btn{flex:1 1 100%}}',
      '@media (prefers-reduced-motion:reduce){.n10cc-card{transition:none;transform:none;opacity:1}}'
    ].join('');
    var el = document.createElement('style');
    el.id = 'n10cc-styles';
    el.textContent = css;
    document.head.appendChild(el);
  }

  /* ---- banner ------------------------------------------------- */
  var lastFocus = null;

  function removeBanner() {
    var b = document.getElementById('n10cc-banner');
    if (b) b.parentNode.removeChild(b);
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); lastFocus = null; }
  }

  function showBanner() {
    injectStyles();
    if (document.getElementById('n10cc-banner')) return;
    lastFocus = document.activeElement;

    var banner = document.createElement('div');
    banner.className = 'n10cc-banner';
    banner.id = 'n10cc-banner';
    banner.innerHTML =
      '<div class="n10cc-card" role="dialog" aria-modal="false" aria-labelledby="n10cc-title" aria-describedby="n10cc-text">' +
        '<p class="n10cc-title" id="n10cc-title">Cookies on this site</p>' +
        '<p class="n10cc-text" id="n10cc-text">We use Google Analytics cookies to understand how visitors use ' +
          'the site so we can improve it. These are only set if you accept. Essential cookies needed for the ' +
          'site to work are always on. See our <a href="' + PRIVACY_URL + '">Privacy Policy</a>.</p>' +
        '<div class="n10cc-actions">' +
          '<button type="button" class="n10cc-btn n10cc-accept" id="n10cc-accept">Accept analytics cookies</button>' +
          '<button type="button" class="n10cc-btn n10cc-reject" id="n10cc-reject">Reject non-essential</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    var card = banner.querySelector('.n10cc-card');
    requestAnimationFrame(function () { card.classList.add('n10cc-in'); });

    var acceptBtn = banner.querySelector('#n10cc-accept');
    var rejectBtn = banner.querySelector('#n10cc-reject');
    acceptBtn.focus();

    acceptBtn.addEventListener('click', function () {
      saveChoice('granted');
      removeBanner();
      loadGA();
      ensureSettingsLink();
    });
    rejectBtn.addEventListener('click', function () {
      var hadConsent = readChoice() === 'granted';
      saveChoice('denied');
      removeBanner();
      ensureSettingsLink();
      if (hadConsent || window.__n10GaLoaded) { clearGaCookies(); location.reload(); }
    });

    // keep focus inside the dialog
    banner.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = [acceptBtn, rejectBtn];
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
  }

  /* ---- persistent "Cookie settings" control ------------------ */
  function ensureSettingsLink() {
    injectStyles();
    if (document.getElementById('n10cc-settings')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'n10cc-settings';
    btn.className = 'n10cc-settings';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.textContent = 'Cookie settings';
    btn.addEventListener('click', showBanner);
    document.body.appendChild(btn);
  }

  /* ---- boot ------------------------------------------------- */
  function init() {
    var choice = readChoice();
    if (choice === 'granted') { loadGA(); ensureSettingsLink(); return; }
    if (choice === 'denied')  { ensureSettingsLink(); return; }
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
