from pathlib import Path
import re

path = Path('index.html')
html = path.read_text(encoding='utf-8')

css = r'''

        /* Springer Nature peer-review cards — matched to the site's original card language */
        .reviewer-summary {
            margin: 12px 0 22px;
            color: #68727d;
            font-size: 0.98em;
        }

        .reviewer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 18px;
            margin-top: 22px;
        }

        .reviewer-card {
            display: flex;
            gap: 16px;
            align-items: center;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 12px;
            border-left: 4px solid #667eea;
            transition: all 0.3s ease;
            color: inherit;
            text-decoration: none;
        }

        .reviewer-card::after {
            display: none;
        }

        .reviewer-card:hover {
            transform: translateY(-5px);
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            box-shadow: 0 12px 28px rgba(102, 126, 234, 0.2);
            border-left-color: #764ba2;
        }

        .reviewer-cover {
            width: 66px;
            height: 88px;
            flex: 0 0 66px;
            object-fit: cover;
            border-radius: 4px;
            box-shadow: 0 5px 14px rgba(0, 0, 0, 0.16);
            background: #ffffff;
        }

        .reviewer-info {
            min-width: 0;
        }

        .reviewer-journal {
            color: #2c3e50;
            font-size: 0.96em;
            font-weight: 700;
            line-height: 1.45;
            margin-bottom: 6px;
        }

        .reviewer-count {
            color: #7f8c8d;
            font-size: 0.86em;
            line-height: 1.5;
        }

        @media (max-width: 480px) {
            .reviewer-grid {
                grid-template-columns: 1fr;
            }
        }
'''

if '.reviewer-grid {' not in html:
    html = html.replace('</style>', css + '\n</style>', 1)

en_section = r'''<h2>🧾 Academic Service</h2>
<div class="experience-item">
<strong>Peer Reviewer — Springer Nature Journals</strong><br/>
<em>2026 - Present</em>
<p class="reviewer-summary">Completed <strong>9 manuscript reviews</strong> across <strong>6 Springer Nature journals</strong> in artificial intelligence, robotics, information security, multidisciplinary science, and computing.</p>
<div class="reviewer-grid">
<a class="reviewer-card" href="https://link.springer.com/journal/10207" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/international-journal-information-security.png" alt="International Journal of Information Security cover"/>
<div class="reviewer-info"><div class="reviewer-journal">International Journal of Information Security</div><div class="reviewer-count">1 manuscript reviewed</div></div>
</a>
<a class="reviewer-card" href="https://www.nature.com/srep/" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/scientific-reports.png" alt="Scientific Reports cover"/>
<div class="reviewer-info"><div class="reviewer-journal">Scientific Reports</div><div class="reviewer-count">3 manuscripts reviewed</div></div>
</a>
<a class="reviewer-card" href="https://link.springer.com/journal/44430" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/discover-robotics.png" alt="Discover Robotics cover"/>
<div class="reviewer-info"><div class="reviewer-journal">Discover Robotics</div><div class="reviewer-count">1 manuscript reviewed</div></div>
</a>
<a class="reviewer-card" href="https://link.springer.com/journal/10462" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/artificial-intelligence-review.png" alt="Artificial Intelligence Review cover"/>
<div class="reviewer-info"><div class="reviewer-journal">Artificial Intelligence Review</div><div class="reviewer-count">1 manuscript reviewed</div></div>
</a>
<a class="reviewer-card" href="https://link.springer.com/journal/44163" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/discover-artificial-intelligence.png" alt="Discover Artificial Intelligence cover"/>
<div class="reviewer-info"><div class="reviewer-journal">Discover Artificial Intelligence</div><div class="reviewer-count">2 manuscripts reviewed</div></div>
</a>
<a class="reviewer-card" href="https://link.springer.com/journal/11227" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/journal-of-supercomputing.png" alt="The Journal of Supercomputing cover"/>
<div class="reviewer-info"><div class="reviewer-journal">The Journal of Supercomputing</div><div class="reviewer-count">1 manuscript reviewed</div></div>
</a>
</div>
</div>'''

zh_section = r'''<h2>🧾 学术服务</h2>
<div class="experience-item">
<strong>Springer Nature 期刊同行评审人</strong><br/>
<em>2026 年至今</em>
<p class="reviewer-summary">已为 <strong>6 本 Springer Nature 期刊</strong>完成 <strong>9 次论文评审</strong>，涉及人工智能、机器人、信息安全、综合科学与高性能计算等方向。</p>
<div class="reviewer-grid">
<a class="reviewer-card" href="https://link.springer.com/journal/10207" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/international-journal-information-security.png" alt="International Journal of Information Security 期刊封面"/>
<div class="reviewer-info"><div class="reviewer-journal">International Journal of Information Security</div><div class="reviewer-count">已评审 1 篇</div></div>
</a>
<a class="reviewer-card" href="https://www.nature.com/srep/" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/scientific-reports.png" alt="Scientific Reports 期刊封面"/>
<div class="reviewer-info"><div class="reviewer-journal">Scientific Reports</div><div class="reviewer-count">已评审 3 篇</div></div>
</a>
<a class="reviewer-card" href="https://link.springer.com/journal/44430" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/discover-robotics.png" alt="Discover Robotics 期刊封面"/>
<div class="reviewer-info"><div class="reviewer-journal">Discover Robotics</div><div class="reviewer-count">已评审 1 篇</div></div>
</a>
<a class="reviewer-card" href="https://link.springer.com/journal/10462" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/artificial-intelligence-review.png" alt="Artificial Intelligence Review 期刊封面"/>
<div class="reviewer-info"><div class="reviewer-journal">Artificial Intelligence Review</div><div class="reviewer-count">已评审 1 篇</div></div>
</a>
<a class="reviewer-card" href="https://link.springer.com/journal/44163" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/discover-artificial-intelligence.png" alt="Discover Artificial Intelligence 期刊封面"/>
<div class="reviewer-info"><div class="reviewer-journal">Discover Artificial Intelligence</div><div class="reviewer-count">已评审 2 篇</div></div>
</a>
<a class="reviewer-card" href="https://link.springer.com/journal/11227" target="_blank" rel="noopener">
<img class="reviewer-cover" src="images/reviewer/journal-of-supercomputing.png" alt="The Journal of Supercomputing 期刊封面"/>
<div class="reviewer-info"><div class="reviewer-journal">The Journal of Supercomputing</div><div class="reviewer-count">已评审 1 篇</div></div>
</a>
</div>
</div>'''

html, n_en = re.subn(
    r'<h2>💼 Work Experience</h2>\s*<div class="experience-item">.*?</div>\s*(?=<h2>🏆 Certifications &amp; Achievements</h2>)',
    en_section + '\n', html, count=1, flags=re.S)
html, n_zh = re.subn(
    r'<h2>💼 工作经历</h2>\s*<div class="experience-item">.*?</div>\s*(?=<h2>🏆 证书与经历</h2>)',
    zh_section + '\n', html, count=1, flags=re.S)

if n_en != 1 or n_zh != 1:
    raise SystemExit(f'Expected one EN and one ZH work section; got EN={n_en}, ZH={n_zh}')

html = html.replace(
    'B.Sc. in Information Technology | Research &amp; Editing Professional',
    'B.Sc. in Information Technology | AI &amp; Robotics Research')
html = html.replace(
    'I currently work as a part-time Youth Editor at the Hong Kong Institute of Humanities and Social Sciences, \n                where I edit academic journal articles to ensure clarity and accuracy, and collaborate with researchers to enhance manuscript quality before publication.',
    'Alongside my research, I contribute as a peer reviewer for Springer Nature journals across artificial intelligence, robotics, information security, and computing.')
html = html.replace('信息技术本科生｜科研与学术编辑', '信息技术本科生｜人工智能与机器人科研')
html = html.replace(
    '目前我在香港人文社会科学研究院担任兼职青年编辑，主要负责学术论文的语言润色、清晰度检查与稿件质量提升。',
    '除科研外，我也为 Springer Nature 旗下人工智能、机器人、信息安全与计算方向期刊提供同行评审。')

path.write_text(html, encoding='utf-8')
