from pathlib import Path

path = Path('index.html')
html = path.read_text(encoding='utf-8')

old_bg = """            background:\n                linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)),\n                url('images/homepage-bg.jpg') center center / cover no-repeat fixed;\n"""
new_bg = """            background-color: #f5f7fb;\n            background-image:\n                linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)),\n                url('/images/homepage-bg.jpg?v=20260904');\n            background-position: center center;\n            background-size: cover;\n            background-repeat: no-repeat;\n            background-attachment: fixed;\n"""
if old_bg in html:
    html = html.replace(old_bg, new_bg, 1)

scholar_search = 'https://scholar.google.com/scholar?q=author%3A%22Yule+Cai%22'
html = html.replace('https://scholar.google.com/citations?user=YOUR_ID', scholar_search)

path.write_text(html, encoding='utf-8')
