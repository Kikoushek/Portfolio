/* ==========================================================================
   Kikoushek — Portfolio behaviour
   Content lives in js/data.js; this file only renders it.
   ========================================================================== */
(function () {
  "use strict";

  const SITE = window.SITE || {};
  const PROJECTS = window.PROJECTS || [];
  const SKILLS = window.SKILLS || [];
  const INVENTORY = window.INVENTORY || [];
  const ACHIEVEMENTS = window.ACHIEVEMENTS || [];
  const CATEGORIES = window.CATEGORIES || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- icons ---------- */
  const P = (d) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  const ICONS = {
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>',
    user: P('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    arrow: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    external: P('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    close: P('<path d="M6 6l12 12M18 6 6 18"/>'),
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6Z"/></svg>',
    lock: P('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    scroll: P('<path d="M8 3h11a2 2 0 0 1 2 2v2h-4M8 3a2 2 0 0 0-2 2v14a2 2 0 0 1-2 2h11a2 2 0 0 0 2-2V7M8 3a2 2 0 0 1 2 2v0M10 9h4M10 13h4"/>'),
    tree: P('<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><path d="M12 7v10M12 12H5v5M12 12h7v5"/>'),
    bag: P('<path d="M5 8h14l-1 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    mail: P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    flag: P('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    island: P('<path d="M3 11h18l-4 3-2 6-3-3-2 2-2-5Z"/><path d="M12 11V5M12 5c-2 0-4 1-5 3M12 5c2 0 4 1 5 3"/>'),
    rocket: P('<path d="M12 15l-3-3c1-5 5-9 11-9 0 6-4 10-9 11Z"/><path d="M9 12H5l2-4h4M12 15v4l4-2v-4M6 18c-1 1-1 3-1 3s2 0 3-1"/>'),
    sparkle: P('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/>'),
    bolt: P('<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>'),
    trophy: P('<path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>'),
    clock: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    gamepad: P('<path d="M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6L14 14h-4l-1 1.6A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4Z"/><path d="M7 11v3M5.5 12.5h3M16 12h.01M18 13.5h.01"/>'),
  };
  const icon = (n) => ICONS[n] || "";
  const fillIcons = (root) => $$("[data-icon]", root).forEach((el) => (el.innerHTML = icon(el.dataset.icon)));

  /* ---------- covers ---------- */
  function coverHTML(p) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + ' screenshot" loading="lazy" />';
    if (p.scene) return '<canvas data-scene="' + esc(p.scene.palette || "dusk") + '" data-seed="' + (p.scene.seed || 1) + '" aria-hidden="true"></canvas>';
    const hue = [...p.title].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
      '<div class="gen" style="background:linear-gradient(135deg,hsl(' + hue + ' 60% 22%),hsl(' + ((hue + 60) % 360) + ' 70% 12%))">' +
      esc(p.title.charAt(0)) + "</div>"
    );
  }
  function mountScenes(root) {
    if (!window.SkyScene) return;
    $$("canvas[data-scene]", root).forEach((c) => {
      if (c.dataset.mounted) return;
      c.dataset.mounted = "1";
      SkyScene.mount(c, { palette: c.dataset.scene, seed: +c.dataset.seed, interactive: true, interactiveHost: c.parentElement });
    });
  }

  function linkHTML(l, primary) {
    const ext = /^https?:/.test(l.url);
    return (
      '<a class="btn ' + (primary ? "btn-primary" : "btn-ghost") + '" href="' + esc(l.url) + '"' +
      (ext ? ' target="_blank" rel="noopener"' : "") + ">" + icon(l.icon || "external") + " " + esc(l.label) + "</a>"
    );
  }
  const chipsHTML = (list) => '<ul class="chips">' + (list || []).map((t) => '<li class="chip">' + esc(t) + "</li>").join("") + "</ul>";
  const statsHTML = (stats) =>
    '<div class="stat-row">' +
    (stats || []).map((s) => '<div class="stat"><b data-count="' + esc(s.value) + '">' + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>").join("") +
    "</div>";

  /* ---------- site basics ---------- */
  function renderBasics() {
    const name = SITE.name || "Player";
    document.title = name + " — " + (SITE.role || "Portfolio");
    $("#heroName").textContent = name;
    $("#playerName").textContent = name;
    $("#avatarLetter").textContent = name.charAt(0).toUpperCase();
    $("#playerClass").textContent = SITE.role || "";
    $("#heroIntro").textContent = SITE.intro || "";
    $("#playerLevel").textContent = "LV. " + String(SITE.level || 1).padStart(2, "0");
    $("#year").textContent = new Date().getFullYear();
    if (SITE.github) $("#navGithub").href = SITE.github;

    const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;
    $("#heroHud").innerHTML = [
      ["Quests", String(PROJECTS.length).padStart(2, "0")],
      ["Main engine", "UE 5.5"],
      ["Trophies", unlocked + "/" + ACHIEVEMENTS.length],
    ]
      .map((r) => "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>")
      .join("");

    let actions = "";
    if (SITE.github) actions += linkHTML({ label: "GitHub profile", url: SITE.github, icon: "github" }, true);
    if (SITE.email) actions += linkHTML({ label: "Send a message", url: "mailto:" + SITE.email, icon: "mail" }, false);
    actions += linkHTML({ label: "Browse quests", url: "#quests", icon: "gamepad" }, false);
    $("#contactActions").innerHTML = actions;
  }

  /* ---------- player ---------- */
  function renderPlayer() {
    const ranks = ["Novice", "Apprentice", "Adept", "Expert", "Master"];
    $("#skills").innerHTML = SKILLS.map((s) => {
      const lv = Math.max(1, Math.min(5, s.level || 1));
      let pips = "";
      for (let i = 0; i < 5; i++) pips += '<span class="pip' + (i < lv ? " on" : "") + '" style="transition-delay:' + (i * 0.08).toFixed(2) + 's"></span>';
      return (
        '<li class="skill"><div><span class="skill-name">' + esc(s.name) + '</span><span class="skill-rank">' + ranks[lv - 1] +
        '</span></div><div class="pips" aria-label="Level ' + lv + ' of 5">' + pips + "</div></li>"
      );
    }).join("");
    $("#inventory").innerHTML = INVENTORY.map((t, i) => '<li class="slot" data-key="' + ((i + 1) % 10) + '">' + esc(t) + "</li>").join("");
  }

  /* ---------- quests ---------- */
  function renderQuests() {
    const featured = PROJECTS.find((p) => p.featured);
    const rest = PROJECTS.filter((p) => p !== featured);

    if (featured) {
      $("#featured").innerHTML =
        '<article class="featured reveal">' +
        '<div class="featured-cover" data-open="' + esc(featured.id) + '" role="button" tabindex="0" aria-label="Open details for ' + esc(featured.title) + '">' + coverHTML(featured) + "</div>" +
        '<div class="featured-body">' +
        '<span class="badge">' + icon("star") + " Main quest · " + esc(featured.status || "") + "</span>" +
        "<h3>" + esc(featured.title) + "</h3>" +
        '<p class="tagline">' + esc(featured.tagline) + "</p>" +
        statsHTML(featured.stats) +
        chipsHTML(featured.tech) +
        '<div class="featured-actions">' +
        '<button class="btn btn-primary" data-open="' + esc(featured.id) + '">' + icon("scroll") + " Quest details</button>" +
        (featured.links || []).map((l) => linkHTML(l, false)).join("") +
        "</div></div></article>";
    }

    const cats = [...new Set(rest.map((p) => p.category).filter(Boolean))];
    const filters = [["all", "All", rest.length]].concat(cats.map((c) => [c, CATEGORIES[c] || c, rest.filter((p) => p.category === c).length]));
    $("#filters").innerHTML = filters
      .map((f, i) => '<button class="filter" role="tab" data-filter="' + esc(f[0]) + '" aria-selected="' + (i === 0) + '">' + esc(f[1]) + '<span class="count">' + f[2] + "</span></button>")
      .join("");
    if (filters.length < 3) $("#filters").hidden = true;

    $("#questGrid").innerHTML =
      rest
        .map(
          (p) =>
            '<article class="card reveal" role="button" tabindex="0" aria-label="Open details for ' + esc(p.title) + '" data-open="' + esc(p.id) + '" data-cat="' + esc(p.category || "") + '">' +
            '<div class="card-cover">' + coverHTML(p) + (p.status ? '<span class="card-status">' + esc(p.status) + "</span>" : "") + "</div>" +
            '<div class="card-body">' +
            '<div class="card-meta">' + esc([p.year, p.engine].filter(Boolean).join(" · ")) + "</div>" +
            "<h3>" + esc(p.title) + "</h3>" +
            "<p>" + esc(p.tagline) + "</p>" +
            chipsHTML((p.tech || []).slice(0, 4)) +
            '<span class="card-arrow">' + icon("arrow") + "</span>" +
            "</div></article>"
        )
        .join("") +
      '<div class="card locked reveal" aria-label="Locked quest slot">' +
      '<div class="lock-icon">' + icon("lock") + "</div>" +
      "<h3>??? LOCKED</h3><p>A new quest is being forged.<br />Check back soon.</p></div>";

    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (!b) return;
      $$(".filter").forEach((x) => x.setAttribute("aria-selected", x === b));
      const f = b.dataset.filter;
      $$("#questGrid .card[data-cat]").forEach((c) => c.classList.toggle("hide", f !== "all" && c.dataset.cat !== f));
    });

    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open]");
      if (t && !e.target.closest("a")) openModal(t.dataset.open);
    });
    document.addEventListener("keydown", (e) => {
      const t = e.target.closest && e.target.closest('[role="button"][data-open]');
      if (t && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openModal(t.dataset.open);
      }
    });
  }

  /* ---------- modal ---------- */
  const modal = $("#modal");
  function openModal(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    $("#modalBody").innerHTML =
      '<button class="modal-close" aria-label="Close">' + icon("close") + "</button>" +
      '<div class="modal-cover">' + coverHTML(p) + "</div>" +
      '<div class="modal-content">' +
      '<span class="badge">' + icon(p.featured ? "star" : "gamepad") + " " + esc(p.featured ? "Main quest" : CATEGORIES[p.category] || "Quest") + "</span>" +
      '<h2 id="modalTitle">' + esc(p.title) + "</h2>" +
      '<div class="modal-meta">' +
      (p.status ? "<span>Status <b>" + esc(p.status) + "</b></span>" : "") +
      (p.year ? "<span>Year <b>" + esc(p.year) + "</b></span>" : "") +
      (p.engine ? "<span>Built with <b>" + esc(p.engine) + "</b></span>" : "") +
      "</div>" +
      (p.description || [p.tagline]).map((d) => "<p>" + esc(d) + "</p>").join("") +
      (p.stats ? statsHTML(p.stats) : "") +
      (p.features && p.features.length ? "<h4>// Features</h4><ul class=\"features\">" + p.features.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ul>" : "") +
      (p.tech && p.tech.length ? "<h4>// Tech stack</h4>" + chipsHTML(p.tech) : "") +
      (p.links && p.links.length ? '<div class="modal-actions">' + p.links.map((l, i) => linkHTML(l, i === 0)).join("") + "</div>" : "") +
      "</div>";
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    document.body.style.overflow = "hidden";
    $("#modalBody").scrollTop = 0;
    mountScenes(modal);
  }
  function closeModal() {
    if (modal.close) modal.close();
    else modal.removeAttribute("open");
  }
  modal.addEventListener("close", () => {
    document.body.style.overflow = "";
    $("#modalBody").innerHTML = "";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".modal-close")) closeModal();
  });

  /* ---------- achievements ---------- */
  function renderAchievements() {
    const got = ACHIEVEMENTS.filter((a) => a.unlocked).length;
    const total = ACHIEVEMENTS.length || 1;
    $("#achProgress").innerHTML = "<span><b>" + got + "</b> / " + ACHIEVEMENTS.length + " unlocked</span><div class=\"bar\"><span data-w=\"" + Math.round((got / total) * 100) + '"></span></div>';
    $("#achGrid").innerHTML = ACHIEVEMENTS.map(
      (a) =>
        '<article class="ach reveal ' + esc(a.rarity || "common") + (a.unlocked ? "" : " locked") + '">' +
        '<div class="ach-icon">' + icon(a.unlocked ? a.icon : "lock") + "</div>" +
        "<div><h3>" + esc(a.title) + "</h3><p>" + esc(a.desc) + '</p><span class="rarity">' + esc(a.rarity || "common") + "</span></div></article>"
    ).join("");
  }

  /* ---------- reveal on scroll + counters ---------- */
  function countUp(el) {
    const raw = el.dataset.count || "";
    const m = raw.match(/^(\d+)(.*)$/);
    if (!m || reduced) return;
    const target = +m[1], suffix = m[2], t0 = performance.now(), dur = 1200;
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + suffix;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  function setupReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add("in");
          $$("[data-count]", el).forEach(countUp);
          if (el.id === "achProgress" || el.contains($("#achProgress"))) {
            const bar = $("#achProgress .bar span");
            if (bar) bar.style.width = bar.dataset.w + "%";
          }
          if (el.classList.contains("player-card")) $("#xpFill").style.width = Math.max(0, Math.min(100, SITE.xp || 0)) + "%";
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el, i) => {
      if (el.parentElement && el.parentElement.matches(".quest-grid, .ach-grid")) {
        el.style.transitionDelay = (Array.from(el.parentElement.children).indexOf(el) % 3) * 0.08 + "s";
      }
      io.observe(el);
    });
  }

  /* ---------- nav ---------- */
  function setupNav() {
    const nav = $("#nav"), links = $("#navLinks"), toggle = $("#navToggle");
    const onScroll = () => nav.classList.toggle("scrolled", scrollY > 20);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toggle.addEventListener("click", () => {
      const open = !links.classList.contains("open");
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) $$("a", links).forEach((a) => a.classList.toggle("active", a.dataset.section === e.target.id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main section[id]").forEach((s) => io.observe(s));
  }

  /* ---------- typewriter ---------- */
  function setupTypewriter() {
    const el = $("#typewriter");
    const words = SITE.typewriter && SITE.typewriter.length ? SITE.typewriter : ["games"];
    if (reduced) { el.textContent = words[0]; return; }
    let w = 0, i = 0, del = false;
    (function tick() {
      const word = words[w];
      i += del ? -1 : 1;
      el.textContent = word.slice(0, i);
      let delay = del ? 40 : 85;
      if (!del && i === word.length) { del = true; delay = 1800; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- card tilt ---------- */
  function setupTilt() {
    if (reduced || !matchMedia("(pointer: fine)").matches) return;
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(".card:not(.locked)");
      $$(".card.tilting").forEach((c) => {
        if (c !== card) { c.classList.remove("tilting"); c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
      });
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("tilting");
      card.style.setProperty("--rx", (-y * 6).toFixed(2) + "deg");
      card.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
    });
  }

  /* ---------- cursor glow ---------- */
  function setupCursor() {
    if (!matchMedia("(pointer: fine)").matches || reduced) return;
    const g = $(".cursor-glow");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; document.body.classList.add("has-cursor"); }, { passive: true });
    (function loop() {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      g.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- starfield background ---------- */
  const bg = { burst: null };
  function setupBackground() {
    const c = $("#bg"), ctx = c.getContext("2d");
    let W, H, dpr, parts = [], mx = 0, my = 0;
    const colors = ["245,198,107", "94,242,255", "155,123,255", "255,255,255"];
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, (W * H) / 14000));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.4 + 0.3,
        c: colors[Math.random() < 0.6 ? 3 : Math.floor(Math.random() * 3)],
        p: Math.random() * 6,
        vx: 0, vy: 0,
      }));
      if (reduced) draw(0);
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.y -= 0.12 * p.z + p.vy; p.x += p.vx;
        p.vx *= 0.96; p.vy *= 0.96;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        const x = p.x + mx * 18 * p.z, y = p.y + my * 18 * p.z;
        const a = (0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.0015 + p.p))) * p.z;
        ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(x, y, p.r * p.z * 1.4, 0, 6.283); ctx.fill();
      }
    }
    function loop(t) {
      if (!document.hidden) draw(t);
      requestAnimationFrame(loop);
    }
    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { mx = e.clientX / W - 0.5; my = e.clientY / H - 0.5; }, { passive: true });
    resize();
    if (!reduced) requestAnimationFrame(loop);
    bg.burst = function () {
      for (const p of parts) {
        const dx = p.x - W / 2, dy = p.y - H / 2, d = Math.hypot(dx, dy) || 1;
        p.vx = (dx / d) * 9 * p.z; p.vy = -(dy / d) * 9 * p.z;
        p.c = colors[0];
      }
    };
  }

  /* ---------- hero scene ---------- */
  function setupHeroScene() {
    const c = $("#heroScene"), fpsEl = $("#fps");
    if (!window.SkyScene || !c) return;
    let frames = 0, last = performance.now();
    SkyScene.mount(c, {
      palette: "dusk",
      seed: 3,
      interactive: true,
      interactiveHost: $("#heroViewport"),
      onFrame(now) {
        frames++;
        if (now - last > 500) {
          fpsEl.textContent = "FPS " + Math.round((frames * 1000) / (now - last));
          frames = 0; last = now;
        }
      },
    });
  }

  /* ---------- toast + konami ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }
  function setupKonami() {
    const code = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
    let pos = 0;
    addEventListener("keydown", (e) => {
      const k = (e.key || "").toLowerCase();
      pos = k === code[pos] ? pos + 1 : k === code[0] ? 1 : 0;
      if (pos === code.length) {
        pos = 0;
        toast("★ CHEAT ACTIVATED · +999 XP · LEVEL UP!");
        $("#xpFill").style.width = "100%";
        $("#playerLevel").textContent = "LV. 99";
        if (bg.burst) bg.burst();
      }
    });
  }

  /* ---------- loader ---------- */
  function hideLoader() {
    const l = $("#loader");
    if (!l) return;
    const t0 = performance.now();
    const done = () => setTimeout(() => l.classList.add("done"), Math.max(0, (reduced ? 0 : 1100) - (performance.now() - t0)));
    if (document.readyState === "complete") done();
    else addEventListener("load", done, { once: true });
    setTimeout(() => l.classList.add("done"), 3000); // never block longer than 3 s
  }

  /* ---------- boot ---------- */
  fillIcons(document);
  renderBasics();
  renderPlayer();
  renderQuests();
  renderAchievements();
  mountScenes(document);
  setupHeroScene();
  setupBackground();
  setupNav();
  setupReveal();
  setupTypewriter();
  setupTilt();
  setupCursor();
  setupKonami();
  hideLoader();
})();
