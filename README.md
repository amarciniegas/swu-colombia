# SWU Colombia

Sitio web de la comunidad de Star Wars: Unlimited en Colombia. Hecho con [Astro](https://astro.build) y publicado gratis en Cloudflare Pages.

> Sitio de fans no oficial. No afiliado a Lucasfilm Ltd. ni a Fantasy Flight Games.

## Estructura

```
src/
├── components/     Piezas reutilizables (Header, Footer, tarjetas, logo)
├── data/           Contenido editable: enlaces, eventos, noticias
│   ├── sitio.ts      ← enlaces de WhatsApp, Discord e Instagram
│   ├── eventos.ts    ← próximos eventos (ejemplos por ahora)
│   └── noticias.ts   ← artículos (ejemplos por ahora)
├── layouts/        Plantilla base de todas las páginas (SEO, fuentes)
├── pages/          Cada archivo es una página del sitio
└── styles/         Colores, tipografía y botones (global.css)
public/             Archivos tal cual: favicon, imágenes
astro.config.mjs    Dirección del sitio (cámbiala al comprar el dominio)
```

## Trabajar en tu computador

Necesitas [Node.js](https://nodejs.org) 22 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:4321 y se actualiza al guardar
npm run build    # genera el sitio final en la carpeta dist/
```

## Publicar gratis en Cloudflare Pages

1. **Sube el proyecto a GitHub**: crea un repositorio nuevo (por ejemplo `swu-colombia`) y sube esta carpeta.
   ```bash
   git init
   git add .
   git commit -m "Primera versión del sitio"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/swu-colombia.git
   git push -u origin main
   ```
2. Crea una cuenta gratis en [dash.cloudflare.com](https://dash.cloudflare.com).
3. Ve a **Workers & Pages → Create → Pages → Connect to Git** y elige el repositorio.
4. Configuración de compilación:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variable de entorno (opcional): `NODE_VERSION` = `22`
5. **Save and Deploy**. En uno o dos minutos el sitio queda en `https://NOMBRE-DEL-PROYECTO.pages.dev`.

Desde ahí, cada vez que subas cambios a GitHub (`git push`), Cloudflare publica la nueva versión solo.

## Cuando compres el dominio

1. En Cloudflare Pages: tu proyecto → **Custom domains → Set up a domain**.
2. En `astro.config.mjs` cambia `SITE_URL` por tu dominio y sube el cambio.

## Pendientes

- [ ] Poner los enlaces reales de WhatsApp, Discord e Instagram en `src/data/sitio.ts`.
- [ ] Semana 3: Eventos y Tiendas desde el panel del CMS.
- [ ] Semana 4: Noticias, Aprende, Herramientas y Comunidad.
