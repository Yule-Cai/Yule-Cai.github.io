(() => {
  'use strict';
  const D = window.YULE_DATA;
  const STUDIES = window.YULE_STUDIES || {};
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storage = { getItem(key){ try{return window.localStorage.getItem(key)}catch{return null} }, setItem(key,value){try{window.localStorage.setItem(key,value)}catch{}} };
  const lang = { current: storage.getItem('yule-lang') === 'zh' ? 'zh' : 'en' };
  const words = {
    en: {about:'About', publications:'Publications', research:'Research', experience:'Experience', position:'UNDERGRADUATE RESEARCHER', open:'Open to research collaborations', news:'News <span>& notes</span>', publicationHeading:'Selected <span>publications</span>', researchHeading:'Research <span>& projects</span>', experienceHeading:'Education <span>& service</span>', intro:'Building robots that can <em>reason, adapt, and recover.</em>', caption:'A selection of peer-reviewed work; the complete list is available on Google Scholar.', more:'Explore full publication list', lede:'Research questions and working prototypes, from task recovery to path planning and robotic manipulation.', projects:'SELECTED PROJECTS', footer:'Made for the work, not just the webpage.', paper:'Paper ↗', preview:'Quick preview', cite:'Copy BibTeX', related:'Find related papers ↗', abstract:'Research snapshot', approach:'What this work covers', note:'This preview is an editorial summary, not the original paper. Follow the DOI for the full publication.', first:'First author', co:'Co-first author', full:'View published paper ↗', all:'All', others:'Co-author', original:'Original research', current:'Current', service:'Academic service', education:'Education', copied:'BibTeX copied', close:'Close preview', journal:'Journal'},
    zh: {about:'关于', publications:'论文', research:'研究', experience:'经历', position:'本科研究者', open:'欢迎学术交流与合作', news:'最新<span>动态</span>', publicationHeading:'代表性<span>论文</span>', researchHeading:'研究<span>与项目</span>', experienceHeading:'教育<span>与学术服务</span>', intro:'让机器人学会<em>推理、适应与恢复。</em>', caption:'此处展示部分同行评审论文；完整列表可在 Google Scholar 查阅。',more:'查看完整论文列表',lede:'从任务恢复到路径规划与机器人操作：研究问题、实验和开发中的原型。',projects:'代表性项目',footer:'认真做研究，也认真记录过程。',paper:'论文 ↗',preview:'研究速览',cite:'复制 BibTeX',related:'查找相关论文 ↗',abstract:'研究概述',approach:'研究涉及的内容',note:'这里是方便浏览的简要介绍，并非论文原文；完整内容请通过 DOI 查看。',first:'第一作者',co:'共同第一作者',full:'查看已发表论文 ↗',all:'全部',others:'共同作者',original:'原始研究',current:'在读',service:'学术服务',education:'教育背景',copied:'已复制 BibTeX',close:'关闭预览',journal:'期刊'}
  };
  const w = (key) => words[lang.current][key];
  const img = p => /^https?:\/\//.test(p || '') ? p : `assets/${p}`;
  const paperVisual = (p, modal=false) => {
    if (!p.cover) return `<div class="paper-visual paper-empty${modal?' paper-modal':''}"><span>ORIGINAL FIGURE</span><strong>Awaiting a verified figure</strong><small>See the publisher's article for the paper.</small></div>`;
    const caption = `${p.figure || 'Figure'} · ${p.figureSource || 'Original publication'}`;
    return `<figure class="paper-visual${modal?' paper-modal':''}"><div class="paper-image-frame"><img class="${modal?'modal-cover':'pub-cover'}" src="${escape(p.localCover?img(p.localCover):img(p.cover))}" data-backup="${escape(p.localCover?img(p.cover):(p.backupCover?img(p.backupCover):''))}" data-final="${escape(p.backupCover?img(p.backupCover):'')}" alt="${escape('Original '+(p.figure||'figure')+' from: '+p.title)}" loading="lazy" /></div><figcaption><span>${escape(caption)}</span><a href="${escape(p.figureLink || p.doi)}" target="_blank" rel="noopener noreferrer" aria-label="Source for ${escape(p.title)}">Source ↗</a></figcaption></figure>`;
  };
  const registerFigureFallbacks = (scope=document) => {
    scope.querySelectorAll('.paper-visual img[data-backup]').forEach(el=>{
      el.addEventListener('error',()=>{
        const fallback=el.dataset.backup;
        if(fallback && !el.dataset.fallbackUsed){el.dataset.fallbackUsed='1';el.src=fallback; return;}
        const final=el.dataset.final;
        if(final && !el.dataset.finalUsed && el.src!==final){el.dataset.finalUsed='1';el.src=final;const cap=el.closest('.paper-visual')?.querySelector('figcaption span');if(cap)cap.textContent='Publisher image unavailable — temporary placeholder'; return;}
        const frame=el.closest('.paper-image-frame');if(frame){el.remove();frame.innerHTML='<div class="figure-unavailable">Figure unavailable offline</div>';}
      });
    });
  };
  let currentFilter='all';
  let toastTimer;
  const toast = (msg) => { const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1800); };
  const updateStatic = () => {
    document.documentElement.lang=lang.current==='zh'?'zh-CN':'en';
    document.querySelectorAll('[data-i18n="position"]').forEach(el=>el.textContent=w('position'));
    document.querySelectorAll('[data-i18n="open"]').forEach(el=>el.textContent=w('open'));
    document.querySelector('[data-i18n="news"]').innerHTML=w('news');
    document.querySelector('[data-i18n="publications"]').innerHTML=w('publicationHeading');
    document.querySelector('[data-i18n="research"]').innerHTML=w('researchHeading');
    document.querySelector('[data-i18n="experience"]').innerHTML=w('experienceHeading');
    $('intro-title').innerHTML=w('intro');
    $('bio-paragraphs').innerHTML=D.about[lang.current].map(p=>`<p>${escape(p)}</p>`).join('');
    $('publication-caption').textContent=w('caption');
    $('all-publications-link').textContent=w('more');
    $('project-lede').textContent=w('lede');
    $('selected-projects-label').textContent=w('projects');
    $('footer-note').textContent=w('footer');
    $('language-toggle').textContent=lang.current==='zh'?'EN':'中文';
    const nav=document.querySelectorAll('.primary-nav a');
    ['about','publications','research','experience'].forEach((k,i)=>nav[i].textContent=w(k));
    const filters=document.querySelectorAll('.filter');filters[0].textContent=w('all');filters[1].textContent=w('first');filters[2].textContent=w('others');
    const tags = D.profile[lang.current==='zh'?'linesZh':'lines'];
    $('profile-role').textContent=lang.current==='zh'?'具身智能 / 机器人导航 / RL × LLM':'Embodied AI / Robot Navigation / RL × LLM';
    document.querySelector('.research-tags').innerHTML=tags.map(t=>`<span>${escape(t)}</span>`).join('');
    document.querySelector('.get-in-touch').innerHTML=(lang.current==='zh'?'联系我':'Get in touch')+' <span>↗</span>';
  };
  const renderNews = () => { $('news-list').innerHTML=D.news.map(n=>`<div class="news-row"><span class="news-date">${escape(n.date)}</span><div class="news-body">${escape(n[lang.current])}${n.url?` <a href="${escape(n.url)}" target="_blank" rel="noreferrer">↗</a>`:''}</div><span class="news-type">${escape(n.type)}</span></div>`).join(''); };
  const renderPublications=()=>{
    const papers=D.publications.filter(p=>currentFilter==='all'||(currentFilter==='first'?p.role==='First author':p.role==='Co-first author'));
    $('publication-list').innerHTML=papers.map(p=>`<article class="pub-card">${paperVisual(p)}<div class="pub-body"><div class="pub-meta"><span class="pub-venue">${escape(p.venue)}</span><span class="pub-year">${p.year}</span>${p.role==='First author'||p.role==='Co-first author'?`<span class="pub-role">${escape(p.role==='Co-first author'?(lang.current==='zh'?'共同第一作者':'Co-first author'):(lang.current==='zh'?'第一作者':'First author'))}</span>`:''}</div><h3 class="pub-title"><button type="button" class="preview-trigger" data-id="${escape(p.id)}" aria-label="Preview: ${escape(p.title)}">${escape(p.title)}</button></h3><p class="pub-authors">${escape(p.authors)}</p><div class="pub-tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="pub-actions"><button type="button" data-action="preview" data-id="${escape(p.id)}">◈ ${w('preview')}</button><a href="${escape(p.doi)}" target="_blank" rel="noreferrer">↗ ${w('paper')}</a><button type="button" data-action="bib" data-id="${escape(p.id)}">⧉ ${w('cite')}</button></div></div></article>`).join('');
    registerFigureFallbacks($('publication-list'));
  };
  const glyph = {
    path:'<svg viewBox="0 0 60 50" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="39" r="5"/><circle cx="50" cy="9" r="5"/><path d="M13 37 24 30 18 18 37 16 45 11" stroke-dasharray="3 3"/><path d="m35 8 7 3-3 7"/></svg>',
    policy:'<svg viewBox="0 0 60 50" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="7" width="16" height="14" rx="4"/><rect x="40" y="7" width="16" height="14" rx="4"/><rect x="22" y="31" width="16" height="14" rx="4"/><path d="m20 14 20 0M12 22l17 9m19-9L31 31"/><circle cx="29" cy="14" r="3" fill="currentColor"/></svg>',
    graph:'<svg viewBox="0 0 60 50" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="6" width="52" height="30" rx="7"/><path d="M17 18h26M17 25h17M26 36l-5 7 14-7"/><circle cx="47" cy="25" r="2" fill="currentColor"/></svg>'
  };
  const renderResearch=()=>{
    $('focus-grid').innerHTML=D.focus.map(f=>`<article class="focus-card"><div class="focus-mark">${glyph[f.shape]}<span class="mono">${f.key}</span></div><h3>${escape(lang.current==='zh'?f.zh:f.title)}</h3><p>${escape(lang.current==='zh'?f.descZh:f.desc)}</p></article>`).join('');
    $('projects-list').innerHTML=D.projects.map(p=>`<article class="project-card"><img src="${img(p.cover)}" class="project-art" alt="Original abstract illustration for ${escape(p.name)}" loading="lazy"/><div class="project-content"><div class="project-category">${escape(p.category)} / ${p.n}</div><h3>${escape(p.name)}</h3><p>${escape(lang.current==='zh'?p.zh:p.description)}</p><a class="project-link" href="${escape(p.url)}" target="_blank" rel="noreferrer">${lang.current==='zh'?'查看 GitHub 仓库':'Explore on GitHub'} ↗</a></div></article>`).join('');
  };
  const renderExperience=()=>{
    $('experience-content').innerHTML=`<article class="timeline-item"><div class="timeline-date">${escape(D.education[0].period)}</div><div><h3>${w('education')}</h3><p class="organization">${escape(D.education[0].school)}</p><p>${escape(lang.current==='zh'?D.education[0].degreeZh:D.education[0].degree)}</p></div></article>`+D.service.map(s=>`<article class="timeline-item"><div class="timeline-date">${escape(s.period)}</div><div><h3>${w('service')} · ${escape(s.title)}</h3><p class="organization">${escape(s.org)}</p><p>${escape(s[lang.current])}</p></div></article>`).join('');
  };
  const copy=(s)=>{ if(navigator.clipboard&&window.isSecureContext) return navigator.clipboard.writeText(s);const t=document.createElement('textarea');t.value=s;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();try{document.execCommand('copy')}finally{t.remove()}return Promise.resolve();};
  const tr=(entry) => typeof entry === 'string' ? entry : (entry?.[lang.current] || entry?.en || '');
  const studyWords={
    en:{question:'RESEARCH QUESTION',overview:'The research in brief',method:'Approach & experimental setup',findings:'What the paper reports',figures:'Figures from the paper',boundary:'Scope & limitations',summary:'Short research abstract',metadata:'READING NOTES · PEER-REVIEWED WORK',figSource:'View figure at publisher ↗',figFallback:'Publisher figure could not be loaded.',figureFoot:'Original figure · Springer Nature',publisher:'Read the publication',figNo:'FIGURE',results:'Reported results'},
    zh:{question:'研究问题',overview:'研究背景与思路',method:'研究方法与实验设置',findings:'论文中的主要发现',figures:'论文原始图片',boundary:'研究边界与局限',summary:'论文简要摘要',metadata:'论文解读 · 同行评审成果',figSource:'前往出版社查看原图 ↗',figFallback:'无法加载出版社原始图片。',figureFoot:'论文原图 · Springer Nature',publisher:'阅读论文原文',figNo:'图',results:'论文报告的结果'}
  };
  const stw=k=>studyWords[lang.current][k];
  const showPaper=(id)=>{
    const p=D.publications.find(p=>p.id===id);if(!p)return;
    const s=STUDIES[id];
    const key=encodeURIComponent(p.tags.slice(0,2).join(' '));
    const citation=`<div class="modal-actions"><a class="primary" target="_blank" rel="noopener noreferrer" href="${escape(p.doi)}">${stw('publisher')} ↗</a><button id="modal-copy" type="button">${w('cite')}</button><a href="https://www.semanticscholar.org/search?q=${key}&sort=relevance" target="_blank" rel="noopener noreferrer">${w('related')}</a></div>`;
    const fallback=`<div class="modal-section"><h3>${w('abstract')}</h3><p>${escape(p.abstract)}</p></div><div class="modal-section"><h3>${w('approach')}</h3><ol>${p.method.map(m=>`<li>${escape(m)}</li>`).join('')}</ol></div>`;
    let deep='';
    if(s){
      const metrics=s.metrics.map(x=>`<article class="study-metric"><div class="study-value">${escape(x.value)}</div><div class="study-metric-label">${escape(tr(x.label))}</div><p>${escape(tr(x.detail))}</p></article>`).join('');
      const steps=s.stages.map((x,i)=>`<li><span class="study-step-number">${String(i+1).padStart(2,'0')}</span><div><h4>${escape(tr(x.name))}</h4><p>${escape(tr(x.desc))}</p></div></li>`).join('');
      const findings=s.findings.map(x=>`<li><span class="study-finding-marker" aria-hidden="true">↗</span><div><h4>${escape(tr(x.name))}</h4><p>${escape(tr(x.detail))}</p></div></li>`).join('');
      let visual='';
      if(s.figures?.length){
        const f=s.figures[0];
        visual=`<section class="study-section study-gallery"><div class="study-section-caption"><span>02</span><h3>${stw('figures')}</h3></div><div class="study-figure-tabs" role="group" aria-label="${stw('figures')}">${s.figures.map((f,i)=>`<button class="study-figure-tab${i===0?' active':''}" data-figure-index="${i}" type="button" aria-pressed="${i===0}">${escape(f.number)} <small>${escape(tr(f.label))}</small></button>`).join('')}</div><figure class="study-figure-large"><div class="study-figure-viewport"><img id="study-selected-figure" loading="eager" src="${escape(f.url)}" alt="${escape(tr(f.label))}" /></div><figcaption><div><strong id="study-figure-title">${escape(f.number)} · ${escape(tr(f.label))}</strong><p id="study-figure-caption">${escape(tr(f.caption))}</p></div><a id="study-figure-link" href="${escape(p.figureLink || p.doi)}" target="_blank" rel="noopener noreferrer">${stw('figSource')}</a></figcaption></figure></section>`;
      }else{
        visual=`<section class="study-section study-figure-section"><div class="study-section-caption"><span>02</span><h3>${stw('figures')}</h3></div>${paperVisual(p,true)}</section>`;
      }
      deep=`<div class="study-overview"><span class="study-eyebrow">${stw('question')}</span><h3>${escape(tr(s.question))}</h3><p>${escape(tr(s.context))}</p></div><section class="study-stats" aria-label="${stw('results')}">${metrics}</section>${visual}<div class="study-columns"><section class="study-section"><div class="study-section-caption"><span>03</span><h3>${stw('method')}</h3></div><ol class="study-step-list">${steps}</ol></section><section class="study-section"><div class="study-section-caption"><span>04</span><h3>${stw('findings')}</h3></div><ul class="study-finding-list">${findings}</ul></section></div><section class="study-boundary"><div><span class="study-eyebrow">05 / ${stw('boundary')}</span><p>${escape(tr(s.limitations))}</p></div></section><details class="study-abstract"><summary>${stw('summary')}<span>＋</span></summary><p>${escape(p.abstract)}</p></details>`;
    }
    const badge=p.role==='Co-first author'?(lang.current==='zh'?'共同第一作者':'Co-first author'):(p.role==='First author'?(lang.current==='zh'?'第一作者':'First author'):'');
    $('modal-content').innerHTML=`<div class="study-header"><span class="modal-overline">${stw('metadata')} / ${p.year}</span><h2 class="modal-title" id="paper-modal-title">${escape(p.title)}</h2><div class="study-byline">${escape(p.authors)} ${badge?`<span>${escape(badge)}</span>`:''}</div><div class="modal-sub">${escape(p.venue)} · ${p.year}</div></div>${deep||`${paperVisual(p,true)}${fallback}`}${citation}<p class="study-disclaimer">${w('note')}</p>`;
    if(!s)registerFigureFallbacks($('modal-content'));
    if(s?.figures?.length){
      const buttons=Array.from($('modal-content').querySelectorAll('[data-figure-index]'));
      const selected=$('study-selected-figure');
      const activate=(index)=>{const f=s.figures[index];if(!f)return;selected.src=f.url;selected.alt=tr(f.label);$('study-figure-title').textContent=`${f.number} · ${tr(f.label)}`;$('study-figure-caption').textContent=tr(f.caption);buttons.forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});};
      buttons.forEach(btn=>btn.addEventListener('click',()=>activate(Number(btn.dataset.figureIndex))));
      selected.addEventListener('error',()=>{const viewport=selected.closest('.study-figure-viewport');if(viewport&&!viewport.querySelector('.study-figure-error')){const fail=document.createElement('div');fail.className='study-figure-error';fail.textContent=stw('figFallback');viewport.append(fail);}});
      selected.addEventListener('load',()=>{selected.closest('.study-figure-viewport')?.querySelector('.study-figure-error')?.remove();});
    }
    $('modal-copy').addEventListener('click',()=>copy(p.bib).then(()=>toast(w('copied'))));
    const dlg=$('paper-dialog');if(!dlg.open)dlg.showModal();dlg.scrollTop=0;
  };
  const renderAll=()=>{updateStatic();renderNews();renderPublications();renderResearch();renderExperience();};
  document.addEventListener('click',ev=>{
    const trigger=ev.target.closest('[data-id]');if(!trigger)return;
    if(trigger.dataset.action==='bib'){const p=D.publications.find(x=>x.id===trigger.dataset.id);if(p)copy(p.bib).then(()=>toast(w('copied')));return;}
    showPaper(trigger.dataset.id);
  });
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===btn));currentFilter=btn.dataset.filter;renderPublications();}));
  $('paper-close').addEventListener('click',()=>$('paper-dialog').close());
  $('paper-dialog').addEventListener('click',ev=>{if(ev.target===$('paper-dialog'))$('paper-dialog').close();});
  $('language-toggle').addEventListener('click',()=>{lang.current=lang.current==='en'?'zh':'en';storage.setItem('yule-lang',lang.current);renderAll();});
  const savedTheme=storage.getItem('yule-theme');if(savedTheme==='dark')document.documentElement.dataset.theme='dark';
  const themeIcon=()=>{$('theme-icon').textContent=document.documentElement.dataset.theme==='dark'?'☼':'☾';};themeIcon();
  $('theme-toggle').addEventListener('click',()=>{const isDark=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=isDark?'light':'dark';storage.setItem('yule-theme',isDark?'light':'dark');themeIcon();});
  $('menu-toggle').addEventListener('click',()=>{const nav=document.querySelector('.primary-nav');const open=nav.classList.toggle('open');$('menu-toggle').setAttribute('aria-expanded',String(open));});
  document.querySelectorAll('.primary-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.primary-nav').classList.remove('open');$('menu-toggle').setAttribute('aria-expanded','false');}));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const id=entry.target.id;document.querySelectorAll('.primary-nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===id));}}),{rootMargin:'-20% 0px -65% 0px'});document.querySelectorAll('.observed').forEach(el=>observer.observe(el));}
  const portrait=$('portrait');
  const portraitSources=D.profile.portraitSources || [D.profile.portrait];
  let portraitIndex=0;
  portrait.addEventListener('error',()=>{
    portraitIndex+=1;
    if(portraitIndex<portraitSources.length) portrait.src=portraitSources[portraitIndex];
    else {portrait.style.display='none';$('portrait-fallback').style.display='flex';}
  });
  portrait.addEventListener('load',()=>{$('portrait-fallback').style.display='none';portrait.style.display='block';});
  portrait.src=portraitSources[0];
  renderAll();
})();