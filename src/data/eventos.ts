// Eventos de EJEMPLO. En la semana 3 esto pasa al panel del CMS
// para que los organizadores lo editen sin tocar código.

export type TipoEvento = 'Casual' | 'Semanal' | 'Torneo' | 'Premier';

export interface Evento {
  titulo: string;
  ciudad: string;
  tienda: string;
  fecha: string; // formato AAAA-MM-DD
  hora: string;
  tipo: TipoEvento;
}

export const eventos: Evento[] = [
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
