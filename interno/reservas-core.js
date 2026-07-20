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

RCore.sincronizarLimpiezas = async (reservas, cabanas, u) => {
  await asegurarProyecto(u);
  const hoy = hoyISO();
  let creadas = 0, actualizadas = 0, borradas = 0;

  for (const r of reservas) {
    const ref = doc(db, 'actividades', 'limp-' + r.id);

    if (r.estado === 'confirmada' && r.checkOut >= hoy) {
      const s = await getDoc(ref);
      const gestionados = {
        titulo: `Limpieza ${nomCab(cabanas, r.cabanaId)} · salida ${r.checkOut}`,
        detalle: `Salida de ${r.clienteNombre ?? ''}`.trim(),
        parentId: 'proj-limpiezas',
        tipo: 'normal', alcance: 'equipo',
        monto: tarifaLimpieza(cabanas, r.cabanaId),
        fechaInicio: r.checkOut,
        cabanaId: r.cabanaId, reservaId: r.id,
        actualizadoEn: serverTimestamp()
      };
      if (s.exists()) {
        await setDoc(ref, gestionados, { merge: true });
        actualizadas++;
      } else {
        await setDoc(ref, {
          ...gestionados,
          competencias: [], prioridad: null, recurrenciaDias: 0,
          fechaVencimiento: r.checkOut,
          esCompra: false, proveedor: null,
          hecho: false, estado: 'pendiente', sesionActualId: null,
          ultimoCierreEn: null, orden: 0,
          creadoEn: serverTimestamp(), creadoPor: u.uid, creadoNombre: u.nombre ?? ''
        });
        creadas++;
      }
    } else if (r.estado === 'anulada') {
      const s = await getDoc(ref);
      if (s.exists() && !s.data().hecho) {
        await deleteDoc(ref);
        borradas++;
      }
    }
  }
  return { creadas, actualizadas, borradas };
};
