/* ──────────────────────────────────────────────────────────────
   N10 Academy — site announcement bar
   Slim, dismissible strip pinned above the fixed nav. Dismissal is
   remembered per announcement version (bump VERSION to show it again).
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var VERSION   = '2026-09-10-schedule';          // bump to re-show after dismissals
  var KEY       = 'n10-announce-dismissed';
  var LINK_HREF = 'programmes.html#weekly-schedule';
  var LINK_TEXT = 'See the schedule';
  var MESSAGE   = 'Training schedule updated — from Thu 10 Sep 2026, Thursday first team trains at Tottenham Powerleague, N17.';

  try { if (localStorage.getItem(KEY) === VERSION) return; } catch (e) { /* private mode */ }

  function injectStyles() {
    if (document.getElementById('n10ann-styles')) return;
    var css = [
      '.n10ann{position:fixed;top:0;left:0;right:0;z-index:9990;background:#F5C518;color:#0A0A0B;',
        'font-family:Inter,system-ui,sans-serif;border-bottom:1px solid rgba(10,10,11,.18)}',
      '.n10ann-inner{max-width:80rem;margin:0 auto;padding:8px 44px 8px 16px;position:relative;',
        'display:flex;align-items:center;justify-content:center;gap:10px;min-height:24px}',
      '.n10ann-text{margin:0;font-size:12.5px;line-height:1.45;font-weight:500;text-align:center}',
      '.n10ann-link{color:#0A0A0B;font-weight:700;text-decoration:underline;text-underline-offset:2px;white-space:nowrap}',
      '.n10ann-link:hover{text-decoration-thickness:2px}',
      '.n10ann-link:focus-visible{outline:2px solid #0A0A0B;outline-offset:2px;border-radius:2px}',
      '.n10ann-close{position:absolute;top:50%;right:8px;transform:translateY(-50%);',
        'width:28px;height:28px;display:flex;align-items:center;justify-content:center;',
        'background:transparent;border:0;color:#0A0A0B;font-size:20px;line-height:1;cursor:pointer;',
        'border-radius:6px;opacity:.7;transition:opacity .18s ease,background-color .18s ease}',
      '.n10ann-close:hover{opacity:1;background:rgba(10,10,11,.10)}',
      '.n10ann-close:focus-visible{outline:2px solid #0A0A0B;outline-offset:1px;opacity:1}',
      '@media (max-width:640px){.n10ann-inner{padding:7px 40px 7px 12px}.n10ann-text{font-size:12px}}'
    ].join('');
    var el = document.createElement('style');
    el.id = 'n10ann-styles';
    el.textContent = css;
    document.head.appendChild(el);
  }

  function build() {
    injectStyles();
    if (document.getElementById('n10ann-bar')) return;

    var bar = document.createElement('div');
    bar.className = 'n10ann';
    bar.id = 'n10ann-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Site announcement');
    bar.innerHTML =
      '<div class="n10ann-inner">' +
        '<p class="n10ann-text">' + MESSAGE +
          ' <a class="n10ann-link" href="' + LINK_HREF + '">' + LINK_TEXT + '</a></p>' +
        '<button type="button" class="n10ann-close" aria-label="Dismiss announcement">×</button>' +
      '</div>';
    document.body.insertBefore(bar, document.body.firstChild);

    var nav = document.getElementById('navbar');

    function applyOffset() {
      var h = bar.offsetHeight;
      if (nav) nav.style.top = h + 'px';
      document.body.style.paddingTop = h + 'px';
    }
    function clearOffset() {
      if (nav) nav.style.top = '';
      document.body.style.paddingTop = '';
    }
    applyOffset();
    window.addEventListener('resize', applyOffset, { passive: true });

    bar.querySelector('.n10ann-close').addEventListener('click', function () {
      try { localStorage.setItem(KEY, VERSION); } catch (e) {}
      window.removeEventListener('resize', applyOffset);
      bar.remove();
      clearOffset();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
