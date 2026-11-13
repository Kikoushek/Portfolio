/* ==========================================================================
   SkyScene — procedurally drawn floating islands on a 2D canvas.
   Usage: SkyScene.mount(canvas, { palette: "dusk", seed: 7, interactive: true })
   ========================================================================== */
(function () {
  "use strict";

  const PALETTES = {
    dusk: {
      sky: ["#120c2e", "#3b1d5c", "#9a3f6e", "#f08a5d", "#ffd08a"],
      haze: "#c77a8a",
      sun: "#ffe2a8",
      sunPos: [0.72, 0.58],
      cloud: "#f6c9c0",
      cloudShade: "#b9839e",
      grass: "#7cc46a",
      grassDark: "#3e8a4c",
      rockTop: "#8a6450",
      rockBottom: "#2b1a35",
      leaves: ["#5fb35a", "#e0913f", "#4c9e57", "#f2c14e"],
      stars: 0.55,
      glow: "#ffd28a",
    },
    day: {
      sky: ["#2d6fd6", "#4d93ec", "#7fb8f5", "#bfe0ff", "#e8f6ff"],
      haze: "#a9cdf2",
      sun: "#fff6d8",
      sunPos: [0.78, 0.2],
      cloud: "#ffffff",
      cloudShade: "#c9def5",
      grass: "#82d36b",
      grassDark: "#4a9a4f",
      rockTop: "#9a7a62",
      rockBottom: "#4a3a48",
      leaves: ["#4fae4f", "#6cc45c", "#3d9a52", "#9bd85a"],
      stars: 0,
      glow: "#fff2b8",
    },
    night: {
      sky: ["#03040d", "#0a1030", "#142050", "#22356e", "#3a4f88"],
      haze: "#2f4377",
      sun: "#e8f0ff",
      sunPos: [0.2, 0.22],
      cloud: "#55689e",
      cloudShade: "#2c3a68",
      grass: "#3f8f6a",
      grassDark: "#24604e",
      rockTop: "#4c4a68",
      rockBottom: "#121227",
      leaves: ["#2f7d5e", "#3e9a72", "#5ef2ff", "#2a6a55"],
      stars: 1,
      glow: "#5ef2ff",
    },
  };

  /* ---------- helpers ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hex(c) {
    const n = parseInt(c.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) {
    const A = hex(a), B = hex(b);
    return "rgb(" + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",") + ")";
  }
  function rgba(c, a) {
    const A = hex(c);
    return "rgba(" + A[0] + "," + A[1] + "," + A[2] + "," + a + ")";
  }

  /* ---------- scene generation ---------- */
  function buildIsland(r, x, y, w, fog, opts) {
    opts = opts || {};
    const n = 9 + Math.floor(r() * 4);
    const under = [];
    for (let i = 1; i < n; i++) {
      const f = i / n;
      const bell = 1 - Math.pow(Math.abs(f * 2 - 1), 1.5);
      under.push([f, bell * (0.55 + r() * 0.3)]);
    }
    const tipX = 0.42 + r() * 0.16;
    const trees = [];
    const count = opts.trees != null ? opts.trees : 2 + Math.floor(r() * 4);
    for (let i = 0; i < count; i++) {
      trees.push({
        u: (r() - 0.5) * 0.75,
        v: (r() - 0.5) * 1.1,
        h: 0.12 + r() * 0.12,
        pine: r() < 0.45,
        leaf: Math.floor(r() * 4),
      });
    }
    trees.sort((a, b) => a.v - b.v);
    return {
      x, y, w, fog,
      under, tipX,
      tipDepth: 0.8 + r() * 0.35,
      trees,
      phase: r() * Math.PI * 2,
      house: !!opts.house,
      panels: !!opts.panels,
      waterfall: !!opts.waterfall,
    };
  }

  function buildScene(seed) {
    const r = rng(seed);
    const j = (v, a) => v + (r() - 0.5) * a;
    const islands = [
      // far
      buildIsland(r, j(0.3, 0.06), j(0.24, 0.05), 0.08, 0.72, { trees: 2 }),
      buildIsland(r, j(0.66, 0.06), j(0.2, 0.04), 0.07, 0.75, { trees: 1 }),
      buildIsland(r, j(0.93, 0.03), j(0.3, 0.05), 0.06, 0.78, { trees: 1 }),
      buildIsland(r, j(0.06, 0.03), j(0.48, 0.05), 0.07, 0.7, { trees: 2 }),
      // mid
      buildIsland(r, j(0.15, 0.04), j(0.36, 0.04), 0.2, 0.38, { trees: 4 }),
      buildIsland(r, j(0.85, 0.04), j(0.44, 0.04), 0.22, 0.34, { trees: 3, panels: true }),
      // main
      buildIsland(r, 0.5, j(0.5, 0.03), 0.44, 0, { trees: 6, house: true, panels: true, waterfall: true }),
    ];
    const stars = [];
    for (let i = 0; i < 90; i++) stars.push([r(), r() * 0.6, r() * 1.2 + 0.3, r() * 6]);
    const clouds = [];
    for (let l = 0; l < 3; l++) {
      const puffs = [];
      const count = 14 + l * 4;
      for (let i = 0; i < count; i++) {
        puffs.push([i / count + r() * 0.04, r() * 0.05, 0.05 + r() * 0.06]);
      }
      clouds.push({ puffs, y: 0.8 + l * 0.07, speed: 0.004 + l * 0.004, shade: 1 - l / 2 });
    }
    const skyClouds = [];
    for (let i = 0; i < 5; i++) skyClouds.push([r(), 0.1 + r() * 0.5, 0.05 + r() * 0.07, 0.003 + r() * 0.005]);
    const motes = [];
    for (let i = 0; i < 26; i++) motes.push([r(), r(), r() * 6, 0.5 + r() * 1.5]);
    return { islands, stars, clouds, skyClouds, motes };
  }

  /* ---------- drawing ---------- */
  function drawIsland(ctx, P, isl, W, H, t, mx, my) {
    const depth = 1 - isl.fog;
    const bob = Math.sin(t * 0.6 + isl.phase) * H * 0.008 * (0.5 + depth);
    const cx = isl.x * W + mx * W * 0.025 * (0.3 + depth);
    const cy = isl.y * H + bob + my * H * 0.015 * (0.3 + depth);
    const w = isl.w * Math.min(W, H * 1.6);
    const th = w * 0.075;
    const D = w * 0.62 * isl.tipDepth;
    const f = (c) => mix(c, P.haze, isl.fog);

    // waterfall (behind rock)
    if (isl.waterfall) {
      const wx = cx + w * 0.3, wy = cy + th * 0.3, ww = w * 0.04, wh = H - wy;
      const g = ctx.createLinearGradient(0, wy, 0, wy + wh);
      g.addColorStop(0, "rgba(190,240,255,0.95)");
      g.addColorStop(0.7, "rgba(190,240,255,0.35)");
      g.addColorStop(1, "rgba(190,240,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(wx, wy, ww, wh);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      const step = H * 0.06;
      const off = (t * H * 0.25) % step;
      for (let y = wy - step + off; y < wy + wh * 0.7; y += step) {
        ctx.fillRect(wx + ww * 0.2, y, ww * 0.25, step * 0.4);
        ctx.fillRect(wx + ww * 0.6, y + step * 0.5, ww * 0.2, step * 0.3);
      }
    }

    // rock underside
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, cy);
    const pts = isl.under;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const px = cx - w / 2 + p[0] * w;
      let py = cy + p[1] * D;
      if (Math.abs(p[0] - isl.tipX) < 0.12) py = cy + D;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(cx + w / 2, cy);
    ctx.closePath();
    const rg = ctx.createLinearGradient(0, cy, 0, cy + D);
    rg.addColorStop(0, f(P.rockTop));
    rg.addColorStop(1, f(P.rockBottom));
    ctx.fillStyle = rg;
    ctx.fill();

    // strata
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = rgba("#000000", 0.12 * depth + 0.04);
    ctx.lineWidth = Math.max(1, w * 0.006);
    for (let k = 1; k < 4; k++) {
      ctx.beginPath();
      const yy = cy + D * k * 0.2;
      ctx.moveTo(cx - w / 2, yy);
      ctx.quadraticCurveTo(cx, yy + D * 0.06, cx + w / 2, yy - D * 0.03);
      ctx.stroke();
    }
    ctx.restore();

    // grass lip + top
    ctx.fillStyle = f(P.grassDark);
    ctx.beginPath();
    ctx.ellipse(cx, cy + th * 0.45, w / 2, th, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = f(P.grass);
    ctx.beginPath();
    ctx.ellipse(cx, cy, w / 2, th, 0, 0, Math.PI * 2);
    ctx.fill();

    // house
    if (isl.house) {
      const hx = cx - w * 0.08, hy = cy - th * 0.1, hw = w * 0.11, hh = w * 0.075;
      ctx.fillStyle = f("#e9dcc4");
      ctx.fillRect(hx - hw / 2, hy - hh, hw, hh);
      ctx.fillStyle = f("#b8694a");
      ctx.beginPath();
      ctx.moveTo(hx - hw * 0.62, hy - hh);
      ctx.lineTo(hx, hy - hh - hw * 0.45);
      ctx.lineTo(hx + hw * 0.62, hy - hh);
      ctx.closePath();
      ctx.fill();
      // glowing window
      ctx.fillStyle = P.glow;
      ctx.shadowColor = P.glow;
      ctx.shadowBlur = w * 0.04;
      ctx.fillRect(hx - hw * 0.12, hy - hh * 0.62, hw * 0.24, hh * 0.3);
      ctx.shadowBlur = 0;
    }

    // solar panels
    if (isl.panels) {
      const n = isl.house ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const px = cx + w * (isl.house ? 0.06 + i * 0.07 : -0.05 + i * 0.09);
        const py = cy - th * 0.05 + (i % 2) * th * 0.3;
        const pw = w * 0.055, ph = w * 0.03;
        ctx.fillStyle = f("#6b6f80");
        ctx.fillRect(px - pw * 0.05, py - ph * 0.7, pw * 0.1, ph * 0.7);
        ctx.fillStyle = f("#1e3a8a");
        ctx.beginPath();
        ctx.moveTo(px - pw / 2, py - ph * 0.6);
        ctx.lineTo(px + pw / 2, py - ph * 0.6);
        ctx.lineTo(px + pw * 0.38, py - ph * 1.4);
        ctx.lineTo(px - pw * 0.62, py - ph * 1.4);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = rgba("#9fd8ff", 0.45 * depth + 0.1);
        ctx.fillRect(px - pw * 0.3, py - ph * 1.25, pw * 0.25, ph * 0.18);
      }
    }

    // trees
    for (const tr of isl.trees) {
      const tx = cx + tr.u * w;
      const ty = cy + tr.v * th * 0.55;
      const h = tr.h * w;
      ctx.fillStyle = f("#5a3d2b");
      ctx.fillRect(tx - w * 0.006, ty - h * 0.45, w * 0.012, h * 0.45);
      const leaf = f(P.leaves[tr.leaf]);
      ctx.fillStyle = leaf;
      if (tr.pine) {
        for (let k = 0; k < 3; k++) {
          const s = 1 - k * 0.25;
          ctx.beginPath();
          ctx.moveTo(tx - h * 0.28 * s, ty - h * (0.3 + k * 0.22));
          ctx.lineTo(tx, ty - h * (0.75 + k * 0.2));
          ctx.lineTo(tx + h * 0.28 * s, ty - h * (0.3 + k * 0.22));
          ctx.closePath();
          ctx.fill();
        }
      } else {
        const rr = h * 0.26;
        ctx.beginPath();
        ctx.arc(tx, ty - h * 0.7, rr, 0, Math.PI * 2);
        ctx.arc(tx - rr * 0.7, ty - h * 0.52, rr * 0.8, 0, Math.PI * 2);
        ctx.arc(tx + rr * 0.7, ty - h * 0.55, rr * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawPuffs(ctx, layer, W, H, t, color) {
    ctx.fillStyle = color;
    const off = (t * layer.speed) % 1;
    ctx.beginPath();
    for (const p of layer.puffs) {
      const x = (p[0] + off) % 1;
      for (const dx of [0, -1, 1]) {
        const px = (x + dx) * W;
        const r = p[2] * W * 0.9;
        ctx.moveTo(px + r, layer.y * H + p[1] * H);
        ctx.arc(px, layer.y * H + p[1] * H, r, 0, Math.PI * 2);
      }
    }
    ctx.fill();
    ctx.fillRect(0, layer.y * H + 0.03 * H, W, H);
  }

  function render(ctx, P, S, W, H, t, mx, my) {
    // sky
    const g = ctx.createLinearGradient(0, 0, 0, H);
    P.sky.forEach((c, i) => g.addColorStop(i / (P.sky.length - 1), c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // stars
    if (P.stars > 0) {
      for (const s of S.stars) {
        const a = P.stars * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.4 + s[3])));
        ctx.fillStyle = "rgba(255,255,255," + (a * (1 - s[1] * 1.2)).toFixed(3) + ")";
        ctx.fillRect(s[0] * W, s[1] * H, s[2], s[2]);
      }
    }

    // sun / moon
    const sx = P.sunPos[0] * W - mx * W * 0.01, sy = P.sunPos[1] * H - my * H * 0.01;
    const sr = Math.min(W, H) * 0.08;
    const sg = ctx.createRadialGradient(sx, sy, sr * 0.5, sx, sy, sr * 5);
    sg.addColorStop(0, rgba(P.sun, 0.55));
    sg.addColorStop(1, rgba(P.sun, 0));
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = P.sun;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();

    // sky clouds
    for (const c of S.skyClouds) {
      const x = ((c[0] + t * c[3]) % 1.3) - 0.15;
      ctx.fillStyle = rgba(P.cloud, 0.22);
      ctx.beginPath();
      ctx.ellipse(x * W, c[1] * H, c[2] * W * 1.8, c[2] * W * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // islands (far to near), far cloud layer between
    const isl = S.islands;
    for (let i = 0; i < isl.length; i++) {
      if (i === 4) drawPuffs(ctx, S.clouds[0], W, H, t, mix(P.cloudShade, P.haze, 0.45));
      drawIsland(ctx, P, isl[i], W, H, t, mx, my);
    }

    // near cloud sea
    drawPuffs(ctx, S.clouds[1], W, H, t, P.cloudShade);
    drawPuffs(ctx, S.clouds[2], W, H, t, P.cloud);

    // floating motes / fireflies
    for (const m of S.motes) {
      const y = (m[1] - t * 0.012 * m[3]) % 1;
      const yy = (y < 0 ? y + 1 : y) * H * 0.85;
      const x = m[0] * W + Math.sin(t + m[2]) * W * 0.01;
      const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 2 + m[2]));
      ctx.fillStyle = rgba(P.glow, a * 0.8);
      ctx.beginPath();
      ctx.arc(x, yy, 1.2 + m[3] * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------- mount ---------- */
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function mount(canvas, opts) {
    opts = opts || {};
    const P = PALETTES[opts.palette] || PALETTES.dusk;
    const S = buildScene(opts.seed || 1);
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, raf = 0, visible = true, running = false;
    let mx = 0, my = 0, tx = 0, ty = 0;
    const start = performance.now() - (opts.seed || 1) * 1000;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frame(performance.now(), true);
    }

    function frame(now, once) {
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      render(ctx, P, S, W, H, (now - start) / 1000, mx, my);
      if (opts.onFrame) opts.onFrame(now);
      if (!once && running) raf = requestAnimationFrame(frame);
    }

    function play() {
      if (reduced || running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
      visible ? play() : pause();
    }).observe(canvas);
    document.addEventListener("visibilitychange", () => (document.hidden ? pause() : play()));

    if (opts.interactive) {
      const host = opts.interactiveHost || canvas;
      host.addEventListener("pointermove", (e) => {
        const r = canvas.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      host.addEventListener("pointerleave", () => (tx = ty = 0));
    }

    resize();
    play();
    return { play, pause };
  }

  window.SkyScene = { mount };
})();
