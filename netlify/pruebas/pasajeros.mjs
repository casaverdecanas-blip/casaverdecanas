// Banco de pasajerosSimultaneos (interno/nucleo.js) — sin red ni npm:
//   node netlify/pruebas/pasajeros.mjs
// Lo que importa (3-nov-2026, Mauro): los huéspedes de un acuerdo de varias
// cabañas son el MÁXIMO a la vez, no la suma de las cabañas. La función se saca
// de nucleo.js entre sus marcas: nucleo.js importa Firebase y no carga en node.
import assert from "node:assert/strict";
import fs from "node:fs";
const fuente = fs.readFileSync(new URL("../../interno/nucleo.js", import.meta.url), "utf8");
const cuerpo = fuente.slice(fuente.indexOf("function pasajerosSimultaneos"), fuente.indexOf("// ═══ FIN PASAJEROS"));
const pax = new Function(cuerpo + "\nreturn pasajerosSimultaneos;")();

let pasadas = 0, fallidas = 0;
const prueba = (n, f) => { try { f(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };
const r = (checkIn, checkOut, adultos, ninos = 0, extra = {}) => ({ checkIn, checkOut, adultos, ninos, ...extra });

prueba("el acuerdo de Darío: 8 + 2 niños, no 14 + 4", () => {
  assert.deepEqual(pax([r("2026-12-20", "2026-12-28", 4), r("2026-12-20", "2026-12-28", 4, 2), r("2026-12-28", "2026-12-30", 6, 2)]),
    { adultos: 8, ninos: 2, bebes: 0 });
});
prueba("la salida de una y la entrada de otra el mismo día no se suman", () => {
  assert.deepEqual(pax([r("2027-01-03", "2027-01-09", 5), r("2027-01-09", "2027-01-12", 6)]), { adultos: 6, ninos: 0, bebes: 0 });
});
prueba("todas a la vez: la suma de siempre", () => {
  assert.deepEqual(pax([r("2027-02-01", "2027-02-09", 4, 1), r("2027-02-01", "2027-02-09", 3), r("2027-02-01", "2027-02-09", 2, 2)]),
    { adultos: 9, ninos: 3, bebes: 0 });
});
prueba("superposición parcial: cuenta la noche con más gente", () => {
  assert.deepEqual(pax([r("2027-01-10", "2027-01-20", 2), r("2027-01-15", "2027-01-18", 4, 1), r("2027-01-19", "2027-01-25", 3)]),
    { adultos: 6, ninos: 1, bebes: 0 });
});
prueba("una cabaña anulada no cuenta", () => {
  assert.deepEqual(pax([r("2027-01-10", "2027-01-20", 2), r("2027-01-10", "2027-01-20", 4, 0, { estado: "anulada" })]),
    { adultos: 2, ninos: 0, bebes: 0 });
});
prueba("bebés y campos vacíos o en texto", () => {
  assert.deepEqual(pax([r("2027-01-10", "2027-01-12", "3", undefined, { bebes: 1 })]), { adultos: 3, ninos: 0, bebes: 1 });
});
prueba("sin fechas: la suma, y vacío da cero", () => {
  assert.deepEqual(pax([{ adultos: 2 }, { adultos: 1, ninos: 1 }]), { adultos: 3, ninos: 1, bebes: 0 });
  assert.deepEqual(pax([]), { adultos: 0, ninos: 0, bebes: 0 });
});

console.log(`\n${pasadas} pasadas, ${fallidas} fallidas`);
process.exit(fallidas ? 1 : 0);
