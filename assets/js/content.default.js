// ============================================================
// content.default.js · Contenido por defecto del sitio GN Digital
// Fuente única de verdad: el navegador lo usa como fallback offline
// y el servidor lo siembra en la DB (server/lib/seed.js).
// El admin edita estas secciones desde /admin.html.
// ============================================================
(function (root, factory) {
  var DATA = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
  if (root) root.GN_CONTENT = DATA;
})(typeof window !== 'undefined' ? window : null, function () {
  return {
    brand: {
      name: "GN Digital Technology",
      short: "GN",
      tagline: "Ingeniería digital para negocios que venden",
      status: "Disponible para nuevos proyectos",
      logoUrl: ""
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
      {
        num: "01",
        name: "Descubrimiento",
        desc: "Analizamos tu negocio, tu competencia y tus objetivos. Definimos exactamente qué construir y por qué.",
        icon: "radar"
      },
      {
        num: "02",
        name: "Diseño",
        desc: "Diseñamos la experiencia visual: interfaces pensadas para convertir visitantes en clientes.",
        icon: "pen"
      },
      {
        num: "03",
        name: "Desarrollo",
        desc: "Construimos con tecnología moderna, rápida y segura. Sin plantillas genéricas: tu sistema es único.",
        icon: "cpu"
      },
      {
        num: "04",
        name: "Lanzamiento",
        desc: "Desplegamos, conectamos pagos, dominio y analítica. Tu empresa digital queda viva en producción.",
        icon: "rocket"
      }
    ],
    portfolio: [
      {
        name: "Tienda Universal",
        category: "E-commerce",
        desc: "Plataforma multi-idioma con 6 idiomas, multi-tienda, pagos reales, facturas PDF e inventario en tiempo real.",
        image: "assets/img/work/tienda.webp",
        url: "",
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
      email: "hola@gndigital.tech",
      phone: "+34 600 123 456",
      whatsapp: "34600123456",
      city: "España · Trabajamos en remoto",
      hours: "Lun–Vie · 9:00–19:00",
      socials: [
        { name: "Instagram", url: "#" },
        { name: "LinkedIn", url: "#" },
        { name: "WhatsApp", url: "#" }
      ]
    },
    seo: {
      title: "GN Digital Technology — Páginas web, e-commerce e inventarios",
      description: "Creamos páginas web, tiendas online y sistemas de inventario que venden. Ingeniería digital a medida para tu negocio, con panel de edición incluido.",
      ogImage: ""
    }
  };
});
