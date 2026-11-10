// Noticias de EJEMPLO. En la semana 4 esto pasa al CMS como artículos.

export type Categoria = 'Estrategia' | 'Expansiones' | 'Reporte de torneo';

export interface Noticia {
  titulo: string;
  categoria: Categoria;
  autor: string;
  fecha: string; // AAAA-MM-DD
  href: string;
}

export const noticias: Noticia[] = [
  {
    titulo: 'Artículo de ejemplo: estrategia',
    categoria: 'Estrategia',
    autor: 'Comunidad SWU Colombia',
    fecha: '2026-11-10',
    href: '#',
  },
  {
    titulo: 'Artículo de ejemplo: expansiones',
    categoria: 'Expansiones',
    autor: 'Comunidad SWU Colombia',
    fecha: '2026-11-10',
    href: '#',
  },
  {
    titulo: 'Artículo de ejemplo: reporte de torneo',
    categoria: 'Reporte de torneo',
    autor: 'Comunidad SWU Colombia',
    fecha: '2026-11-10',
    href: '#',
  },
];
