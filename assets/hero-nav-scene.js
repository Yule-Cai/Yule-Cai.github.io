/* v2.7 — Bidirectional pointer-scrubbed conceptual navigation scenario.
   The map is an illustration of planning, blockage detection, replanning,
   and recovery; it is not experimental data or a physics simulation. */
(() => {
  'use strict';
  const title = document.getElementById('intro-title');
  const stage = title?.closest('.hero-lens-stage');
  const overlay = stage?.querySelector('.hero-lens-overlay');
  const caption = stage?.querySelector('.hero-lens-orbit-label');
  const touchToggle = stage?.querySelector('.hero-lens-touch-toggle');
  if (!title || !stage || !overlay || !caption || !touchToggle || !window.matchMedia) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  const clamp = (x, min = 0, max = 1) => Math.max(min, Math.min(max, x));
  const ramp = (x, start, end) => clamp((x - start) / (end - start));
  const trans = {
    en: [
      ['01 / PATH PLANNING','Initial route','Planned route · obstacle-free'],
      ['02 / EXECUTION','Progress monitored','Robot following planned route'],
      ['03 / OBSTRUCTION','Progress stalled','New obstacle blocks the route'],
      ['04 / REPLANNING','Alternative found','Detour avoids the blocked cell'],
      ['05 / RECOVERY','Goal reached','Recovered route reaches the goal']
    ],
    zh: [
      ['01 / 路径规划','初始路线','规划一条可行路径'],
      ['02 / 执行监测','执行中','机器人沿规划路线前进'],
      ['03 / 遇到障碍','检测到停滞','新障碍阻断原路线'],
      ['04 / 重新规划','找到替代路线','沿新的航点绕过障碍'],
      ['05 / 恢复执行','到达目标','恢复路线到达目标点']
    ]
  };
  const lang = () => document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  const scene = document.createElement('div');
  scene.className = 'hero-nav-map nav-phase-plan';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = `
    <header class="nav-hud-head"><span class="nav-hud-kicker">NAV·LAB <b>01</b></span><span class="nav-hud-status"><i></i><span class="nav-status-title">PATH PLANNING</span></span></header>
    <div class="nav-map-frame">
    <svg class="nav-grid-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 218" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="yc-hero-nav-grid-v27" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-width=".9"/></pattern>
      </defs>
      <rect class="nav-grid-ground" x="4" y="2" width="312" height="212" rx="7" fill="url(#yc-hero-nav-grid-v27)"/>
      <g class="nav-world" transform="translate(0 0)">
        <g class="nav-map-structures">
          <rect class="nav-static-obstacle" x="48" y="61" width="35" height="31" rx="3"/>
          <rect class="nav-static-obstacle" x="190" y="151" width="40" height="33" rx="3"/>
          <rect class="nav-static-obstacle" x="244" y="105" width="34" height="31" rx="3"/>
          <rect class="nav-static-obstacle faded" x="14" y="31" width="24" height="22" rx="3"/>
        </g>
        <path class="nav-original-ghost" d="M28 185L72 185L72 133L158 133L158 86L238 86L238 45L291 45"/>
        <path class="nav-route-original" d="M28 185L72 185L72 133L158 133L158 86L238 86L238 45L291 45"/>
        <path class="nav-route-recovery" d="M126 133L126 60L214 60L214 45L291 45"/>
        <g class="nav-dynamic-obstacle">
          <rect class="nav-hazard-halo" x="141" y="111" width="45" height="44" rx="7"/>
          <rect class="nav-hazard-core" x="149" y="119" width="29" height="28" rx="4"/>
          <path class="nav-hazard-cross" d="M155 125L172 142M172 125L155 142"/>
        </g>
        <g class="nav-waypoints">
          <circle cx="72" cy="133" r="3.5"/>
          <circle cx="126" cy="60" r="3.5" class="nav-detour-waypoint"/>
          <circle cx="214" cy="60" r="3.5" class="nav-detour-waypoint"/>
        </g>
        <g class="nav-start"><circle cx="28" cy="185" r="7.2"/><circle cx="28" cy="185" r="2.4"/></g>
        <g class="nav-goal"><circle cx="291" cy="45" r="11.5"/><circle cx="291" cy="45" r="5.5"/><path d="M291 27V34M291 56V63M273 45H280M302 45H309"/></g>
        <g class="nav-bot" transform="translate(28 185)"><circle class="nav-bot-range" r="17"/><circle class="nav-bot-shell" r="9.2"/><path class="nav-bot-direction" d="M0 -6 L4 4 L0 2 L-4 4Z"/><circle class="nav-bot-core" r="2.2"/></g>
      </g>
      <g class="nav-map-legend"><circle class="nav-legend-old" cx="15" cy="12" r="3"/><path class="nav-legend-line" d="M24 12H47"/><circle class="nav-legend-new" cx="60" cy="12" r="3"/></g>
    </svg>
    <div class="nav-coords"><span>LOCAL MAP / 8×6</span><span class="nav-direction">S → G</span></div>
    </div>
    <footer class="nav-hud-footer"><div class="nav-state-row"><span class="nav-state-text">Initial route</span><span class="nav-pct">0%</span></div><div class="nav-progress-track"><span class="nav-progress-fill"></span><span class="nav-progress-ticks"></span></div><p class="nav-state-detail">Planned route · obstacle-free</p></footer>
  `;
  overlay.insertBefore(scene, caption);
  caption.style.display = 'none';
  const $ = (selector) => scene.querySelector(selector);
  const svg = scene.querySelector('svg');
  const world = $('.nav-world');
  const original = $('.nav-route-original');
  const recovery = $('.nav-route-recovery');
  const ghost = $('.nav-original-ghost');
  const bot = $('.nav-bot');
  const hazard = $('.nav-dynamic-obstacle');
  const detourNodes = scene.querySelectorAll('.nav-detour-waypoint');
  const phaseHead = $('.nav-status-title');
  const stateHead = $('.nav-state-text');
  const detail = $('.nav-state-detail');
  const percent = $('.nav-pct');
  const fill = $('.nav-progress-fill');
  const directionLabel = $('.nav-direction');
  const originalLength = original.getTotalLength();
  const recoveryLength = recovery.getTotalLength();
  original.style.strokeDasharray = `${originalLength} ${originalLength}`;
  recovery.style.strokeDasharray = `${recoveryLength} ${recoveryLength}`;

  let progress = 0, orientation = 'ltr', engaged = false, latestClientX = 0, drawFrame = 0;
  let touchControls = null, slider = null, directionButtons = [];
  const choosePhase = p => p < .22 ? 0 : p < .44 ? 1 : p < .62 ? 2 : p < .84 ? 3 : 4;
  const pToFraction = clientX => {
    const bounds = title.getBoundingClientRect();
    const fraction = clamp((clientX - bounds.left) / Math.max(1, bounds.width));
    return orientation === 'ltr' ? fraction : 1 - fraction;
  };
  function render() {
    drawFrame = 0;
    const p = progress;
    const stageIndex = choosePhase(p);
    const [stageLabel, stateLabel, description] = trans[lang()][stageIndex];
    scene.className = `hero-nav-map nav-phase-${['plan','execute','blocked','replan','recover'][stageIndex]}`;
    scene.dataset.direction = orientation;
    scene.dataset.progress = String(Math.round(p * 100));
    world.setAttribute('transform', orientation === 'rtl' ? 'translate(320 0) scale(-1 1)' : 'translate(0 0)');
    directionLabel.textContent = orientation === 'rtl' ? 'G ← S' : 'S → G';
    phaseHead.textContent = stageLabel;
    stateHead.textContent = stateLabel;
    detail.textContent = description;
    const pct = Math.round(p * 100);
    percent.textContent = `${pct}%`;
    fill.style.width = `${pct}%`;
    const drawOriginal = ramp(p, 0, .22);
    original.style.strokeDashoffset = String(originalLength * (1 - drawOriginal));
    const seenHazard = ramp(p, .425, .51);
    hazard.style.opacity = String(seenHazard);
    ghost.style.opacity = String(seenHazard * .46);
    original.style.opacity = String(1 - .58 * seenHazard);
    if (p >= .44) original.classList.add('has-blocked'); else original.classList.remove('has-blocked');
    const drawNew = ramp(p, .62, .84);
    recovery.style.strokeDashoffset = String(recoveryLength * (1 - drawNew));
    recovery.style.opacity = String(drawNew > 0 ? 1 : 0);
    detourNodes.forEach(node => { node.style.opacity = String(drawNew); });
    let point;
    if (p < .22) point = original.getPointAtLength(0);
    else if (p < .44) point = original.getPointAtLength(originalLength * .371 * ramp(p, .22, .44));
    else if (p < .84) point = original.getPointAtLength(originalLength * .371);
    else point = recovery.getPointAtLength(recoveryLength * ramp(p, .84, 1));
    bot.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
    bot.style.opacity = p >= .44 && p < .62 ? '.93' : '1';
    scene.style.setProperty('--nav-danger-strength', String(seenHazard));
    scene.style.setProperty('--nav-recovery-strength', String(drawNew));
    stage.dataset.navPhase = ['plan','execute','blocked','replan','recover'][stageIndex];
    stage.dataset.navDirection = orientation;
    if (slider && Number(slider.value) !== pct) slider.value = String(pct);
    const output = touchControls?.querySelector('output');
    if (output) output.textContent = `${pct}% · ${stateLabel}`;
    directionButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.dir === orientation)));
  }
  const schedule = () => { if (!drawFrame) drawFrame = requestAnimationFrame(render); };
  const setProgress = value => { progress = clamp(value); schedule(); };
  const setOrientation = dir => { orientation = dir === 'rtl' ? 'rtl' : 'ltr'; schedule(); };
  function enterAt(clientX) {
    const bounds = title.getBoundingClientRect();
    // Choose direction once per hover session, before calculating progress.
    orientation = clientX > bounds.left + bounds.width / 2 ? 'rtl' : 'ltr';
    engaged = true;
    setProgress(pToFraction(clientX));
  }
  title.addEventListener('pointerenter', event => {
    if (fine.matches && (event.pointerType === 'mouse' || event.pointerType === 'pen')) enterAt(event.clientX);
  });
  title.addEventListener('pointermove', event => {
    if (!fine.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
    if (!engaged) enterAt(event.clientX);
    latestClientX = event.clientX;
    setProgress(pToFraction(latestClientX));
  });
  title.addEventListener('pointerleave', () => { engaged = false; });
  window.addEventListener('blur', () => { engaged = false; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) engaged = false; });
  window.addEventListener('resize', () => { if (engaged) setProgress(pToFraction(latestClientX)); });
  new MutationObserver(schedule).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  // Touch devices: no autoplay; the user drags through the same state timeline.
  touchControls = document.createElement('div');
  touchControls.className = 'nav-touch-controls';
  touchControls.innerHTML = `
    <div class="nav-touch-top"><label for="hero-navigation-progress">Route progress / 路径进度</label><output for="hero-navigation-progress">0%</output></div>
    <input type="range" id="hero-navigation-progress" min="0" max="100" value="0" step="1" aria-label="Scrub the path-planning and recovery sequence"/>
    <div class="nav-touch-options" role="group" aria-label="Route direction">
      <button class="nav-touch-direction" type="button" data-dir="ltr" aria-pressed="true">S → G</button>
      <button class="nav-touch-direction" type="button" data-dir="rtl" aria-pressed="false">G ← S</button>
      <span class="nav-touch-hint">Drag to explore · 拖动查看</span>
    </div>`;
  stage.appendChild(touchControls);
  slider = touchControls.querySelector('input[type="range"]');
  directionButtons = Array.from(touchControls.querySelectorAll('[data-dir]'));
  slider.addEventListener('input', () => setProgress(Number(slider.value) / 100));
  directionButtons.forEach(btn => btn.addEventListener('click', () => setOrientation(btn.dataset.dir)));
  touchToggle.addEventListener('click', () => {
    // The existing spotlight toggle updates aria-pressed synchronously.
    const opened = touchToggle.getAttribute('aria-pressed') === 'true';
    if (opened) {setOrientation('ltr');setProgress(0);}
    const text = touchToggle.querySelector('.lens-toggle-text');
    if (text) text.textContent = opened
      ? (lang() === 'zh' ? '收起导航演示' : 'Hide navigation demo')
      : (lang() === 'zh' ? '体验路径重规划' : 'Explore route recovery');
  });
  function refreshLabels() {
    const text = touchToggle.querySelector('.lens-toggle-text');
    if (text) text.textContent = touchToggle.getAttribute('aria-pressed') === 'true'
      ? (lang() === 'zh' ? '收起导航演示' : 'Hide navigation demo')
      : (lang() === 'zh' ? '体验路径重规划' : 'Explore route recovery');
    const l = touchControls.querySelector('label');
    if (l) l.textContent = lang() === 'zh' ? '路径进度' : 'Route progress';
    schedule();
  }
  new MutationObserver(refreshLabels).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  // On coarse pointers the spotlight is a static card; the range input is the sole progress driver.
  if (coarse.matches) setProgress(0);
  render();
})();