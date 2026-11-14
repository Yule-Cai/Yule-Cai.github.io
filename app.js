(() => {
  'use strict';
  const D = window.YULE_DATA;
  const STUDIES = window.YULE_STUDIES || {};
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storage = { getItem(key){ try{return window.localStorage.getItem(key)}catch{return null} }, setItem(key,value){try{window.localStorage.setItem(key,value)}catch{}} };
  const lang = { current: storage.getItem('yule-lang') === 'zh' ? 'zh' : 'en' };
  const words = {
    en: {about:'About', publications:'Publications', research:'Research', experience:'Experience', position:'UNDERGRADUATE RESEARCHER', open:'Open to research collaborations', news:'News <span>& notes</span>', publicationHeading:'Selected <span>publications</span>', researchHeading:'Research <span>& projects</span>', experienceHeading:'Education <span>& service</span>', intro:'Building robots that can <em>reason, adapt, and recover.</em>', caption:'A selection of peer-reviewed work; the complete list is available on Google Scholar.', more:'Explore full publication list', lede:'Research spanning motion planning, reliable decision-making and multi-robot learning. Published evidence is distinguished from ongoing work.', projects:'SELECTED PROJECTS', footer:'Made for the work, not just the webpage.', paper:'Paper ↗', preview:'Quick preview', cite:'Copy BibTeX', related:'Find related papers ↗', abstract:'Research snapshot', approach:'What this work covers', note:'This preview is an editorial summary, not the original paper. Follow the DOI for the full publication.', first:'First author', co:'Co-first author', full:'View published paper ↗', all:'All', others:'Co-first author', original:'Original research', current:'Current', service:'Academic service', education:'Education', copied:'BibTeX copied', close:'Close preview', journal:'Journal'},
    zh: {about:'关于', publications:'论文', research:'研究', experience:'经历', position:'本科研究者', open:'欢迎学术交流与合作', news:'最新<span>动态</span>', publicationHeading:'代表性<span>论文</span>', researchHeading:'研究<span>与项目</span>', experienceHeading:'教育<span>与学术服务</span>', intro:'让机器人学会<em>推理、适应与恢复。</em>', caption:'此处展示部分同行评审论文；完整列表可在 Google Scholar 查阅。',more:'查看完整论文列表',lede:'研究涵盖运动规划、可靠决策与多机器人学习，并区分已发表成果和在研工作。',projects:'代表性项目',footer:'认真做研究，也认真记录过程。',paper:'论文 ↗',preview:'研究速览',cite:'复制 BibTeX',related:'查找相关论文 ↗',abstract:'研究概述',approach:'研究涉及的内容',note:'这里是方便浏览的简要介绍，并非论文原文；完整内容请通过 DOI 查看。',first:'第一作者',co:'共同第一作者',full:'查看已发表论文 ↗',all:'全部',others:'共同第一作者',original:'原始研究',current:'在读',service:'学术服务',education:'教育背景',copied:'已复制 BibTeX',close:'关闭预览',journal:'期刊'}
  };
  const w = (key) => words[lang.current][key];
  const img = p => /^https?:\/\//.test(p || '') ? p : `assets/${p}`;
  const paperVisual = (p, modal=false) => {
    if (!p.cover) return `<div class="paper-visual paper-empty${modal?' paper-modal':''}"><span>ORIGINAL FIGURE</span><strong>Awaiting a verified figure</strong><small>See the publisher's article for the paper.</small></div>`;
    const caption = `${p.figure || (lang.current==='zh'?'图':'Figure')} · ${p.figureSource || (lang.current==='zh'?'论文原始图片':'Original publication')}`;
    return `<figure class="paper-visual${modal?' paper-modal':''}"><div class="paper-image-frame"><img class="${modal?'modal-cover':'pub-cover'}" src="${escape(p.localCover?img(p.localCover):img(p.cover))}" data-backup="${escape(p.localCover?img(p.cover):(p.backupCover?img(p.backupCover):''))}" data-final="${escape(p.backupCover?img(p.backupCover):'')}" alt="${escape((lang.current==='zh'?'论文原图：':'Original figure: ')+p.title)}" loading="lazy" /></div><figcaption><span>${escape(caption)}</span><a href="${escape(p.figureLink || p.doi)}" target="_blank" rel="noopener noreferrer" aria-label="Source for ${escape(p.title)}">${lang.current==='zh'?'来源 ↗':'Source ↗'}</a></figcaption></figure>`;
  };
  const registerFigureFallbacks = (scope=document) => {
    scope.querySelectorAll('.paper-visual img[data-backup]').forEach(el=>{
      el.addEventListener('error',()=>{
        const fallback=el.dataset.backup;
        if(fallback && !el.dataset.fallbackUsed){el.dataset.fallbackUsed='1';el.src=fallback; return;}
        const final=el.dataset.final;
        if(final && !el.dataset.finalUsed && el.src!==final){el.dataset.finalUsed='1';el.src=final;const cap=el.closest('.paper-visual')?.querySelector('figcaption span');if(cap)cap.textContent=lang.current==='zh'?'出版社图片不可用，显示临时占位图':'Publisher image unavailable — temporary placeholder'; return;}
        const frame=el.closest('.paper-image-frame');if(frame){el.remove();frame.innerHTML='<div class="figure-unavailable">'+(lang.current==='zh'?'原图当前无法加载':'Figure unavailable offline')+'</div>';}
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
    const staticLabels={en:{introKicker:'01 / INTRODUCTION',aboutKicker:'ABOUT ME',latest:'LATEST UPDATES',selectedWork:'SELECTED WORK / RESEARCH OUTPUT',openSource:'WORK IN PROGRESS / OPEN SOURCE',background:'ACADEMIC BACKGROUND',location:'Sintok, Kedah · Malaysia',researchQuestion:'CURRENT RESEARCH QUESTION',siteType:'Academic portfolio · 2026'},zh:{introKicker:'01 / 研究简介',aboutKicker:'关于我',latest:'最新进展',selectedWork:'精选成果 / 学术论文',openSource:'研究进行中 / 开源项目',background:'学术背景',location:'马来西亚 · 吉打州 · 新笃',researchQuestion:'当前研究问题',siteType:'学术主页 · 2026'}};
    document.querySelectorAll('[data-i18n-text]').forEach(el=>{const val=staticLabels[lang.current][el.dataset.i18nText];if(val)el.textContent=val});
    $('cv-link').firstChild.textContent=lang.current==='zh'?'查看学术简历 ':'View CV ';
    $('research-link').firstChild.textContent=lang.current==='zh'?'研究方向详情 ':'Research overview ';
    $('premise-text').textContent=lang.current==='zh'?'当环境与约束发生变化时，机器人如何可靠地规划、验证决策并协同执行？':'How can robots plan, validate decisions and coordinate reliably as environments and constraints change?';
    $('premise-link').textContent=lang.current==='zh'?'了解研究思路 ↗':'Explore the research approach ↗';
    $('back-to-top').textContent=lang.current==='zh'?'返回顶部 ↑':'Back to top ↑';
    document.querySelector('.pub-filters').setAttribute('aria-label',lang.current==='zh'?'筛选论文':'Filter publications');
    $('menu-toggle').setAttribute('aria-label',lang.current==='zh'?'切换导航菜单':'Toggle navigation');
    $('theme-toggle').setAttribute('aria-label',lang.current==='zh'?'切换深浅色模式':'Switch color mode');
    $('language-toggle').setAttribute('aria-label',lang.current==='zh'?'切换为英文':'Switch to Chinese');
    const v15={
      en:{arcEyebrow:'RESEARCH PILLARS',arcTitle:'Three complementary research areas',arcIntro:'Parallel research areas across planning, decision reliability and team learning—not successive completed stages.',systemsEyebrow:'SUPPORTING SYSTEMS DIRECTION',systemsTitle:'Efficient Distributed Reinforcement Learning',systemsText:'CAMS studies communication scheduling and policy-version age in distributed RL, separate from robot navigation benchmarks.',systemsLink:'Explore systems research ↗',visionEyebrow:'LONG-TERM RESEARCH QUESTION · PROPOSED',visionTitle:'Adaptive Joint Capability Models for Multi-Robot Autonomy',visionText:'Can a team distinguish a flawed plan from changes in individual capability or coordination, and update only the relevant part of its shared model? This agenda remains unvalidated.',visionLink:'Explore the research question ↗',resultsEyebrow:'EVIDENCE FROM PUBLISHED WORK',resultsTitle:'Navigation under partial observability',resultsIntro:'Reported mean success rate across five map-difficulty levels in our published RL–LLM navigation study.',combinedName:'RL–LLM framework',ppoName:'Pure PPO baseline',evaluations:'total evaluations · 5 difficulty levels · 7 baseline methods',resultsCaveat:'These are results from a specified experimental benchmark, not a claim of success in all real-world conditions. Values and comparison scope are reported in the journal article.',resultsSource:'Source: peer-reviewed paper ↗',ongoingEyebrow:'ONGOING RESEARCH · NOT PEER-REVIEWED RESULTS',ongoingTitle:'Active and under-review research',ongoingIntro:'Experimental prototypes and submitted studies are identified without unpublished performance claims.',ongoingMore:'Read research questions and scope ↗'},
      zh:{arcEyebrow:'研究领域',arcTitle:'三个互为补充的研究方向',arcIntro:'规划、决策可靠性与团队学习是并行发展的研究领域，而非已完成的单一路线。',systemsEyebrow:'配套系统研究方向',systemsTitle:'高效分布式强化学习',systemsText:'CAMS 研究分布式强化学习的通信调度与策略版本滞后尾部问题，不将其视为已完成的机器人导航成果。',systemsLink:'了解系统研究 ↗',visionEyebrow:'长期研究问题 · 待验证',visionTitle:'多机器人联合能力的自适应建模',visionText:'团队能否区分计划错误、单车能力变化与协作失效，并仅更新共享模型中真正变化的部分？该研究纲领尚未验证。',visionLink:'查看研究设想 ↗',resultsEyebrow:'已发表论文的实验结果',resultsTitle:'部分可观测条件下的导航',resultsIntro:'RL–LLM 导航论文在五个难度等级上报告的平均成功率。',combinedName:'RL–LLM 协同框架',ppoName:'纯 PPO 基线',evaluations:'总评估次数 · 5 个难度等级 · 7 种基线方法',resultsCaveat:'上述数值仅反映指定实验设置下的表现，不代表机器人在所有现实环境中的成功率。比较口径以正式论文为准。',resultsSource:'查看同行评审论文 ↗',ongoingEyebrow:'进行中的研究 · 非同行评审结果',ongoingTitle:'在研项目与审稿中问题',ongoingIntro:'这里区分实验原型和在审工作，不公开未经核验的性能结论。',ongoingMore:'了解研究问题及边界 ↗'}
    };
    document.querySelectorAll('[data-i18n-v15]').forEach(el=>{const key=el.dataset.i18nV15;if(v15[lang.current][key])el.textContent=v15[lang.current][key];});
    const compare=document.querySelector('.comparison-chart');if(compare)compare.setAttribute('aria-label',lang.current==='zh'?'已发表导航研究：RL–LLM 平均成功率 95%，纯 PPO 平均成功率 72%，五个难度等级':'Published navigation study: RL–LLM 95 percent mean success; pure PPO 72 percent mean success across five levels');
    const tags = D.profile[lang.current==='zh'?'linesZh':'lines'];
    $('profile-role').textContent=lang.current==='zh'?'机器人规划 / 可靠自主 / 多智能体强化学习':'Robot Planning / Reliable Autonomy / Multi-Agent RL';
    document.querySelector('.research-tags').innerHTML=tags.map(t=>`<span>${escape(t)}</span>`).join('');
    document.querySelector('.get-in-touch').innerHTML=(lang.current==='zh'?'联系我':'Get in touch')+' <span>↗</span>';
  };
  const renderNews = () => { $('news-list').innerHTML=D.news.map(n=>`<div class="news-row"><span class="news-date">${escape(n.date)}</span><div class="news-body">${escape(n[lang.current])}${n.url?` <a href="${escape(n.url)}" target="_blank" rel="noreferrer">↗</a>`:''}</div><span class="news-type">${escape(lang.current==='zh'?(n.type==='Journal'?'期刊论文':n.type==='Open source'?'开源项目':n.type):n.type)}</span></div>`).join(''); };
  const renderPublications=()=>{
    const papers=D.publications.filter(p=>currentFilter==='all'||(currentFilter==='first'?p.role==='First author':p.role==='Co-first author'));
    $('publication-list').innerHTML=papers.map(p=>`<article class="pub-card">${paperVisual(p)}<div class="pub-body"><div class="pub-meta"><span class="pub-venue">${escape(p.venue)}</span><span class="pub-year">${p.year}</span>${p.role==='First author'||p.role==='Co-first author'?`<span class="pub-role">${escape(p.role==='Co-first author'?(lang.current==='zh'?'共同第一作者':'Co-first author'):(lang.current==='zh'?'第一作者':'First author'))}</span>`:''}</div><h3 class="pub-title"><button type="button" class="preview-trigger" data-id="${escape(p.id)}" aria-label="${lang.current==='zh'?'预览论文：':'Preview: '}${escape(p.title)}">${escape(p.title)}</button></h3><p class="pub-authors">${escape(p.authors)}</p><div class="pub-tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="pub-actions"><button type="button" data-action="preview" data-id="${escape(p.id)}">◈ ${w('preview')}</button><a href="papers/${escape(p.id)}.html">${lang.current==='zh'?'研究详情 ↗':'Research page ↗'}</a><a href="${escape(p.doi)}" target="_blank" rel="noreferrer">↗ ${w('paper')}</a><button type="button" data-action="bib" data-id="${escape(p.id)}">⧉ ${w('cite')}</button></div></div></article>`).join('');
    registerFigureFallbacks($('publication-list'));
  };
  const renderArc=()=>{
    $('research-arc-list').innerHTML=D.researchArc.map(x=>`<li class="arc-step"><div class="arc-step-top"><span class="arc-index">${escape(x.num)}</span><span class="arc-state ${escape(x.status)}">${escape(tr(x.state))}</span></div><h4>${escape(tr(x.title))}</h4><p>${escape(tr(x.detail))}</p><a href="${escape(x.link)}">${escape(tr(x.linkLabel))}</a></li>`).join('');
    $('ongoing-grid').innerHTML=D.ongoing.map(x=>`<article class="ongoing-card"><span>${escape(x.num)} / ${escape(tr(x.stage)|| (lang.current==='zh'?'研究中':'RESEARCH'))}</span><h4>${escape(tr(x.title))}</h4><p>${escape(tr(x.text))}</p></article>`).join('');
  };
  const renderResearch=()=>{
    $('projects-list').innerHTML=D.projects.map(p=>{
      const available = p.public !== false;
      const picture = `<img src="${escape(img(p.cover))}" data-remote="${escape(img(p.remoteCover||p.cover))}" data-fallback="${escape(img(p.fallbackCover))}" class="project-art" alt="${escape(lang.current==='zh'?p.evidenceZh:p.evidenceEn)}" loading="lazy" decoding="async" />`;
      const label = escape(lang.current==='zh'?(available?'在 GitHub 中查看实验原图：':'项目概念示意：'):(available?'View the original research figure on GitHub: ':'Concept illustration for '))+escape(p.name);
      const chip = `<span class="project-evidence-chip">${available?(lang.current==='zh'?'项目原始结果':'Original project figure'):(lang.current==='zh'?'研究方向示意':'Concept illustration')}</span>`;
      const media = available ? `<a class="project-media-link" href="${escape(p.evidence||p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${picture}${chip}</a>` : `<div class="project-media-link" aria-label="${label}">${picture}${chip}</div>`;
      const actions = available ? `<a class="project-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">${lang.current==='zh'?'查看研究代码':'View code'} ↗</a><a class="project-secondary-link" href="${escape(p.evidence)}" target="_blank" rel="noopener noreferrer">${lang.current==='zh'?'原始图片':'Source figure'} ↗</a>` : `<span class="project-access-note">${lang.current==='zh'?'研究仓库暂未公开':'Research repository not public'}</span>`;
      return `<article class="project-card">${media}<div class="project-content"><div class="project-category">${escape(p.category)} / ${p.n}</div><h3>${escape(p.name)}</h3><p>${escape(lang.current==='zh'?p.zh:p.description)}</p><div class="project-evidence-caption">${escape(lang.current==='zh'?p.evidenceZh:p.evidenceEn)} <span>· ${escape(p.evidenceTag)}</span></div><div class="project-actions">${actions}</div></div></article>`;
    }).join('');
    $('projects-list').querySelectorAll('img[data-fallback]').forEach(el=>el.addEventListener('error',()=>{if(!el.dataset.remoteUsed && el.dataset.remote && el.src!==el.dataset.remote){el.dataset.remoteUsed='1';el.src=el.dataset.remote;return;} if(!el.dataset.remoteUsed && el.dataset.remote && el.src!==el.dataset.remote){el.dataset.remoteUsed='1';el.src=el.dataset.remote;return;} if(!el.dataset.fallbackUsed){el.dataset.fallbackUsed='1';el.src=el.dataset.fallback;el.alt=lang.current==='zh'?'项目图暂时无法加载':'Research figure temporarily unavailable';el.closest('.project-media-link')?.querySelector('.project-evidence-chip')?.remove();}}));
  };
  const renderExperience=()=>{
    const education=`<article class="timeline-item"><div class="timeline-date">${escape(D.education[0].period)}</div><div><h3>${w('education')}</h3><p class="organization">${escape(D.education[0].school)}</p><p>${escape(lang.current==='zh'?D.education[0].degreeZh:D.education[0].degree)}</p></div></article>`;
    const experience=(D.researchExperience||[]).map(x=>`<article class="timeline-item research-experience-item"><div class="timeline-date">${escape(x.period)}</div><div><h3>${escape(tr(x.role))}</h3><p class="organization">${escape(tr(x.org))}</p><p>${escape(tr(x.desc))}</p><a class="research-experience-source" href="${escape(x.link)}" target="_blank" rel="noopener noreferrer">${lang.current==='zh'?'相关正式论文 ↗':'Associated publication ↗'}</a></div></article>`).join('');
    const summer=(D.summerSchools||[]).map(x=>`<article class="timeline-item summer-school-item"><div class="timeline-date">${escape(lang.current==='zh'?x.periodZh:x.period)}</div><div><h3>${escape(tr(x.name))}</h3><p class="organization">${escape(tr(x.org))}</p><p>${escape(tr(x.desc))}</p><a class="summer-school-link" href="${escape(x.link)}" target="_blank" rel="noopener noreferrer">${lang.current==='zh'?'暑校官方介绍 ↗':'Official programme overview ↗'}</a></div></article>`).join('');
    const service=D.service.map(x=>`<article class="timeline-item"><div class="timeline-date">${escape(x.period)}</div><div><h3>${w('service')} · ${escape(lang.current==='zh'?(x.titleZh||x.title):x.title)}</h3><p class="organization">${escape(lang.current==='zh'?(x.orgZh||x.org):x.org)}</p><p>${escape(x[lang.current])}</p></div></article>`).join('');
    $('experience-content').innerHTML=education+experience+summer+service;
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
    const citation=`<div class="modal-actions"><a href="papers/${encodeURIComponent(p.id)}.html" class="modal-detail-link">${lang.current==='zh'?'独立论文详情页 ↗':'Open full research page ↗'}</a><a class="primary" target="_blank" rel="noopener noreferrer" href="${escape(p.doi)}">${stw('publisher')} ↗</a><button id="modal-copy" type="button">${w('cite')}</button><a href="https://www.semanticscholar.org/search?q=${key}&sort=relevance" target="_blank" rel="noopener noreferrer">${w('related')}</a></div>`;
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
  const renderAll=()=>{updateStatic();renderNews();renderPublications();renderArc();renderResearch();renderExperience();};
  document.addEventListener('click',ev=>{
    const trigger=ev.target.closest('[data-id]');if(!trigger)return;
    if(trigger.dataset.action==='bib'){const p=D.publications.find(x=>x.id===trigger.dataset.id);if(p)copy(p.bib).then(()=>toast(w('copied')));return;}
    showPaper(trigger.dataset.id);
  });
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});currentFilter=btn.dataset.filter;renderPublications();}));
  // Animate the reader closing without breaking dialog focus or Esc dismissal.
  const readerDialog = $('paper-dialog');
  let readerCloseTimer;
  const closeReader = () => {
    if (!readerDialog.open || readerDialog.classList.contains('is-closing')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { readerDialog.close(); return; }
    readerDialog.classList.add('is-closing');
    window.clearTimeout(readerCloseTimer);
    readerCloseTimer = window.setTimeout(() => {
      readerDialog.close();
      readerDialog.classList.remove('is-closing');
    }, 155);
  };
  $('paper-close').addEventListener('click',closeReader);
  readerDialog.addEventListener('click',ev=>{if(ev.target===readerDialog)closeReader();});
  readerDialog.addEventListener('cancel',ev=>{
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { ev.preventDefault(); closeReader(); }
  });
  $('language-toggle').addEventListener('click',()=>{lang.current=lang.current==='en'?'zh':'en';storage.setItem('yule-lang',lang.current);renderAll();});
  const savedTheme=storage.getItem('yule-theme');if(savedTheme==='dark')document.documentElement.dataset.theme='dark';
  const themeIcon=()=>{$('theme-icon').textContent=document.documentElement.dataset.theme==='dark'?'☼':'☾';$('theme-toggle').setAttribute('aria-pressed',document.documentElement.dataset.theme==='dark'?'true':'false');};themeIcon();
  $('theme-toggle').addEventListener('click',()=>{const isDark=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=isDark?'light':'dark';storage.setItem('yule-theme',isDark?'light':'dark');themeIcon();});
  $('menu-toggle').addEventListener('click',()=>{const nav=document.querySelector('.primary-nav');const open=nav.classList.toggle('open');$('menu-toggle').setAttribute('aria-expanded',String(open));});
  document.querySelectorAll('.primary-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.primary-nav').classList.remove('open');$('menu-toggle').setAttribute('aria-expanded','false');}));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const id=entry.target.id;document.querySelectorAll('.primary-nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===id));}}),{rootMargin:'-20% 0px -65% 0px'});document.querySelectorAll('.observed').forEach(el=>observer.observe(el));}
  const portrait=$('portrait');
  const portraitSources=D.profile.portraitSources || [D.profile.portrait];
  let portraitIndex=0;
  portrait.addEventListener('error',()=>{
    portraitIndex+=1;
    if(portraitIndex<portraitSources.length){ portrait.removeAttribute('srcset'); portrait.src=portraitSources[portraitIndex]; }
    else {portrait.style.display='none';$('portrait-fallback').style.display='flex';}
  });
  portrait.addEventListener('load',()=>{$('portrait-fallback').style.display='none';portrait.style.display='block';});
  portrait.src=portraitSources[0];
  renderAll();
})();