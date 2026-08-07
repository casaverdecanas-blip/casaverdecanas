// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — reservas-core.js
//  Integración reservas ↔ actividades: generación automática de
//  LIMPIEZAS por reserva confirmada, con IDs deterministas
//  (limp-<reservaId>) → upserts idempotentes. La limpieza toma el
//  precio de la ficha de la cabaña → al cerrarse genera honorarios.
// ═══════════════════════════════════════════════════════════════

import {
  db, doc, getDoc, setDoc, deleteDoc, updateDoc, addDoc, collection,
  serverTimestamp, Timestamp
} from './firebase-init.js';

export const RCore = {};

// Las funciones de servidor. Misma dirección que usa nucleo.js: si algún día
// cambia el proyecto de Netlify, se cambia en los dos lados (CONVENCIONES §2.1).
RCore.NETLIFY = 'https://serene-scone-76bd4e.netlify.app/.netlify/functions';

// ── Las direcciones .ics de Airbnb ───────────────────────
// Viven en config/airbnb como { cabanaId: 'https://…ics' } y NO en la cabaña.
//
// POR QUÉ NO EN /cabanas/, por dos motivos y en este orden:
//  1. Esa colección es la FUENTE DEL SITIO PÚBLICO y la baja cada visitante.
//     Una dirección de integración no tiene nada que hacer ahí: son dos tipos
//     de dato distintos y se descargaría en cada visita para nada.
//  2. Se lee sin sesión, y el .ics de Airbnb trae —además de las fechas, que
//     no son secretas y ya se ven en Airbnb y en el sitio— el CÓDIGO DE
//     RESERVA y los últimos 4 dígitos del teléfono del huésped. Es poco, pero
//     no es nada, y guardarlo donde entra solo el equipo no cuesta nada.
// Detectado en agosto de 2026, antes de que hubiera ninguna cargada.
RCore.leerIcsAirbnb = async () => {
  try {
    const s = await getDoc(doc(db, 'config', 'airbnb'));
    return s.exists() ? (s.data().ics || {}) : {};
  } catch (e) { console.warn('config/airbnb', e); return {}; }
};

// Se guarda de a una, con el ID de la cabaña como clave. Con merge, para que
// dos personas cargando cabañas distintas no se pisen.
RCore.guardarIcsAirbnb = async (cabanaId, url) => {
  await setDoc(doc(db, 'config', 'airbnb'), {
    ics: { [cabanaId]: url || null }
  }, { merge: true });
};

// La dirección que hay que pegar EN AIRBNB para que importe nuestra
// ocupación. Sin cabaña, devuelve el calendario unificado.
RCore.urlIcsPropio = (cabanaId) => RCore.NETLIFY + '/ical-cabana'
  + (cabanaId ? '?c=' + encodeURIComponent(cabanaId) : '');

// La fecha LOCAL, no la de UTC. toISOString() da el día en UTC y Brasil está
// tres horas atrás: desde las 21:00 de cada noche devolvía MAÑANA, y con eso
// la ventana de siete días de las limpiezas se corría un día entero.
// No se importa de nucleo.js a propósito: este módulo no depende de CV2 y
// hacerlo depender por una función de tres líneas es peor que repetirla.
const hoyISO = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
    + '-' + String(d.getDate()).padStart(2, '0');
};

const nomCab = (cabanas, id) => {
  const c = cabanas.find((x) => x.id === id);
  const n = c?.nombre;
  return typeof n === 'object' ? (n.es ?? n.pt ?? n.en ?? id) : (n ?? id);
};
const tarifaLimpieza = (cabanas, id) =>
  Number(cabanas.find((x) => x.id === id)?.tarifas?.limpieza) || 0;

// Proyecto raíz "Limpiezas" (id determinista, se crea una sola vez)
async function asegurarProyecto(u) {
  const ref = doc(db, 'actividades', 'proj-limpiezas');
  const s = await getDoc(ref);
  if (s.exists()) return;
  await setDoc(ref, {
    titulo: 'Limpiezas',
    detalle: 'Generadas automáticamente por las reservas confirmadas',
    tipo: 'normal', parentId: null, color: '#2a9d8f',
    alcance: 'equipo', competencias: [], prioridad: null,
    recurrenciaDias: 0, monto: 0,
    fechaInicio: null, fechaVencimiento: null,
    esCompra: false, proveedor: null,
    hecho: false, estado: 'pendiente', sesionActualId: null,
    ultimoCierreEn: null, orden: 0,
    creadoEn: serverTimestamp(), creadoPor: u.uid, creadoNombre: u.nombre ?? ''
  });
}

/**
 * Sincroniza las limpiezas de un conjunto de reservas (una o todas).
 * - confirmada con salida hoy o futura → upsert limp-<id> (título, fecha
 *   y monto se actualizan; hecho/sesiones NO se tocan: merge parcial)
 * - anulada → borra su limpieza si todavía no se hizo
 * Idempotente: correrla dos veces no duplica ni pisa trabajo hecho.
 */
// ═══ SYNC AIRBNB (T2.4) ══════════════════════════════════════
// Cada cabaña tiene un Google Calendar (público) que recibe el iCal
// de Airbnb; se lee con la API de Calendar v3 y una API key guardada
// en config/integraciones.googleApiKey (solo admin la ve/carga).
//  · evento nuevo  → reserva confirmada origen 'airbnb' (icalUid)
//  · fechas cambiadas → se actualizan (+historial)
//  · evento desaparecido con entrada futura → reserva ANULADA
//  · "Not available" (bloqueos) se ignoran
// Después de sincronizar, llamar a sincronizarLimpiezas con las tocadas.

// (Acá vivían 'apiKeyGoogle' y 'guardarApiKeyGoogle'. Se retiraron en agosto
//  de 2026: la sincronización dejó de pasar por Google Calendar y lee el .ics
//  de Airbnb directo. Pedir una clave que ya nadie usa es mandar a configurar
//  algo para nada — y peor, deja creer que hace falta cuando falla otra cosa.
//  El documento config/integraciones queda; si alguna otra pantalla guarda
//  ahí la clave de Google, no se toca.)

// ── Leer un calendario iCal ──────────────────────────────
// Un .ics es texto plano con bloques VEVENT. Se parsea a mano porque son
// treinta líneas y traer una librería para esto sería agregar una dependencia
// —y un punto de falla— a un sistema que hoy no tiene ninguna.
//
// Lo primero es DESPLEGAR las líneas: el formato parte todo lo que pase de 75
// caracteres y continúa en la siguiente con un espacio adelante. Sin esto, una
// descripción larga se lee cortada y el código de reserva se pierde.
function desplegar(texto) {
  return String(texto || '').replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
}

function leerICS(texto) {
  const eventos = [];
  let ev = null;
  desplegar(texto).split('\n').forEach((linea) => {
    if (linea.startsWith('BEGIN:VEVENT')) { ev = {}; return; }
    if (linea.startsWith('END:VEVENT')) { if (ev) eventos.push(ev); ev = null; return; }
    if (!ev) return;
    const i = linea.indexOf(':');
    if (i < 0) return;
    // La clave puede traer parámetros: 'DTSTART;VALUE=DATE'
    const clave = linea.slice(0, i).split(';')[0].toUpperCase();
    const valor = linea.slice(i + 1);
    if (clave === 'UID') ev.uid = valor.trim();
    else if (clave === 'SUMMARY') ev.summary = valor;
    else if (clave === 'DESCRIPTION') ev.description = valor;
    // '20260811' o '20260811T140000Z' → '2026-08-11'
    else if (clave === 'DTSTART') ev.desde = valor.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    else if (clave === 'DTEND') ev.hasta = valor.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  });
  return eventos.filter((e) => e.uid && /^\d{4}-\d{2}-\d{2}$/.test(e.desde || ''));
}

RCore.sincronizarAirbnb = async (reservas, cabanas, u) => {
  const hoy = new Date();
  const timeMin = new Date(hoy.getTime() - 30 * 86400000).toISOString();
  const stats = { nuevas: 0, actualizadas: 0, anuladas: 0, cabanasSinCalendario: 0 };
  const tocadas = [];
  const icsPorCabana = await RCore.leerIcsAirbnb();

  for (const cab of cabanas) {
    // La dirección sale de config/airbnb, no de la cabaña: ver arriba.
    const icsUrl = icsPorCabana[cab.id];
    if (!icsUrl) { stats.cabanasSinCalendario++; continue; }

    // AHORA SE LEE EL .ics DE AIRBNB DIRECTO, sin Google Calendar en el medio.
    // El campo 'calendarId' de la cabaña pasa a guardar la DIRECCIÓN .ics que
    // da Airbnb, pegada tal cual.
    // Google estaba ahí porque Airbnb rechazaba las lecturas automáticas de
    // servidores chicos; la función de Netlify manda un User-Agent de
    // navegador y corre con TLS al día, que era lo que faltaba. Si aun así
    // rechaza, la función lo dice con el código y las cabeceras (§10 · F5).
    if (!/^https?:\/\//i.test(String(icsUrl))) {
      const e = new Error('La cabaña ' + cab.id + ' tiene algo que no es una dirección '
        + '.ics. Cargala desde el botón Airbnb del panel.');
      e.code = 'ics-invalido';
      throw e;
    }

    const resp = await fetch(RCore.NETLIFY + '/airbnb-ical?u='
      + encodeURIComponent(icsUrl));
    const data = await resp.json().catch(() => null);
    if (!data || data.ok !== true) {
      throw new Error('Calendario de ' + cab.id + ': '
        + ((data && data.motivo) || 'no se pudo leer'));
    }

    // 'Not available' son bloqueos que puso el anfitrión, no reservas: si se
    // importaran, cada fecha bloqueada a mano en Airbnb aparecería acá como
    // una reserva fantasma.
    const eventos = leerICS(data.ics).filter((e) =>
      !/not available|no disponible/i.test(e.summary || '')
      && e.hasta && e.desde >= timeMin.slice(0, 10));

    const vistos = new Set();

    for (const e of eventos) {
      const checkIn = e.desde;
      const checkOut = e.hasta;
      vistos.add(e.uid);

      // 'icalUid' y no 'googleEventId': el identificador ahora es el UID del
      // evento iCal. Se cambió el nombre en vez de reusar el viejo porque un
      // campo que significa dos cosas según de dónde vino es exactamente lo
      // que fabrica errores silenciosos (§4).
      const existente = reservas.find((r) => r.icalUid === e.uid);
      const cambio = (txt) => ({
        fecha: Timestamp.now(), autorUid: u.uid, autorNombre: 'Sync Airbnb', cambio: txt
      });

      if (!existente) {
        // Airbnb pone el enlace a la reserva en la descripción; de ahí sale
        // el código HM…, que es lo único identificable que manda.
        // El \\s* tolera un espacio de más si el generador plegó la línea con
        // dos espacios en vez de uno. El formato pide uno, pero un código de
        // reserva perdido por un espacio ajeno es un mal negocio.
        const desc = String(e.description || '');
        const codigo = (desc.match(/\/details\/\s*([A-Z0-9]{6,14})/)
          || desc.match(/\b(HM[A-Z0-9]{6,12})\b/) || [])[1];
        // Toda reserva vive dentro de un ACUERDO (grupos/{id}), que es donde
        // está la plata. Airbnb no informa el precio en el calendario, así que
        // el acuerdo nace en cero y se completa a mano.
        // PENDIENTE DE VERIFICAR (jul-2026): esta importación nunca corrió con
        // reservas reales de Airbnb; hoy se cargan a mano porque el calendario
        // tampoco trae los detalles que hacen falta.
        const gRef = await addDoc(collection(db, 'grupos'), {
          total: 0, moneda: 'BRL', nota: 'Importada de Airbnb · falta el precio',
          clienteId: null,
          clienteNombre: 'Airbnb' + (codigo ? ' · ' + codigo : ''),
          creadoEn: serverTimestamp(), creadoPor: u.uid, creadoNombre: 'Sync Airbnb'
        });
        const ref = await addDoc(collection(db, 'reservas'), {
          grupoId: gRef.id,
          clienteNombre: 'Airbnb' + (codigo ? ' · ' + codigo : ''),
          clienteId: null,
          cabanaId: cab.id,
          checkIn, checkOut,
          horaEntrada: '14:00', horaSalida: '10:00',
          adultos: 2, ninos: 0,
          estado: 'confirmada',
          origen: 'airbnb',
          icalUid: e.uid,
          notas: (e.description ?? '').slice(0, 200),
          historial: [cambio('importada desde Airbnb')],
          creadoEn: serverTimestamp(), creadoPor: u.uid, creadoNombre: 'Sync Airbnb'
        });
        tocadas.push({ id: ref.id, estado: 'confirmada', checkIn, checkOut, cabanaId: cab.id, clienteNombre: 'Airbnb' });
        stats.nuevas++;
      } else if ((existente.checkIn !== checkIn || existente.checkOut !== checkOut)
                 && existente.estado === 'confirmada') {
        await updateDoc(doc(db, 'reservas', existente.id), {
          checkIn, checkOut,
          historial: [...(existente.historial ?? []), cambio(`fechas → ${checkIn}/${checkOut}`)],
          actualizadoEn: serverTimestamp()
        });
        tocadas.push({ ...existente, checkIn, checkOut });
        stats.actualizadas++;
      }
    }

    // Cancelaciones: reservas Airbnb de esta cabaña, futuras, sin evento
    const hoyIso = hoyISO();
    for (const r of reservas) {
      if (r.origen === 'airbnb' && r.cabanaId === cab.id && r.estado === 'confirmada'
          && r.icalUid && !vistos.has(r.icalUid) && r.checkIn >= hoyIso) {
        await updateDoc(doc(db, 'reservas', r.id), {
          estado: 'anulada',
          historial: [...(r.historial ?? []), {
            fecha: Timestamp.now(), autorUid: u.uid, autorNombre: 'Sync Airbnb',
            cambio: 'cancelada en Airbnb'
          }],
          actualizadoEn: serverTimestamp()
        });
        tocadas.push({ ...r, estado: 'anulada' });
        stats.anuladas++;
      }
    }
  }

  // Limpiezas de todo lo tocado (crea nuevas, borra de anuladas)
  if (tocadas.length) await RCore.sincronizarLimpiezas(tocadas, cabanas, u);
  return stats;
};

// Días de anticipación con que se materializa cada actividad.
const VENTANA_DIAS = 7;
// Se parte del MEDIODÍA a propósito: doce horas de margen contra el desfase
// de zona horaria y contra el cambio de horario. Acá toISOString() sí es
// seguro — el problema es solo cuando se convierte la hora ACTUAL.
const sumarDias = (iso, n) => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const restarDias = (iso, n) => sumarDias(iso, -n);

// Base común de una actividad de limpieza/control (campos que el árbol y
// el semáforo esperan). Solo se escribe en la CREACIÓN; el merge posterior
// nunca pisa hecho/estado/sesión ni el trabajo humano (regla 3.6).
function baseActividad(u, extra) {
  return Object.assign({
    parentId: 'proj-limpiezas', tipo: 'normal', alcance: 'equipo',
    competencias: [], recurrenciaDias: 0, monto: 0,
    esCompra: false, proveedor: null,
    hecho: false, estado: 'pendiente', sesionActualId: null,
    ultimoCierreEn: null, orden: 0,
    creadoEn: serverTimestamp(), creadoPor: u.uid, creadoNombre: u.nombre ?? ''
  }, extra);
}


/**
 * Espejo público de ocupación. La colección 'disponibilidad' existe para que
 * el sitio (sin sesión) pueda mostrar qué está ocupado SIN exponer nombres,
 * teléfonos ni montos: guarda únicamente cabaña y fechas.
 * Se mantiene desde acá para que no haya un segundo lugar donde actualizarla.
 */
async function espejarDisponibilidad(r) {
  const ref = doc(db, 'disponibilidad', r.id);
  const ocupa = r.estado === 'confirmada'
    && typeof r.checkIn === 'string' && typeof r.checkOut === 'string';
  try {
    if (ocupa) {
      await setDoc(ref, {
        cabanaId: r.cabanaId, desde: r.checkIn, hasta: r.checkOut,
        actualizadoEn: serverTimestamp()
      });
    } else {
      await deleteDoc(ref);
    }
  } catch (e) {
    // Nunca hacer fracasar la reserva por el espejo público.
    console.warn('disponibilidad:', e);
  }
}

/**
 * Barre TODAS las reservas y materializa las que entran en la ventana de 7
 * días. Como no hay servidor, se llama al abrir la app (Actividades y
 * Reservas). Idempotente: los IDs deterministas no duplican.
 */
RCore.materializarPendientes = async (reservas, cabanas, u) => {
  const hoy = hoyISO();
  const enVentana = reservas.filter((r) =>
    r.estado === 'confirmada'
    && typeof r.checkIn === 'string'
    && r.checkIn >= hoy && restarDias(r.checkIn, VENTANA_DIAS) <= hoy);
  if (!enVentana.length) return { creadas: 0, actualizadas: 0, borradas: 0 };
  return RCore.sincronizarLimpiezas(enVentana, cabanas, u);
};

/**
 * Materializa, para una lista de reservas, las actividades que entran en la
 * ventana de 7 días:
 *   · limp-<id>      LIMPIEZA de entrada  (se hace ANTES del check-in;
 *                    rojo un día antes; lleva la tarifa → genera honorarios)
 *   · checkout-<id>  CONTROL de salida    (se hace en el check-out)
 * Idempotente (IDs deterministas + merge). Anular borra lo no hecho.
 * Mantiene el nombre sincronizarLimpiezas por compatibilidad de llamadas.
 */
RCore.sincronizarLimpiezas = async (reservas, cabanas, u) => {
  await asegurarProyecto(u);
  const hoy = hoyISO();
  let creadas = 0, actualizadas = 0, borradas = 0;

  const upsert = async (id, gestionados, nuevos) => {
    const ref = doc(db, 'actividades', id);
    const s = await getDoc(ref);
    if (s.exists()) {
      await setDoc(ref, gestionados, { merge: true });
      actualizadas++;
    } else {
      await setDoc(ref, Object.assign({}, gestionados, nuevos));
      creadas++;
    }
  };

  for (const r of reservas) {
    await espejarDisponibilidad(r);
    const cab = nomCab(cabanas, r.cabanaId);
    const okFechas = typeof r.checkIn === 'string' && typeof r.checkOut === 'string';

    if (r.estado === 'confirmada' && okFechas) {
      // ── LIMPIEZA DE ENTRADA (se prepara antes del check-in) ──
      // Único que se materializa por fecha: una semana antes del check-in,
      // rojo un día antes. Lleva la tarifa → genera honorarios.
      // El CONTROL DE SALIDA ya NO nace acá: lo crea "terminar la limpieza"
      // como hijo de esta actividad (ver actividades.html).
      if (r.checkIn >= hoy && restarDias(r.checkIn, VENTANA_DIAS) <= hoy) {
        await upsert('limp-' + r.id,
          {
            titulo: 'Limpieza ' + cab + ' · entrada ' + r.checkIn,
            detalle: ('Preparar para ' + (r.clienteNombre || '')).trim(),
            cabanaId: r.cabanaId, reservaId: r.id,
            fase: 'entrada',
            monto: tarifaLimpieza(cabanas, r.cabanaId),
            fechaInicio: restarDias(r.checkIn, 1),
            fechaVencimiento: r.checkIn,
            actualizadoEn: serverTimestamp()
          },
          baseActividad(u, {}));
      }
    } else if (r.estado === 'anulada') {
      // Solo se borra lo que NO se hizo. Si el check-out ya existe (la
      // limpieza se terminó, alguien estuvo en la cabaña), la anulación no
      // lo toca: el control de salida hay que hacerlo igual.
      const sl = await getDoc(doc(db, 'actividades', 'limp-' + r.id));
      if (sl.exists() && !sl.data().hecho) { await deleteDoc(doc(db, 'actividades', 'limp-' + r.id)); borradas++; }
    }
  }
  return { creadas, actualizadas, borradas };
};
