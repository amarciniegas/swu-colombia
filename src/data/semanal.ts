// Juego semanal fijo en cada ciudad.

export interface JuegoSemanal {
  ciudad: string;
  tienda: string;
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  hora: string; // hora de inicio
  nombre: string; // ej. "Weekly"
  formato: string; // ej. "Premier"
  costo?: string;
}

export const juegoSemanal: JuegoSemanal[] = [
  {
    ciudad: 'Barranquilla',
    tienda: 'Ravenwood',
    dia: 'Miércoles',
    hora: '6:00 p. m.',
    nombre: 'Weekly',
    formato: 'Premier',
    costo: '$15.000 COP',
  },
];
