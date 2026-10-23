#!/usr/bin/env python3
"""Social / Desk card images for Field Notes notes: 1200x630, notebook colour + terrain.

    python3 _tools/make_cards.py <slug> [<slug> ...]
    python3 _tools/make_cards.py --all

What goes on the card, in order of preference:
  1. photography notes: a fan of up to four prints from `photos:` (pick with `card_photos: [1, 3, 5, 6]`)
  2. reactions (`responding_to:` an X/Twitter post): a screenshot of the post if given as `card_image:`,
     else the live embed if X lets it render, else a quote card of the post's own words
     (`responding_quote`, `responding_author`)
  3. any other note: its own image (`card_image:`, else `cover:`, else the first image or video poster in the body)
  4. nothing visual: the note's title on the terrain

Writes assets/notes/<slug>/<slug>-card.jpg. Rendered with headless Chrome so it matches the site's look.
"""
import contextlib
import functools
import html
import http.server
import pathlib
import threading
import re
import subprocess
import sys
import tempfile

import yaml
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
W, H = 1200, 630
IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif")


def front_matter(path):
    text = path.read_text(encoding="utf-8")
    _, fm, body = text.split("---", 2)
    return yaml.safe_load(fm) or {}, body


def file_url(site_path):
    """Cards are rendered from a local web server rooted at the repo, so site paths work as-is."""
    return site_path


def body_image(body):
    for m in re.finditer(r'(?:src|poster)="([^"]+)"|!\[[^\]]*\]\(([^)\s]+)', body):
        src = m.group(1) or m.group(2)
        if src.lower().endswith(IMAGE_EXT) and not src.startswith("http"):
            return src
    return None


def stage_html(fm, body, embed=True):
    photos = fm.get("photos") or []
    if photos:
        picks = fm.get("card_photos") or list(range(1, min(4, len(photos)) + 1))
        tilt = {1: [0], 2: [-4, 4], 3: [-6, 1, 6], 4: [-8, -2.5, 2.5, 8]}[len(picks)]
        prints = "".join(
            f'<div class="print" style="--r:{tilt[i]}deg"><img src="{file_url(photos[n - 1]["src"])}"></div>'
            for i, n in enumerate(picks)
        )
        return f'<div class="fan">{prints}</div>', False
    url = fm.get("responding_to", "")
    if url and fm.get("card_image"):
        return f'<div class="print single"><img src="{file_url(fm["card_image"])}"></div>', False
    if url and not embed:
        quote = html.escape(fm.get("responding_quote", ""))
        by = html.escape(fm.get("responding_author", ""))
        return (f'<figure class="quote"><span class="kicker">Responding to</span><blockquote>{quote}</blockquote>'
                f'<figcaption>{by}</figcaption></figure>'), False
    if re.match(r"https://(twitter|x)\.com/", url):
        return (f'<div class="post"><blockquote class="twitter-tweet" data-dnt="true" data-conversation="none">'
                f'<a href="{html.escape(url)}"></a></blockquote></div>'
                '<script async src="https://platform.x.com/widgets.js"></script>'), True
    img = fm.get("card_image") or fm.get("cover") or body_image(body)
    if img:
        return f'<div class="print single"><img src="{file_url(img)}"></div>', False
    return f'<h1 class="title">{html.escape(fm.get("title", ""))}</h1>', False


def card_html(fm, body, notebook, embed=True):
    stage, _ = stage_html(fm, body, embed)
    terrain = f"/assets/fn/terrain/{notebook['terrain']}.svg"
    grain = ("data:image/svg+xml," "%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='g'%3E"
             "%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='2' stitchTiles='stitch'/%3E"
             "%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=Fraunces:opsz,wght@9..144,400&family=Jost:wght@500&display=swap">
<style>
html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; }}
body {{ position: relative; background: {notebook['color']}; font-family: Jost, sans-serif; }}
.terrain {{ position: absolute; inset: 0; background: url("{terrain}") center / cover no-repeat; }}
.shade {{ position: absolute; inset: 0; background: radial-gradient(120% 90% at 30% 0%, rgba(255,255,255,.07), transparent 60%), linear-gradient(180deg, transparent 35%, rgba(0,0,0,.3)); }}
.grain {{ position: absolute; inset: 0; background: url("{grain}") 0 0 / 320px; opacity: .22; mix-blend-mode: overlay; }}
.stage {{ position: absolute; inset: 44px 56px 92px; display: flex; align-items: center; justify-content: center; }}
.print {{ background: #f3ece0; padding: 11px; border-radius: 3px; box-shadow: 0 2px 5px rgba(0,0,0,.28), 0 34px 60px -24px rgba(0,0,0,.7); }}
.print img {{ display: block; max-height: 448px; max-width: 1060px; border-radius: 1px; }}
.fan {{ display: flex; align-items: center; justify-content: center; }}
.fan .print {{ margin: 0 -26px; transform: rotate(var(--r)); }}
.fan .print img {{ max-height: 370px; max-width: 300px; }}
.post {{ width: 550px; }}
.post .twitter-tweet {{ margin: 0 !important; }}
.quote {{ margin: 0; max-width: 820px; padding: 34px 40px 30px; background: #f3ece0; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,.28), 0 34px 60px -24px rgba(0,0,0,.7); }}
.quote .kicker {{ font: 500 13px/1 Jost, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #6e6a62; }}
.quote blockquote {{ margin: 16px 0 14px; font: 400 54px/1.1 Fraunces, Georgia, serif; color: #1e1a15; }}
.quote figcaption {{ font: 500 15px/1.3 Jost, sans-serif; letter-spacing: .08em; color: #4a433a; }}
.title {{ margin: 0; max-width: 960px; text-align: center; color: #f6f1e7; font: 400 64px/1.05 Fraunces, Georgia, serif; text-shadow: 0 2px 20px rgba(0,0,0,.3); }}
.brand {{ position: absolute; left: 56px; bottom: 34px; display: flex; align-items: baseline; gap: 16px; color: #f3ebda; }}
.brand b {{ font: 800 30px/1 "Big Shoulders Display", sans-serif; letter-spacing: .05em; text-transform: uppercase; }}
.brand span {{ font: 500 13px/1 Jost, sans-serif; letter-spacing: .16em; text-transform: uppercase; opacity: .75; }}
</style></head><body>
<div class="terrain"></div><div class="shade"></div><div class="grain"></div>
<div class="stage">{stage}</div>
<div class="brand"><b>Field Notes</b><span>{html.escape(notebook['name'])}</span></div>
</body></html>"""


def render(slug, notebooks):
    note = ROOT / "_notes" / f"{slug}.md"
    fm, body = front_matter(note)
    notebook = notebooks[fm["notebook"]]
    _, needs_network = stage_html(fm, body)
    out = ROOT / "assets" / "notes" / slug / f"{slug}-card.jpg"
    out.parent.mkdir(parents=True, exist_ok=True)
    page = ROOT / "_tools" / ".card.html"  # temporary; served from the repo root, then deleted
    page.write_text(card_html(fm, body, notebook), encoding="utf-8")
    try:
        with serve() as port, tempfile.TemporaryDirectory() as tmp:
            if needs_network:  # does the embedded post actually render? if not, use the quote card
                dom = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--virtual-time-budget=25000", "--dump-dom",
                                      f"http://127.0.0.1:{port}/_tools/.card.html"], capture_output=True, text=True).stdout
                if "twitter-tweet-rendered" not in dom:
                    print(f"{slug}: the X post would not render headlessly; using a quote card (or set card_image: to a screenshot)")
                    page.write_text(card_html(fm, body, notebook, embed=False), encoding="utf-8")
                    needs_network = False
            shot = pathlib.Path(tmp) / "card.png"
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            f"--window-size={W},{H}", "--force-device-scale-factor=1",
                            f"--virtual-time-budget={25000 if needs_network else 6000}",
                            f"--screenshot={shot}", f"http://127.0.0.1:{port}/_tools/.card.html"],
                           check=True, capture_output=True)
            Image.open(shot).convert("RGB").crop((0, 0, W, H)).save(out, "JPEG", quality=88, optimize=True, progressive=True)
    finally:
        page.unlink(missing_ok=True)
    print(f"{slug}: {out.relative_to(ROOT)}")


@contextlib.contextmanager
def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        yield server.server_address[1]
    finally:
        server.shutdown()


def main():
    data = yaml.safe_load((ROOT / "_data" / "fieldnotes.yml").read_text())
    notebooks = {n["id"]: n for n in data["notebooks"]}
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    slugs = [p.stem for p in sorted((ROOT / "_notes").glob("*.md"))] if args == ["--all"] else args
    for slug in slugs:
        render(slug, notebooks)


if __name__ == "__main__":
    main()
