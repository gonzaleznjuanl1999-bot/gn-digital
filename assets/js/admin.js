// ============================================================
// GN DIGITAL TECHNOLOGY — admin.js (panel de contenido CMS)
// Editor genérico por esquema: text / textarea / number / checkbox
// / select / image (subida a Supabase) / stringlist / list.
// ============================================================
(function () {
  'use strict';

  var TOKEN_KEY = 'gn:token';
  var state = { token: localStorage.getItem(TOKEN_KEY) || '', data: null, section: null, uploading: null, dirty: false };

  var DEFAULTS = (typeof window.GN_CONTENT !== 'undefined' && window.GN_CONTENT) || {};

  // ---------- Esquema de secciones ----------
  var ICON_CHOICES = ['globe', 'cart', 'box', 'chart', 'code', 'shield', 'radar', 'pen', 'cpu', 'rocket'];
  var SECTIONS = [
    { key: 'brand', label: 'Marca', icon: '◈', desc: 'Nombre, eslogan y estado de la empresa', fields: [
      { key: 'name', label: 'Nombre', type: 'text' },
      { key: 'short', label: 'Abreviatura (logo)', type: 'text' },
      { key: 'tagline', label: 'Eslogan', type: 'text' },
      { key: 'status', label: 'Estado en la barra de navegación', type: 'text' },
      { key: 'logoUrl', label: 'Logo (imagen opcional)', type: 'image' }
    ]},
    { key: 'hero', label: 'Hero', icon: '▚', desc: 'Portada principal del sitio', fields: [
      { key: 'eyebrow', label: 'Eyebrow (etiqueta superior)', type: 'text' },
      { key: 'title1', label: 'Título · línea 1', type: 'text' },
      { key: 'title2', label: 'Título · línea 2 (con degradado)', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { key: 'cta1', label: 'Botón principal', type: 'text' },
      { key: 'cta2', label: 'Botón secundario', type: 'text' },
      { key: 'terminal', label: 'Líneas de la terminal', type: 'list', itemLabel: 'Línea', itemIcon: '▸', sub: [
        { key: 'c', label: 'Comando', type: 'text' },
        { key: 'o', label: 'Salida', type: 'text' }
      ]}
    ]},
    { key: 'marquee', label: 'Cinta', icon: '≡', desc: 'Palabras de la cinta que se desplaza', type: 'stringlist', itemLabel: 'Palabra' },
    { key: 'services', label: 'Servicios', icon: '▤', desc: 'Tarjetas de servicios (la marcada ★ destaca)', type: 'list', itemLabel: 'Servicio', itemIcon: '▤', sub: [
      { key: 'icon', label: 'Icono', type: 'select', options: ICON_CHOICES },
      { key: 'name', label: 'Nombre', type: 'text' },
      { key: 'desc', label: 'Descripción', type: 'textarea' },
      { key: 'features', label: 'Características', type: 'stringlist', itemLabel: 'Característica' },
      { key: 'price', label: 'Precio (ej: desde $899)', type: 'text' },
      { key: 'featured', label: 'Destacada (más grande)', type: 'checkbox' }
    ]},
    { key: 'stats', label: 'Cifras', icon: '▦', desc: 'Números de la banda de métricas', type: 'list', itemLabel: 'Cifra', itemIcon: '▦', sub: [
      { key: 'value', label: 'Valor (número)', type: 'number' },
      { key: 'suffix', label: 'Sufijo (+, %…)', type: 'text' },
      { key: 'label', label: 'Etiqueta', type: 'text' }
    ]},
    { key: 'process', label: 'Proceso', icon: '➤', desc: 'Pasos del proceso (scroll horizontal)', type: 'list', itemLabel: 'Paso', itemIcon: '➤', sub: [
      { key: 'num', label: 'Número (01, 02…)', type: 'text' },
      { key: 'name', label: 'Nombre', type: 'text' },
      { key: 'desc', label: 'Descripción', type: 'textarea' },
      { key: 'icon', label: 'Icono', type: 'select', options: ICON_CHOICES }
    ]},
    { key: 'portfolio', label: 'Trabajo', icon: '▧', desc: 'Proyectos del portafolio', type: 'list', itemLabel: 'Proyecto', itemIcon: '▧', sub: [
      { key: 'name', label: 'Nombre', type: 'text' },
      { key: 'category', label: 'Categoría (E-commerce, Web…)', type: 'text' },
      { key: 'desc', label: 'Descripción', type: 'textarea' },
      { key: 'image', label: 'Imagen', type: 'image' },
      { key: 'url', label: 'URL del proyecto (opcional)', type: 'text' },
      { key: 'tags', label: 'Etiquetas', type: 'stringlist', itemLabel: 'Etiqueta' }
    ]},
    { key: 'testimonials', label: 'Testimonios', icon: '★', desc: 'Opiniones de clientes', type: 'list', itemLabel: 'Testimonio', itemIcon: '★', sub: [
      { key: 'quote', label: 'Cita', type: 'textarea' },
      { key: 'author', label: 'Autor', type: 'text' },
      { key: 'role', label: 'Rol / empresa', type: 'text' },
      { key: 'stars', label: 'Estrellas (1–5)', type: 'number' }
    ]},
    { key: 'contact', label: 'Contacto', icon: '✉', desc: 'Datos de contacto y redes', fields: [
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Teléfono', type: 'text' },
      { key: 'whatsapp', label: 'WhatsApp (código país + número, sin +)', type: 'text' },
      { key: 'city', label: 'Ubicación', type: 'text' },
      { key: 'hours', label: 'Horario', type: 'text' },
      { key: 'socials', label: 'Redes sociales', type: 'list', itemLabel: 'Red', itemIcon: '@', sub: [
        { key: 'name', label: 'Nombre (Instagram, LinkedIn, WhatsApp)', type: 'text' },
        { key: 'url', label: 'URL', type: 'text' }
      ]}
    ]},
    { key: 'seo', label: 'SEO', icon: '◈', desc: 'Metadatos para buscadores', fields: [
      { key: 'title', label: 'Título de la página', type: 'text' },
      { key: 'description', label: 'Descripción (meta)', type: 'textarea' },
      { key: 'ogImage', label: 'Imagen para compartir (OG)', type: 'image' }
    ]},
    { key: 'labels', label: 'Textos UI', icon: '✎', desc: 'Menú, títulos de sección, CTA y pie (español)', fields: [
      { key: 'navServicios', label: 'Menú · Servicios', type: 'text' },
      { key: 'navTrabajo', label: 'Menú · Trabajo', type: 'text' },
      { key: 'navProceso', label: 'Menú · Proceso', type: 'text' },
      { key: 'navTestimonios', label: 'Menú · Testimonios', type: 'text' },
      { key: 'navContacto', label: 'Menú · Contacto', type: 'text' },
      { key: 'trust1', label: 'Hero · confianza 1', type: 'text' },
      { key: 'trust2', label: 'Hero · confianza 2', type: 'text' },
      { key: 'trust3', label: 'Hero · confianza 3', type: 'text' },
      { key: 's1Eyebrow', label: 'Servicios · etiqueta', type: 'text' },
      { key: 's1T1', label: 'Servicios · título parte 1', type: 'text' },
      { key: 's1T2', label: 'Servicios · título parte 2', type: 'text' },
      { key: 's1Desc', label: 'Servicios · descripción', type: 'textarea' },
      { key: 's2Eyebrow', label: 'Trabajo · etiqueta', type: 'text' },
      { key: 's2T1', label: 'Trabajo · título parte 1', type: 'text' },
      { key: 's2T2', label: 'Trabajo · título parte 2', type: 'text' },
      { key: 's2Desc', label: 'Trabajo · descripción', type: 'textarea' },
      { key: 's3Eyebrow', label: 'Proceso · etiqueta', type: 'text' },
      { key: 's3T1', label: 'Proceso · título parte 1', type: 'text' },
      { key: 's3T2', label: 'Proceso · título parte 2', type: 'text' },
      { key: 's4Eyebrow', label: 'Testimonios · etiqueta', type: 'text' },
      { key: 's4T1', label: 'Testimonios · título parte 1', type: 'text' },
      { key: 's4T2', label: 'Testimonios · título parte 2', type: 'text' },
      { key: 'ctaEyebrow', label: 'Contacto · etiqueta', type: 'text' },
      { key: 'ctaT1', label: 'Contacto · título parte 1', type: 'text' },
      { key: 'ctaT2', label: 'Contacto · título parte 2', type: 'text' },
      { key: 'ctaSub', label: 'Contacto · subtítulo', type: 'textarea' },
      { key: 'ctaWhatsapp', label: 'Botón WhatsApp', type: 'text' },
      { key: 'ctaEmail', label: 'Botón email', type: 'text' },
      { key: 'scroll', label: 'Indicador de scroll', type: 'text' },
      { key: 'footNav', label: 'Pie · Navegación', type: 'text' },
      { key: 'footServices', label: 'Pie · Servicios', type: 'text' },
      { key: 'footContact', label: 'Pie · Contacto', type: 'text' },
      { key: 'footRights', label: 'Pie · derechos', type: 'text' }
    ]}
  ];

  // Variantes en alemán de todas las secciones (claves *_de)
  var BASE_SECTIONS = SECTIONS.slice();
  SECTIONS = SECTIONS.concat(BASE_SECTIONS.map(function (s) {
    return Object.assign({}, s, { key: s.key + '_de', label: s.label + ' (DE)', desc: (s.desc || '') + ' — alemán' });
  }));

  // ---------- Helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function toast(msg, type) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = 'toast ' + (type || '');
    t.hidden = false;
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.hidden = true; }, 2600);
  }

  // ---------- API con auto-refresh ----------
  async function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({}, opts.headers || {});
    if (state.token) opts.headers.Authorization = 'Bearer ' + state.token;
    if (opts.body) opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
    var res = await fetch(path, opts);
    if (res.status === 401 && state.token) {
      var ok = await tryRefresh();
      if (ok) return api(path, opts);
      showLogin();
      throw new Error('sesión expirada');
    }
    return res;
  }

  async function tryRefresh() {
    try {
      var r = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'same-origin' });
      if (!r.ok) { state.token = ''; localStorage.removeItem(TOKEN_KEY); return false; }
      var j = await r.json();
      state.token = j.token;
      localStorage.setItem(TOKEN_KEY, j.token);
      return true;
    } catch (e) { return false; }
  }

  // ---------- Vistas ----------
  function showLogin() {
    $('#panelView').hidden = true;
    $('#loginView').hidden = false;
    $('input[name="username"]', $('#loginView')).focus();
  }
  function showPanel() {
    $('#loginView').hidden = true;
    $('#panelView').hidden = false;
  }

  async function login(ev) {
    ev.preventDefault();
    var form = ev.target;
    var err = $('#loginErr');
    err.hidden = true;
    var btn = $('.btn', form);
    btn.disabled = true;
    btn.textContent = 'Entrando…';
    try {
      var r = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username.value.trim(), password: form.password.value })
      });
      var j = await r.json();
      if (!r.ok) throw new Error(j.error === 'too_many_requests' ? 'Demasiados intentos, espera 15 min' : 'Credenciales incorrectas');
      state.token = j.token;
      localStorage.setItem(TOKEN_KEY, j.token);
      form.reset();
      await boot();
    } catch (e) {
      err.textContent = e.message || 'Error de conexión';
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Acceder →';
    }
  }

  // ---------- Contenido ----------
  async function loadData() {
    var r = await api('/api/content');
    if (!r.ok) throw new Error('no se pudo cargar el contenido');
    var j = await r.json();
    state.data = Object.assign({}, DEFAULTS, j || {});
  }

  function renderNav() {
    var nav = $('#sideNav');
    nav.innerHTML = SECTIONS.map(function (s) {
      return '<button data-section="' + s.key + '" aria-label="' + esc(s.label) + '"><span class="nav-icon">' + s.icon + '</span>' + esc(s.label) + '</button>';
    }).join('');
    $all('button', nav).forEach(function (b) {
      b.addEventListener('click', function () { openSection(b.getAttribute('data-section')); });
    });
  }

  function openSection(key) {
    var sec = SECTIONS.find(function (s) { return s.key === key; });
    if (!sec) return;
    state.section = sec;
    state.dirty = false;
    $all('#sideNav button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-section') === key);
    });
    $('#sectionTitle').textContent = sec.icon + '  ' + sec.label;
    $('#sectionDesc').textContent = sec.desc;
    $('#saveState').textContent = 'sin cambios';
    $('#saveState').classList.remove('saved');
    $('#contentArea').innerHTML = renderSection(sec);
    bindSectionEvents(sec);
  }

  // ---------- Render de campos ----------
  function fieldHtml(f, value, prefix) {
    var v = value == null ? '' : value;
    var name = (prefix ? prefix + ':' : '') + f.key;
    var out = '<div class="field"><label for="' + esc(name) + '">' + esc(f.label) + '</label>';
    switch (f.type) {
      case 'textarea':
        out += '<textarea id="' + esc(name) + '" data-i="' + esc(name) + '">' + esc(v) + '</textarea>';
        break;
      case 'number':
        out += '<input type="number" id="' + esc(name) + '" data-i="' + esc(name) + '" value="' + esc(v) + '">';
        break;
      case 'checkbox':
        out += '<div class="check-row"><input type="checkbox" id="' + esc(name) + '" data-i="' + esc(name) + '"' + (v ? ' checked' : '') + '><span>activado</span></div>';
        break;
      case 'select':
        out += '<select id="' + esc(name) + '" data-i="' + esc(name) + '">' +
          (f.options || []).map(function (o) { return '<option value="' + esc(o) + '"' + (String(v) === String(o) ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') +
          '</select>';
        break;
      case 'image':
        out += '<div class="img-field">' +
          '<div class="img-preview" style="background-image:url(\'' + esc(v) + '\')" data-preview>' + (v ? '' : 'sin imagen') + '</div>' +
          '<div class="img-controls">' +
          '<input type="text" data-i="' + esc(name) + '" value="' + esc(v) + '" placeholder="URL de la imagen">' +
          '<div style="display:flex;gap:8px">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-upload="' + esc(name) + '">⬆ Subir imagen</button>' +
          (v ? '<button type="button" class="btn btn-danger btn-sm" data-clear="' + esc(name) + '">✕</button>' : '') +
          '</div><span class="hint">PNG · JPG · WEBP (máx ~5 MB)</span></div></div>';
        break;
      default:
        out += '<input type="text" id="' + esc(name) + '" data-i="' + esc(name) + '" value="' + esc(v) + '">';
    }
    return out + '</div>';
  }

  function stringlistHtml(f, values, prefix) {
    var arr = Array.isArray(values) ? values : [];
    var name = (prefix ? prefix + ':' : '') + f.key;
    var out = '<div class="field"><label>' + esc(f.label) + '</label><div class="stringlist-inputs" data-sl="' + esc(name) + '">';
    if (!arr.length) {
      out += '<div class="empty-hint" data-empty>Sin elementos — añade el primero ↓</div>';
    } else {
      arr.forEach(function (v, i) {
        out += '<div class="stringlist-row"><input type="text" data-sl-i="' + esc(name) + '" value="' + esc(v) + '" placeholder="' + esc(f.itemLabel || 'Elemento') + ' ' + (i + 1) + '">' +
          '<button type="button" class="btn btn-danger btn-sm" data-sl-del="' + esc(name) + '" aria-label="Eliminar">✕</button></div>';
      });
    }
    out += '</div><button type="button" class="btn btn-ghost btn-sm add-btn" data-sl-add="' + esc(name) + '">+ Añadir ' + esc(f.itemLabel || 'elemento') + '</button></div>';
    return out;
  }

  function renderSection(sec) {
    var data = state.data[sec.key] || {};
    if (sec.type === 'stringlist') {
      return stringlistHtml(sec, data, '');
    }
    if (sec.type === 'list') {
      var arr = Array.isArray(data) ? data : [];
      if (!arr.length) return '<div class="empty-hint">Sección vacía — añade el primer elemento ↓</div>' + addBtnHtml(sec);
      return arr.map(function (item, i) {
        var body = '<div class="list-block" data-item="' + sec.key + '" data-idx="' + i + '">' +
          '<div class="list-head"><span class="idx">' + String(i + 1).padStart(2, '0') + ' · ' + esc(sec.itemLabel) + '</span>' +
          '<span class="list-actions">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-move="' + sec.key + '" data-dir="-1" aria-label="Subir">↑</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-move="' + sec.key + '" data-dir="1" aria-label="Bajar">↓</button>' +
          '<button type="button" class="btn btn-danger btn-sm" data-del="' + sec.key + '" aria-label="Eliminar">✕</button>' +
          '</span></div><div class="list-grid">' +
          sec.sub.map(function (f) {
            if (f.type === 'stringlist') {
              return '<div class="full">' + stringlistHtml(f, item[f.key], sec.key + ':' + i) + '</div>';
            }
            return '<div class="' + (f.type === 'textarea' ? 'full' : '') + '">' + fieldHtml(f, item[f.key], sec.key + ':' + i) + '</div>';
          }).join('') +
          '</div></div>';
        return body;
      }).join('') + addBtnHtml(sec);
    }
    // fields
    return '<div class="list-grid">' + sec.fields.map(function (f) {
      if (f.type === 'list') {
        return '<div class="full">' + renderNestedList(sec, f, data[f.key]) + '</div>';
      }
      if (f.type === 'stringlist') {
        return '<div class="full">' + stringlistHtml(f, data[f.key], '') + '</div>';
      }
      return '<div class="' + (f.type === 'textarea' ? 'full' : '') + '">' + fieldHtml(f, data[f.key], '') + '</div>';
    }).join('') + '</div>';
  }

  function renderNestedList(sec, f, value) {
    var arr = Array.isArray(value) ? value : [];
    var html = '<div class="field"><label>' + esc(f.label) + '</label>';
    arr.forEach(function (item, i) {
      html += '<div class="list-block" data-item="' + sec.key + ':' + f.key + '" data-idx="' + i + '">' +
        '<div class="list-head"><span class="idx">' + String(i + 1).padStart(2, '0') + ' · ' + esc(f.itemLabel) + '</span>' +
        '<span class="list-actions">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="' + sec.key + ':' + f.key + '" data-dir="-1">↑</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="' + sec.key + ':' + f.key + '" data-dir="1">↓</button>' +
        '<button type="button" class="btn btn-danger btn-sm" data-del="' + sec.key + ':' + f.key + '">✕</button>' +
        '</span></div><div class="list-grid">' +
        f.sub.map(function (sf) { return '<div class="' + (sf.type === 'textarea' ? 'full' : '') + '">' + fieldHtml(sf, item[sf.key], sec.key + ':' + f.key + ':' + i) + '</div>'; }).join('') +
        '</div></div>';
    });
    html += '<button type="button" class="btn btn-ghost btn-sm add-btn" data-add="' + sec.key + ':' + f.key + '">+ Añadir ' + esc(f.itemLabel || 'elemento') + '</button></div>';
    return html;
  }

  function addBtnHtml(sec) {
    return '<button type="button" class="btn btn-ghost add-btn" data-add="' + sec.key + '" style="margin-top:8px">+ Añadir ' + esc(sec.itemLabel || 'elemento') + '</button>';
  }

  // ---------- Eventos del formulario ----------
  function markDirty() {
    state.dirty = true;
    var s = $('#saveState');
    s.textContent = 'sin guardar';
    s.classList.remove('saved');
  }

  function bindSectionEvents(sec) {
    var area = $('#contentArea');
    ['input', 'change'].forEach(function (evt) {
      area.addEventListener(evt, markDirty);
    });

    area.addEventListener('click', function (e) {
      var t = e.target.closest('[data-add],[data-del],[data-move],[data-upload],[data-clear],[data-sl-add],[data-sl-del]');
      if (!t) return;
      var add = t.getAttribute('data-add');
      var del = t.getAttribute('data-del');
      var move = t.getAttribute('data-move');
      var up = t.getAttribute('data-upload');
      var clr = t.getAttribute('data-clear');
      var slAdd = t.getAttribute('data-sl-add');
      var slDel = t.getAttribute('data-sl-del');
      if (add) return listAdd(add);
      if (del) return listDel(del, t);
      if (move) return listMove(move, t);
      if (up) return pickUpload(up);
      if (clr) return clearImage(clr, t);
      if (slAdd) return slAddRow(slAdd, t);
      if (slDel) return slDelRow(slDel, t);
    });
  }

  // listas de objetos
  function syncCurrent() {
    // Antes de mutar (mover/borrar/añadir), recoge los valores del
    // formulario en state.data para que el re-render no pierda texto.
    if (!state.section) return;
    var sec = state.section;
    var collected = collectSection(sec);
    if (sec.type === 'list') {
      state.data[sec.key] = collected;
    } else {
      state.data[sec.key] = Object.assign({}, state.data[sec.key] || {}, collected);
    }
  }
  function listPath(key) {
    var parts = key.split(':');
    if (parts.length === 1) return { secKey: parts[0], fieldKey: null };
    if (parts.length === 2) return { secKey: parts[0], fieldKey: parts[1] };
    return null;
  }
  function listAdd(key) {
    syncCurrent();
    var p = listPath(key);
    var parent = p.fieldKey ? state.data[p.secKey][p.fieldKey] : state.data[p.secKey];
    if (!Array.isArray(parent)) parent = p.fieldKey ? (state.data[p.secKey][p.fieldKey] = []) : (state.data[p.secKey] = []);
    parent.push({});
    markDirty();
    openSection(p.secKey);
  }
  function listDel(key, btn) {
    syncCurrent();
    var p = listPath(key);
    var block = btn.closest('[data-item]');
    if (!block) return;
    var idx = parseInt(block.getAttribute('data-idx'), 10);
    var parent = p.fieldKey ? state.data[p.secKey][p.fieldKey] : state.data[p.secKey];
    if (Array.isArray(parent)) parent.splice(idx, 1);
    markDirty();
    openSection(p.secKey);
  }
  function listMove(key, btn) {
    syncCurrent();
    var p = listPath(key);
    var block = btn.closest('[data-item]');
    if (!block) return;
    var idx = parseInt(block.getAttribute('data-idx'), 10);
    var dir = parseInt(btn.getAttribute('data-dir'), 10);
    var parent = p.fieldKey ? state.data[p.secKey][p.fieldKey] : state.data[p.secKey];
    var to = idx + dir;
    if (!Array.isArray(parent) || to < 0 || to >= parent.length) return;
    var tmp = parent[idx]; parent[idx] = parent[to]; parent[to] = tmp;
    markDirty();
    openSection(p.secKey);
  }

  // stringlists
  function slAddRow(name, btn) {
    var wrap = btn.closest('.field').querySelector('[data-sl]');
    var row = document.createElement('div');
    row.className = 'stringlist-row';
    row.innerHTML = '<input type="text" data-sl-i="' + esc(name) + '" placeholder="Elemento nuevo">' +
      '<button type="button" class="btn btn-danger btn-sm" data-sl-del="' + esc(name) + '" aria-label="Eliminar">✕</button>';
    var empty = wrap.querySelector('[data-empty]');
    if (empty) empty.remove();
    wrap.appendChild(row);
    row.querySelector('input').focus();
    markDirty();
  }
  function slDelRow(name, btn) {
    var row = btn.closest('.stringlist-row');
    row.remove();
    markDirty();
  }

  // imágenes
  var pendingUpload = null;
  function pickUpload(name) {
    pendingUpload = name;
    $('#fileInput').click();
  }
  function clearImage(name, btn) {
    var block = btn.closest('.img-field');
    var input = block.querySelector('[data-i]');
    input.value = '';
    var preview = block.querySelector('[data-preview]');
    preview.style.backgroundImage = '';
    preview.textContent = 'sin imagen';
    btn.remove();
    markDirty();
  }
  async function onFile(file) {
    if (!pendingUpload || !file) return;
    var name = pendingUpload;
    pendingUpload = null;
    var type = file.type;
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(type)) return toast('Formato no válido', 'err');
    if (file.size > 5 * 1024 * 1024) return toast('La imagen supera 5 MB', 'err');
    toast('Subiendo imagen…');
    try {
      var dataUrl = await new Promise(function (resolve, reject) {
        var fr = new FileReader();
        fr.onload = function () { resolve(fr.result); };
        fr.onerror = reject;
        fr.readAsDataURL(file);
      });
      var r = await api('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ data: dataUrl, type: type }),
        headers: { 'Content-Type': 'application/json' }
      });
      var j = await r.json();
      if (!r.ok) throw new Error(j.detail || 'fallo al subir');
      var blocks = $all('#contentArea [data-upload="' + name + '"]');
      if (!blocks.length) return;
      var block = blocks[0].closest('.img-field');
      var input = block.querySelector('[data-i]');
      input.value = j.url;
      var preview = block.querySelector('[data-preview]');
      preview.style.backgroundImage = 'url(\'' + j.url + '\')';
      preview.textContent = '';
      var btn = block.querySelector('[data-clear]');
      if (!btn) {
        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'btn btn-danger btn-sm';
        clearBtn.setAttribute('data-clear', name);
        clearBtn.textContent = '✕';
        block.querySelector('.img-controls > div').appendChild(clearBtn);
      }
      markDirty();
      toast('Imagen subida ✓', 'ok');
    } catch (e) {
      toast(e.message || 'Error al subir la imagen', 'err');
    }
  }

  // ---------- Recoger valores del formulario ----------
  function collectSection(sec) {
    var data = {};
    var area = $('#contentArea');

    if (sec.type === 'stringlist') {
      return $all('[data-sl-i=""]', area).map(function (i) { return i.value.trim(); }).filter(Boolean);
    }

    if (sec.type === 'list') {
      return $all('[data-item="' + sec.key + '"]', area).map(function (block) {
        var item = {};
        sec.sub.forEach(function (f) {
          var name = sec.key + ':' + block.getAttribute('data-idx') + ':' + f.key;
          if (f.type === 'stringlist') {
            item[f.key] = $all('[data-sl-i="' + name + '"]', block).map(function (i) { return i.value.trim(); }).filter(Boolean);
          } else if (f.type === 'checkbox') {
            var c = block.querySelector('[data-i="' + name + '"]');
            item[f.key] = c ? c.checked : false;
          } else if (f.type === 'number') {
            var n = block.querySelector('[data-i="' + name + '"]');
            item[f.key] = n && n.value !== '' ? parseFloat(n.value) : 0;
          } else {
            var x = block.querySelector('[data-i="' + name + '"]');
            item[f.key] = x ? x.value : '';
          }
        });
        return item;
      });
    }

    // fields
    sec.fields.forEach(function (f) {
      if (f.type === 'list') {
        data[f.key] = $all('[data-item="' + sec.key + ':' + f.key + '"]', area).map(function (block) {
          var item = {};
          f.sub.forEach(function (sf) {
            var name = sec.key + ':' + f.key + ':' + block.getAttribute('data-idx') + ':' + sf.key;
            if (sf.type === 'checkbox') {
              var c = block.querySelector('[data-i="' + name + '"]');
              item[sf.key] = c ? c.checked : false;
            } else if (sf.type === 'number') {
              var n = block.querySelector('[data-i="' + name + '"]');
              item[sf.key] = n && n.value !== '' ? parseFloat(n.value) : 0;
            } else {
              var x = block.querySelector('[data-i="' + name + '"]');
              item[sf.key] = x ? x.value : '';
            }
          });
          return item;
        });
      } else if (f.type === 'stringlist') {
        data[f.key] = $all('[data-sl-i=""]', area).map(function (i) { return i.value.trim(); }).filter(Boolean);
      } else if (f.type === 'checkbox') {
        var c = area.querySelector('[data-i="' + f.key + '"]');
        data[f.key] = c ? c.checked : false;
      } else if (f.type === 'number') {
        var n = area.querySelector('[data-i="' + f.key + '"]');
        data[f.key] = n && n.value !== '' ? parseFloat(n.value) : 0;
      } else {
        var x = area.querySelector('[data-i="' + f.key + '"]');
        data[f.key] = x ? x.value : '';
      }
    });
    return data;
  }

  // ---------- Guardar / restablecer ----------
  async function saveSection() {
    if (!state.section) return;
    var sec = state.section;
    var data = collectSection(sec);
    var btn = $('#saveBtn');
    btn.disabled = true;
    btn.textContent = 'Guardando…';
    try {
      var r = await api('/api/content/' + sec.key, {
        method: 'PUT',
        body: JSON.stringify({ data: data })
      });
      if (!r.ok) {
        var j = await r.json().catch(function () { return {}; });
        throw new Error(j.error || 'error al guardar');
      }
      state.data[sec.key] = data;
      state.dirty = false;
      var s = $('#saveState');
      s.textContent = '✓ guardado ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      s.classList.add('saved');
      toast('Sección "' + sec.label + '" guardada ✓', 'ok');
    } catch (e) {
      toast(e.message || 'Error al guardar', 'err');
    } finally {
      btn.disabled = false;
      btn.textContent = '💾 Guardar';
    }
  }

  async function resetSection() {
    if (!state.section) return;
    var sec = state.section;
    if (!window.confirm('Restablecer "' + sec.label + '" al contenido de fábrica? Se perderán los cambios de esta sección.')) return;
    try {
      var r = await api('/api/content/' + sec.key + '/reset', { method: 'POST' });
      if (!r.ok) throw new Error('error al restablecer');
      state.data[sec.key] = Object.assign({}, DEFAULTS[sec.key] || {});
      openSection(sec.key);
      toast('Sección restablecida ✓', 'ok');
    } catch (e) {
      toast(e.message || 'Error al restablecer', 'err');
    }
  }

  function logout() {
    state.token = '';
    localStorage.removeItem(TOKEN_KEY);
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(function () {});
    showLogin();
  }

  // ---------- Boot ----------
  async function boot() {
    if (!state.token) { showLogin(); return; }
    try {
      await loadData();
      renderNav();
      showPanel();
      var first = new URLSearchParams(location.hash.slice(1)).get('s') || 'hero';
      openSection(first);
    } catch (e) {
      showLogin();
    }
  }

  function init() {
    $('#loginForm').addEventListener('submit', login);
    $('#saveBtn').addEventListener('click', saveSection);
    $('#resetBtn').addEventListener('click', resetSection);
    $('#logoutBtn').addEventListener('click', logout);
    $('#fileInput').addEventListener('change', function () {
      onFile(this.files && this.files[0]);
      this.value = '';
    });
    window.addEventListener('beforeunload', function (e) {
      if (state.dirty) { e.preventDefault(); e.returnValue = ''; }
    });
    boot();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
