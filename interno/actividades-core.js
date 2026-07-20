// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — actividades-core.js
//  El corazón operativo: Play/Stop (sin pausa), tildes, cierre de
//  ciclo con reprogramación de recurrentes y HONORARIOS
//  PROPORCIONALES. Diseño heredado del v5.2 del sistema viejo,
//  reescrito limpio. Fuente única: /sesiones/ y /honorarios/.
// ═══════════════════════════════════════════════════════════════

import {
  db, doc, getDoc, getDocs, addDoc, updateDoc,
  collection, query, where, limit,
  getAggregateFromServer, sum,
  serverTimestamp, Timestamp
} from './firebase-init.js';

export const Core = {};

// ── Utilidades ───────────────────────────────────────────────
const hoyISO = () => new Date().toISOString().slice(0, 10);
const sumarDias = (iso, n) => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const r2 = (n) => Math.round(n * 100) / 100;

// ── Sesión activa del usuario (en cualquier actividad) ───────
Core.sesionActiva = async (uid) => {
  const s = await getDocs(query(
    collection(db, 'sesiones'),
    where('uid', '==', uid),
    where('estado', '==', 'en_curso'),
    limit(1)
  ));
  return s.empty ? null : { id: s.docs[0].id, ...s.docs[0].data() };
};

// ── ▶ Play ───────────────────────────────────────────────────
Core.iniciar = async (actId, u) => {
  const ya = await Core.sesionActiva(u.uid);
  if (ya) {
    const err = new Error(`Ya tenés el cronómetro corriendo en "${ya.actividadTitulo || 'otra actividad'}". Frenalo primero.`);
    err.code = 'crono-ocupado';
    throw err;
  }
  const actSnap = await getDoc(doc(db, 'actividades', actId));
  if (!actSnap.exists()) throw new Error('La actividad no existe.');
  const act = actSnap.data();
  const ahora = Timestamp.now();

  const ref = await addDoc(collection(db, 'sesiones'), {
    actividadId: actId,
    actividadTitulo: act.titulo ?? '',
    uid: u.uid,
    nombre: u.nombre ?? '',
    inicio: ahora,
    fin: null,
    horas: 0,
    estado: 'en_curso',
    tipo: 'cronometro',
    notas: '',
    creadoEn: ahora,
    creadoPor: u.uid,
    actualizadoEn: ahora
  });
  await updateDoc(doc(db, 'actividades', actId), {
    estado: 'en_curso',
    sesionActualId: ref.id,
    actualizadoEn: serverTimestamp()
  });
  return { sesionId: ref.id, inicioMs: ahora.toMillis() };
};

// ── ⏹ Stop ───────────────────────────────────────────────────
// El tiempo se registra SIEMPRE. terminada decide si además se
// cierra el ciclo (reprogramar recurrente / tachar única) y se
// reparten honorarios.
Core.finalizar = async (actId, u, terminada = true) => {
  const ahora = Timestamp.now();

  const s = await getDocs(query(
    collection(db, 'sesiones'),
    where('uid', '==', u.uid),
    where('actividadId', '==', actId),
    where('estado', '==', 'en_curso'),
    limit(1)
  ));

  let horas = 0;
  if (!s.empty) {
    const ses = s.docs[0];
    horas = r2(Math.max(0, (ahora.toMillis() - ses.data().inicio.toMillis()) / 3600000));
    await updateDoc(ses.ref, {
      fin: ahora,
      horas,
      estado: 'finalizada',
      actualizadoEn: ahora
    });
  } else if (!terminada) {
    throw new Error('No hay un cronómetro corriendo en esta actividad.');
  }

  const actRef = doc(db, 'actividades', actId);
  const actSnap = await getDoc(actRef);
  if (!actSnap.exists()) return { horas, terminada };

  if (terminada) {
    await _cerrarCiclo(actId, actSnap.data(), u, true);
  } else {
    await updateDoc(actRef, {
      estado: 'pendiente',
      sesionActualId: null,
      actualizadoEn: serverTimestamp()
    });
  }
  return { horas, terminada };
};

// ── ✔ Tildar (realizada sin cronómetro) ──────────────────────
// Deja una sesión de 0 horas (tipo 'tilde') para que TODO el
// registro de realizaciones viva en /sesiones/, y cierra el ciclo.
Core.tildar = async (actId, u) => {
  const actSnap = await getDoc(doc(db, 'actividades', actId));
  if (!actSnap.exists()) throw new Error('La actividad no existe.');
  const act = actSnap.data();
  const ahora = Timestamp.now();

  await addDoc(collection(db, 'sesiones'), {
    actividadId: actId,
    actividadTitulo: act.titulo ?? '',
    uid: u.uid,
    nombre: u.nombre ?? '',
    inicio: ahora,
    fin: ahora,
    horas: 0,
    estado: 'finalizada',
    tipo: 'tilde',
    notas: '',
    creadoEn: ahora,
    creadoPor: u.uid,
    actualizadoEn: ahora
  });

  await _cerrarCiclo(actId, act, u, false);
  const ciclo = act.recurrenciaDias ?? 0;
  return { recurrente: ciclo > 0, proxima: ciclo > 0 ? sumarDias(hoyISO(), ciclo) : null };
};

// ── Cierre de ciclo (interno) ────────────────────────────────
async function _cerrarCiclo(actId, act, u, conCrono) {
  const ahora = Timestamp.now();

  // 1) Honorarios proporcionales del ciclo que se cierra
  const monto = Number(act.monto) || 0;
  if (monto > 0) {
    const prevMs = act.ultimoCierreEn?.toMillis?.() ?? 0;
    const porUid = {};
    let totalHoras = 0;

    const sSnap = await getDocs(query(
      collection(db, 'sesiones'),
      where('actividadId', '==', actId)
    ));
    sSnap.forEach((d) => {
      const s = d.data();
      if (s.estado !== 'finalizada' || !s.uid) return;
      const finMs = s.fin?.toMillis?.() ?? 0;
      if (!finMs || finMs <= prevMs) return;   // pertenece a un ciclo ya cerrado
      const h = Number(s.horas) || 0;
      (porUid[s.uid] ??= { nombre: s.nombre ?? '', horas: 0 }).horas += h;
      totalHoras += h;
    });

    const base = {
      actividadId: actId,
      concepto: act.titulo ?? 'Actividad',
      estado: 'pendiente',
      cicloCerradoEn: ahora,
      cerradoPor: u.uid,
      cerradoNombre: u.nombre ?? '',
      pagadoEn: null,
      movimientoId: null,
      creadoEn: serverTimestamp()
    };

    if (totalHoras > 0.001) {
      // Reparto proporcional a las horas de cada persona en el ciclo
      for (const [uid, reg] of Object.entries(porUid)) {
        const parte = r2(monto * (reg.horas / totalHoras));
        if (parte <= 0) continue;
        await addDoc(collection(db, 'honorarios'), {
          ...base, uid, nombre: reg.nombre, horas: r2(reg.horas), monto: parte
        });
      }
    } else {
      // Tilde puro sin horas en el ciclo: todo a quien cierra
      await addDoc(collection(db, 'honorarios'), {
        ...base, uid: u.uid, nombre: u.nombre ?? '', horas: 0, monto: r2(monto)
      });
    }
  }

  // 2) Reprogramar (recurrente) o tachar (única)
  const ciclo = act.recurrenciaDias ?? 0;
  const comun = {
    sesionActualId: null,
    ultimaRealizacion: hoyISO(),
    ultimaRealizacionNombre: u.nombre ?? '',
    ultimaRealizacionConCrono: !!conCrono,
    ultimoCierreEn: ahora,
    actualizadoEn: serverTimestamp()
  };
  if (ciclo > 0) {
    await updateDoc(doc(db, 'actividades', actId), {
      ...comun,
      estado: 'pendiente',
      hecho: false,
      hechoPor: null,
      hechoEn: null,
      fechaInicio: sumarDias(hoyISO(), ciclo)
    });
  } else {
    await updateDoc(doc(db, 'actividades', actId), {
      ...comun,
      estado: 'finalizada',
      hecho: true,
      hechoPor: u.uid,
      hechoEn: ahora
    });
  }
}

// ── Horas acumuladas de una actividad (agregación del servidor) ──
// Suma en Firestore sin bajar documentos. Las sesiones en curso y
// los tildes tienen horas 0, así que el filtro por actividad basta.
Core.horasDeActividad = async (actId) => {
  const r = await getAggregateFromServer(
    query(collection(db, 'sesiones'), where('actividadId', '==', actId)),
    { total: sum('horas') }
  );
  return r2(r.data().total ?? 0);
};
