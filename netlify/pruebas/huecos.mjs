// Banco de huecoDelPedido (interno/nucleo.js) — sin red ni npm:
//   node netlify/pruebas/huecos.mjs
// Lo que importa (21-oct-2026, pizarra-56): un pedido de Facebook «llena un
// hueco» si sus fechas caen en noches libres, con la capacidad de cada espacio
// (base primero, el máximo sólo con adicional), igual que lugarPara de la
// Pizarra. La función se saca de nucleo.js entre sus marcas: nucleo.js importa
// Firebase y no se puede cargar en node.
import assert from "node:assert/strict";
import fs from "node:fs";
const fuente = fs.readFileSync(new URL("../../interno/nucleo.js", import.meta.url), "utf8");
const cuerpo = fuente.slice(fuente.indexOf("function huecoDelPedido"), fuente.indexOf("// ═══ FIN HUECOS"));
const huecoDelPedido = new Function(cuerpo + "\nreturn huecoDelPedido;")();

const cab = (id, nombre, base, max, orden) => ({ id, nombre: { es: nombre }, capacidad: { base, max }, orden, activa: true });
const CABANAS = [cab("c1", "Cabaña 1", 6, 8, 1), cab("c2", "Depto", 4, 5, 2), cab("c3", "Loft", 5, 7, 3)];
const OCUP = [
  { cabanaId: "c1", desde: "2027-01-03", hasta: "2027-01-12" },
  { cabanaId: "c3", desde: "2027-01-05", hasta: "2027-01-20" },
  { cabanaId: "c2", desde: "2027-02-01", hasta: "2027-03-01" },
  { cabanaId: "c3", desde: "2027-02-01", hasta: "2027-02-27" },
];
const HOY = "2026-10-21";

let pasadas = 0, fallidas = 0;
const prueba = (n, f) => { try { f(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };

prueba("con fechas libres para los que son, cae en el hueco, con la cabaña más justa", () => {
  const h = huecoDelPedido({ desde: "2027-01-08", hasta: "2027-01-15", personas: 4 }, OCUP, CABANAS, HOY);
  assert.equal(h.tipo, "fechas"); assert.deepEqual(h.ids, ["c2"]); assert.equal(h.conExtra, false);
  assert.match(h.texto, /Depto del 08\/01 al 15\/01, para 4/);
});
prueba("si una sola no alcanza con la base, se juntan; el máximo sólo si ni juntas", () => {
  const h = huecoDelPedido({ desde: "2027-01-20", hasta: "2027-01-27", personas: 10 }, OCUP, CABANAS, HOY);
  assert.deepEqual(h.ids.sort(), ["c1", "c2"]); assert.equal(h.conExtra, false);
  // en febrero sólo queda la Cabaña 1: para 8, con adicional
  const x = huecoDelPedido({ desde: "2027-02-10", hasta: "2027-02-15", personas: 8 }, OCUP, CABANAS, HOY);
  assert.deepEqual(x.ids, ["c1"]); assert.equal(x.conExtra, true); assert.match(x.texto, /adicional por persona/);
});
prueba("ocupado o sin cupo, no es un hueco", () => {
  assert.equal(huecoDelPedido({ desde: "2027-01-06", hasta: "2027-01-10", personas: 8 }, OCUP, CABANAS, HOY), null);
  assert.equal(huecoDelPedido({ desde: "2027-01-20", hasta: "2027-01-27", personas: 21 }, OCUP, CABANAS, HOY), null);
});
prueba("lo que ya pasó o no tiene forma no es un hueco", () => {
  assert.equal(huecoDelPedido({ desde: "2026-01-10", hasta: "2026-01-17", personas: 2 }, [], CABANAS, HOY), null);
  assert.equal(huecoDelPedido({ desde: "10/01", hasta: "17/01" }, [], CABANAS, HOY), null);
  assert.equal(huecoDelPedido({ desde: "2027-01-17", hasta: "2027-01-10" }, [], CABANAS, HOY), null);
  assert.equal(huecoDelPedido({}, [], CABANAS, HOY), null);
  assert.equal(huecoDelPedido({ desde: "2027-01-10", hasta: "2027-01-17" }, [], [], HOY), null);
});
prueba("sin decir cuántos son, alcanza una cabaña libre", () => {
  const h = huecoDelPedido({ desde: "2027-01-05", hasta: "2027-01-10" }, OCUP, CABANAS, HOY);
  assert.deepEqual(h.ids, ["c2"]); assert.doesNotMatch(h.texto, /para/);
});
prueba("un mes suelto: hay lugar si queda una tirada de 3 noches o más", () => {
  const h = huecoDelPedido({ mes: "2027-02", personas: 5 }, OCUP, CABANAS, HOY);
  assert.equal(h.tipo, "mes"); assert.deepEqual(h.ids, ["c1"]); assert.equal(h.noches, 28);
  // febrero con el Depto y el Loft llenos: para 12 no hay, ni con adicional (c1 llega a 8)
  assert.equal(huecoDelPedido({ mes: "2027-02", personas: 12 }, OCUP, CABANAS, HOY), null);
  // un mes que ya pasó, no
  assert.equal(huecoDelPedido({ mes: "2026-09" }, [], CABANAS, HOY), null);
});
prueba("una cabaña apagada no cuenta, y la capacidad vieja (un número) se entiende", () => {
  const cs = [{ ...CABANAS[0], activa: false }, { id: "c2", nombre: "Depto", capacidad: 4 }];
  assert.deepEqual(huecoDelPedido({ desde: "2027-01-20", hasta: "2027-01-25", personas: 4 }, [], cs, HOY).ids, ["c2"]);
  assert.equal(huecoDelPedido({ desde: "2027-01-20", hasta: "2027-01-25", personas: 5 }, [], cs, HOY), null);
});

console.log(`\n  ${pasadas} pasadas, ${fallidas} fallidas\n`);
process.exit(fallidas ? 1 : 0);
