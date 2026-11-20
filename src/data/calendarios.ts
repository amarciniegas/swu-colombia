// Calendarios públicos de Google Calendar, uno por ciudad.
// Pega aquí el "ID del calendario" (Configuración y uso compartido → Integrar el calendario).
// Si una ciudad no tiene ID todavía, se usan los datos de semanal.ts / eventos.ts.

export interface Calendario {
  ciudad: string;
  id: string;
}

export const calendarios: Calendario[] = [
  { ciudad: 'Barranquilla', id: '0bb61f689033e504afd4ce5c11e7935bcca28a1103cb0290cc1ed8c8a1c9b8be@group.calendar.google.com' },
  { ciudad: 'Bogotá', id: '' },
  { ciudad: 'Medellín', id: '' },
  { ciudad: 'Cali', id: '' },
];

// La llave de Google Cloud se guarda como variable de entorno (no en el código):
//   - en tu computador: archivo .env  →  PUBLIC_GOOGLE_CALENDAR_KEY=...
//   - en Cloudflare Pages: Settings → Variables and Secrets
export const apiKey: string = import.meta.env.PUBLIC_GOOGLE_CALENDAR_KEY ?? '';

export const calendariosActivos = calendarios.filter((c) => c.id.trim() !== '');

/** true cuando hay llave y al menos un calendario configurado. */
export const usarCalendario = apiKey !== '' && calendariosActivos.length > 0;

export function calendarioDe(ciudad: string): Calendario | undefined {
  return calendariosActivos.find((c) => c.ciudad === ciudad);
}

/** Enlace para suscribirse desde Google Calendar. */
export function enlaceGoogle(id: string): string {
  return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(id)}`;
}

/** Enlace iCal (Apple Calendar, Outlook…). */
export function enlaceIcal(id: string): string {
  return `https://calendar.google.com/calendar/ical/${encodeURIComponent(id)}/public/basic.ics`;
}
