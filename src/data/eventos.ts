// Eventos del sitio. En la semana 3 esto pasa al panel del CMS
// para que los organizadores lo editen sin tocar código.

export type TipoEvento = 'Casual' | 'Semanal' | 'Torneo' | 'Premier' | 'Planetary Qualifier';

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
  // ---- Eventos de EJEMPLO: bórralos cuando tengan eventos reales ----
  {
    titulo: 'Evento de ejemplo',
    ciudad: 'Barranquilla',
    tienda: 'Tienda aliada',
    fecha: '2026-12-05',
    hora: '3:00 p. m.',
    tipo: 'Semanal',
  },
  {
    titulo: 'Evento de ejemplo',
    ciudad: 'Bogotá',
    tienda: 'Tienda aliada',
    fecha: '2026-12-12',
    hora: '2:00 p. m.',
    tipo: 'Torneo',
  },
  {
    titulo: 'Evento de ejemplo',
    ciudad: 'Medellín',
    tienda: 'Tienda aliada',
    fecha: '2026-12-19',
    hora: '4:00 p. m.',
    tipo: 'Casual',
  },
];
