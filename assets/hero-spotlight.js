/* v2.3 | Progressive enhancement for the homepage intro title.
   The original h2 remains readable to browsers and assistive technologies.
   The overlay is a visual clone and is excluded from the accessibility tree. */
(() => {
  'use strict';
  const title = document.getElementById('intro-title');
  if (!title || !window.matchMedia || !window.requestAnimationFrame) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  const stage = document.createElement('div');
  stage.className = 'hero-lens-stage';
  title.parentNode.insertBefore(stage, title);
  stage.appendChild(title);

  const overlay = document.createElement('div');
  overlay.className = 'hero-lens-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  const pattern = document.createElement('div');
  pattern.className = 'hero-lens-pattern';
  ['MOTION · PLAN · CONSTRAINTS', 'VERIFY · AUDIT · ADAPT', 'MULTI-ROBOT · COORDINATE', 'MOTION · PLAN · CONSTRAINTS', 'VERIFY · AUDIT · ADAPT', 'MULTI-ROBOT · COORDINATE'].forEach(str => {
    const line = document.createElement('span');
    line.textContent = str;
    pattern.appendChild(line);
  });
  const copy = document.createElement('h2');
  copy.className = 'intro-title hero-lens-copy';
  copy.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'hero-lens-orbit-label';
  label.textContent = 'PLAN  /  VERIFY  /  COORDINATE';
  overlay.append(pattern, copy, label);
  stage.appendChild(overlay);

  let targetX = 0, targetY = 0, targetR = 0;
  let x = 0, y = 0, r = 0;
  let frame = 0;
  let active = false;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  let tapButton = null;

  function fitOverlay() {
    // Keep the reveal canvas within the viewport to avoid horizontal scrolling.
    if (window.matchMedia('(max-width: 760px)').matches) {
      overlay.style.removeProperty('left');
      overlay.style.removeProperty('right');
      return;
    }
    const bounds = stage.getBoundingClientRect();
    overlay.style.left = `-${Math.min(154, Math.max(0, bounds.left - 8))}px`;
    overlay.style.right = `-${Math.min(154, Math.max(0, window.innerWidth - bounds.right - 8))}px`;
  }
  function syncCopy() {
    fitOverlay();
    copy.innerHTML = title.innerHTML;
    const a = title.getBoundingClientRect();
    const b = overlay.getBoundingClientRect();
    copy.style.left = `${a.left - b.left}px`;
    copy.style.top = `${a.top - b.top}px`;
    copy.style.width = `${a.width}px`;
    copy.style.minHeight = `${a.height}px`;
  }
  function radius() {
    // A slightly smaller lens keeps the map and its caption legible.
    return Math.round(Math.min(202, Math.max(142, window.innerWidth * .14)));
  }
  function safeLensPosition(clientX, clientY, bounds) {
    // Keep the full circle on the overlay rather than clipping its label at edges.
    const maxR = Math.max(70, Math.min(radius(), bounds.width / 2 - 10, bounds.height / 2 - 10));
    const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
    return {
      x: clamp(clientX - bounds.left, maxR + 8, bounds.width - maxR - 8),
      y: clamp(clientY - bounds.top, maxR + 8, bounds.height - maxR - 8),
      radius: maxR
    };
  }
  function tick() {
    frame = 0;
    const ease = .24;
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    r += (targetR - r) * .22;
    const done = Math.abs(targetX - x) < .35 && Math.abs(targetY - y) < .35 && Math.abs(targetR - r) < .35;
    if (done) { x=targetX; y=targetY; r=targetR; }
    overlay.style.clipPath = `circle(${Math.max(0,r).toFixed(2)}px at ${x.toFixed(2)}px ${y.toFixed(2)}px)`;
    overlay.style.setProperty('--spotlight-x', `${x.toFixed(2)}px`);
    overlay.style.setProperty('--spotlight-y', `${y.toFixed(2)}px`);
    overlay.style.setProperty('--spotlight-label-offset', `${Math.round(Math.min(100, Math.max(78, Math.max(0,r) * .5)))}px`);
    overlay.style.setProperty('--hero-map-scale', Math.min(.94, Math.max(.62, (Math.max(0,r)-18)/195)).toFixed(3));
    overlay.style.setProperty('--hero-label-offset', `${Math.round(Math.min(100, Math.max(78, Math.max(0,r) * .5)))}px`);
    overlay.style.setProperty('--hero-label-width', `${Math.round(Math.min(270, Math.max(145, Math.max(0,r) * 1.75 - 20)))}px`);
    if (!active && r < .4) stage.classList.remove('is-revealing');
    if (!done) frame = requestAnimationFrame(tick);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(tick); }
  function revealAt(clientX, clientY) {
    const bounds = overlay.getBoundingClientRect();
    const pos = fine.matches ? safeLensPosition(clientX, clientY, bounds) : {x: clientX - bounds.left, y: clientY - bounds.top, radius: radius()};
    targetX = pos.x;
    targetY = pos.y;
    if (!active) {
      // Resume smoothly if the user comes back before the lens closes.
      const resuming = r > .5 && stage.classList.contains('is-revealing');
      if (!resuming) { x = targetX; y = targetY; r = 0; }
      active = true;
      stage.classList.add('is-revealing');
      syncCopy();
      stage.dispatchEvent(new Event('yc-hero-open'));
    }
    targetR = pos.radius;
    schedule();
  }
  function conceal() {
    if (!active) return;
    active = false;
    targetR = 0;
    if (tapButton) tapButton.setAttribute('aria-pressed','false');
    stage.dispatchEvent(new Event('yc-hero-close'));
    if (coarse.matches) {
      // Touch preview uses clip-path:none, so a collapsing circle cannot hide it.
      if (frame) cancelAnimationFrame(frame);
      frame = 0; r = 0;
      stage.classList.remove('is-revealing');
      overlay.style.clipPath = 'circle(0px at 50% 50%)';
      return;
    }
    schedule();
  }

  title.addEventListener('pointerenter', e => {
    if (fine.matches && (e.pointerType === 'mouse' || e.pointerType === 'pen')) revealAt(e.clientX, e.clientY);
  });
  title.addEventListener('pointermove', e => {
    if (fine.matches && (e.pointerType === 'mouse' || e.pointerType === 'pen')) revealAt(e.clientX, e.clientY);
  });
  title.addEventListener('pointerleave', conceal);
  window.addEventListener('blur', conceal);
  document.addEventListener('visibilitychange', () => { if (document.hidden) conceal(); });

  tapButton = document.createElement('button');
  tapButton.type = 'button';
  tapButton.className = 'hero-lens-touch-toggle';
  tapButton.setAttribute('aria-pressed','false');
  tapButton.innerHTML = '<span class="lens-toggle-dot" aria-hidden="true"></span><span class="lens-toggle-text">Explore the unknown</span>';
  stage.appendChild(tapButton);
  function syncButtonLanguage() {
    const zh = document.documentElement.lang.toLowerCase().startsWith('zh');
    const label = zh ? '探索隐藏视角' : 'Explore the unknown';
    tapButton.querySelector('.lens-toggle-text').textContent = label;
    tapButton.setAttribute('aria-label', zh ? '切换标题聚光镜效果' : 'Toggle title spotlight');
  }
  tapButton.addEventListener('click', () => {
    if (!coarse.matches) return;
    if (active) conceal();
    else {
      const a = title.getBoundingClientRect();
      revealAt(a.left + a.width*.6, a.top + a.height*.5);
      tapButton.setAttribute('aria-pressed','true');
    }
  });

  const observer = new MutationObserver(() => { syncCopy(); syncButtonLanguage(); });
  observer.observe(title,{subtree:true,childList:true,characterData:true});
  const langObserver = new MutationObserver(syncButtonLanguage);
  langObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('resize', () => { syncCopy(); if (active) {conceal();} }, {passive:true});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncCopy).catch(() => {});
  if (window.ResizeObserver) new ResizeObserver(syncCopy).observe(title);
  reduced.addEventListener?.('change', () => { if (reduced.matches) { conceal(); stage.classList.remove('is-revealing'); } });
  syncCopy(); syncButtonLanguage();
})();