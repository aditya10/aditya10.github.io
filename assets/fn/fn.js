// Field Notes behaviour. Every control does exactly one thing.
(() => {
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  // ---- Desk <-> note transition of the menu bar (desktop only) ----
  const wide = matchMedia("(min-width: 641px)").matches;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onDesk = document.body.classList.contains("is-desk");
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
  };
  const bar = document.querySelector(".shell-bar");
  const nav = document.querySelector(".shell-nav");
  const brand = document.querySelector(".shell-bar .brand");
  const word = brand?.querySelector("b");
  const full = word?.textContent || "";
  const caret = () => { const c = document.createElement("span"); c.className = "caret"; c.setAttribute("aria-hidden", "true"); return c; };
  // horizontal offset that would put the nav back in the centre of the bar
  const toCentre = () => {
    const b = bar.getBoundingClientRect(), n = nav.getBoundingClientRect();
    return b.left + (b.width - n.width) / 2 - n.left;
  };

  if (onDesk) {
    if (session.get("fn-enter-desk") === "1" && !still) document.querySelector(".page")?.classList.add("enter");
    session.set("fn-enter-desk", "");
  } else if (wide && !still && word && session.get("fn-last") === "desk") {
    // arrived from the Desk: slide the menu right and type the name out
    word.textContent = "";
    brand.classList.add("typing");
    const c = caret(); word.after(c);
    nav.style.transform = `translateX(${toCentre()}px)`;
    nav.getBoundingClientRect();
    requestAnimationFrame(() => {
      nav.style.transition = "transform 0.7s cubic-bezier(0.2, 0.7, 0.1, 1)";
      nav.style.transform = "";
    });
    let i = 0;
    const type = setInterval(() => {
      word.textContent = full.slice(0, ++i);
      if (i >= full.length) { clearInterval(type); setTimeout(() => { c.remove(); brand.classList.remove("typing"); }, 450); }
    }, 60);
  }
  addEventListener("pageshow", (e) => {
    session.set("fn-last", onDesk ? "desk" : "page");
    if (e.persisted && !onDesk && word) { // restored by Back after leaving: put the bar back as it was
      word.textContent = full;
      brand.classList.remove("typing");
      brand.querySelectorAll(".caret").forEach((c) => c.remove());
      nav.style.transition = "";
      nav.style.transform = "";
    }
  });

  // leaving a note via the name: delete it, slide the menu back, then open the Desk
  if (!onDesk && brand) {
    brand.addEventListener("click", (e) => {
      if (!wide || still || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      const href = brand.href;
      brand.classList.add("typing");
      const c = caret(); word.after(c);
      nav.style.transition = "transform 0.6s cubic-bezier(0.2, 0.7, 0.1, 1)";
      nav.style.transform = `translateX(${toCentre()}px)`;
      let i = word.textContent.length;
      const del = setInterval(() => {
        word.textContent = full.slice(0, --i);
        if (i <= 0) {
          clearInterval(del);
          session.set("fn-enter-desk", "1");
          setTimeout(() => (location.href = href), 120);
        }
      }, 38);
    });
  }

  // ---- theme: paper / night (falls back to system preference) ----
  document.querySelectorAll("[data-action=theme]").forEach((b) =>
    b.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "night" ? "paper" : "night";
      store.set("fn-theme", root.dataset.theme);
    })
  );

  // ---- mobile menu: opens the nav sheet, nothing else ----
  const menuBtn = document.querySelector("[data-action=menu]");
  const sheet = document.getElementById("nav-sheet");
  const setMenu = (open) => { if (!sheet) return; sheet.hidden = !open; menuBtn.setAttribute("aria-expanded", open); };
  menuBtn?.addEventListener("click", (e) => { e.stopPropagation(); setMenu(sheet.hidden); });
  document.addEventListener("click", (e) => sheet && !sheet.hidden && !sheet.contains(e.target) && setMenu(false));

  // ---- note data (title, notebook, date, opening line), built by Jekyll ----
  let NOTES = null, loading = null;
  const notes = () => (loading ||= fetch("/notes/previews.json").then((r) => r.json()).then((d) => (NOTES = d)).catch(() => (NOTES = {})));
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // ---- hover previews: desktop pointers only ----
  const canHover = matchMedia("(hover: hover) and (pointer: fine)");
  const card = document.createElement("div");
  card.className = "preview";
  card.setAttribute("role", "tooltip");
  card.innerHTML = '<div class="card glass"></div>';
  document.body.appendChild(card);
  let openT, closeT, current, wanted; // wanted: the link the reader is pointing at or focused on

  const fill = (n) => {
    card.firstChild.innerHTML =
      `<div class="meta"><span class="label">${esc(n.notebook)} · ${esc(n.date)}</span></div>` +
      `<h4>${esc(n.title)}</h4>` + (n.excerpt ? `<p>${esc(n.excerpt)}</p>` : "");
  };
  const place = (a) => {
    const r = a.getBoundingClientRect();
    const w = card.offsetWidth, h = card.offsetHeight;
    let left = Math.min(Math.max(12, r.left), innerWidth - w - 12);
    let top = r.bottom + 8;
    if (top + h > innerHeight - 12) top = r.top - h - 8;
    card.style.left = left + "px";
    card.style.top = top + "px";
  };
  const open = (a, delay) => {
    clearTimeout(closeT);
    clearTimeout(openT);
    openT = setTimeout(async () => {
      const n = (await notes())[a.dataset.preview];
      if (!n || wanted !== a) return;
      current = a;
      fill(n);
      place(a);
      card.classList.add("open");
    }, delay);
  };
  const close = (delay = 160) => {
    clearTimeout(openT);
    closeT = setTimeout(() => { card.classList.remove("open"); current = null; }, delay);
  };
  if (canHover.matches && document.querySelector("a[data-preview]")) (window.requestIdleCallback || setTimeout)(() => notes());
  document.querySelectorAll("a[data-preview]").forEach((a) => {
    a.addEventListener("mouseenter", () => { wanted = a; canHover.matches && open(a, 300); });
    a.addEventListener("mouseleave", () => { wanted = null; close(); });
    a.addEventListener("focus", () => { wanted = a; canHover.matches && open(a, 0); });
    a.addEventListener("blur", () => { wanted = null; close(0); });
  });
  card.addEventListener("mouseenter", () => clearTimeout(closeT));
  card.addEventListener("mouseleave", () => close());
  addEventListener("scroll", () => current && close(0), { passive: true });

  // ---- search: / or Cmd/Ctrl+K opens, Esc closes ----
  const search = document.querySelector(".search");
  const input = search?.querySelector("input");
  const list = search?.querySelector("ul");
  let filter = "all";
  const render = () => {
    const q = (input.value || "").toLowerCase();
    list.innerHTML = Object.values(NOTES || {})
      .filter((n) => (filter === "all" || n.notebook.toLowerCase() === filter) && (n.title + " " + n.excerpt).toLowerCase().includes(q))
      .map((n) => `<li><a href="${esc(n.url)}"><span>${esc(n.title)}</span><span class="label">${esc(n.notebook)}</span></a></li>`)
      .join("") || '<li class="label" style="padding:.8rem">No notes match.</li>';
  };
  const openSearch = async () => { search.classList.add("open"); input.value = ""; input.focus(); await notes(); render(); };
  const closeSearch = () => search.classList.remove("open");
  document.querySelectorAll("[data-action=search]").forEach((b) => b.addEventListener("click", openSearch));
  search?.addEventListener("click", (e) => e.target === search && closeSearch());
  input?.addEventListener("input", render);
  search?.querySelectorAll(".filters button").forEach((b) =>
    b.addEventListener("click", () => {
      filter = b.dataset.filter;
      search.querySelectorAll(".filters button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      render();
    })
  );
  addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
    if (search && ((e.key === "/" && !typing) || (e.key === "k" && (e.metaKey || e.ctrlKey)))) { e.preventDefault(); openSearch(); }
    if (e.key === "Escape") { closeSearch(); close(0); setMenu(false); }
  });

  // ---- notebook tabs ----
  document.querySelectorAll("[role=tablist]").forEach((tl) => {
    const tabs = [...tl.querySelectorAll("[role=tab]")];
    tabs.forEach((t) =>
      t.addEventListener("click", () => {
        t.scrollIntoView({ inline: "nearest", block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        tabs.forEach((x) => {
          const on = x === t;
          x.setAttribute("aria-selected", on);
          document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
        });
      })
    );
  });

  // ---- turn to a random page ----
  document.querySelectorAll("[data-action=random]").forEach((b) =>
    b.addEventListener("click", async () => {
      const pages = Object.values(await notes()).map((n) => n.url).filter((u) => u !== location.pathname);
      if (pages.length) location.href = pages[Math.floor(Math.random() * pages.length)];
    })
  );

  // ---- marginalia on small screens: tap the asterisk to show the note ----
  // desktop floats the note into the margin beside its paragraph (so it must come first);
  // on small screens it opens *below* the paragraph instead
  const narrow = matchMedia("(max-width: 960px)");
  const margins = [];
  document.querySelectorAll("aside.margin").forEach((m, i) => {
    const p = m.nextElementSibling;
    if (!p) return;
    margins.push([m, p]);
    m.id ||= "mn" + (i + 1);
    const b = document.createElement("button");
    b.className = "mn-toggle";
    b.setAttribute("aria-controls", m.id);
    b.setAttribute("aria-expanded", "false");
    b.setAttribute("aria-label", "Show margin note");
    b.textContent = "✱";
    p.append(b);
  });
  const placeMargins = () => margins.forEach(([m, p]) => (narrow.matches ? p.after(m) : p.before(m)));
  placeMargins();
  narrow.addEventListener("change", placeMargins);
  document.querySelectorAll(".mn-toggle").forEach((b) =>
    b.addEventListener("click", () => {
      const m = document.getElementById(b.getAttribute("aria-controls"));
      const show = !m.classList.contains("show");
      m.classList.toggle("show", show);
      b.setAttribute("aria-expanded", show);
    })
  );

  // ---- copy link ----
  document.querySelectorAll("[data-action=copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const label = b.querySelector("span");
      try { await navigator.clipboard.writeText(location.href); label.textContent = "Copied"; }
      catch { label.textContent = "Copy failed"; }
      setTimeout(() => (label.textContent = "Copy link"), 1600);
    })
  );

  // ---- photo gallery: full screen, turning the pages of a field notebook ----
  const contact = document.querySelector("[data-gallery]");
  if (contact) {
    const frames = [...contact.querySelectorAll("a[href]")];
    const g = document.createElement("div");
    g.className = "gallery";
    g.setAttribute("role", "dialog");
    g.setAttribute("aria-modal", "true");
    g.setAttribute("aria-label", "Photo gallery");
    const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="${d}"/></svg>`;
    g.innerHTML =
      '<span class="count label"></span><div class="book"></div>' +
      `<button class="g-btn g-close" aria-label="Close gallery">${icon("M6 6l12 12M18 6L6 18")}</button>` +
      `<button class="g-btn g-prev" aria-label="Previous photo">${icon("M15 5l-7 7 7 7")}</button>` +
      `<button class="g-btn g-next" aria-label="Next photo">${icon("M9 5l7 7-7 7")}</button>`;
    document.body.append(g);
    const book = g.querySelector(".book"), count = g.querySelector(".count");
    const prevB = g.querySelector(".g-prev"), nextB = g.querySelector(".g-next");
    let at = 0, busy = false, opener = null;

    const leaf = (i) => {
      const a = frames[i], el = document.createElement("figure");
      el.className = "leaf";
      const t = a.querySelector("img"), w = +t.getAttribute("width") || t.naturalWidth, h = +t.getAttribute("height") || t.naturalHeight;
      el.innerHTML = `<img src="${esc(a.getAttribute("href"))}" alt="${esc(a.dataset.alt)}" width="${w}" height="${h}" style="--r: ${w / h}">` +
        (a.dataset.note ? `<p class="g-note">${esc(a.dataset.note)}</p>` : "") +
        (a.dataset.caption ? `<p class="caption">${esc(a.dataset.caption)}</p>` : "");
      return el;
    };
    const status = () => {
      count.textContent = `${String(at + 1).padStart(2, "0")} / ${String(frames.length).padStart(2, "0")}`;
      prevB.disabled = at === 0;
      nextB.disabled = at === frames.length - 1;
      [at - 1, at + 1].forEach((k) => frames[k] && (new Image().src = frames[k].getAttribute("href")));
    };
    const show = (i) => { book.replaceChildren(leaf(i)); at = i; status(); };
    const turn = (dir) => {
      const to = at + dir;
      if (busy || to < 0 || to >= frames.length) return;
      const cur = book.lastElementChild, next = leaf(to);
      if (still) { show(to); return; }
      busy = true;
      if (dir > 0) { // the current page lifts away to the left, revealing the next one beneath it
        book.prepend(next);
        cur.classList.add("out-next");
        cur.addEventListener("animationend", () => { cur.remove(); busy = false; }, { once: true });
      } else { // the previous page swings back in over the current one
        next.classList.add("in-prev");
        book.append(next);
        next.addEventListener("animationend", () => { next.classList.remove("in-prev"); cur.remove(); busy = false; }, { once: true });
      }
      at = to;
      status();
    };
    const openG = (i, from) => {
      opener = from;
      show(i);
      g.classList.add("open");
      root.style.overflow = "hidden";
      g.querySelector(".g-close").focus();
    };
    const closeG = () => {
      g.classList.remove("open");
      root.style.overflow = "";
      opener?.focus();
    };
    frames.forEach((a, i) => a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      openG(i, a);
    }));
    g.querySelector(".g-close").addEventListener("click", closeG);
    prevB.addEventListener("click", () => turn(-1));
    nextB.addEventListener("click", () => turn(1));
    g.addEventListener("click", (e) => e.target === g && closeG());
    addEventListener("keydown", (e) => {
      if (!g.classList.contains("open")) return;
      if (e.key === "ArrowRight") turn(1);
      else if (e.key === "ArrowLeft") turn(-1);
      else if (e.key === "Escape") closeG();
    });
    let x0 = null; // swipe on touch screens
    g.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") x0 = e.clientX; });
    g.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1);
    });
  }

  // ---- video clips: play muted only while on screen, never with reduced motion ----
  const clips = document.querySelectorAll("video.clip");
  if (clips.length && !still && "IntersectionObserver" in window) {
    const vo = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) e.target.play().catch(() => {});
      else e.target.pause();
    }), { threshold: 0.5 });
    clips.forEach((v) => vo.observe(v));
  }

  // ---- reactions: embed the original post once it scrolls near, keep the quote as a fallback ----
  const embeds = document.querySelectorAll("[data-embed]");
  if (embeds.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const url = e.target.dataset.embed;
      if (!/^https:\/\/(twitter|x)\.com\//.test(url)) return;
      e.target.innerHTML = `<blockquote class="twitter-tweet" data-dnt="true"><a href="${esc(url)}"></a></blockquote>`;
      const s = document.createElement("script");
      s.src = "https://platform.x.com/widgets.js"; // X's official embed script
      s.async = true;
      // only hide the saved quote once X has really drawn the post (it sometimes "renders" an empty frame)
      s.onload = () => window.twttr?.events?.bind("rendered", () => {
        let tries = 0;
        const check = setInterval(() => {
          const frame = e.target.querySelector("iframe");
          if (frame && frame.offsetHeight > 60) { clearInterval(check); e.target.closest(".responding")?.classList.add("embedded"); }
          else if (++tries > 20) { clearInterval(check); e.target.replaceChildren(); } // gave up: keep the quote, drop the empty frame
        }, 250);
      });
      document.head.append(s);
    }), { rootMargin: "400px" });
    embeds.forEach((el) => io.observe(el));
  }
})();
