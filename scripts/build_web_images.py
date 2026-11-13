#!/usr/bin/env python3
"""Build public-site images from pre-existing owner's assets and CC BY licensed sources.

Sources are public repository figures and (for one paper) an MDPI figure; no
private data or unpublished research materials are used. Keeps originals intact.
"""
from pathlib import Path
from io import BytesIO
from urllib.request import Request, urlopen
import sys
from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets'
OUT.mkdir(exist_ok=True)

SOURCES = {
 'project-recovery.webp': 'https://raw.githubusercontent.com/Yule-Cai/llm_task_recovery/main/figures/fig_map_viz_recovery.png',
 'project-navigation.webp': 'https://raw.githubusercontent.com/Yule-Cai/Decoupled-Dual-Brain-Nav/main/docs/fig4_benchmark_panel.png',
 'project-optimization.webp': 'https://raw.githubusercontent.com/Yule-Cai/Kinematic-Aware-IHO/main/results/planned_paths/Path_Map4.png',
 'project-hand.webp': 'https://raw.githubusercontent.com/Yule-Cai/shadow-hand-asl/main/docs/simulation/1/12.png',
 # MDPI figure, CC BY 4.0; attribution remains in website figure caption.
 'paper-iho.webp': 'https://mdpi-res.com/sensors/sensors-26-02416/article_deploy/html/images/sensors-26-02416-g001-550.jpg',
}

def normalize(im):
    im = ImageOps.exif_transpose(im)
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        return im.convert('RGBA')
    return im.convert('RGB')

def save_webp(im, target, max_dim, quality=83):
    im = normalize(im)
    im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    im.save(target, 'WEBP', quality=quality, method=6, exact=True)
    print(f'OK {target.relative_to(ROOT)}: {im.width}x{im.height} {target.stat().st_size:,} bytes')

avatar = ROOT / 'profile.png'
if not avatar.exists():
    raise SystemExit('Missing original profile.png: refusing to create a placeholder')
with Image.open(avatar) as im:
    im.load()
    save_webp(im.copy(), OUT/'profile-420.webp', 420, 82)
    save_webp(im.copy(), OUT/'profile-900.webp', 900, 84)

success = 0
for name, url in SOURCES.items():
    try:
        req = Request(url, headers={'User-Agent': 'YuleCaiPortfolioAssetBuilder/1.0', 'Accept': 'image/*'})
        with urlopen(req, timeout=25) as response:
            raw = response.read(12*1024*1024+1)
        if len(raw)>12*1024*1024:
            raise ValueError('image too large')
        with Image.open(BytesIO(raw)) as im:
            im.load()
            save_webp(im, OUT/name, 1150 if name.startswith('project-') else 850, 85)
        success += 1
    except (OSError, ValueError, UnidentifiedImageError) as e:
        # Remote site may temporarily block downloads. The page retains its remote and SVG fallback.
        print(f'WARN {name}: {type(e).__name__}: {e}', file=sys.stderr)

print(f'Completed: avatar variants + {success}/{len(SOURCES)} sourced figures')