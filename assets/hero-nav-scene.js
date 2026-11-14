/* v2.6 · Conceptual route planning, progress-loss detection and recovery.
   Decorative SVG: not a real simulation or a claim about experiment results. */
(() => {
  'use strict';
  const title = document.getElementById('intro-title');
  const stage = title?.closest('.hero-lens-stage');
  const overlay = stage?.querySelector('.hero-lens-overlay');
  const label = stage?.querySelector('.hero-lens-orbit-label');
  const touchToggle = stage?.querySelector('.hero-lens-touch-toggle');
  if (!title || !stage || !overlay || !label || !touchToggle || !window.matchMedia) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const map = document.createElement('div');
  map.className = 'hero-nav-map nav-phase-plan';
  map.setAttribute('aria-hidden', 'true');
  map.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 190" focusable="false" aria-hidden="true">
    <defs><pattern id="yc-nav-grid-v26" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-width=".8"/></pattern></defs>
    <rect class="hero-nav-grid" x="6" y="4" width="208" height="180" fill="url(#yc-nav-grid-v26)"/>
    <rect class="hero-nav-block" x="92" y="103" width="37" height="30" rx="4"/>
    <rect class="hero-nav-static-block" x="140" y="30" width="28" height="25" rx="3"/>
    <path class="hero-nav-route-original" d="M24 162H75V118H145V72H200"/>
    <path class="hero-nav-route-recovery" d="M24 162H52V84H167V72H200"/>
    <circle class="hero-nav-danger" cx="111" cy="118" r="18"/>
    <g class="hero-nav-agent"><circle class="hero-nav-agent-outer" cx="24" cy="162" r="10"/><circle class="hero-nav-agent-center" cx="24" cy="162" r="3.5"/></g>
    <circle class="hero-nav-goal" cx="200" cy="72" r="8"/>
    <path class="hero-nav-crosshair" d="M200 62V82M190 72H210"/>
    <text class="hero-nav-waypoint-label" x="12" y="181">S</text>
    <text class="hero-nav-waypoint-label" x="202" y="54">G</text>
  </svg>`;
  overlay.insertBefore(map, label);

  const phases = ['plan', 'blocked', 'recover'];
  const labels = {
    en: ['PATH FOUND', 'PROGRESS STALLED', 'RECOVERY ROUTE'],
    zh: ['路径已规划', '检测到停滞', '恢复路线']
  };
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let phaseTimer = null;
  let currentPhase = 0;
  let running = false;
  const lang = () => document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  const clearPhaseTimer = () => { if (phaseTimer !== null) { window.clearTimeout(phaseTimer); phaseTimer = null; } };

  function syncCopy() {
    label.textContent = labels[lang()][currentPhase];
    const caption = touchToggle.querySelector('.lens-toggle-text');
    if (caption) caption.textContent = touchToggle.getAttribute('aria-pressed') === 'true'
      ? (lang() === 'zh' ? '收起导航演示' : 'Hide navigation demo')
      : (lang() === 'zh' ? '体验路径重规划' : 'Explore route recovery');
    touchToggle.setAttribute('aria-label', lang() === 'zh' ? '切换导航恢复演示' : 'Toggle navigation recovery preview');
  }
  function phaseTo(index) {
    currentPhase = index;
    map.classList.remove('nav-phase-plan', 'nav-phase-blocked', 'nav-phase-recover');
    map.classList.add('nav-phase-' + phases[index]);
    stage.dataset.navPhase = phases[index];
    syncCopy();
    clearPhaseTimer();
    // One deliberate sequence rather than an infinite animation loop.
    if (running && index < 2) phaseTimer = window.setTimeout(() => phaseTo(index + 1), index === 0 ? 1750 : 1350);
  }
  function start() {
    clearPhaseTimer();
    running = true;
    phaseTo(0);
  }
  function stop() { running = false; clearPhaseTimer(); }
  title.addEventListener('pointerenter', () => { if (finePointer.matches) start(); });
  title.addEventListener('pointerleave', stop);
  touchToggle.addEventListener('click', () => {
    // The existing spotlight handler has already toggled aria-pressed.
    if (touchToggle.getAttribute('aria-pressed') === 'true') start();
    else stop();
    syncCopy();
  });
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  const classObserver = new MutationObserver(() => { if (!stage.classList.contains('is-revealing')) stop(); });
  classObserver.observe(stage, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(syncCopy).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  syncCopy();
})();