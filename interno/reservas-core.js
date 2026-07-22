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

const hoyISO = () => new Date().toISOString().slice(0, 10);

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
//  · evento nuevo  → reserva confirmada origen 'airbnb' (googleEventId)
//  · fechas cambiadas → se actualizan (+historial)
//  · evento desaparecido con entrada futura → reserva ANULADA
//  · "Not available" (bloqueos) se ignoran
// Después de sincronizar, llamar a sincronizarLimpiezas con las tocadas.

async function apiKeyGoogle() {
  const s = await getDoc(doc(db, 'config', 'integraciones'));
  return s.exists() ? (s.data().googleApiKey ?? null) : null;
}

RCore.guardarApiKeyGoogle = async (clave) => {
  await setDoc(doc(db, 'config', 'integraciones'), { googleApiKey: clave }, { merge: true });
};

RCore.sincronizarAirbnb = async (reservas, cabanas, u) => {
  const clave = await apiKeyGoogle();
  if (!clave) {
    const err = new Error('Falta la Google API Key.');
    err.code = 'sin-clave';
    throw err;
  }

  const hoy = new Date();
  const timeMin = new Date(hoy.getTime() - 30 * 86400000).toISOString();
  const stats = { nuevas: 0, actualizadas: 0, anuladas: 0, cabanasSinCalendario: 0 };
  const tocadas = [];

  for (const cab of cabanas) {
    if (!cab.calendarId) { stats.cabanasSinCalendario++; continue; }

    const url = 'https://www.googleapis.com/calendar/v3/calendars/'
      + encodeURIComponent(cab.calendarId)
      + '/events?singleEvents=true&maxResults=250&timeMin=' + encodeURIComponent(timeMin)
      + '&key=' + encodeURIComponent(clave);
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Calendario de ${cab.id}: HTTP ${resp.status} (¿es público? ¿la key permite Calendar?)`);
    }
    const data = await resp.json();
    const eventos = (data.items ?? []).filter((e) =>
      e.status !== 'cancelled'
      && !/not available/i.test(e.summary ?? '')
      && (e.start?.date || e.start?.dateTime));

    const vistos = new Set();

    for (const e of eventos) {
      const checkIn = (e.start.date ?? e.start.dateTime).slice(0, 10);
      const checkOut = (e.end.date ?? e.end.dateTime).slice(0, 10);
      vistos.add(e.id);

      const existente = reservas.find((r) => r.googleEventId === e.id);
      const cambio = (txt) => ({
        fecha: Timestamp.now(), autorUid: u.uid, autorNombre: 'Sync Airbnb', cambio: txt
      });

      if (!existente) {
        const codigo = ((e.description ?? '').match(/([A-Z0-9]{8,12})/) ?? [])[1];
        const ref = await addDoc(collection(db, 'reservas'), {
          clienteNombre: 'Airbnb' + (codigo ? ' · ' + codigo : ''),
          clienteId: null,
          cabanaId: cab.id,
          checkIn, checkOut,
          horaEntrada: '14:00', horaSalida: '10:00',
          adultos: 2, ninos: 0,
          totalBRL: 0,
          estado: 'confirmada',
          origen: 'airbnb',
          googleEventId: e.id,
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
    const hoyIso = hoy.toISOString().slice(0, 10);
    for (const r of reservas) {
      if (r.origen === 'airbnb' && r.cabanaId === cab.id && r.estado === 'confirmada'
          && r.googleEventId && !vistos.has(r.googleEventId) && r.checkIn >= hoyIso) {
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
 * Barre TODAS las reservas y materializa las que entran en la ventana de 7
 * días. Como no hay servidor, se llama al abrir la app (Actividades y
 * Reservas). Idempotente: los IDs deterministas no duplican.
 */
RCore.materializarPendientes = async (reservas, cabanas, u) => {
  const hoy = hoyISO();
  const enVentana = reservas.filter((r) =>
    r.estado === 'confirmada'
    && typeof r.checkIn === 'string' && typeof r.checkOut === 'string'
    && (
      (r.checkIn >= hoy && restarDias(r.checkIn, VENTANA_DIAS) <= hoy) ||
      (r.checkOut >= hoy && restarDias(r.checkOut, VENTANA_DIAS) <= hoy)
    ));
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
    const cab = nomCab(cabanas, r.cabanaId);
    const okFechas = typeof r.checkIn === 'string' && typeof r.checkOut === 'string';

    if (r.estado === 'confirmada' && okFechas) {
      // ── LIMPIEZA DE ENTRADA (se prepara antes del check-in) ──
      // Se materializa una semana antes del check-in; se pone urgente
      // (rojo) un día antes. La hace quien prepara: lleva la tarifa.
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
      // ── CONTROL DE SALIDA (check-out) ────────────────────────
      // Independiente de la limpieza de entrada de la próxima reserva.
      // No lleva tarifa (es control, no limpieza facturable).
      if (r.checkOut >= hoy && restarDias(r.checkOut, VENTANA_DIAS) <= hoy) {
        await upsert('checkout-' + r.id,
          {
            titulo: 'Check-out ' + cab + ' · salida ' + r.checkOut,
            detalle: ('Control de salida de ' + (r.clienteNombre || '')).trim(),
            cabanaId: r.cabanaId, reservaId: r.id,
            fase: 'salida',
            fechaInicio: restarDias(r.checkOut, 1),
            fechaVencimiento: r.checkOut,
            actualizadoEn: serverTimestamp()
          },
          baseActividad(u, {}));
      }
    } else if (r.estado === 'anulada') {
      for (const id of ['limp-' + r.id, 'checkout-' + r.id]) {
        const s = await getDoc(doc(db, 'actividades', id));
        if (s.exists() && !s.data().hecho) { await deleteDoc(doc(db, 'actividades', id)); borradas++; }
      }
    }
  }
  return { creadas, actualizadas, borradas };
};
