// Tiendas aliadas donde se juega Star Wars: Unlimited.

export interface Tienda {
  nombre: string;
  ciudad: string;
  direccion?: string;
  instagramUsuario?: string; // como se muestra, sin @
  instagramUrl?: string; // enlace exacto a la cuenta (cuando lo confirmemos)
  whatsapp?: string; // enlace wa.me
  logo?: string; // ruta dentro de /public, ej. '/img/tiendas/ravenwood.png' (PNG transparente o SVG)
}

export const tiendas: Tienda[] = [
  {
    nombre: 'Ravenwood',
    ciudad: 'Barranquilla',
    direccion: 'Cra. 45 #80-31, Local 1',
    instagramUsuario: 'Ravenwood',
    instagramUrl: 'https://www.instagram.com/ravenwood/',
    logo: '/img/tiendas/ravenwood.png',
  },
  {
    nombre: 'Friz Froz Fruz',
    ciudad: 'Cali',
    direccion: 'Cra. 27 Oeste #2-31, Barrio San Fernando',
    logo: '/img/tiendas/friz-froz-fruz.png',
  },
  {
    nombre: 'Son Geniales',
    ciudad: 'Bogotá',
    direccion: 'Cra. 46 #102-42, Barrio Santa Margarita',
    logo: '/img/tiendas/son-geniales.png',
  },
];
