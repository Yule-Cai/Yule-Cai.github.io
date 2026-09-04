from pathlib import Path
p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = s.replace('https://scholar.google.com/scholar?q=author%3A%22Yule+Cai%22', 'https://scholar.google.com/citations?hl=en&user=W8lwxUYAAAAJ')
p.write_text(s, encoding='utf-8')
