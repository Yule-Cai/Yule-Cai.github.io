/* v3.0 — Three complementary research themes, not one proven system.
   Conceptual hero illustration only; no experimental data or actual trajectories. */
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
  map.className = 'hero-nav-map research-phase-plan';
  map.setAttribute('aria-hidden', 'true');
  map.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 222" focusable="false" aria-hidden="true">
    <defs>
      <pattern id="yc-hero-research-grid-v30" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="currentColor" stroke-width=".75"/></pattern>
      <linearGradient id="yc-hero-route-v30" x1="0" x2="1"><stop offset="0" stop-color="#79d8ed"/><stop offset="1" stop-color="#a9e7cd"/></linearGradient>
    </defs>
    <rect x="2" y="2" width="276" height="218" rx="17" class="research-grid-panel"/>
    <rect x="9" y="12" width="262" height="196" rx="11" fill="url(#yc-hero-research-grid-v30)" class="research-grid"/>
    <path d="M18 45H263M18 178H263" class="research-panel-line"/>
    <circle cx="21" cy="25" r="3" class="research-led"/>
    <text x="31" y="29" class="research-head-label">ROBOT AUTONOMY / RESEARCH THEMES</text>
    <text x="20" y="198" class="research-footer-label">CONCEPT ILLUSTRATION · NOT TEST DATA</text>
    <g class="research-scene research-scene-plan">
      <rect x="107" y="76" width="42" height="30" rx="6" class="research-static-obstacle"/>
      <rect x="171" y="117" width="30" height="30" rx="5" class="research-static-obstacle"/>
      <path d="M43 158L75 158L75 116L91 116L91 64L162 64L162 97L222 97" class="research-route-muted"/>
      <path d="M43 158L75 158L75 116L91 116L91 64L162 64L162 97L222 97" class="research-route-primary research-trace"/>
      <circle cx="43" cy="158" r="10" class="research-robot"/><path d="M43 152v12M37 158h12" class="research-robot-core"/>
      <circle cx="222" cy="97" r="9" class="research-goal"/>
      <path d="M222 84V110M209 97H235" class="research-goal-cross"/>
      <text x="29" y="178" class="research-node-caption">START</text><text x="205" y="124" class="research-node-caption">GOAL</text>
      <rect x="106" y="151" width="108" height="20" rx="10" class="research-chip"/>
      <text x="160" y="165" text-anchor="middle" class="research-chip-text">KINEMATIC PLANNING</text>
    </g>
    <g class="research-scene research-scene-verify">
      <path d="M32 145H79L112 111H239" class="research-route-muted"/>
      <rect x="112" y="86" width="56" height="54" rx="7" class="research-rule-zone"/>
      <path d="M32 145H79L112 111H239" class="research-route-rejected"/>
      <path d="M32 145H75L94 163H183L201 146H238" class="research-route-accepted research-trace"/>
      <circle cx="49" cy="145" r="9" class="research-robot"/>
      <path d="M49 139v12M43 145h12" class="research-robot-core"/>
      <path d="M125 97L155 127M155 97L125 127" class="research-rule-cross"/>
      <path d="M222 61l17 9v17q-3 19-17 24-14-5-17-24V70Z" class="research-shield"/>
      <path d="m214 86 6 6 11-15" class="research-shield-check"/>
      <rect x="24" y="58" width="117" height="20" rx="10" class="research-chip"/>
      <text x="82" y="72" text-anchor="middle" class="research-chip-text">CONSTRAINT CHECK</text>
      <text x="118" y="150" class="research-node-caption">REJECT</text>
      <text x="186" y="173" class="research-node-caption">ADMISSIBLE?</text>
    </g>
    <g class="research-scene research-scene-coordinate">
      <path d="M39 150L91 105L155 105L215 76" class="research-route-coord-a research-trace"/>
      <path d="M39 82L86 141L154 141L215 76" class="research-route-coord-b research-trace"/>
      <circle cx="93" cy="105" r="11" class="research-team-robot-a"/>
      <circle cx="86" cy="141" r="11" class="research-team-robot-b"/>
      <text x="93" y="109" text-anchor="middle" class="research-robot-id">A</text>
      <text x="86" y="145" text-anchor="middle" class="research-robot-id">B</text>
      <path d="M93 105L86 141" class="research-comm-link"/>
      <circle cx="215" cy="76" r="8" class="research-goal"/>
      <path d="M215 64V88M203 76H227" class="research-goal-cross"/>
      <path d="M103 112Q126 95 152 111" class="research-signal"/>
      <path d="M101 121Q134 98 162 119" class="research-signal research-signal-two"/>
      <rect x="119" y="153" width="132" height="20" rx="10" class="research-chip"/>
      <text x="185" y="167" text-anchor="middle" class="research-chip-text">TEAM FEEDBACK / RL</text>
      <text x="30" y="68" class="research-node-caption">SHARED GOAL</text>
    </g>
  </svg>`;
  overlay.insertBefore(map, label);

  const phases = ['plan', 'verify', 'coordinate'];
  const labels = {
    en: ['PLAN · FEASIBLE MOTION', 'VERIFY · RUNTIME CONSTRAINTS', 'COORDINATE · TEAM LEARNING'],
    zh: ['规划 · 运动可行性', '验证 · 运行时约束', '协同 · 团队强化学习']
  };
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const language = () => document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  let phaseTimer = null;
  let currentPhase = 0;
  let running = false;
  const clearTimer = () => { if (phaseTimer !== null) { clearTimeout(phaseTimer); phaseTimer = null; } };
  function syncCopy() {
    label.textContent = labels[language()][currentPhase];
    const caption = touchToggle.querySelector('.lens-toggle-text');
    if (caption) caption.textContent = touchToggle.getAttribute('aria-pressed') === 'true'
      ? (language() === 'zh' ? '收起研究演示' : 'Hide research preview')
      : (language() === 'zh' ? '探索机器人研究' : 'Explore robot research');
    touchToggle.setAttribute('aria-label', language() === 'zh' ? '切换机器人研究主题演示' : 'Toggle robot research themes preview');
  }
  function phaseTo(index) {
    currentPhase = index;
    map.classList.remove(...phases.map(p => 'research-phase-' + p));
    map.classList.add('research-phase-' + phases[index]);
    stage.dataset.researchPhase = phases[index];
    syncCopy();
    clearTimer();
    // A single short conceptual sequence, never a persistent infinite animation.
    if (running && index < phases.length - 1) {
      phaseTimer = setTimeout(() => phaseTo(index + 1), index === 0 ? 1900 : 1700);
    }
  }
  const start = () => { running = true; phaseTo(0); };
  const stop = () => { running = false; clearTimer(); };
  title.addEventListener('pointerenter', e => {
    if (finePointer.matches && (e.pointerType === 'mouse' || e.pointerType === 'pen')) start();
  });
  title.addEventListener('pointerleave', stop);
  touchToggle.addEventListener('click', () => {
    if (touchToggle.getAttribute('aria-pressed') === 'true') start();
    else stop();
    syncCopy();
  });
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  const observer = new MutationObserver(() => { if (!stage.classList.contains('is-revealing')) stop(); });
  observer.observe(stage, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(syncCopy).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  syncCopy();
})();