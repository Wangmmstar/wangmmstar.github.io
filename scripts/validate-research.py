"""Validate published pages and content preservation without build dependencies."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = "786cb08"
SITES = ["mobile-sar-copilot", "bim2workface", "bim-laser", "lunar-construction", "subsurface", "fire-investigation"]


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.tags, self.text, self.skip = [], [], 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))
        if tag in ("script", "style"):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip -= 1

    def handle_data(self, data):
        if not self.skip and data.strip():
            self.text.append(" ".join(data.split()))

    def references(self):
        return Counter((tag, key, value) for tag, attrs in self.tags for key, value in attrs.items()
                       if key in ("src", "href", "srcset", "alt", "poster", "data-src")
                       and not (tag == "link" and attrs.get("rel") == "stylesheet"))


for site in SITES:
    relative = f"projects/{site}/index.html"
    source = (ROOT / relative).read_text()
    page = Page(source)
    old = Page(subprocess.check_output(["git", "show", f"{BASE}:{relative}"], cwd=ROOT, text=True))
    expected_text = Counter(old.text)
    if site == "lunar-construction":
        # The revised Hero replaces the introduction with the existing paper metadata.
        expected_text.subtract(["We project identifiable points onto uneven terrain and use their known 3D positions to help a robot locate itself."])
        expected_text.update(["Affiliations"])
    assert +expected_text == Counter(page.text), f"Research text changed: {site}"
    removed = old.references() - page.references()
    if site == "lunar-construction":
        # The original simulation image is intentionally replaced only in the Hero.
        removed -= Counter({
            ("img", "src", "/projects/lunar-construction/projects/lunar-construction/media/lunar-simulation-scene.png"): 1,
            ("img", "alt", "Research simulation: a fixed laser projector casts identifiable points onto uneven lunar construction terrain. Original labels identify the projector, raycasting, and terrain model."): 1,
        })
    assert not removed, f"An original link or media reference was removed: {site}"
    assert sum(tag == "h1" for tag, _ in page.tags) == 1, f"Expected one Hero title: {site}"
    styles = [a["href"] for tag, a in page.tags if tag == "link" and a.get("rel") == "stylesheet"]
    hero_style = "/projects/lunar-construction/lunar-hero.css" if site == "lunar-construction" else "/projects/research-heroes.css"
    assert styles[-1] == hero_style, f"Hero CSS must load last: {site}"
    assert "/projects/research-heroes.css" in styles
    assert "/projects/research-layout.css" in styles
    assert any(tag == "meta" and a.get("name") == "viewport" for tag, a in page.tags)
    ids = [a["id"] for _, a in page.tags if "id" in a]
    assert len(ids) == len(set(ids)), f"Duplicate element IDs: {site}"
    for tag, attrs in page.tags:
        for key in ("src", "href", "poster", "data-src"):
            url = attrs.get(key, "")
            if url.startswith("/") and not url.startswith("//"):
                target = ROOT / url.split("#")[0].split("?")[0].lstrip("/")
                assert target.exists(), f"Missing asset: {target}"
        for item in attrs.get("srcset", "").split(","):
            url = item.strip().split(" ")[0]
            if url.startswith("/"):
                assert (ROOT / url.lstrip("/")).exists(), f"Missing srcset asset: {url}"
    print(f"{site}: content, links, media, IDs and stylesheet order preserved")

changed = subprocess.check_output(["git", "diff", "--name-only", BASE], cwd=ROOT, text=True).splitlines()
assert not any("/_astro/" in file for file in changed), "Generated assets must remain untouched"
assert not re.search(r"margin(?:-top|-left)?\s*:\s*-\d", (ROOT / "projects/research-layout.css").read_text())
print("All six pages validated; hashed build assets untouched.")
