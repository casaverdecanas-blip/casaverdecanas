// Banco del conector (interno/conector-1.js) — sin red ni npm:
//   node netlify/pruebas/conector.mjs
// Lo que importa (8-nov-2026, plan Timón): todo lo que el conector PROMETE
// existe hoy en el código de Casa Verde. Si alguien renombra o saca una función
// de actividades-core.js o de nucleo.js que el conector ofrece, falla acá —
// antes de que se le rompa a Tiempos en el teléfono de Florencia.
import assert from "node:assert/strict";
import fs from "node:fs";
const leer = (r) => fs.readFileSync(new URL("../../interno/" + r, import.meta.url), "utf8");
const con = leer("conector-1.js");

let pasadas = 0, fallidas = 0;
const prueba = (n, f) => { try { f(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };

// OFRECE se lee del texto: el módulo importa Firebase y no carga en node.
const lista = (k) => JSON.parse(con.match(new RegExp(k + ": Object\\.freeze\\((\\[[^\\]]*\\])"))[1].replace(/'/g, '"'));
const ofreceCore = lista("Core"), ofreceCV2 = lista("CV2");

prueba("dice su contrato: conector-1", () => assert.match(con, /export const CONTRATO = 'conector-1';/));
prueba("ofrece lo que usa Tiempos hoy", () => {
  for (const n of ["consultaActividades", "limpiezaLatente", "iniciar", "finalizar", "tildar",
    "itemsDeCompra", "compradosDe", "tildarCompra"]) assert.ok(ofreceCore.includes(n), n);
  for (const n of ["subirImagen", "comprimirImagen", "NETLIFY"]) assert.ok(ofreceCV2.includes(n), n);
});
prueba("cada cosa del motor que ofrece existe en actividades-core.js", () => {
  const core = leer("actividades-core.js");
  for (const n of ofreceCore) assert.match(core, new RegExp("^Core\\." + n + " = ", "m"), "falta Core." + n);
});
prueba("cada cosa del núcleo que ofrece existe en nucleo.js", () => {
  const nuc = leer("nucleo.js");
  for (const n of ofreceCV2) assert.match(nuc, new RegExp("^CV2\\." + n + " = ", "m"), "falta CV2." + n);
});
prueba("sólo importa archivos de Casa Verde, y en diferido", () => {
  assert.doesNotMatch(con, /^import /m);
  const imps = [...con.matchAll(/import\('([^']+)'\)/g)].map((m) => m[1]).sort();
  assert.deepEqual(imps, ["./actividades-core.js", "./firebase-init.js", "./nucleo.js"]);
});

prueba("compras (core-3): una por línea; sin líneas, el título es la cosa; lo que no es compra, nada", () => {
  const core = leer("actividades-core.js");
  const src = core.match(/^Core\.itemsDeCompra = [\s\S]*?^};/m)[0] + "\n" + core.match(/^Core\.compradosDe = .*$/m)[0];
  const Core = {};
  new Function("Core", src)(Core);
  assert.deepEqual(Core.itemsDeCompra({ esCompra: true, titulo: "Súper", detalle: "Pan\n\n  Harina \n" }), ["Pan", "Harina"]);
  assert.deepEqual(Core.itemsDeCompra({ esCompra: true, titulo: " bicarbonato ", detalle: "" }), ["bicarbonato"]);
  assert.deepEqual(Core.itemsDeCompra({ esCompra: false, titulo: "Pintar", detalle: "" }), []);
  assert.deepEqual(Core.compradosDe({ comprados: ["Pan"] }), ["Pan"]);
  assert.deepEqual(Core.compradosDe({}), []);
});
prueba("actividades.html usa las compras del motor, no una copia", () => {
  const act = leer("actividades.html");
  assert.match(act, /const itemsDe = \(it\) => Core\.itemsDeCompra\(it\);/);
  assert.match(act, /await Core\.tildarCompra\(actId, txt, tildado\);/);
  assert.doesNotMatch(act, /comprados: tildado \? arrayUnion/);
});

console.log(`\n${pasadas} pasadas, ${fallidas} fallidas`);
process.exit(fallidas ? 1 : 0);
