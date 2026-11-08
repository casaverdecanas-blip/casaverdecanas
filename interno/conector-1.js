// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — conector-1.js
//  Sello: conector-1 (8-nov-2026)
//
//  LA ÚNICA PUERTA DE CASA VERDE PARA OTRAS APPS DEL ECOSISTEMA.
//
//  Mauro, 8-nov-2026 (el plan «Timón»): Tiempos pasa a ser la app de gestión
//  del ecosistema y Casa Verde una app más, independiente. Hasta acá Tiempos
//  importaba tres archivos internos de este sitio (firebase-init.js,
//  actividades-core.js y nucleo.js) y usaba de ellos lo que quisiera: cualquier
//  cambio de adentro le podía romper algo sin que nadie lo viera.
//
//  Ahora importa ESTE archivo y nada más, y lo que puede usar está escrito
//  abajo, en OFRECE. Es un CONTRATO con número:
//    · lo que está en OFRECE no se saca ni cambia de forma mientras exista
//      conector-1.js; el banco netlify/pruebas/conector.mjs lo comprueba
//      contra el código de hoy;
//    · un cambio incompatible es un conector-2.js NUEVO, al lado, y conector-1
//      se borra recién cuando nadie lo pide.
//  Tiempos tiene su propio banco que falla si usa algo que no está acá.
//
//  `mod` (la base: auth, db y las funciones del SDK de Firebase) se entrega
//  entero a propósito: es el SDK, no lógica de Casa Verde, y la regla que
//  manda sobre lo que se lee o escribe es firestore.rules, no este archivo.
// ═══════════════════════════════════════════════════════════════

export const CONTRATO = 'conector-1';

/* Lo que una app de afuera puede usar. Si se agrega un nombre, se agrega
   acá y en el banco; si se quiere sacar uno, es conector-2. */
export const OFRECE = Object.freeze({
  Core: Object.freeze(['consultaActividades', 'limpiezaLatente', 'esLimpiezaEntrada',
    'iniciar', 'finalizar', 'tildar']),
  CV2: Object.freeze(['subirImagen', 'comprimirImagen', 'NETLIFY'])
});

const solo = (obj, nombres) => {
  const r = {};
  for (const n of nombres) {
    const v = obj[n];
    r[n] = typeof v === 'function' ? v.bind(obj) : v;
  }
  return Object.freeze(r);
};

let promesa = null;

/** Baja Casa Verde y devuelve { contrato, mod, Core, CV2 }. CV2 vale null
 *  si el núcleo no bajó (sin fotos ni IA; lo demás anda). Tira si no bajó
 *  la base o el motor. */
export function cargar() {
  if (promesa) return promesa;
  promesa = (async () => {
    const mod = await import('./firebase-init.js');
    await mod.cargarFirebase();
    const { Core } = await import('./actividades-core.js');
    let CV2 = null;
    try { ({ CV2 } = await import('./nucleo.js')); } catch { CV2 = null; }
    return Object.freeze({
      contrato: CONTRATO,
      mod,
      Core: solo(Core, OFRECE.Core),
      CV2: CV2 ? solo(CV2, OFRECE.CV2) : null
    });
  })().catch((e) => { promesa = null; throw e; });
  return promesa;
}
