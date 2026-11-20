// Tiendas aliadas donde se juega Star Wars: Unlimited.

export interface Tienda {
  nombre: string;
  ciudad: string;
  direccion?: string;
  instagramUsuario?: string; // como se muestra, sin @
  instagramUrl?: string; // enlace exacto a la cuenta (cuando lo confirmemos)
  whatsapp?: string; // enlace wa.me
}

export const tiendas: Tienda[] = [
  {
    nombre: 'Ravenwood',
    ciudad: 'Barranquilla',
    direccion: 'Cra. 45 #80-31, Local 1',
    instagramUsuario: 'Ravenwood',
    instagramUrl: 'https://www.instagram.com/ravenwood/',
  },
  {
    nombre: 'Friz Froz Fruz',
    ciudad: 'Cali',
  },
];
