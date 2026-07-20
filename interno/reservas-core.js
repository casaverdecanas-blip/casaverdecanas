// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — reservas-core.js
//  Integración reservas ↔ actividades: generación automática de
//  LIMPIEZAS por reserva confirmada, con IDs deterministas
//  (limp-<reservaId>) → upserts idempotentes. La limpieza toma el
//  precio de la ficha de la cabaña → al cerrarse genera honorarios.
// ═══════════════════════════════════════════════════════════════

import {
  db, doc, getDoc, setDoc, deleteDoc, serverTimestamp
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
