# adityachinchure.com

Aditya's personal site: a Jekyll 4.3 site with two parts.

- **Main site** (Klise theme): `index.md`, `projects.md`, `news.md`, `_posts/` (projects), `_layouts/{default,master,post,…}`, `_sass/klise`. Leave it as is unless asked.
- **Field Notes** at `/notes/`: the blog, with its own design. Everything for it is prefixed or namespaced:
  - notes: `_notes/<slug>.md` (collection `notes`, URL `/notes/<slug>/`)
  - layouts: `_layouts/fn-base.html`, `fn-note.html`, `fn-page.html`
  - includes: `_includes/fn/` (one shared top bar, footer, search, cards, writing components)
  - pages: `notes/` (Desk, notebooks, Index, `previews.json`)
  - data: `_data/fieldnotes.yml` (notebooks, statuses, threads)
  - build features: `_plugins/fieldnotes.rb` (`[[links]]`, backlinks, threads, word counts, opening lines)
  - styles and script: `assets/fn/fn.css`, `assets/fn/fn.js`, terrain drawings in `assets/fn/terrain/`
  - raw text as Aditya sent it: `_sources/<slug>.md`; word diff tool: `_tools/worddiff.py`
  - plans and decisions: `_plans/`

## Rules

1. **No AI-written content.** Every reader-visible sentence on Field Notes is Aditya's own words: titles, descriptions, captions, addenda, reaction quotes. Allowed: spelling fixes, Markdown structure, components, links on Aditya's existing words. If something is missing, ask; never invent it. Alt text is the one exception: draft literal alt text and get it approved.
2. **Posting goes through the `/field-note` skill** (`.claude/skills/field-note/SKILL.md`). It ends with a word diff and Aditya's explicit "publish".
3. **Change only what's asked.** Shared pieces (top bar, footer, cards, tokens) live in one place; check what else uses a rule before editing it, and say so before any side effect. Don't add unrequested styling.
4. **Never push, deploy, send the newsletter, or post on social media** without an explicit yes for that specific action. Work happens on the local `field-notes` branch.

## Running it

```bash
bundle exec jekyll serve --destination .jekyll-preview
```

- No `--livereload`: this Ruby has no OpenSSL, so live-reload's dependency won't load, and new gems can't be downloaded. Don't add gem dependencies without discussing it.
- Restart the server after editing `_plugins/` or `_config.yml`.
- Deploys: GitHub Pages currently builds `master` with its built-in builder, which does **not** run `_plugins/`. Field Notes needs the planned switch to a GitHub Actions build before it can go live.
