# Cambios realizados — gn-digital (30 ago 2026)

## 1. Verificación del idioma alemán ✅ (sin cambios, ya estaba hecho)

- La web ya tiene **traducción completa al alemán** en `assets/js/content.default.js` (objeto `de` + objeto `es`).
- El botón **ES/DE** ya existe en el menú (`.lang-switch` en `index.html`).
- El selector de idioma funciona por: navegador (`lang`) o `localStorage`, con fallback a español.
- **Nada que corregir aquí.** Cuando un lead alemán abre `gndigital.vercel.app/?lang=de`, ve toda la web en alemán.

## 2. Demo de tienda-universal linkeada en el portfolio ✅ (CAMBIO REALIZADO)

**Archivo:** `assets/js/content.default.js`

Añadí la URL de la tienda demo (en producción) al item **"Tienda Universal"** del portfolio, tanto en el objeto `es` como en el `de`:

```
url: "https://tienda-universal-gonzaleznjuanl1999-3553s-projects.vercel.app"
```

**Efecto visual:** el item "Tienda Universal" (1º del portfolio, sección "Trabajo") ahora muestra:
- Botón **"Ver proyecto"** clicable (se abre en pestaña nueva)
- La URL visible como pill bajo el nombre del proyecto (en vez de "gn.digital/caso")

Esto funciona porque `main.js:148` renderiza:
```js
var link = p.url ? '<a class="work-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">Ver proyecto</a>' : '<span class="work-link">Caso interno</span>';
```

## 3. Verificaciones hechas ✅

- Sintaxis JS válida: `node -e "require('./assets/js/content.default.js')"` sin errores.
- Ambas URLs (es y de) apuntan a la demo: `portfolio[0].url` correcto en los dos objetos.
- La demo responde viva: `GET /api/health` → `{"ok":true,"db":"pg"}` (producido, base Postgres en Supabase).

## 4. PENDIENTE — despliegue

El cambio está **solo local** en `assets/js/content.default.js`. Falta desplegar para que se vea en `gndigital.vercel.app`:

- Opciones: `vercel --prod` desde la carpeta `gn-digital/`, o `git push` si el repo tiene CI/CD (como tienda-universal).
- ⚠️ Nota: si el proyecto gn-digital usa el panel admin (`admin.html`), los edits del admin se guardan como **overrides** en el servidor y pueden **tapar** el valor por defecto de `content.default.js` para el item del portfolio. Si tras desplegar el botón "Ver proyecto" no aparece, revisar el editor del admin (Trabajo → Proyecto 1 → campo URL) y pegar ahí la misma URL.

## 5. Siguiente paso sugerido (para el otro flujo)

- Cuando la web esté en producción con el portfolio linkeado, añadir el enlace `gndigital.vercel.app` a las firmas de los emails de outreach (los leads suizos verificarán la web antes de responder).
