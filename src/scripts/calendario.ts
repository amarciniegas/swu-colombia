// Lee los calendarios públicos de Google y pinta los eventos con el diseño del sitio.
// Se ejecuta en el navegador: un evento nuevo en Google Calendar aparece al recargar la página.
//
// Cada contenedor de la página indica qué mostrar:
//   <div data-cal-lista="inicio | especiales | semanal" data-ciudad="Barranquilla" data-vacio="Texto…">
// Mientras carga (o si Google falla) se queda el contenido que ya trae la página.

interface Config {
  apiKey: string;
  calendarios: { ciudad: string; id: string }[];
}

interface Ev {
  titulo: string;
  ciudad: string;
  inicio: Date;
  todoElDia: boolean;
  lugar: string;
  ubicacion: string;
  tipo: string;
  costo: string;
  formato: string;
  destacado: boolean;
  recurrenciaId: string | null;
}

const ZONA = 'America/Bogota';
const INSIGNIA_PQ = '/img/insignia-planetary-qualifier.png';
const DIAS_ADELANTE = 90;

const configEl = document.getElementById('config-calendario');
if (configEl?.textContent) {
  iniciar(JSON.parse(configEl.textContent) as Config);
}

async function iniciar(config: Config) {
  const contenedores = document.querySelectorAll<HTMLElement>('[data-cal-lista]');
  if (contenedores.length === 0) return;

  const ahora = new Date();
  const hasta = new Date(ahora.getTime() + DIAS_ADELANTE * 864e5);
  const resultados = await Promise.allSettled(
    config.calendarios.map((c) => cargar(c, config.apiKey, ahora, hasta)),
  );

  const fallidos = resultados.filter((r) => r.status === 'rejected');
  fallidos.forEach((r) => console.warn('[calendario]', (r as PromiseRejectedResult).reason));
  if (fallidos.length === resultados.length) return; // nada cargó: se queda lo que había

  const todos = resultados.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  todos.sort((a, b) => a.inicio.getTime() - b.inicio.getTime());

  // Eventos repetidos (el weekly): solo la próxima fecha de cada serie.
  const vistos = new Set<string>();
  const semanal: Ev[] = [];
  const especiales: Ev[] = [];
  for (const ev of todos) {
    if (ev.recurrenciaId) {
      if (!vistos.has(ev.recurrenciaId)) {
        vistos.add(ev.recurrenciaId);
        semanal.push(ev);
      }
    } else {
      especiales.push(ev);
    }
  }

  contenedores.forEach((c) => pintar(c, especiales, semanal));
  document.dispatchEvent(new CustomEvent('eventos:actualizados'));
}

async function cargar(cal: { ciudad: string; id: string }, apiKey: string, desde: Date, hasta: Date): Promise<Ev[]> {
  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events`);
  url.search = new URLSearchParams({
    key: apiKey,
    singleEvents: 'true',
    orderBy: 'startTime',
    timeMin: desde.toISOString(),
    timeMax: hasta.toISOString(),
    maxResults: '100',
  }).toString();

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${cal.ciudad}: Google respondió ${resp.status}`);
  const datos = await resp.json();
  return (datos.items ?? [])
    .filter((it: any) => it.status !== 'cancelled' && (it.start?.dateTime || it.start?.date))
    .map((it: any) => convertir(it, cal.ciudad));
}

function convertir(it: any, ciudad: string): Ev {
  const campos = leerCampos(it.description ?? '');
  const ubicacion: string = (it.location ?? '').trim();
  const tipo = campos.tipo ?? '';
  const todoElDia = !it.start.dateTime;
  // Un evento de todo el día ("2026-12-05") se interpreta a mediodía para no cambiar de fecha.
  const inicio = todoElDia ? new Date(`${it.start.date}T12:00:00-05:00`) : new Date(it.start.dateTime);
  return {
    titulo: (it.summary ?? 'Evento').trim(),
    ciudad,
    inicio,
    todoElDia,
    lugar: campos.lugar ?? ubicacion.split(',')[0].trim(),
    ubicacion,
    tipo,
    costo: campos.costo ?? '',
    formato: campos.formato ?? '',
    destacado: /^s[ií]/i.test(campos.destacado ?? '') || /planetary/i.test(tipo),
    recurrenciaId: it.recurringEventId ?? null,
  };
}

/** Lee líneas "Clave: valor" de la descripción (Google a veces la guarda como HTML). */
function leerCampos(descripcion: string): Record<string, string> {
  const html = descripcion.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li)>/gi, '\n');
  const texto = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
  const campos: Record<string, string> = {};
  for (const linea of texto.split('\n')) {
    const m = linea.match(/^\s*(tipo|costo|formato|destacado|lugar)\s*:\s*(.+?)\s*$/i);
    if (m) campos[m[1].toLowerCase()] = m[2];
  }
  return campos;
}

// ---------- Pintar ----------

function pintar(cont: HTMLElement, especiales: Ev[], semanal: Ev[]) {
  const modo = cont.dataset.calLista;
  const ciudad = cont.dataset.ciudad ?? '';
  const deCiudad = (e: Ev) => !ciudad || e.ciudad === ciudad;
  const esp = especiales.filter(deCiudad);
  const sem = semanal.filter(deCiudad);
  const vacio = cont.dataset.vacio ?? '';
  const conEnlaceCiudad = !ciudad;

  let html = '';
  if (modo === 'inicio') {
    const dest = esp.filter((e) => e.destacado);
    const otros = esp.filter((e) => !e.destacado).slice(0, 6);
    html =
      dest.map(htmlDestacado).join('') +
      `<div class="grilla" id="lista-eventos">${otros.map(htmlEvento).join('')}${sem.map((e) => htmlSemanal(e, true)).join('')}</div>`;
    if (esp.length + sem.length === 0) html += htmlVacio(vacio);
  } else if (modo === 'especiales') {
    const dest = esp.filter((e) => e.destacado);
    const otros = esp.filter((e) => !e.destacado);
    html = dest.map(htmlDestacado).join('');
    if (otros.length) html += `<div class="grilla">${otros.map(htmlEvento).join('')}</div>`;
    if (esp.length === 0) html = htmlVacio(vacio);
  } else if (modo === 'semanal') {
    html = sem.length
      ? `<div class="grilla">${sem.map((e) => htmlSemanal(e, conEnlaceCiudad)).join('')}</div>`
      : htmlVacio(vacio);
  }
  cont.innerHTML = html;
}

function esc(t: string): string {
  return t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function slug(t: string): string {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, '-');
}

function fmt(d: Date, opts: Intl.DateTimeFormatOptions): string {
  return d.toLocaleString('es-CO', { timeZone: ZONA, ...opts });
}

function hora(e: Ev): string {
  return e.todoElDia ? 'Todo el día' : fmt(e.inicio, { hour: 'numeric', minute: '2-digit' });
}

function fechaIso(e: Ev): string {
  return e.inicio.toLocaleDateString('en-CA', { timeZone: ZONA });
}

function competitivo(tipo: string): boolean {
  return /torneo|showdown|premier|planetary|regional|sector/i.test(tipo);
}

function mapa(e: Ev): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.ubicacion}, Colombia`)}`;
}

function htmlVacio(texto: string): string {
  return texto ? `<p class="vacio">${esc(texto)}</p>` : '';
}

function htmlEvento(e: Ev): string {
  const dia = fmt(e.inicio, { day: '2-digit' });
  const mes = fmt(e.inicio, { month: 'short' }).replace('.', '').toUpperCase();
  const larga = fmt(e.inicio, { weekday: 'long', day: 'numeric', month: 'long' });
  const etiqueta = [e.ciudad, e.tipo].filter(Boolean).join(' · ');
  const lugar = [e.lugar, hora(e), e.costo].filter(Boolean).join(' · ');
  return `
<article class="evento tarjeta evento-filtrable" data-ciudad="${esc(e.ciudad)}">
  <time class="evento__fecha" datetime="${fechaIso(e)}">
    <span class="evento__dia" aria-hidden="true">${esc(dia)}</span>
    <span class="evento__mes" aria-hidden="true">${esc(mes)}</span>
    <span class="solo-lectores">${esc(larga)}</span>
  </time>
  <div class="evento__info">
    <p class="etiqueta${competitivo(e.tipo) ? ' etiqueta--villano' : ''}">${esc(etiqueta)}</p>
    <h3 class="evento__titulo">${esc(e.titulo)}</h3>
    <p class="evento__lugar">${esc(lugar)}</p>
  </div>
</article>`;
}

function htmlSemanal(e: Ev, enlaceCiudad: boolean): string {
  const diaLargo = fmt(e.inicio, { weekday: 'long' });
  const diaCorto = diaLargo.slice(0, 3).toUpperCase();
  const plural = /s$/.test(diaLargo) ? diaLargo : `${diaLargo}s`;
  const proxima = fmt(e.inicio, { day: 'numeric', month: 'long' });
  const titulo = e.titulo;
  return `
<article class="semanal tarjeta evento-filtrable" data-ciudad="${esc(e.ciudad)}">
  <div class="semanal__dia" aria-hidden="true">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="M7 22l-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></svg>
    <span>${esc(diaCorto)}</span>
  </div>
  <div class="semanal__info">
    <p class="etiqueta">${esc(e.ciudad)} · Juego semanal</p>
    <h3 class="semanal__titulo">${esc(titulo)}</h3>
    <p class="semanal__detalle">Todos los ${esc(plural)} · desde las ${esc(hora(e))}</p>
    <p class="semanal__detalle">${esc([e.lugar, e.costo].filter(Boolean).join(' · '))}</p>
    <p class="semanal__detalle">Próxima: ${esc(proxima)}</p>
    ${enlaceCiudad ? `<a href="/eventos/${slug(e.ciudad)}" class="semanal__enlace">Ver ${esc(e.ciudad)} →</a>` : ''}
  </div>
</article>`;
}

function htmlDestacado(e: Ev): string {
  const larga = fmt(e.inicio, { weekday: 'long', day: 'numeric', month: 'long' });
  const fecha = larga.charAt(0).toUpperCase() + larga.slice(1);
  const datos: [string, string][] = [
    ['Ciudad', e.ciudad],
    ['Fecha', fecha],
    ['Hora', hora(e)],
    ['Lugar', e.lugar],
    ['Formato', e.formato],
    ['Inscripción', e.costo],
  ];
  const insignia = /planetary/i.test(e.tipo)
    ? `<img src="${INSIGNIA_PQ}" alt="Insignia oficial de Planetary Qualifier de Star Wars: Unlimited" width="168" height="168" class="destacado__insignia" loading="lazy">`
    : '';
  const whatsapp = document.getElementById('config-calendario')?.dataset.whatsapp;
  return `
<article class="destacado evento-filtrable" data-ciudad="${esc(e.ciudad)}">
  ${insignia}
  <div class="destacado__info">
    <p class="destacado__eyebrow">Evento destacado${e.tipo ? ` · ${esc(e.tipo)}` : ''}</p>
    <h3 class="destacado__titulo">${esc(e.titulo)}</h3>
    <dl class="destacado__datos">
      ${datos
        .filter(([, v]) => v)
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
        .join('')}
    </dl>
    <div class="destacado__acciones">
      ${whatsapp ? `<a href="${esc(whatsapp)}" class="boton boton--amarillo" target="_blank" rel="noopener noreferrer">Pregunta por cupos en WhatsApp<span class="solo-lectores"> (abre en otra pestaña)</span></a>` : ''}
      ${e.ubicacion ? `<a href="${mapa(e)}" class="boton boton--borde" target="_blank" rel="noopener noreferrer">Ver en el mapa<span class="solo-lectores"> (abre Google Maps en otra pestaña)</span></a>` : ''}
    </div>
  </div>
</article>`;
}
