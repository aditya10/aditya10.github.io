#!/usr/bin/env python3
"""Word-level diff between Aditya's raw text and a published Field Notes note.

Proves that publishing changed only formatting (and any listed spelling fixes):
    python3 _tools/worddiff.py _sources/<slug>.md _notes/<slug>.md

Words are compared exactly (case and punctuation attached to words count).
Ignored on the note side: front matter (except the title), Markdown/HTML syntax,
UI labels (<span class="label">), and include parameters that are not Aditya's
words (src, alt, n, label, date, pickup). Exit code 0 = identical, 1 = differences.
"""
import difflib
import re
import sys

AUTHOR_PARAMS = ("text", "caption", "hand", "was", "is")


def note_words(path):
    src = open(path, encoding="utf-8").read()
    title = ""
    if src.startswith("---"):
        _, fm, src = src.split("---", 2)
        m = re.search(r'^title:\s*"?(.*?)"?\s*$', fm, re.M)
        title = m.group(1) if m else ""
    # keep only Aditya's words from components
    def include(m):
        params = dict(re.findall(r'(\w+)="((?:[^"\\]|\\.)*)"', m.group(0)))
        return " ".join(params[k] for k in AUTHOR_PARAMS if k in params)
    src = re.sub(r"\{%\s*include\b.*?%\}", include, src, flags=re.S)
    src = re.sub(r"\{%.*?%\}|\{\{.*?\}\}", " ", src, flags=re.S)
    src = re.sub(r'<span class="label">.*?</span>', " ", src, flags=re.S)
    src = re.sub(r"<[^>]+>", " ", src)
    src = re.sub(r"\[\[([a-z0-9-]+)(?:#[\w-]+)?(?:[|¦]([^\]]+))?\]\]", lambda m: m.group(2) or "", src)
    return title, words(markdown_to_text(src))


def markdown_to_text(src):
    """Markdown syntax removed, the same way for both sides."""
    src = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", src)
    src = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", src)
    src = re.sub(r"^\s{0,3}(?:#+|>|[*+-]|\d+\.)\s+", "", src, flags=re.M)
    src = re.sub(r"\$\$", " ", src)
    return re.sub(r"[*_`~]", "", src)


def words(text):
    text = text.replace("’", "'").replace("“", '"').replace("”", '"')
    return re.findall(r"\S+", text)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    raw = words(markdown_to_text(open(sys.argv[1], encoding="utf-8").read()))
    title, published = note_words(sys.argv[2])
    if title and raw[: len(words(title))] == words(title):
        published = words(title) + published
    print(f"title: {title}")
    ops = [op for op in difflib.SequenceMatcher(None, raw, published, autojunk=False).get_opcodes() if op[0] != "equal"]
    for tag, i1, i2, j1, j2 in ops:
        print(f"{tag:8} raw: {' '.join(raw[i1:i2])!r:40}  published: {' '.join(published[j1:j2])!r}")
    print(f"{len(raw)} raw words, {len(published)} published words, {len(ops)} difference(s)")
    sys.exit(1 if ops else 0)


if __name__ == "__main__":
    main()
