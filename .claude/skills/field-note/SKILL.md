---
name: field-note
description: Publish or update a note on Field Notes (adityachinchure.com/notes) from Aditya's own text and assets. Use whenever Aditya sends content for the blog, or asks to add an addendum, record a changed mind, update a note's status, or post photos.
---

# Posting to Field Notes

Aditya provides the words and assets. You handle structure, components, metadata, assets and the build. **Every reader-visible sentence must be Aditya's own words**; see the rules in `CLAUDE.md`.

## Allowed and not allowed

- **Allowed:** spelling and typo fixes (list each one); Markdown structure (headings, lists, emphasis, links, math, code); splitting text into paragraphs; moving Aditya's sentences into components (margin notes, tangents, captions); adding `[[links]]` on words Aditya already wrote.
- **Not allowed:** rephrasing, "improving", summarising, adding transitions, writing titles, descriptions, captions or addenda. If something is missing, **ask**.
- **Alt text** is the exception: draft literal descriptions of what each image shows, and list them for approval.

## New note

1. **Save the raw text verbatim** to `_sources/<slug>.md`. Slugs are short, lowercase, hyphenated, and never change once published.
2. **Pick the notebook** (`_data/fieldnotes.yml`) and say why:
   - `current-work`: unpublished ideas and work in progress; also needs `status` (exploring, building, paused, published)
   - `published-research`: write-ups of published papers; add `venue`
   - `thoughts`: musings, opinion pieces, and reactions (add `responding_to`)
   - `photography`: photo entries (add `photos`, and optionally `hero`, `camera`, `lens`, `edit`, `region`)
   - `talks`: public slides
3. **Tags:** reuse tags already used in `_notes/` where they fit; propose any new tag explicitly.
4. **Title:** use Aditya's. If none was given, ask (you may suggest a phrase taken verbatim from the text).
5. **Links:** search `_notes/` for related notes. Propose `[[slug]]` links on existing words, and `thread:` if the note continues a line of work (add the thread's title to `_data/fieldnotes.yml`).
6. **Format** the body using the components below.
7. **Assets:** put files in `assets/notes/<slug>/`. For photos, strip GPS (keep camera and lens data), resize to at most 2400 px on the long edge, and convert to JPEG/WebP. Record each photo's `w`, `h` and `exif`. Name files `<slug>-01.jpg`, `<slug>-02.jpg`, and so on.
8. **Card image:** `python3 _tools/make_cards.py <slug>` makes `assets/notes/<slug>/<slug>-card.jpg` (1200×630: notebook colour and terrain, with the note's image, gallery fan, or reacted-to post). It's used on the Desk and in social previews. Look at it; pick gallery frames with `card_photos:` or a specific image with `card_image:` (for reactions, a screenshot of the post) and re-run if needed.
9. **Check:**
   - `bundle exec jekyll build -d .jekyll-preview` builds with no `Field Notes:` warnings
   - `python3 _tools/worddiff.py _sources/<slug>.md _notes/<slug>.md` shows only spelling fixes and intended moves
   - the note on the Desk, its notebook page and the Index, at desktop and phone width
10. **Report to Aditya:** the preview link, the word diff, each spelling fix, the drafted alt text, the card image, notebook, tags, links, and the front matter. Wait for an explicit "publish".
11. **On "publish":** commit `Add note: <title>`. Don't push unless asked. Ask separately before any newsletter send; never post to social media.

## Front matter

```yaml
title: "Aditya's title"
short_title: Spotlight          # optional; used for thread stops and unlabelled [[links]]
notebook: published-research    # current-work | published-research | thoughts | photography | talks
status: building                # current-work only
venue: ECCV 2026                # published-research only
date: 2026-10-21                # when first noted
updated: 2026-10-21             # last revisited (addendum, changed mind); omit until then
thread: surprise-in-video       # optional; id from _data/fieldnotes.yml
cover: /assets/notes/<slug>/<slug>-01.jpg   # optional; card image and social preview
description: "..."              # optional; Aditya's words only. Defaults to the opening line
tags: [video, evaluation]
math: true                      # only when the note has math
bibtex: |                       # optional; adds a Cite button
  @inproceedings{...}
responding_to: https://x.com/...  # thoughts reactions: the post is embedded
responding_quote: "..."           # fallback quote of the post (the post's own words)
responding_author: "@handle"
photos:                           # photography
  - src: /assets/notes/<slug>/<slug>-01.jpg
    w: 1500                       # pixel size, so the page reserves space before it loads
    h: 2000
    alt: "..."                    # drafted, approved by Aditya
    caption: "..."                # Aditya's words
    exif: { aperture: "f/4", shutter: "1/121s", iso: 80, focal: "24mm" }  # from the original's EXIF; shown under the frame and handwritten in the gallery. Never publish dates or location
```

Photography originals go in `_sources/photos/<slug>/` (git-ignored, never published); publish 2400 px copies in `assets/notes/<slug>/`. `camera:` (note-wide, or per photo) is used in the gallery's handwritten note.

## Components

- **Link to a note:** `[[slug]]`, `[[slug|label]]`, `[[slug#anchor]]`. Backlinks ("Referenced by") are automatic.
- **Margin note:** on its own line directly before the paragraph it annotates. On phones it collapses into a ✱.
  `{% include fn/margin.html text="..." %}`, or with `label="↳ Picked up from" pickup=true hand="..."`
- **Figure:** `{% include fn/figure.html src="/assets/notes/<slug>/x.jpg" alt="..." caption="..." n="01" %}`
- **Math:** `$$ ... $$` on its own lines for display; `$$ ... $$` inline. Set `math: true`.
- **Tangent** (collapsed aside):
  ```html
  <details class="tangent" markdown="1">
  <summary><span class="label">Tangent · short label</span></summary>

  Aditya's text.
  </details>
  ```
- **Changed my mind:** `{% include fn/revision.html date="2026-10-21" was="old claim" is="new position" %}`. Set `updated:`.
- **Addendum** (dated later addition, appended at the end):
  ```html
  <section class="addendum" markdown="1">
  <span class="label">Addendum · 2026-10-21</span>

  Aditya's text.
  </section>
  ```
  Set `updated:`.

## Revisiting

- **Addendum or changed mind:** add the component, set `updated:`, save Aditya's new text to `_sources/<slug>-YYYY-MM-DD.md`, and run the word diff on it.
- **Status change** (Current Work): update `status`. When an idea becomes a paper, set `status: published`, add the Published Research note, and link the two with a shared `thread`.
- **Renames:** keep the slug. If a slug truly must change, ask first.
