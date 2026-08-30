// ============================================================
// GN DIGITAL TECHNOLOGY — main.js
// Render desde GN_CONTENT (servidor + fallback local) y motion.
// ============================================================
(function () {
  'use strict';

  var gsapOk = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CONTENT = (typeof window.GN_CONTENT !== 'undefined' && window.GN_CONTENT) || {};
  var merged = deepClone(CONTENT);

  // ---------- utilidades ----------
  function deepClone(o) { return JSON.parse(JSON.stringify(o || {})); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function setText(key, fallback) {
    var parts = String(key || '').split('.');
    var v = merged;
    for (var i = 0; i < parts.length && v != null; i++) v = v[parts[i]];
    return v == null || v === '' ? (fallback != null ? fallback : '') : String(v);
  }

  // ---------- iconos SVG ----------
  var ICONS = {
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 12.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 8H6"/><circle cx="10.5" cy="21" r="1.3"/><circle cx="17" cy="21" r="1.3"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8.2v7.6a2 2 0 0 1-1 1.7l-7 4a2 2 0 0 1-2 0l-7-4a2 2 0 0 1-1-1.7V8.2a2 2 0 0 1 1-1.7l7-4a2 2 0 0 1 2 0l7 4a2 2 0 0 1 1 1.7z"/><path d="M3.3 7.3 12 12l8.7-4.7M12 22V12"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M8 16v-5M13 16V8M18 16v-8"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-5 4 5 4M16 8l5 4-5 4M13.5 5l-3 14"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="m9 11.5 2.2 2.2L15.5 9.5"/></svg>',
    radar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/><path d="M12 12 19 6"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19h9"/><path d="M16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1 1-4z"/></svg>',
    cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M15.5 4.5C19 6 22 9.5 22 14l-7-7C13 4.5 14.5 2 14.5 2S13.5 3.5 15.5 4.5z"/><path d="M8.5 12.5c1-3 4-6 8-8l3 3c-2 4-5 7-8 8z"/><circle cx="14.5" cy="9.5" r="1.5"/><path d="M9.5 14.5 6 18l1 1 3.5-3.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9.5 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4 0 4.88 2.6 4.88 6V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21h-4z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-1.5-.5c-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.6.4.1.1.1.7-.2 1.3z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  };

  var SOCIAL_ICONS = { instagram: ICONS.instagram, linkedin: ICONS.linkedin, whatsapp: ICONS.whatsapp };

  // ============================================================
  // Carga del contenido: API + overrides locales → merged
  // ============================================================
  function loadContent() {
    return fetch('/api/content', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('no api')); })
      .then(function (remote) {
        if (remote && typeof remote === 'object') {
          Object.keys(remote).forEach(function (k) { merged[k] = remote[k]; });
        }
        return merged;
      })
      .catch(function () { return merged; });
  }

  // ============================================================
  // Render por sección
  // ============================================================
  function renderStaticKeys() {
    $all('[data-k]').forEach(function (el) {
      el.textContent = setText(el.getAttribute('data-k'), el.textContent);
    });
    var seo = merged.seo || {};
    if (seo.title) document.title = seo.title;
    if (seo.description) {
      var m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', seo.description);
    }
    if (seo.ogImage) {
      var og = document.querySelector('meta[property="og:image"]') || (function () {
        var t = document.createElement('meta'); t.setAttribute('property', 'og:image'); document.head.appendChild(t); return t;
      })();
      og.setAttribute('content', seo.ogImage);
    }
    $('#year').textContent = String(new Date().getFullYear());
  }

  function renderMarquee() {
    var items = (merged.marquee || []).filter(Boolean);
    var html = '';
    items.forEach(function (t) { html += '<span>' + esc(t) + '</span>'; });
    var double = html + html;
    $('#marqueeTrack').innerHTML = double;
    $('#marqueeTrack2').innerHTML = double;
  }

  function renderServices() {
    var grid = $('#servicesGrid');
    var items = (merged.services || []).filter(Boolean);
    grid.innerHTML = items.map(function (s, i) {
      var icon = ICONS[s.icon] || ICONS.code;
      var feats = (s.features || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
      var featured = s.featured ? ' svc-featured' : '';
      return '<article class="svc' + featured + '" data-reveal data-delay="' + (i % 3) * 0.08 + '">' +
        '<div class="svc-icon">' + icon + '</div>' +
        '<h3 class="svc-name">' + esc(s.name) + '</h3>' +
        '<p class="svc-desc">' + esc(s.desc) + '</p>' +
        '<ul class="svc-feats">' + feats + '</ul>' +
        '<span class="svc-price">' + esc(s.price) + '</span>' +
        '</article>';
    }).join('');
  }

  function renderStats() {
    var grid = $('#statsGrid');
    var items = (merged.stats || []).filter(Boolean);
    grid.innerHTML = items.map(function (s) {
      return '<div class="stat" data-reveal>' +
        '<div class="stat-num" data-count="' + esc(s.value) + '" data-suffix="' + esc(s.suffix || '') + '">0' + esc(s.suffix || '') + '</div>' +
        '<div class="stat-label">' + esc(s.label) + '</div>' +
        '</div>';
    }).join('');
  }

  function renderWork() {
    var grid = $('#workGrid');
    var items = (merged.portfolio || []).filter(Boolean);
    grid.innerHTML = items.map(function (p) {
      var tags = (p.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
      var link = p.url ? '<a class="work-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">Ver proyecto</a>' : '<span class="work-link">Caso interno</span>';
      var img = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' : '';
      var urlPill = p.url ? esc(p.url).replace(/^https?:\/\//, '') : 'gn.digital/caso';
      return '<article class="work-card" data-reveal>' +
        '<div class="work-media"><div class="work-browser"><i></i><i></i><i></i><span>' + esc(urlPill) + '</span></div>' + img + '</div>' +
        '<div class="work-body">' +
        '<div class="work-cat">' + esc(p.category) + '</div>' +
        '<h3 class="work-name">' + esc(p.name) + '</h3>' +
        '<p class="work-desc">' + esc(p.desc) + '</p>' +
        '<div class="work-tags">' + tags + '</div>' + link +
        '</div></article>';
    }).join('');
  }

  function renderProcess() {
    var track = $('#processTrack');
    var items = (merged.process || []).filter(Boolean);
    track.innerHTML = items.map(function (p, i) {
      var icon = ICONS[p.icon] || ICONS.rocket;
      return '<div class="process-step" data-step="' + (i + 1) + '">' +
        '<div class="ps-num">' + esc(p.num) + '</div>' +
        '<div class="ps-icon">' + icon + '</div>' +
        '<h3 class="ps-name">' + esc(p.name) + '</h3>' +
        '<p class="ps-desc">' + esc(p.desc) + '</p>' +
        '</div>';
    }).join('');
  }

  function renderTestimonials() {
    var items = (merged.testimonials || []).filter(Boolean);
    var card = function (t) {
      var stars = '';
      for (var i = 0; i < Math.min(5, Math.max(1, Number(t.stars) || 5)); i++) stars += ICONS.star;
      var initials = (t.author || 'GN').split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      return '<div class="t-card">' +
        '<div class="t-stars">' + stars + '</div>' +
        '<p class="t-quote">' + esc(t.quote) + '</p>' +
        '<div class="t-author"><div class="t-avatar">' + esc(initials) + '</div>' +
        '<div><b>' + esc(t.author) + '</b><span>' + esc(t.role) + '</span></div></div>' +
        '</div>';
    };
    var half = Math.ceil(items.length / 2);
    var row1 = items.slice(0, half), row2 = items.slice(half);
    if (!row2.length) { row2 = row1; }
    $('#tRow1').innerHTML = '<div class="t-card-row">' + row1.map(card).join('') + row1.map(card).join('') + '</div>';
    $('#tRow2').innerHTML = '<div class="t-card-row">' + row2.map(card).join('') + row2.map(card).join('') + '</div>';
  }

  function renderContact() {
    var c = merged.contact || {};
    var socials = (c.socials || []).filter(Boolean);
    $('#footSocials').innerHTML = socials.map(function (s) {
      var icon = SOCIAL_ICONS[String(s.name || '').toLowerCase()] || '';
      return '<a href="' + esc(s.url || '#') + '" target="_blank" rel="noopener" aria-label="' + esc(s.name) + '">' + icon + ' ' + esc(s.name) + '</a>';
    }).join('');
    $('#footServices').innerHTML = (merged.services || []).map(function (s) { return '<span>' + esc(s.name) + '</span>'; }).join('');
    $('#footContact').innerHTML =
      '<a href="mailto:' + esc(c.email || '') + '">' + esc(c.email || '') + '</a>' +
      '<a href="tel:' + esc(c.phone || '').replace(/\s/g, '') + '">' + esc(c.phone || '') + '</a>' +
      '<span>' + esc(c.city || '') + '</span>';
    $('#contactCards').innerHTML =
      '<div class="contact-card" data-reveal><span class="cc-label">Email</span><span class="cc-value"><a href="mailto:' + esc(c.email || '') + '">' + esc(c.email || '') + '</a></span></div>' +
      '<div class="contact-card" data-reveal><span class="cc-label">Teléfono</span><span class="cc-value"><a href="tel:' + esc(c.phone || '').replace(/\s/g, '') + '">' + esc(c.phone || '') + '</a></span></div>' +
      '<div class="contact-card" data-reveal><span class="cc-label">Ubicación</span><span class="cc-value">' + esc(c.city || '') + '</span></div>' +
      '<div class="contact-card" data-reveal><span class="cc-label">Horario</span><span class="cc-value">' + esc(c.hours || '') + '</span></div>';
    var wa = $('#ctaWhatsapp');
    if (wa && c.whatsapp) {
      wa.setAttribute('href', 'https://wa.me/' + esc(c.whatsapp) + '?text=' + encodeURIComponent('Hola GN Digital 👋 Quiero un proyecto web'));
    }
    var mail = $('#ctaMail');
    if (mail && c.email) mail.setAttribute('href', 'mailto:' + esc(c.email));
  }

  function renderAll() {
    renderStaticKeys();
    renderMarquee();
    renderServices();
    renderStats();
    renderWork();
    renderProcess();
    renderTestimonials();
    renderContact();
  }

  // ============================================================
  // Terminal con máquina de escribir
  // ============================================================
  function playTerminal() {
    var body = $('#terminalBody');
    var lines = (merged.hero && merged.hero.terminal) || [];
    if (!body || !lines.length) return;
    if (reduced || !gsapOk) {
      body.innerHTML = lines.map(function (l, i) {
        return '<div class="term-line"><span class="t-c">' + esc(l.c) + '</span><br><span class="' + (i === lines.length - 1 ? 't-arrow' : 't-ok') + '">' + esc(l.o) + '</span></div>';
      }).join('');
      return;
    }
    var i = 0;
    body.innerHTML = '';
    function typeLine() {
      if (i >= lines.length) return;
      var line = lines[i];
      var div = document.createElement('div');
      div.className = 'term-line';
      var c = document.createElement('span');
      c.className = 't-c';
      div.appendChild(c);
      body.appendChild(div);
      var n = 0;
      (function typeChar() {
        if (n <= line.c.length) { c.textContent = line.c.slice(0, n++); setTimeout(typeChar, 26); return; }
        var o = document.createElement('div');
        o.className = i === lines.length - 1 ? 't-arrow' : 't-ok';
        o.textContent = line.o;
        var okIdx = 0;
        (function showOut() {
          o.textContent = line.o.slice(0, ++okIdx);
          if (okIdx < line.o.length) setTimeout(showOut, 9);
          else { i++; setTimeout(typeLine, 320); }
        })();
        div.appendChild(o);
      })();
    }
    setTimeout(typeLine, 500);
  }

  // ============================================================
  // Partículas canvas
  // ============================================================
  function initCanvas() {
    var canvas = $('#fx');
    if (!canvas || reduced) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [], running = false;
    var COLORS = ['34,211,238', '139,92,246', '184,240,106'];
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    function spawn() {
      var n = W < 700 ? 26 : 52;
      particles = [];
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.6 + 0.5,
          vy: -(Math.random() * 0.28 + 0.06),
          vx: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.5 + 0.15,
          c: COLORS[i % COLORS.length]
        });
      }
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
        if (p.x < -8) p.x = W + 8;
        if (p.x > W + 8) p.x = -8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize(); spawn();
    window.addEventListener('resize', function () { resize(); spawn(); });
    var io = new IntersectionObserver(function (e) {
      var vis = e[0].isIntersecting;
      if (vis && !running) { running = true; requestAnimationFrame(frame); }
      if (!vis) running = false;
    }, { threshold: 0 });
    io.observe(canvas);
  }

  // ============================================================
  // UI: nav / menú / glow
  // ============================================================
  function initUI() {
    var nav = $('#nav'), burger = $('#burger'), menu = $('#mobileMenu');
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 30); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger && menu) {
      burger.addEventListener('click', function () {
        var open = !menu.hasAttribute('hidden');
        menu.toggleAttribute('hidden');
        burger.classList.toggle('open', !open);
        burger.setAttribute('aria-expanded', String(!open));
        document.body.style.overflow = open ? '' : 'hidden';
      });
      $all('a[data-link]', menu).forEach(function (a) {
        a.addEventListener('click', function () {
          menu.toggleAttribute('hidden', true);
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    if (window.matchMedia('(pointer: fine)').matches && !reduced) {
      var glow = $('#cursorGlow');
      var cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy, raf = null;
      document.addEventListener('mousemove', function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!raf) raf = requestAnimationFrame(function loop() {
          cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
          glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
          raf = null;
        });
        document.body.classList.add('cg-on');
      }, { passive: true });
    }
  }

  // ============================================================
  // Motion: GSAP (con fallback IntersectionObserver)
  // ============================================================
  function initMotion() {
    if (!gsapOk || reduced) {
      document.body.classList.add('no-motion');
      revealFallback();
      return;
    }
    gsap.registerPlugin(window.ScrollTrigger);

    // reveals con IntersectionObserver: el estado inicial oculto lo pone el
    // CSS ([data-reveal]/[data-reveal]/[.r-up] opacity:0) y .revealed lo
    // revierte con transición. NUNCA inline: ganaría a la clase y el
    // elemento quedaría invisible para siempre.
    var targets = $all('[data-reveal], .r-up, .reveal');
    targets.forEach(function (el) {
      var d = parseFloat(el.getAttribute('data-delay') || 0) || 0;
      if (d) el.style.transitionDelay = d + 's';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });

    // counters
    $all('.stat-num').forEach(function (el) {
      var end = parseFloat(el.getAttribute('data-count') || '0');
      var suffix = el.getAttribute('data-suffix') || '';
      var obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 1.7, ease: 'power2.out', delay: 0.2,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; }
      });
    });

    // hero parallax (fromTo: nunca captura el estado oculto del reveal)
    gsap.fromTo('.hero-top', { y: 0, opacity: 1 }, {
      y: -50, opacity: 0.35, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.fromTo('.terminal', { y: 0, opacity: 1 }, {
      y: -90, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  function revealFallback() {
    var targets = $all('[data-reveal], .r-up, .reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  // ============================================================
  // Ajuste del título del hero: reduce el tamaño hasta que quepa
  // en 2 líneas exactas (el texto es editable desde el CMS).
  // Siempre recalcula desde la base CSS (puede crecer y encoger).
  // ============================================================
  function fitHeroTitle() {
    var h1 = $('.hero-title');
    if (!h1) return;
    h1.style.fontSize = ''; // base CSS (clamp)
    var fs = parseFloat(getComputedStyle(h1).fontSize) || 64;
    function shrink() {
      h1.style.fontSize = fs + 'px';
      var lh = parseFloat(getComputedStyle(h1).lineHeight) || fs * 1.05;
      // 2 líneas ≈ 2.13×lh (fragmento de línea fantasma); 3+ líneas ≈ 3.1×
      if (h1.scrollHeight > lh * 2.3 && fs > 38) { fs -= 1; shrink(); }
    }
    shrink();
  }
  var fitTimer = null;
  function fitHeroTitleDebounced() {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitHeroTitle, 150);
  }

  // ============================================================
  // Boot
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {
    loadContent().then(function () {
      renderAll();
      initUI();
      playTerminal();
      initCanvas();
      initMotion();
      fitHeroTitle();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(fitHeroTitle);
      }
      window.addEventListener('resize', fitHeroTitleDebounced, { passive: true });
    });
  });
})();
