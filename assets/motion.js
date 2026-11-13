/* Lightweight cross-page fallback + same-page arrival cue.
   Navigation remains a normal link: browser back, opening in new tabs,
   external URLs and reduced-motion preferences all work as expected. */
(() => {
  'use strict';
  const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const nativeTransition = typeof document.startViewTransition === 'function';
  const pendingKey = 'yule-internal-navigation';
  let navigating = false;

  if (!nativeTransition && !reduced()) {
    try {
      if (sessionStorage.getItem(pendingKey) === location.pathname) {
        document.documentElement.classList.add('motion-entering');
        sessionStorage.removeItem(pendingKey);
      }
    } catch { /* restricted storage: normal navigation remains available */ }
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    let next;
    try { next = new URL(link.href, location.href); } catch { return; }
    if (next.origin !== location.origin || !/^https?:$/.test(next.protocol)) return;

    // Let the browser perform native anchor navigation (and URL history changes).
    // A subtle highlight shows which section was reached.
    if (next.pathname === location.pathname && next.search === location.search) {
      if (next.hash && !reduced()) {
        let id;
        try { id = decodeURIComponent(next.hash.slice(1)); } catch { return; }
        const section = document.getElementById(id);
        if (section) {
          section.classList.remove('section-arriving');
          // On a reopened link, restart the cue without shifting the layout.
          void section.offsetWidth;
          section.classList.add('section-arriving');
          window.setTimeout(() => section.classList.remove('section-arriving'), 620);
        }
      }
      return;
    }
    // The browser's native cross-document transition handles modern engines.
    // Reduced-motion users always receive ordinary immediate navigation.
    if (nativeTransition || reduced() || navigating) return;
    if (!/\/$|\.html$/i.test(next.pathname)) return;
    navigating = true;
    event.preventDefault();
    try { sessionStorage.setItem(pendingKey, next.pathname); } catch {}
    document.documentElement.classList.add('motion-leaving');
    window.setTimeout(() => location.assign(next.href), 150);
  });

  window.addEventListener('pageshow', () => {
    navigating = false;
    document.documentElement.classList.remove('motion-leaving');
  });
})();