// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — actividades-core.js
//  El corazón operativo: Play/Stop (sin pausa), tildes, cierre de
//  ciclo con reprogramación de recurrentes y HONORARIOS
//  PROPORCIONALES. Diseño heredado del v5.2 del sistema viejo,
//  reescrito limpio. Fuente única: /sesiones/ y /honorarios/.
//  Sello: core-4 (24-nov-2026) — los adjuntos de una tarea (fotos y documentos).
//  core-3 (18-nov-2026) — las compras, en el motor (las lee Timón).
//  core-2 (8-nov-2026) — el control de salida nace ACÁ.
// ═══════════════════════════════════════════════════════════════

import {
  db, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  collection, query, where, limit, or, and,
  getAggregateFromServer, sum,
  serverTimestamp, Timestamp, Bytes, arrayUnion, arrayRemove
} from './firebase-init.js';

export const Core = {};

// ── Consulta de actividades visibles (ÚNICO lugar) ───────────
// Para no-admin, CADA rama del or() debe ser DEMOSTRABLE contra las
// reglas (lección v5.13): el motor de reglas rechaza consultas cuyos
// resultados posibles no pueda probar permitidos. Por eso cada rama
// fija el alcance:
//   equipo · personal+propia · asignados+me-incluye · asignados+propia
Core.consultaActividades = (u, esAdmin) => {
  const col = collection(db, 'actividades');
  if (esAdmin) return query(col);
  return query(col, or(
    where('alcance', '==', 'equipo'),
    and(where('alcance', '==', 'personal'), where('creadoPor', '==', u.uid)),
    and(where('alcance', '==', 'asignados'), where('competencias', 'array-contains', u.uid)),
    and(where('alcance', '==', 'asignados'), where('creadoPor', '==', u.uid))
  ));
};

// ═══ ADJUNTOS ═══
// Una tarea compleja necesita su documento de respaldo (un diagnóstico, un
// presupuesto, un manual) y a veces una foto. Mauro, 24-nov-2026: «que se pueda
// adjuntar este tipo de documentos a la tarea, como si fuese también una foto»,
// «privados», «primero en Casa Verde y que quede todo documentado para la
// migración a Timón».
//
// Dos lugares, un solo criterio (qué es privado y qué no):
//   · la tarea lleva `adjuntos: [{id, tipo, nombre, mime, tam, url?, por, en}]`
//     — SÓLO la ficha: abrir el detalle no lee ninguna subcolección;
//   · un DOCUMENTO vive como bytes en `actividades/{id}/adjuntos/{aid}`, con la
//     misma visibilidad que su tarea (regla en firestore.rules) y la misma
//     forma que `firestore.mjs adjuntar` de `datos`, para que el chat lo lea;
//   · una FOTO desde la web va a Cloudinary (como las del control de salida) y
//     la ficha lleva su `url`; no tiene documento en la subcolección.
// Las funciones puras van entre estas marcas: el banco `adjuntos.mjs` las saca
// de acá, porque este archivo importa Firebase y no se carga en node.
const ADJ_DOCS = { pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown', csv: 'text/csv', json: 'application/json' };
const ADJ_IMGS = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
// El techo es el mismo que el de `adjuntoDe` en datos y el de la regla: un
// documento de Firestore no pasa de 1 MiB y los bytes viajan junto a su ficha.
const ADJ_MAX = 900000;
const ADJ_MAX_POR_TAREA = 12;
const ADJ_ID = /^[A-Za-z0-9_-]{1,40}$/;

function nombreDeAdjunto(n) {
  const t = String(n ?? '').split(/[\\/]/).pop().replace(/[\u0000-\u001f\u007f<>"]/g, '').trim().slice(0, 120);
  return t;
}
// Qué es lo que se quiere adjuntar. `tam` en bytes. {ok:false, motivo} dice por qué no.
function evaluarAdjunto(nombre, tam) {
  const n = nombreDeAdjunto(nombre);
  if (!n) return { ok: false, motivo: 'El archivo no tiene nombre.' };
  const ext = n.includes('.') ? n.split('.').pop().toLowerCase() : '';
  const doc_ = ADJ_DOCS[ext], img = ADJ_IMGS[ext];
  if (!doc_ && !img) return { ok: false, motivo: '«' + n + '»: sólo PDF, texto (txt, md, csv, json) e imágenes (jpg, png, webp).' };
  if (!(tam > 0)) return { ok: false, motivo: '«' + n + '» está vacío.' };
  if (tam > ADJ_MAX) return { ok: false, motivo: '«' + n + '» pesa ' + Math.round(tam / 1024) + ' KB: el techo es ' + Math.round(ADJ_MAX / 1024) + ' KB. Achicalo antes.' };
  return { ok: true, nombre: n, tipo: doc_ ? 'documento' : 'imagen', mime: doc_ || img };
}
// La lista de adjuntos de una tarea, depurada: lo que no tiene la forma, no se muestra
// (el agente o una versión vieja pudieron escribir cualquier cosa).
function adjuntosDeTarea(it) {
  const l = Array.isArray(it?.adjuntos) ? it.adjuntos : [];
  return l.filter((a) => a && typeof a === 'object' && ADJ_ID.test(String(a.id ?? ''))
      && typeof a.nombre === 'string' && a.nombre
      && ['documento', 'imagen', 'audio'].includes(a.tipo))
    .map((a) => ({
      id: String(a.id), tipo: a.tipo, nombre: String(a.nombre).slice(0, 120),
      mime: typeof a.mime === 'string' ? a.mime : '', tam: Number(a.tam) > 0 ? Number(a.tam) : 0,
      url: typeof a.url === 'string' && /^https:\/\//.test(a.url) ? a.url : '',
      por: typeof a.por === 'string' ? a.por : '', en: typeof a.en === 'string' ? a.en : ''
    }))
    .sort((x, y) => (x.en < y.en ? -1 : x.en > y.en ? 1 : 0));
}
function tamanoLegible(b) {
  const n = Number(b) || 0;
  return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : n >= 1024 ? Math.round(n / 1024) + ' KB' : n > 0 ? n + ' B' : '';
}
// La ficha que se guarda en la tarea. Una foto web lleva `url`; un documento no.
function fichaDeAdjunto(id, ev, tam, por, en, url) {
  const f = { id, tipo: ev.tipo, nombre: ev.nombre, mime: ev.mime, tam: Number(tam) || 0, por: por || '', en };
  if (url) f.url = url;
  return f;
}
// ═══ FIN ADJUNTOS ═══

Core.ADJUNTOS = Object.freeze({ MAX: ADJ_MAX, MAX_POR_TAREA: ADJ_MAX_POR_TAREA,
  EXTENSIONES: Object.freeze(Object.keys({ ...ADJ_DOCS, ...ADJ_IMGS })) });
Core.evaluarAdjunto = evaluarAdjunto;
Core.adjuntosDe = adjuntosDeTarea;
Core.tamanoLegible = tamanoLegible;

const idAdjunto = () => 'a-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Un DOCUMENTO (o una imagen como bytes): primero el documento privado, después
// la ficha en la tarea. Si la ficha falla, el documento no queda huérfano.
Core.agregarDocumento = async (actId, file, u) => {
  const t = Core.adjuntosDe((await getDoc(doc(db, 'actividades', actId))).data());
  if (t.length >= ADJ_MAX_POR_TAREA) throw new Error('Esta tarea ya tiene ' + ADJ_MAX_POR_TAREA + ' adjuntos: sacá alguno antes.');
  const ev = evaluarAdjunto(file?.name, file?.size);
  if (!ev.ok) throw new Error(ev.motivo);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.length > ADJ_MAX) throw new Error('El archivo supera el techo de ' + Math.round(ADJ_MAX / 1024) + ' KB.');
  const id = idAdjunto(), en = new Date().toISOString();
  const sub = doc(db, 'actividades', actId, 'adjuntos', id);
  // La MISMA forma que `firestore.mjs adjuntar`: tipo, mime, nombre, datos, en, por (+ uid de quien subió).
  await setDoc(sub, { tipo: ev.tipo, mime: ev.mime, nombre: ev.nombre, datos: Bytes.fromUint8Array(bytes),
    en, por: u?.nombre ?? '', uid: u.uid });
  const ficha = fichaDeAdjunto(id, ev, bytes.length, u?.nombre ?? '', en);
  try {
    await updateDoc(doc(db, 'actividades', actId), { adjuntos: arrayUnion(ficha), actualizadoEn: serverTimestamp() });
  } catch (e) {
    try { await deleteDoc(sub); } catch { /* si tampoco se puede, queda un documento sin ficha: no se ve */ }
    throw e;
  }
  return ficha;
};

// Una FOTO que ya subió Cloudinary: sólo la ficha, con su `url`.
Core.agregarFoto = async (actId, url, u) => {
  const t = Core.adjuntosDe((await getDoc(doc(db, 'actividades', actId))).data());
  if (t.length >= ADJ_MAX_POR_TAREA) throw new Error('Esta tarea ya tiene ' + ADJ_MAX_POR_TAREA + ' adjuntos: sacá alguno antes.');
  if (!/^https:\/\//.test(String(url))) throw new Error('La foto no devolvió una dirección válida.');
  const en = new Date().toISOString();
  const ficha = fichaDeAdjunto(idAdjunto(), { nombre: 'Foto ' + en.slice(0, 10) + '.jpg', tipo: 'imagen', mime: 'image/jpeg' }, 0, u?.nombre ?? '', en, url);
  await updateDoc(doc(db, 'actividades', actId), { adjuntos: arrayUnion(ficha), actualizadoEn: serverTimestamp() });
  return ficha;
};

// Para ABRIR: una foto con `url` se abre por su enlace; un documento se lee de
// la subcolección y se entrega como archivo local (blob). Devuelve { url, nombre, mime, local }.
Core.leerAdjunto = async (actId, ficha) => {
  if (ficha.url) return { url: ficha.url, nombre: ficha.nombre, mime: ficha.mime, local: false };
  const s = await getDoc(doc(db, 'actividades', actId, 'adjuntos', ficha.id));
  if (!s.exists()) throw new Error('El documento ya no está.');
  const d = s.data();
  const blob = new Blob([d.datos.toUint8Array()], { type: d.mime || ficha.mime || 'application/octet-stream' });
  return { url: URL.createObjectURL(blob), nombre: d.nombre || ficha.nombre, mime: d.mime || ficha.mime, local: true };
};

// Sacar un adjunto: primero la ficha (lo que se ve), después el documento.
Core.quitarAdjunto = async (actId, ficha) => {
  const act = (await getDoc(doc(db, 'actividades', actId))).data() || {};
  // arrayRemove compara el objeto ENTERO: se saca el que está guardado, no el depurado.
  const guardado = (Array.isArray(act.adjuntos) ? act.adjuntos : []).find((a) => a && a.id === ficha.id);
  if (guardado) await updateDoc(doc(db, 'actividades', actId), { adjuntos: arrayRemove(guardado), actualizadoEn: serverTimestamp() });
  if (!ficha.url) { try { await deleteDoc(doc(db, 'actividades', actId, 'adjuntos', ficha.id)); } catch { /* sin permiso: queda sin ficha, no se ve */ } }
};

// ── Compras (core-3, 18-nov-2026) ────────────────────────────
// Una actividad con «Es una compra» lleva su lista en la descripción, una
// cosa por línea, y lo comprado en `comprados` POR TEXTO (no por posición:
// editar una línea la destilda, que es lo predecible). Vivía sólo en
// actividades.html; pasó al motor porque Timón la muestra en su solapa
// Compras (Mauro, 18-nov: «en Timón no logro ver las compras que se
// registraron en Casa Verde») y tildar desde allá tiene que ser lo mismo
// que tildar acá.
// Una compra SIN líneas es una cosa sola: su título. Hasta core-2 quedaba
// afuera de la vista de Compras («la lista está vacía») — pasó con cinco
// compras cargadas el 18-nov con el nombre y nada más.
Core.itemsDeCompra = (it) => {
  const lineas = String(it?.detalle || '').split('\n').map((l) => l.trim()).filter((l) => l !== '');
  if (lineas.length) return lineas;
  const t = String(it?.titulo || '').trim();
  return it?.esCompra && t ? [t] : [];
};

Core.compradosDe = (it) => (Array.isArray(it?.comprados) ? it.comprados.slice() : []);

// arrayUnion/arrayRemove y no reescribir el array: dos personas tildando
// cosas distintas al mismo tiempo no se pisan.
Core.tildarCompra = (actId, txt, tildado) => updateDoc(doc(db, 'actividades', actId), {
  comprados: tildado ? arrayUnion(txt) : arrayRemove(txt),
  actualizadoEn: serverTimestamp()
});

// ── Utilidades ───────────────────────────────────────────────
const hoyISO = () => new Date().toISOString().slice(0, 10);
const sumarDias = (iso, n) => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const r2 = (n) => Math.round(n * 100) / 100;

// ── Limpiezas latentes ───────────────────────────────────────
// La limpieza de una reserva se CREA apenas la reserva se confirma, aunque
// falten meses. Antes nacía recién siete días antes del check-in, y eso
// dependía de que alguien abriera la app justo en esa ventana: si nadie
// entraba, la limpieza no se creaba nunca y nadie se enteraba.
//
// Para que el cambio no llene las listas de tareas de dentro de tres meses,
// la que todavía está lejos queda LATENTE: existe en la base, pero no se
// muestra hasta que faltan HORIZONTE_LIMPIEZA días. El día que aparece es
// el mismo en que aparecía antes — lo que cambia es que ahora aparece
// siempre, no solo si alguien estuvo mirando.
Core.HORIZONTE_LIMPIEZA = 7;

Core.esLimpieza = (it) => !!(it && it.reservaId && it.fase);

Core.limpiezaLatente = (it) => {
  if (!Core.esLimpieza(it) || it.hecho) return false;
  const ini = it.fechaInicio || it.fechaVencimiento;
  if (!ini) return false;
  return ini > sumarDias(hoyISO(), Core.HORIZONTE_LIMPIEZA);
};

// ── Control de salida (core-2, 8-nov-2026) ───────────────────
// Terminar la limpieza de ENTRADA de una reserva abre su control de salida,
// checkout-<reservaId>, colgando de ella. Hasta core-1 lo hacía la pantalla
// de Actividades y no el motor, así que cerrarla por otro camino —Tiempos
// usa Core.tildar y Core.finalizar— lo salteaba sin aviso: pasó con la
// reserva de Leonardo, cerrada el 2-nov sin control. Ahora vive en el
// cierre de ciclo y lo cumple cualquiera que cierre.
// Lo que NO está acá, a propósito: exigir el inventario de entrada antes
// de cerrar. Eso sigue siendo de la pantalla (faltaControlEntrada).
Core.esLimpiezaEntrada = (it) => !!(it && it.reservaId && it.fase === 'entrada');

// ═══ DATOS CONTROL DE SALIDA (puro, lo prueba netlify/pruebas/control-salida.mjs)
function datosControlDeSalida(act, actId, u, hoy) {
  const nom = act.titulo
    ? act.titulo.replace(/^Limpieza\s+/, '').replace(/\s+·\s+entrada.*$/, '')
    : (act.cabanaId || '');
  return {
    titulo: 'Check-out ' + nom,
    detalle: 'Control de salida — inventario y faltantes',
    parentId: actId,
    tipo: 'normal', alcance: 'equipo', competencias: [],
    cabanaId: act.cabanaId ?? null, reservaId: act.reservaId, fase: 'salida',
    prioridad: 'rojo', recurrenciaDias: 0, monto: 0,
    fechaInicio: hoy, fechaVencimiento: '',
    esCompra: false, hecho: false, estado: 'pendiente',
    sesionActualId: null, ultimoCierreEn: null, orden: 0,
    creadoPor: u.uid, creadoNombre: u.nombre ?? ''
  };
}
// ═══ FIN DATOS CONTROL DE SALIDA
Core.datosControlDeSalida = datosControlDeSalida;

const hoyLocal = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
    + '-' + String(d.getDate()).padStart(2, '0');
};

Core.abrirControlDeSalida = async (act, actId, u) => {
  if (!Core.esLimpiezaEntrada(act)) return false;
  await setDoc(doc(db, 'actividades', 'checkout-' + act.reservaId), {
    ...datosControlDeSalida(act, actId, u, hoyLocal()),
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp()
  }, { merge: true });
  return true;
};

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
  } else {
    // La sesión no existe: casi seguro otra persona terminó la
    // actividad y el cierre frenó este cronómetro. NO se vuelve a
    // cerrar el ciclo (evita honorarios duplicados).
    const err = new Error('Este cronómetro ya fue frenado: la actividad se dio por terminada y tus horas quedaron registradas.');
    err.code = 'sin-sesion';
    throw err;
  }

  const actRef = doc(db, 'actividades', actId);
  const actSnap = await getDoc(actRef);
  if (!actSnap.exists()) return { horas, terminada };

  let controlSalida = false;
  if (terminada) {
    controlSalida = await _cerrarCiclo(actId, actSnap.data(), u, true);
  } else {
    await updateDoc(actRef, {
      estado: 'pendiente',
      sesionActualId: null,
      actualizadoEn: serverTimestamp()
    });
  }
  return { horas, terminada, controlSalida };
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

  const controlSalida = await _cerrarCiclo(actId, act, u, false);
  const ciclo = act.recurrenciaDias ?? 0;
  return { recurrente: ciclo > 0, proxima: ciclo > 0 ? sumarDias(hoyISO(), ciclo) : null, controlSalida };
};

// ── Cierre de ciclo (interno) ────────────────────────────────
async function _cerrarCiclo(actId, act, u, conCrono) {
  const ahora = Timestamp.now();

  // 0) TERMINADA = se frenan TODOS los cronómetros corriendo en la
  //    actividad, de cualquier usuario: su tiempo queda registrado
  //    y entra en el reparto de ESTE ciclo. (Si el Stop fue "todavía
  //    no", este cierre no ocurre y los demás relojes siguen.)
  const abiertas = await getDocs(query(
    collection(db, 'sesiones'),
    where('actividadId', '==', actId),
    where('estado', '==', 'en_curso')
  ));
  for (const d of abiertas.docs) {
    const horas = r2(Math.max(0, (ahora.toMillis() - d.data().inicio.toMillis()) / 3600000));
    await updateDoc(d.ref, {
      fin: ahora, horas, estado: 'finalizada',
      cerradoPorCierreDeActividad: true,
      cerradoPorNombre: u.nombre ?? '',
      actualizadoEn: ahora
    });
  }

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

  // 3) La limpieza de entrada abre su control de salida (core-2).
  //    Devuelve true si lo abrió, para que la pantalla lo diga.
  return Core.abrirControlDeSalida(act, actId, u);
}

// ── Recalcular honorarios tras editar/borrar sesiones ────────
// El Gestor de Sesiones GOBIERNA cobros y estadísticas: si el admin
// altera sesiones, los honorarios de los ciclos afectados se rehacen.
// Regla de seguridad: un ciclo con algún honorario PAGADO no se toca
// (el dinero ya salió) — se informa para ajuste manual en Cobros.
// El "pozo" de cada ciclo se conserva (suma de sus honorarios): solo
// cambia el reparto según las horas que quedaron.
Core.recalcularCiclos = async (actividadId) => {
  const hs = await getDocs(query(
    collection(db, 'honorarios'), where('actividadId', '==', actividadId)));
  if (hs.empty) return { recalculados: 0, conPagos: 0 };

  // Agrupar honorarios por cierre de ciclo
  const ciclos = {};
  hs.forEach((d) => {
    const x = d.data();
    const k = x.cicloCerradoEn?.toMillis?.() ?? 0;
    (ciclos[k] ??= []).push({ id: d.id, ...x });
  });
  const cortes = Object.keys(ciclos).map(Number).sort((a, b) => a - b);

  // Sesiones finalizadas de la actividad (estado actual, post-edición)
  const ss = await getDocs(query(
    collection(db, 'sesiones'), where('actividadId', '==', actividadId)));
  const sesiones = [];
  ss.forEach((d) => { const x = d.data(); if (x.estado === 'finalizada') sesiones.push(x); });

  let recalculados = 0, conPagos = 0;

  for (let i = 0; i < cortes.length; i++) {
    const hasta = cortes[i];
    const desde = i > 0 ? cortes[i - 1] : 0;
    const grupo = ciclos[hasta];

    if (grupo.some((h) => h.estado === 'pagado')) { conPagos++; continue; }

    const pozo = r2(grupo.reduce((a, h) => a + (Number(h.monto) || 0), 0));

    // Horas por persona dentro del ciclo (desde < fin <= hasta)
    const porUid = {};
    let tot = 0;
    for (const s of sesiones) {
      const f = s.fin?.toMillis?.() ?? 0;
      if (f > desde && f <= hasta && s.uid) {
        const h = Number(s.horas) || 0;
        (porUid[s.uid] ??= { nombre: s.nombre ?? '', horas: 0 }).horas += h;
        tot += h;
      }
    }

    // Nuevo reparto del mismo pozo
    const meta = grupo[0];
    const nuevos = [];
    if (tot > 0.001) {
      for (const [uid, reg] of Object.entries(porUid)) {
        const parte = r2(pozo * (reg.horas / tot));
        if (parte > 0) nuevos.push({ uid, nombre: reg.nombre, horas: r2(reg.horas), monto: parte });
      }
    } else {
      nuevos.push({ uid: meta.cerradoPor ?? meta.uid, nombre: meta.cerradoNombre ?? meta.nombre ?? '', horas: 0, monto: pozo });
    }

    for (const h of grupo) await deleteDoc(doc(db, 'honorarios', h.id));
    for (const n of nuevos) {
      await addDoc(collection(db, 'honorarios'), {
        ...n,
        actividadId,
        concepto: meta.concepto ?? '',
        estado: 'pendiente',
        cicloCerradoEn: meta.cicloCerradoEn ?? null,
        cerradoPor: meta.cerradoPor ?? null,
        cerradoNombre: meta.cerradoNombre ?? '',
        pagadoEn: null,
        movimientoId: null,
        nota: 'Recalculado por edición de sesiones',
        creadoEn: serverTimestamp()
      });
    }
    recalculados++;
  }

  return { recalculados, conPagos };
};

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
