# frozen_string_literal: true

# Field Notes build features for the `notes` collection:
#   [[slug]], [[slug|label]], [[slug#anchor]] links between notes
#   "Referenced by" backlinks, threads, word counts, reading time, opening-line excerpts
#
# Runs at build time only; nothing here ships JavaScript.
require "cgi"
require "time"

module FieldNotes
  # [[slug|label]]: before Markdown runs, the "|" is swapped for "¦" so tables can't swallow it
  WIKILINK = /\[\[([a-z0-9][a-z0-9\-]*)(#[A-Za-z0-9_\-]+)?(?:[|¦]([^\]]+))?\]\]/.freeze
  WORDS_PER_MINUTE = 230

  module Text
    module_function

    # The note body as plain prose: Liquid, HTML, math and Markdown syntax removed.
    def plain(src)
      s = src.dup
      s.gsub!(/^```.*?^```/m, " ")
      s.gsub!(/\{%.*?%\}/m, " ")
      s.gsub!(/\{\{.*?\}\}/m, " ")
      s.gsub!(/\$\$.*?\$\$/m, " ")
      s.gsub!(/<[^>]+>/, " ")
      s.gsub!(WIKILINK) { Regexp.last_match(3) || Regexp.last_match(1).tr("-", " ") }
      s.gsub!(/!\[[^\]]*\]\([^)]*\)/, " ")
      s.gsub!(/\[([^\]]*)\]\([^)]*\)/, '\1')
      s.gsub!(/^\s{0,3}(?:#+|>|[*+-]|\d+\.)\s+/, "")
      s.gsub!(/[*_`~]/, "")
      s
    end

    def words(src)
      plain(src).scan(/[[:alnum:]][[:alnum:]'’\-]*/).size
    end

    # First paragraph of prose (skips components, headings, images, math), cut at a word boundary.
    def excerpt(src, limit = 220)
      para = src.split(/\n\s*\n/).map(&:strip).find do |p|
        !p.empty? && !p.start_with?("{%", "<", "#", "!", "$$", "|", "---", "```")
      end
      return "" unless para

      text = plain(para).gsub(/\s+/, " ").strip
      return text if text.length <= limit

      "#{text[0, limit].sub(/\s+\S*\z/, '')}…"
    end
  end

  def self.to_time(value)
    case value
    when Time then value
    when Date then value.to_time
    when String then Time.parse(value)
    end
  end

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      notes = site.collections["notes"]&.docs || []
      config = site.data["fieldnotes"] || {}
      notebooks = (config["notebooks"] || []).to_h { |n| [n["id"], n] }
      by_slug = notes.to_h { |d| [d.data["slug"], d] }

      notes.each do |d|
        nb = notebooks[d.data["notebook"]]
        Jekyll.logger.warn "Field Notes:", "#{d.relative_path}: unknown notebook #{d.data['notebook'].inspect}" unless nb
        words = Text.words(d.content)
        d.data["fn_notebook"] = nb
        d.data["fn_words"] = words
        d.data["fn_minutes"] = [(words.to_f / WORDS_PER_MINUTE).ceil, 1].max
        d.data["fn_excerpt"] = Text.excerpt(d.content)
        d.data["fn_updated"] = FieldNotes.to_time(d.data["updated"]) || d.date
        d.data["fn_backlinks"] = []
        card = "/assets/notes/#{d.data['slug']}/#{d.data['slug']}-card.jpg"
        if File.exist?(File.join(site.source, card))
          d.data["fn_card"] = card
        else
          Jekyll.logger.warn "Field Notes:", "#{d.relative_path}: no card image; run python3 _tools/make_cards.py #{d.data['slug']}"
        end
      end

      # backlinks: every note learns which notes link to it
      notes.each do |d|
        d.content.scan(WIKILINK).map(&:first).uniq.each do |slug|
          target = by_slug[slug]
          if target.nil?
            Jekyll.logger.warn "Field Notes:", "#{d.relative_path}: [[#{slug}]] does not match any note"
          elsif target != d
            target.data["fn_backlinks"] << d
          end
        end
      end

      # threads: notes sharing a `thread:` id, oldest first
      thread_titles = config["threads"] || {}
      threads = notes.select { |d| d.data["thread"] }.group_by { |d| d.data["thread"] }
      threads.each do |id, docs|
        docs.sort_by!(&:date)
        docs.each_with_index do |d, i|
          d.data["fn_thread"] = {
            "id" => id, "title" => thread_titles[id] || id,
            "index" => i + 1, "count" => docs.size,
            "prev" => i.positive? ? docs[i - 1] : nil, "next" => docs[i + 1], "notes" => docs
          }
        end
      end

      recent = notes.sort_by { |d| d.data["fn_updated"] }.reverse
      active = threads.values.select { |docs| docs.size > 1 }.max_by { |docs| docs.map { |d| d.data["fn_updated"] }.max }
      site.data["fn"] = {
        "recent" => recent,
        "by_notebook" => notebooks.keys.to_h { |id| [id, recent.select { |d| d.data["notebook"] == id }] },
        "active_thread" => active && { "title" => thread_titles[active.first.data["thread"]] || active.first.data["thread"], "notes" => active },
        "by_slug" => by_slug,
      }
    end
  end

  Jekyll::Hooks.register :notes, :pre_render do |doc, _payload|
    doc.content = doc.content.gsub(WIKILINK) { Regexp.last_match(0).sub("|", "¦") }
  end

  # Turn [[links]] into real links once the note is HTML, so links inside components work too.
  # Code (<pre>, <code>) is left untouched.
  Jekyll::Hooks.register :notes, :post_convert do |doc|
    by_slug = doc.site.data.dig("fn", "by_slug") || {}
    doc.content = doc.content.split(%r{(<pre[\s>].*?</pre>|<code[\s>].*?</code>)}m).map do |chunk|
      next chunk if chunk.start_with?("<pre", "<code")

      chunk.gsub(WIKILINK) do
        slug, anchor, label = Regexp.last_match(1), Regexp.last_match(2), Regexp.last_match(3)
        target = by_slug[slug]
        # a label is already HTML at this point; a title from front matter is not
        text = label || CGI.escapeHTML(target&.data&.[]("short_title") || target&.data&.[]("title") || slug)
        if target
          %(<a class="wikilink" href="#{target.url}#{anchor}" data-preview="#{slug}">#{text}</a>)
        else
          %(<span class="wikilink missing">#{text}</span>)
        end
      end
    end.join
  end
end
