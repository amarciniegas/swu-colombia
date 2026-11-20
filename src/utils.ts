import type { Tienda } from './data/tiendas';

/** "Medellín" → "medellin", "Santa Marta" → "santa-marta" */
export function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

/** Enlace de Google Maps que busca la tienda por nombre y dirección. */
export function mapaUrl(tienda: Tienda): string {
  const consulta = [tienda.nombre, tienda.direccion, tienda.ciudad, 'Colombia']
    .filter(Boolean)
    .join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

/** Fecha de hoy (AAAA-MM-DD) en hora de Colombia. */
export function hoyColombia(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
}
