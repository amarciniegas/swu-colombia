// Eventos especiales (torneos, Planetary Qualifiers, prereleases…).
// El juego semanal fijo va en semanal.ts.
// En la siguiente etapa esto pasa al panel del CMS para que los
// organizadores lo editen sin tocar código.

export type TipoEvento =
  | 'Casual'
  | 'Torneo'
  | 'Store Showdown'
  | 'Prerelease'
  | 'Premier'
  | 'Planetary Qualifier';

export interface Evento {
  titulo: string;
  ciudad: string;
  tienda: string;
  fecha: string; // formato AAAA-MM-DD
  hora: string;
  tipo: TipoEvento;
  costo?: string;
  // Eventos destacados: se muestran grandes, con su insignia, arriba de la lista.
  destacado?: boolean;
  insignia?: string; // ruta dentro de /public
  insigniaAlt?: string;
}

export const eventos: Evento[] = [
  {
    titulo: 'Planetary Qualifier Cali',
    ciudad: 'Cali',
    tienda: 'Friz Froz Fruz',
    fecha: '2026-11-15',
    hora: '7:00 a. m.',
    tipo: 'Planetary Qualifier',
    costo: '$150.000 COP',
    destacado: true,
    insignia: '/img/insignia-planetary-qualifier.png',
    insigniaAlt: 'Insignia oficial de Planetary Qualifier de Star Wars: Unlimited',
  },
];

/** Eventos de hoy en adelante, ordenados por fecha. */
export function eventosFuturos(hoy: string): Evento[] {
  return eventos.filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
}
