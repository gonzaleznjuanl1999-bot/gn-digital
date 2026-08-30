// ============================================================
// content.default.js · Contenido del sitio GN (es + de)
// Fuente única de verdad: navegador (fallback) y servidor (seed).
// El admin edita las secciones desde /admin.html (keys *_de para
// alemán). La landing elige idioma por navegador/localStorage.
// ============================================================
(function (root, factory) {
  var DATA = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
  if (root) { root.GN_CONTENT = DATA.es; root.GN_CONTENT_DE = DATA.de; }
})(typeof window !== 'undefined' ? window : null, function () {
  var es = {
    brand: {
      name: "gntecnologydigital",
      short: "GN",
      tagline: "Ingeniería digital para negocios que venden",
      status: "Disponible para nuevos proyectos",
      logoUrl: ""
    },
    labels: {
      navServicios: "Servicios", navTrabajo: "Trabajo", navProceso: "Proceso", navTestimonios: "Testimonios", navContacto: "Contacto",
      trust1: "✓ Panel de edición incluido", trust2: "✓ Sin plantillas genéricas", trust3: "✓ Soporte real",
      s1Eyebrow: "// 01 · SERVICIOS",
      s1T1: "Todo lo que tu negocio", s1T2: "necesita en digital",
      s1Desc: "Diseñamos, construimos y mantenemos sistemas completos. Un solo equipo para tu presencia online, tus ventas y tu operación.",
      s2Eyebrow: "// 02 · TRABAJO",
      s2T1: "Sistemas en", s2T2: "producción real",
      s2Desc: "No prometemos: desplegamos. Estos son sistemas nuestros funcionando de verdad, con pagos, datos y usuarios reales.",
      s3Eyebrow: "// 03 · PROCESO",
      s3T1: "De la idea al lanzamiento", s3T2: "sin fricción",
      s4Eyebrow: "// 04 · TESTIMONIOS",
      s4T1: "Clientes que ya", s4T2: "venden en digital",
      ctaEyebrow: "// 05 · CONTACTO",
      ctaT1: "¿Construimos", ctaT2: "lo tuyo",
      ctaSub: "Cuéntanos tu idea o tu problema. En 24h te respondemos con un plan claro, precio y tiempo de entrega.",
      ctaWhatsapp: "💬 WhatsApp", ctaEmail: "✉ Escríbenos un email",
      workSee: "Ver proyecto", workInternal: "Caso interno",
      scroll: "scroll",
      footNav: "Navegación", footServices: "Servicios", footContact: "Contacto",
      footRights: "Todos los derechos reservados"
    },
    hero: {
      eyebrow: "[ SISTEMAS DIGITALES / WEB · E-COMMERCE · INVENTARIOS ]",
      title1: "Construimos sistemas",
      title2: "digitales que venden.",
      subtitle: "Páginas web, tiendas online y software de inventario a medida. Tu negocio en Internet con ingeniería real, no con plantillas genéricas.",
      cta1: "Iniciar mi proyecto",
      cta2: "Ver servicios",
      terminal: [
        { c: "gn@studio:~$ gn deploy --nuevo-proyecto", o: "▸ analizando negocio y objetivos…" },
        { c: "gn@studio:~$ gn build --web --ecommerce", o: "✓ sitio online lanzado en días" },
        { c: "gn@studio:~$ gn inventory --sync", o: "✓ stock sincronizado en tiempo real" },
        { c: "gn@studio:~$ gn launch --ready", o: "→ tu empresa digital está en línea" }
      ]
    },
    marquee: [
      "Páginas web", "E-commerce", "Inventarios", "Automatización",
      "SEO & Marketing", "Sistemas a medida", "Mantenimiento", "Integraciones"
    ],
    services: [
      {
        icon: "globe",
        name: "Páginas Web Corporativas",
        desc: "Tu presencia digital profesional: rápida, segura y diseñada para convertir visitas en clientes.",
        features: ["Diseño premium a medida", "Carga ultrarrápida (Core Web Vitals)", "Posicionamiento SEO desde el día uno", "Panel para editar tu contenido"],
        price: "desde $349",
        featured: false
      },
      {
        icon: "cart",
        name: "E-commerce & Tiendas Online",
        desc: "Tiendas completas con pagos reales, facturas, inventario y multi-idioma. La plataforma que ya usan nuestros clientes.",
        features: ["Pagos: tarjeta, PayPal, cripto y más", "Inventario y stock automático", "Facturación y reportes", "6 idiomas desde el primer día"],
        price: "desde $899",
        featured: true
      },
      {
        icon: "box",
        name: "Sistemas de Inventario",
        desc: "Controla tu stock, proveedores y alertas de reposición en tiempo real. Nunca más pierdas una venta por falta de stock.",
        features: ["Stock en tiempo real", "Alertas de reposición", "Ledger de movimientos", "Proveedores y reordenes"],
        price: "desde $699",
        featured: false
      },
      {
        icon: "chart",
        name: "SEO & Marketing Digital",
        desc: "Atrae tráfico de calidad y convierte. Posicionamiento, campañas y analítica con reportes claros cada mes.",
        features: ["SEO técnico y de contenido", "Campañas en redes", "Google Analytics & Search Console", "Reportes mensuales"],
        price: "desde $249/mes",
        featured: false
      },
      {
        icon: "code",
        name: "Sistemas & Apps a Medida",
        desc: "Software que no existe en ningún catálogo: automatizaciones, paneles, integraciones y APIs para tu operación.",
        features: ["Automatización de procesos", "Paneles de control", "Integración con tus herramientas", "Escalable desde el día uno"],
        price: "a medida",
        featured: false
      },
      {
        icon: "shield",
        name: "Mantenimiento & Soporte",
        desc: "Tu sistema siempre al día: copias de seguridad, actualizaciones, seguridad y soporte cuando lo necesitas.",
        features: ["Backups automáticos", "Monitorización 24/7", "Actualizaciones y parches", "Soporte prioritario"],
        price: "desde $99/mes",
        featured: false
      }
    ],
    stats: [
      { value: 25, suffix: "+", label: "Proyectos entregados" },
      { value: 12, suffix: "", label: "Tiendas online en vivo" },
      { value: 6, suffix: "", label: "Idiomas en nuestros sistemas" },
      { value: 99, suffix: "%", label: "Satisfacción de clientes" }
    ],
    process: [
      { num: "01", name: "Descubrimiento", desc: "Analizamos tu negocio, tu competencia y tus objetivos. Definimos exactamente qué construir y por qué.", icon: "radar" },
      { num: "02", name: "Diseño", desc: "Diseñamos la experiencia visual: interfaces pensadas para convertir visitantes en clientes.", icon: "pen" },
      { num: "03", name: "Desarrollo", desc: "Construimos con tecnología moderna, rápida y segura. Sin plantillas genéricas: tu sistema es único.", icon: "cpu" },
      { num: "04", name: "Lanzamiento", desc: "Desplegamos, conectamos pagos, dominio y analítica. Tu empresa digital queda viva en producción.", icon: "rocket" }
    ],
    portfolio: [
      {
        name: "Tienda Universal",
        category: "E-commerce",
        desc: "Plataforma multi-idioma con 6 idiomas, multi-tienda, pagos reales, facturas PDF e inventario en tiempo real.",
        image: "assets/img/work/tienda.webp",
        url: "https://tienda-universal-gonzaleznjuanl1999-3553s-projects.vercel.app/",
        tags: ["E-commerce", "6 idiomas", "Pagos reales", "PWA"]
      },
      {
        name: "GN Inventario",
        category: "Sistema de gestión",
        desc: "Control de stock con ledger completo, alertas de reposición, proveedores y ajustes — todo en tiempo real.",
        image: "assets/img/work/inventory.webp",
        url: "",
        tags: ["Inventario", "Alertas", "Ledger", "Proveedores"]
      },
      {
        name: "Panel de Gestión",
        category: "Dashboard",
        desc: "CRM, pedidos, facturación, finanzas y marketing reunidos en un solo panel responsive, incluso en móvil.",
        image: "assets/img/work/admin.webp",
        url: "",
        tags: ["CRM", "Finanzas", "Facturación", "Reportes"]
      },
      {
        name: "Gravity Studio",
        category: "Web corporativa",
        desc: "Sitio corporativo de alto impacto con animaciones de scroll, scrollytelling y diseño premium.",
        image: "assets/img/work/gravity.webp",
        url: "",
        tags: ["Web", "Animación", "Premium", "SEO"]
      },
      {
        name: "Checkout & Pagos",
        category: "E-commerce",
        desc: "Proceso de compra optimizado con 8 pasarelas: tarjeta, PayPal, Klarna, SEPA, cripto y más, con confirmación por email.",
        image: "assets/img/work/checkout.webp",
        url: "https://tienda-universal-gonzaleznjuanl1999-3553s-projects.vercel.app/#/checkout",
        tags: ["Checkout", "8 pasarelas", "Cripto", "Emails"]
      },
      {
        name: "CRM & Pedidos",
        category: "Sistema de gestión",
        desc: "Gestión completa de pedidos: estados, devoluciones, tracking, etiquetas y export CSV en un solo clic.",
        image: "assets/img/work/orders.webp",
        url: "",
        tags: ["Pedidos", "Devoluciones", "Tracking", "CSV"]
      },
      {
        name: "Finanzas & Facturación",
        category: "Dashboard",
        desc: "Ventas, impuestos, facturas con numeración automática y conciliación bancaria en tiempo real.",
        image: "assets/img/work/finance.webp",
        url: "",
        tags: ["Ventas", "IVA", "Facturas", "Conciliación"]
      },
      {
        name: "Catálogo & Productos",
        category: "E-commerce",
        desc: "Editor de productos con variantes, precios, SEO, stock por talla y proveedores vinculados.",
        image: "assets/img/work/products.webp",
        url: "https://tienda-universal-gonzaleznjuanl1999-3553s-projects.vercel.app/#/shop",
        tags: ["Productos", "Variantes", "SEO", "Stock"]
      }
    ],
    testimonials: [
      {
        quote: "Pasamos de no tener presencia online a vender todos los días. El proceso fue claro y el resultado superó lo que imaginamos.",
        author: "Carlos Mendoza",
        role: "Fundador · Distribuidora Mendoza",
        stars: 5
      },
      {
        quote: "El sistema de inventario nos ahorra horas cada semana. Las alertas de reposición evitaron quedarnos sin stock en temporada alta.",
        author: "Lucía Fernández",
        role: "Gerente · Tienda Verde",
        stars: 5
      },
      {
        quote: "Nuestra tienda online funciona en 6 idiomas y cobra con todas las pasarelas. Los clientes no se creen que no tenga un equipo grande detrás.",
        author: "Andrés Ruiz",
        role: "CEO · Ruiz Import",
        stars: 5
      },
      {
        quote: "Profesionales, rápidos y transparentes. Explican la tecnología en cristiano y entregan siempre lo prometido.",
        author: "María Torres",
        role: "Directora · Clínica Torres",
        stars: 5
      },
      {
        quote: "La web corporativa se ve espectacular y carga rapidísimo. Las visitas orgánicas se triplicaron en tres meses.",
        author: "Jorge Álvarez",
        role: "Marketing · Constructora Álvarez",
        stars: 5
      }
    ],
    contact: {
      email: "gntecnologydigital@gmail.com",
      phone: "+58 424 5761431",
      whatsapp: "584245761431",
      city: "Nivel mundial · Trabajamos en remoto",
      hours: "Lun–Sáb · 9:00–19:00",
      socials: [
        { name: "Instagram", url: "#" },
        { name: "LinkedIn", url: "#" },
        { name: "WhatsApp", url: "#" }
      ]
    },
    seo: {
      title: "gntecnologydigital — Páginas web, e-commerce e inventarios",
      description: "Creamos páginas web, tiendas online y sistemas de inventario que venden. Ingeniería digital a medida para tu negocio, con panel de edición incluido.",
      ogImage: ""
    }
  };

  var de = {
    brand: {
      name: "gntecnologydigital",
      short: "GN",
      tagline: "Digitale Technik für Unternehmen, die verkaufen",
      status: "Verfügbar für neue Projekte",
      logoUrl: ""
    },
    labels: {
      navServicios: "Leistungen", navTrabajo: "Arbeiten", navProceso: "Prozess", navTestimonios: "Referenzen", navContacto: "Kontakt",
      trust1: "✓ Bearbeitungs-Panel inklusive", trust2: "✓ Keine Standard-Vorlagen", trust3: "✓ Echter Support",
      s1Eyebrow: "// 01 · LEISTUNGEN",
      s1T1: "Alles, was dein Unternehmen", s1T2: "digital braucht",
      s1Desc: "Wir designen, bauen und pflegen komplette Systeme. Ein Team für deine Online-Präsenz, deinen Verkauf und deinen Betrieb.",
      s2Eyebrow: "// 02 · ARBEITEN",
      s2T1: "Systeme in", s2T2: "echter Produktion",
      s2Desc: "Wir versprechen nicht: wir liefern aus. Das sind unsere Systeme, die wirklich laufen — mit echten Zahlungen, Daten und Nutzern.",
      s3Eyebrow: "// 03 · PROZESS",
      s3T1: "Von der Idee zum Launch", s3T2: "ohne Reibung",
      s4Eyebrow: "// 04 · REFERENZEN",
      s4T1: "Kunden, die bereits", s4T2: "digital verkaufen",
      ctaEyebrow: "// 05 · KONTAKT",
      ctaT1: "Bauen wir", ctaT2: "deins",
      ctaSub: "Erzähl uns von deiner Idee oder deinem Problem. Innerhalb von 24 Stunden erhältst du einen klaren Plan mit Preis und Lieferzeit.",
      ctaWhatsapp: "💬 WhatsApp", ctaEmail: "✉ Schreib uns eine E-Mail",
      workSee: "Projekt ansehen", workInternal: "Internes Projekt",
      scroll: "scrollen",
      footNav: "Navigation", footServices: "Leistungen", footContact: "Kontakt",
      footRights: "Alle Rechte vorbehalten"
    },
    hero: {
      eyebrow: "[ DIGITALE SYSTEME / WEB · E-COMMERCE · INVENTAR ]",
      title1: "Wir bauen Systeme,",
      title2: "die verkaufen.",
      subtitle: "Massgeschneiderte Websites, Online-Shops und Inventar-Software. Dein Unternehmen im Internet mit echter Technik — nicht mit Standard-Vorlagen.",
      cta1: "Projekt starten",
      cta2: "Leistungen ansehen",
      terminal: [
        { c: "gn@studio:~$ gn deploy --neues-projekt", o: "▸ Analyse von Geschäft und Zielen…" },
        { c: "gn@studio:~$ gn build --web --ecommerce", o: "✓ Website in Tagen live" },
        { c: "gn@studio:~$ gn inventory --sync", o: "✓ Lagerbestand in Echtzeit" },
        { c: "gn@studio:~$ gn launch --bereit", o: "→ Ihr digitales Unternehmen ist online" }
      ]
    },
    marquee: [
      "Websites", "E-Commerce", "Inventar", "Automatisierung",
      "SEO & Marketing", "Massgeschneiderte Systeme", "Wartung", "Integrationen"
    ],
    services: [
      {
        icon: "globe",
        name: "Websites für Unternehmen",
        desc: "Ihre professionelle digitale Präsenz: schnell, sicher und darauf ausgelegt, Besucher in Kunden zu verwandeln.",
        features: ["Premium-Design nach Mass", "Ultraschnelles Laden (Core Web Vitals)", "SEO ab dem ersten Tag", "Panel zur Bearbeitung Ihrer Inhalte"],
        price: "ab $349",
        featured: false
      },
      {
        icon: "cart",
        name: "E-Commerce & Online-Shops",
        desc: "Komplette Shops mit echten Zahlungen, Rechnungen, Inventar und Mehrsprachigkeit. Die Plattform, die unsere Kunden bereits nutzen.",
        features: ["Zahlungen: Karte, PayPal, Krypto u. v. m.", "Inventar und Lagerbestand automatisch", "Rechnungen und Reports", "6 Sprachen ab dem ersten Tag"],
        price: "ab $899",
        featured: true
      },
      {
        icon: "box",
        name: "Inventarsysteme",
        desc: "Kontrollieren Sie Lagerbestand, Lieferanten und Nachbestell-Warnungen in Echtzeit. Verlieren Sie nie wieder einen Verkauf wegen fehlendem Bestand.",
        features: ["Bestand in Echtzeit", "Nachbestell-Warnungen", "Bewegungs-Ledger", "Lieferanten und Bestellungen"],
        price: "ab $699",
        featured: false
      },
      {
        icon: "chart",
        name: "SEO & Digital-Marketing",
        desc: "Holen Sie sich qualifizierten Traffic und konvertieren Sie. Positionierung, Kampagnen und Analysen mit klaren monatlichen Reports.",
        features: ["Technisches & inhaltliches SEO", "Social-Media-Kampagnen", "Google Analytics & Search Console", "Monatliche Reports"],
        price: "ab $249/Monat",
        featured: false
      },
      {
        icon: "code",
        name: "Massgeschneiderte Systeme & Apps",
        desc: "Software, die in keinem Katalog steht: Automatisierungen, Dashboards, Integrationen und APIs für Ihren Betrieb.",
        features: ["Prozess-Automatisierung", "Kontroll-Dashboards", "Integration Ihrer Tools", "Skalierbar ab dem ersten Tag"],
        price: "nach Mass",
        featured: false
      },
      {
        icon: "shield",
        name: "Wartung & Support",
        desc: "Ihr System immer aktuell: Backups, Updates, Sicherheit und Support, wenn Sie ihn brauchen.",
        features: ["Automatische Backups", "24/7-Überwachung", "Updates und Patches", "Prioritäts-Support"],
        price: "ab $99/Monat",
        featured: false
      }
    ],
    stats: [
      { value: 25, suffix: "+", label: "Projekte ausgeliefert" },
      { value: 12, suffix: "", label: "Online-Shops live" },
      { value: 6, suffix: "", label: "Sprachen in unseren Systemen" },
      { value: 99, suffix: "%", label: "Kundenzufriedenheit" }
    ],
    process: [
      { num: "01", name: "Entdeckung", desc: "Wir analysieren Ihr Geschäft, Ihre Konkurrenz und Ihre Ziele. Wir definieren genau, was wir bauen und warum.", icon: "radar" },
      { num: "02", name: "Design", desc: "Wir gestalten das visuelle Erlebnis: Interfaces, die Besucher in Kunden verwandeln.", icon: "pen" },
      { num: "03", name: "Entwicklung", desc: "Wir bauen mit moderner, schneller und sicherer Technologie. Keine Standard-Vorlagen: Ihr System ist einzigartig.", icon: "cpu" },
      { num: "04", name: "Launch", desc: "Wir deployen, verbinden Zahlungen, Domain und Analytics. Ihr digitales Unternehmen geht live.", icon: "rocket" }
    ],
    portfolio: [
      {
        name: "Tienda Universal",
        category: "E-Commerce",
        desc: "Mehrsprachige Plattform mit 6 Sprachen, Multi-Store, echten Zahlungen, PDF-Rechnungen und Inventar in Echtzeit.",
        image: "assets/img/work/tienda.webp",
        url: "https://tienda-universal-gonzaleznjuanl1999-3553s-projects.vercel.app/",
        tags: ["E-Commerce", "6 Sprachen", "Echte Zahlungen", "PWA"]
      },
      {
        name: "GN Inventar",
        category: "Verwaltungssystem",
        desc: "Bestandskontrolle mit komplettem Ledger, Nachbestell-Warnungen, Lieferanten und Anpassungen — alles in Echtzeit.",
        image: "assets/img/work/inventory.webp",
        url: "",
        tags: ["Inventar", "Warnungen", "Ledger", "Lieferanten"]
      },
      {
        name: "Verwaltungspanel",
        category: "Dashboard",
        desc: "CRM, Bestellungen, Rechnungen, Finanzen und Marketing in einem einzigen responsiven Panel — auch mobil.",
        image: "assets/img/work/admin.webp",
        url: "",
        tags: ["CRM", "Finanzen", "Rechnungen", "Reports"]
      },
      {
        name: "Gravity Studio",
        category: "Unternehmenswebsite",
        desc: "Hochwertige Unternehmenswebsite mit Scroll-Animationen, Scrollytelling und Premium-Design.",
        image: "assets/img/work/gravity.webp",
        url: "",
        tags: ["Web", "Animation", "Premium", "SEO"]
      },
      {
        name: "Checkout & Zahlungen",
        category: "E-Commerce",
        desc: "Optimierter Kaufprozess mit 8 Zahlungsanbietern: Karte, PayPal, Klarna, SEPA, Krypto u. v. m. — mit E-Mail-Bestätigung.",
        image: "assets/img/work/checkout.webp",
        url: "https://tienda-universal-gonzaleznjuanl1999-3553s-projects.vercel.app/#/checkout",
        tags: ["Checkout", "8 Anbieter", "Krypto", "E-Mails"]
      },
      {
        name: "CRM & Bestellungen",
        category: "Verwaltungssystem",
        desc: "Komplette Bestellverwaltung: Status, Rückerstattungen, Tracking, Etiketten und CSV-Export mit einem Klick.",
        image: "assets/img/work/orders.webp",
        url: "",
        tags: ["Bestellungen", "Rückerstattungen", "Tracking", "CSV"]
      },
      {
        name: "Finanzen & Rechnungen",
        category: "Dashboard",
        desc: "Verkäufe, Steuern, automatisch nummerierte Rechnungen und Bankabstimmung in Echtzeit.",
        image: "assets/img/work/finance.webp",
        url: "",
        tags: ["Verkäufe", "MwSt.", "Rechnungen", "Abstimmung"]
      },
      {
        name: "Katalog & Produkte",
        category: "E-Commerce",
        desc: "Produkt-Editor mit Varianten, Preisen, SEO, Lagerbestand pro Grösse und verknüpften Lieferanten.",
        image: "assets/img/work/products.webp",
        url: "https://tienda-universal-gonzaleznjuanl1999-3553s-projects.vercel.app/#/shop",
        tags: ["Produkte", "Varianten", "SEO", "Bestand"]
      }
    ],
    testimonials: [
      {
        quote: "Wir hatten keine Online-Präsenz und verkaufen jetzt täglich. Der Prozess war klar und das Ergebnis übertraf unsere Vorstellungen.",
        author: "Carlos Mendoza",
        role: "Gründer · Mendoza Distribución",
        stars: 5
      },
      {
        quote: "Das Inventarsystem spart uns jede Woche Stunden. Die Nachbestell-Warnungen haben uns in der Hochsaison vor leeren Regalen bewahrt.",
        author: "Lucía Fernández",
        role: "Geschäftsleiterin · Tienda Verde",
        stars: 5
      },
      {
        quote: "Unser Shop funktioniert in 6 Sprachen und akzeptiert alle Zahlungsarten. Kunden glauben nicht, dass hinter uns kein grosses Team steckt.",
        author: "Andrés Ruiz",
        role: "CEO · Ruiz Import",
        stars: 5
      },
      {
        quote: "Professionell, schnell und transparent. Sie erklären Technik in verständlicher Sprache und liefern immer, was sie versprechen.",
        author: "María Torres",
        role: "Direktorin · Klinik Torres",
        stars: 5
      },
      {
        quote: "Die Website sieht spektakulär aus und lädt blitzschnell. Die organischen Besuche haben sich in drei Monaten verdreifacht.",
        author: "Jorge Álvarez",
        role: "Marketing · Bauunternehmen Álvarez",
        stars: 5
      }
    ],
    contact: {
      email: "gntecnologydigital@gmail.com",
      phone: "+58 424 5761431",
      whatsapp: "584245761431",
      city: "Weltweit · Remote-Arbeit",
      hours: "Mo–Sa · 9:00–19:00",
      socials: [
        { name: "Instagram", url: "#" },
        { name: "LinkedIn", url: "#" },
        { name: "WhatsApp", url: "#" }
      ]
    },
    seo: {
      title: "gntecnologydigital — Websites, E-Commerce & Inventar",
      description: "Wir erstellen Websites, Online-Shops und Inventarsysteme, die verkaufen. Massgeschneiderte digitale Technik für Ihr Unternehmen, inklusive Bearbeitungs-Panel.",
      ogImage: ""
    }
  };

  return { es: es, de: de };
});
