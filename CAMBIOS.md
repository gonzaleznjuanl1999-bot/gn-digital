# CAMBIOS · gntecnologydigital (gn-digital)

Historial de sesiones y decisiones del proyecto. Última actualización: 30 ago 2026.

---

## Estado actual

| | |
|---|---|
| **Sitio** | https://gndigital.vercel.app |
| **Admin** | https://gndigital.vercel.app/admin.html |
| **Login admin** | `gonzaleznjuanl1999@gmail.com` / `JuanGonzalez2026` (rol owner) |
| **Repo** | https://github.com/gonzaleznjuanl1999-bot/gn-digital |
| **Stack** | HTML/CSS/JS vanilla · Express serverless (Vercel) · Supabase (PostgREST kv + Storage bucket `gn-media`) |
| **Idiomas** | Español (ES) · Alemán (DE) con detección automática + selector ES/DE |

---

## Cambios por sesión

### 1 · V1 — Landing + CMS + deploy (30 ago 2026)
- Landing "salvaje y tecnológica": hero con terminal animada, grid 3D, partículas canvas, marquesina infinita, bento de servicios, cifras con contadores, portafolio, proceso, testimonios en marquesina doble, CTA, footer.
- Panel admin CMS completo: 10 secciones editables (Marca, Hero, Cinta, Servicios, Cifras, Proceso, Trabajo, Testimonios, Contacto, SEO), subida de imágenes a Supabase, listas con añadir/ordenar/eliminar, restablecer por sección.
- Backend Express serverless: auth JWT (access 15 min + refresh rotado), rate-limit, API de contenido, upload, robots.txt, sitemap.xml.
- Persistencia portátil `server/lib/store.js`: SQLite local (dev) / PostgREST Supabase (prod) sobre la tabla `kv` — sin necesidad de DATABASE_URL.
- Dominio corto: `gndigital.vercel.app`. Repo creado y desplegado con CI manual (push + `vercel --prod` + alias).

### 2 · Portafolio con capturas reales
- 8 proyectos con screenshots reales del sistema de e-commerce (home, inventario, dashboard, checkout, pedidos, finanzas, productos, web corporativa) comprimidas a WebP (~50–130 KB).
- Capturas tomadas con Playwright contra el servidor dev de `tienda-universal`.

### 3 · Fix visibilidad (importante)
- **Bug**: los reveals ponían `opacity: 0` inline, que ganaba a la clase `.revealed` → secciones invisibles para siempre (el sitio parecía lleno de "espacios en blanco").
- **Fix**: el estado oculto lo maneja el CSS; el IntersectionObserver solo añade `.revealed`.
- Parallax del hero con `fromTo` (no captura el estado oculto).
- Hero rediseñado: título a ancho completo + fila inferior (texto/CTA | terminal).
- `fitHeroTitle`: el título se auto-ajusta para caber en 2 líneas con cualquier texto del CMS.

### 4 · Espaciado portafolio → proceso
- Intentado reducir el hueco de 260px → 80px, pero **revertido** por petición del cliente (se restauró el espaciado original).

### 5 · Sección Proceso (3 iteraciones)
1. **Pin horizontal por scroll** → cambiado por botones (no gustó el movimiento con scroll).
2. Botones centrados debajo → flotando al lado de la tarjeta.
3. **Versión final**: 4 tarjetas estáticas en grilla (sin botones, sin carrusel), responsive 4 → 2 → 1 columnas.

### 6 · Paleta de alta gama
- Negro profundo `#0a0a0c` + **oro champán** `#d8b878` / dorado bruñido `#b08d57` / champagne claro `#ead3a3`.
- Aplicada en toda la landing y el admin; logo, favicon y theme-color en oro.

### 7 · Acceso al admin
- Botón `⚙ Admin` visible en la barra de navegación (y en el menú móvil), abre en pestaña nueva.

### 8 · Tarjeta de e-commerce
- La tarjeta destacada pasó de 3×2 columnas al mismo tamaño que las demás (grilla 3×2 perfecta); sigue destacando por borde dorado, tag "★ MÁS PEDIDO" y fondo.

### 9 · Seguridad de acceso
- **Eliminado** el usuario `admin/admin123`.
- **Nuevo propietario**: `gonzaleznjuanl1999@gmail.com` / `JuanGonzalez2026` (rol owner) — actualizado en producción, seed y local; el repo solo contiene el hash bcrypt.

### 10 · Nombre de marca + alemán (i18n)
- Marca renombrada a **`gntecnologydigital`** (ES y DE, nav, footer, SEO).
- **Alemán completo**: contenido traducido (hero, servicios, proceso, portafolio, testimonios, contacto, SEO) en claves `*_de`.
- Detección automática por idioma del navegador (`de` → alemán, pensado para el lead suizo) + selector **ES | DE** en la nav (persistente en localStorage, soporta `?lang=de`).
- Nueva sección "Textos UI" (menú, títulos, CTA, pie) + variantes `*_de` → **22 secciones editables en el admin**.

---

## Arquitectura

```
gn-digital/
├── index.html              → landing (data-k para textos editables)
├── admin.html              → panel de contenido (CMS)
├── assets/
│   ├── css/main.css        → landing (tokens oro champán)
│   ├── css/admin.css       → panel admin
│   ├── js/content.default.js → contenido ES (GN_CONTENT) + DE (GN_CONTENT_DE)
│   ├── js/main.js          → render + motion (GSAP) + i18n
│   ├── js/admin.js         → editor por esquema (22 secciones)
│   └── img/                → logo/favicon oro + capturas work/*.webp
└── server/
    ├── server.js           → Express serverless (Vercel) + estáticos
    ├── lib/store.js        → sqlite (dev) | PostgREST Supabase (prod)
    ├── lib/seed.js         → admin + contenido por defecto (ES + *_de)
    └── routes/             → auth · content · upload
```

**Contenido**: tabla `kv` de Supabase con claves `gn:content:{seccion}` y `gn:content:{seccion}_de`; usuarios en `gn:users`; imágenes en bucket público `gn-media`.

**Cómo desplegar** (CI manual):
1. `git push origin master`
2. `npx vercel --prod --yes`
3. `npx vercel alias set <URL-nueva> gndigital.vercel.app`
4. Si cambiaron los defaults: `POST /api/content/<seccion>/reset` (login admin) para re-sembrar.

**Dev local**: `node server/server.js` → http://localhost:8765 (SQLite, sin envs).
