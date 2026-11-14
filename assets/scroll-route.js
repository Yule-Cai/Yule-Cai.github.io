/* v2.8 — Scroll-pinned conceptual robot-navigation demonstration.
 * Native document scrolling drives progress; no wheel/touch scroll is canceled.
 * A sticky scene stays in view until the short story has progressed, then releases.
 * The diagram is illustrative only, never an experimental result.
 */
(() => {
  'use strict';
  const root = document.getElementById('route-story');
  const pin = root?.querySelector('.route-story-sticky');
  const viewport = root?.querySelector('.route-story-viewport');
  if (!root || !pin || !viewport) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = x => Math.max(0, Math.min(1, x));
  const ramp = (x, start, end) => clamp((x - start) / (end - start));
  const phaseIndex = p => p < .19 ? 0 : p < .40 ? 1 : p < .58 ? 2 : p < .81 ? 3 : 4;
  const steps = {
    en: [
      ['PLANNING','Plan the route','Find a traversable path from start to goal.'],
      ['EXECUTION','Follow the plan','A robot follows the planned waypoints while monitoring progress.'],
      ['BLOCKED','Detect the obstacle','A newly blocked corridor interrupts the original route.'],
      ['REPLANNING','Choose another path','The planned route is revised to avoid the obstruction.'],
      ['RECOVERED','Continue to the goal','The robot follows the recovered route toward its target.']
    ],
    zh: [
      ['规划阶段','规划初始路径','在起点与目标点之间寻找可行路径。'],
      ['执行阶段','沿路径执行','机器人跟随航点行进，并持续监测执行进展。'],
      ['遇到障碍','识别路径阻断','新增障碍使原本可行的路线受阻。'],
      ['重新规划','寻找替代路径','通过新的航点绕开受阻区域。'],
      ['恢复执行','继续前往目标','机器人沿恢复路线继续前进。']
    ]
  };
  const words = {
    en: {eyebrow:'INTERACTIVE / ROBOT NAVIGATION',hint:'SCROLL TO ADVANCE ↓',headline:'When the route fails, <em>the plan changes.</em>',lead:'A conceptual walkthrough of how navigation adapts when an initially valid route becomes blocked.',fallback:'Start → Plan → Obstacle → Replan → Recover',notice:'Illustrative navigation sequence · Not experimental footage',footer:'Scroll down to advance · Scroll up to revisit',skip:'Skip demonstration ↘'},
    zh: {eyebrow:'交互演示 / 机器人导航',hint:'向下滚动推进 ↓',headline:'当路线失效，<em>重新规划才能继续。</em>',lead:'通过概念演示，观察机器人如何在既定路径受阻后调整导航方案。',fallback:'起点 → 规划 → 遇阻 → 重规划 → 恢复',notice:'概念性导航演示 · 非真实实验录像',footer:'下滑推进动画 · 上滑回看阶段',skip:'跳过演示 ↘'}
  };
  const scene = document.createElement('div');
  scene.className = 'route-story-scene nav-phase-plan';
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
  viewport.replaceChildren(scene);
  const $ = s => scene.querySelector(s);
  const original = $('.nav-route-original');
  const recovery = $('.nav-route-recovery');
  const ghost = $('.nav-original-ghost');
  const bot = $('.nav-bot');
  const hazard = $('.nav-dynamic-obstacle');
  const waypoints = scene.querySelectorAll('.nav-detour-waypoint');
  const originalLength = original.getTotalLength();
  const recoveryLength = recovery.getTotalLength();
  original.style.strokeDasharray = `${originalLength} ${originalLength}`;
  recovery.style.strokeDasharray = `${recoveryLength} ${recoveryLength}`;

  const ui = {
    title:root.querySelector('.route-story-stage-title'),
    summary:root.querySelector('.route-story-stage-summary'),
    counter:root.querySelector('.route-story-step-no'),
    badge:root.querySelector('.route-story-state-tag'),
    ticks:[...root.querySelectorAll('.route-story-process span')],
    progress:root.querySelector('.route-story-progress'),
    fill:root.querySelector('.route-story-progress-fill'),
    percent:root.querySelector('.route-story-progress-text'),
    skip:root.querySelector('.route-story-skip'),
    hudStatus:scene.querySelector('.nav-status-title'),
    hudState:scene.querySelector('.nav-state-text'),
    hudDetail:scene.querySelector('.nav-state-detail'),
    hudPercent:scene.querySelector('.nav-pct'),
    hudFill:scene.querySelector('.nav-progress-fill')
  };
  const language = () => document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  let progress=0, previousPhase=-1, previousLanguage='', frame=0;
  function translate() {
    const labels=words[language()];
    root.querySelectorAll('[data-story-i18n]').forEach(el => {
      const name=el.dataset.storyI18n;
      if (name==='headline') el.innerHTML=labels[name];
      else el.textContent=labels[name];
    });
    previousPhase=-1;
    render(progress);
  }
  function render(p) {
    progress=clamp(p);
    const n=phaseIndex(progress);
    const lang=language();
    if (n!==previousPhase || lang!==previousLanguage) {
      const [badge,title,desc]=steps[lang][n];
      scene.className=`route-story-scene nav-phase-${['plan','execute','blocked','replan','recover'][n]}`;
      ui.title.textContent=title;
      ui.summary.textContent=desc;
      ui.counter.textContent=String(n+1).padStart(2,'0')+' / 05';
      ui.badge.textContent=badge;
      ui.hudStatus.textContent=badge;
      ui.hudState.textContent=title;
      ui.hudDetail.textContent=desc;
      ui.ticks.forEach((tick,i)=>tick.classList.toggle('active',i<=n));
      previousPhase=n;previousLanguage=lang;
    }
    const pct=Math.round(progress*100);
    ui.fill.style.width=`${pct}%`;
    ui.progress.setAttribute('aria-valuenow',String(pct));
    ui.percent.textContent=String(pct).padStart(2,'0')+'%';
    ui.hudPercent.textContent=pct+'%';
    ui.hudFill.style.width=pct+'%';
    const oldDraw=ramp(progress,.02,.19);
    original.style.strokeDashoffset=String(originalLength*(1-oldDraw));
    const obstacle=ramp(progress,.395,.50);
    hazard.style.opacity=String(obstacle);
    ghost.style.opacity=String(obstacle*.48);
    original.style.opacity=String(1-.56*obstacle);
    original.classList.toggle('has-blocked',progress>=.40);
    const detour=ramp(progress,.58,.81);
    recovery.style.strokeDashoffset=String(recoveryLength*(1-detour));
    recovery.style.opacity=String(detour>0?1:0);
    waypoints.forEach(node=>node.style.opacity=String(detour));
    let point;
    if(progress<.19) point=original.getPointAtLength(0);
    else if(progress<.40)point=original.getPointAtLength(originalLength*.371*ramp(progress,.19,.40));
    else if(progress<.81)point=original.getPointAtLength(originalLength*.371);
    else point=recovery.getPointAtLength(recoveryLength*ramp(progress,.81,1));
    bot.setAttribute('transform',`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
    scene.style.setProperty('--nav-danger-strength',String(obstacle));
    scene.style.setProperty('--nav-recovery-strength',String(detour));
  }
  function syncFromScroll() {
    frame=0;
    if(reduce.matches) { if(progress!==1)render(1); return; }
    const stickTop=parseFloat(getComputedStyle(pin).top)||0;
    const rect=root.getBoundingClientRect();
    const travel=Math.max(1,root.offsetHeight-pin.offsetHeight);
    render(clamp((stickTop-rect.top)/travel));
  }
  const schedule=()=>{if(!frame)frame=window.requestAnimationFrame(syncFromScroll);};
  ui.skip.addEventListener('click',()=>{
    const target=root.getBoundingClientRect().bottom+window.scrollY-((parseFloat(getComputedStyle(pin).top)||0)+5);
    // Temporarily override the site's smooth-anchor rule for an immediate escape.
    const doc=document.documentElement;
    const prior=doc.style.scrollBehavior;
    doc.style.scrollBehavior='auto';
    window.scrollTo(0,target);
    requestAnimationFrame(()=>{doc.style.scrollBehavior=prior;});
    schedule();
  });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
  new MutationObserver(()=>{translate();schedule();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  reduce.addEventListener?.('change',()=>{root.classList.toggle('story-reduced',reduce.matches);schedule();});
  root.classList.add('story-ready');
  root.classList.toggle('story-reduced',reduce.matches);
  translate();schedule();
})();