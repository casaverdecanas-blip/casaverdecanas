// netlify/pruebas/despertar-cliente.mjs — Banco del lado del sitio de despertar
// (init-3 de interno/firebase-init.js), sin red ni npm.
//   node netlify/pruebas/despertar-cliente.mjs
// Lo que importa: guardar algo que la Pizarra muestra la despierta UNA vez por
// «qué», sin contenido y con el token; lo de otra base, lo que la Pizarra no
// muestra, lo que falló y una sesión anónima no despiertan a nadie.
import assert from "node:assert/strict";
import fs from "node:fs";
import { envolverEscrituras, queCambio, QUE_DE_COLECCION } from "../../interno/firebase-init.js";
import { QUE } from "../functions/despertar.mjs";

let pasadas = 0, fallidas = 0;
const prueba = async (n, f) => { try { await f(); pasadas++; console.log("  ✓ " + n); }
  catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const llamadas = [];
globalThis.fetch = async (url, op) => { llamadas.push({ url, cuerpo: JSON.parse(op.body), auth: op.headers.Authorization }); return { ok: true }; };
const db = {}, otra = {};
const lote = () => ({ set() {}, update() {}, delete() {}, commit: async () => "hecho" });
const F = { setDoc: async () => "s", addDoc: async () => "a", updateDoc: async () => "u", deleteDoc: async () => "d", writeBatch: lote };
const conUsuario = (u) => () => ({ currentUser: u });
const persona = { isAnonymous: false, getIdToken: async () => "tok" };

await prueba("qué cambió sale de la colección, y todos los «qué» los acepta la función", () => {
  assert.equal(queCambio("reservas/abc"), "reservas");
  assert.equal(queCambio("cambios_reserva/x"), "reservas");
  assert.equal(queCambio("pedidos_alquiler/x"), "pedidos");
  assert.equal(queCambio("disponibilidad/x"), null);
  assert.equal(queCambio("toString"), null);
  for (const q of new Set(Object.values(QUE_DE_COLECCION))) assert.ok(QUE.includes(q), q);
});
await prueba("guardar despierta una vez por «qué», sin contenido y con el token; lo demás no", async () => {
  const G = envolverEscrituras(F, () => db, conUsuario(persona));
  assert.equal(await G.updateDoc({ firestore: db, path: "reservas/1" }, {}), "u");
  await G.setDoc({ firestore: db, path: "cambios_reserva/2" }, {});
  await G.addDoc({ firestore: db, path: "actividades" }, {});
  await G.setDoc({ firestore: otra, path: "reservas/3" }, {});          // otra base
  await G.setDoc({ firestore: db, path: "disponibilidad/4" }, {});      // no la muestra
  const b = G.writeBatch(db); b.set({ firestore: db, path: "pedidos_alquiler/5" }, {}); assert.equal(await b.commit(), "hecho");
  let falla = null;
  try { await envolverEscrituras({ ...F, setDoc: async () => { throw new Error("denegado"); } }, () => db, conUsuario(persona)).setDoc({ firestore: db, path: "avisos/9" }); }
  catch (e) { falla = e.message; }
  await esperar(2300);
  assert.equal(falla, "denegado");
  assert.deepEqual(llamadas.map((l) => l.cuerpo.que).sort(), ["pedidos", "reservas", "tareas"]);
  for (const l of llamadas) {
    assert.ok(l.url.endsWith("/.netlify/functions/despertar"));
    assert.deepEqual(l.cuerpo, { base: "casaverde", que: l.cuerpo.que });
    assert.equal(l.auth, "Bearer tok");
  }
});
await prueba("una sesión anónima (el muro de recuerdos) no despierta a nadie", async () => {
  llamadas.length = 0;
  await envolverEscrituras(F, () => db, conUsuario({ isAnonymous: true, getIdToken: async () => "x" })).setDoc({ firestore: db, path: "reservas/1" }, {});
  await esperar(2300);
  assert.equal(llamadas.length, 0);
});
await prueba("las escrituras que exporta firebase-init.js son las envueltas", () => {
  const s = fs.readFileSync(new URL("../../interno/firebase-init.js", import.meta.url), "utf8");
  assert.match(s, /\(\{ setDoc, addDoc, updateDoc, deleteDoc, writeBatch \} =\s*envolverEscrituras\(/);
});

console.log(`\n  ${pasadas} pasadas, ${fallidas} fallidas\n`);
process.exit(fallidas ? 1 : 0);
