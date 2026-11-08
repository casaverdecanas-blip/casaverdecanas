// Banco del control de salida (interno/actividades-core.js, core-2) — sin red ni npm:
//   node netlify/pruebas/control-salida.mjs
// Lo que importa (8-nov-2026): cerrar la limpieza de ENTRADA abre su control de
// salida por CUALQUIER camino —la pantalla, o Tiempos con Core.tildar/finalizar—,
// porque vive en el cierre de ciclo del motor y no en una pantalla. La forma del
// documento se saca de actividades-core.js entre sus marcas (el módulo importa
// Firebase y no carga en node); lo demás se comprueba sobre el texto.
import assert from "node:assert/strict";
import fs from "node:fs";
const leer = (r) => fs.readFileSync(new URL("../../interno/" + r, import.meta.url), "utf8");
const core = leer("actividades-core.js");
const cuerpo = core.slice(core.indexOf("function datosControlDeSalida"), core.indexOf("// ═══ FIN DATOS CONTROL DE SALIDA"));
const datos = new Function(cuerpo + "\nreturn datosControlDeSalida;")();

let pasadas = 0, fallidas = 0;
const prueba = (n, f) => { try { f(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };
const u = { uid: "u1", nombre: "Flor" };
const limp = { titulo: "Limpieza Cabaña 1 · entrada Leonardo", cabanaId: "c1", reservaId: "R9", fase: "entrada" };

prueba("el control cuelga de la limpieza y es de la misma reserva y cabaña", () => {
  const d = datos(limp, "limp-R9", u, "2026-11-08");
  assert.equal(d.parentId, "limp-R9");
  assert.equal(d.reservaId, "R9");
  assert.equal(d.cabanaId, "c1");
  assert.equal(d.fase, "salida");
  assert.equal(d.fechaInicio, "2026-11-08");
});
prueba("el título es «Check-out <cabaña>», sin «Limpieza» ni «· entrada…»", () => {
  assert.equal(datos(limp, "x", u, "2026-11-08").titulo, "Check-out Cabaña 1");
  assert.equal(datos({ ...limp, titulo: "" }, "x", u, "2026-11-08").titulo, "Check-out c1");
});
prueba("sin tarifa, sin recurrencia, del equipo y pendiente", () => {
  const d = datos(limp, "x", u, "2026-11-08");
  assert.equal(d.monto, 0); assert.equal(d.recurrenciaDias, 0);
  assert.equal(d.alcance, "equipo"); assert.equal(d.estado, "pendiente"); assert.equal(d.hecho, false);
  assert.equal(d.creadoPor, "u1"); assert.equal(d.creadoNombre, "Flor");
});
prueba("el cierre de ciclo abre el control (vale para tildar y finalizar)", () => {
  const ciclo = core.slice(core.indexOf("async function _cerrarCiclo"));
  assert.match(ciclo, /return Core\.abrirControlDeSalida\(act, actId, u\)/);
  assert.match(core, /controlSalida = await _cerrarCiclo\(actId, actSnap\.data\(\), u, true\)/);
  assert.match(core, /const controlSalida = await _cerrarCiclo\(actId, act, u, false\)/);
});
prueba("sólo la limpieza de ENTRADA abre un control", () => {
  assert.match(core, /Core\.esLimpiezaEntrada = \(it\) => !!\(it && it\.reservaId && it\.fase === 'entrada'\)/);
  assert.match(core, /if \(!Core\.esLimpiezaEntrada\(act\)\) return false;/);
});
prueba("la pantalla no escribe el control por su cuenta (una sola copia de la regla)", () => {
  const pag = leer("actividades.html");
  assert.doesNotMatch(pag, /'checkout-'\s*\+/);
  assert.doesNotMatch(pag, /function abrirControlDeSalida/);
  assert.match(pag, /const esLimpiezaEntrada = Core\.esLimpiezaEntrada;/);
});
prueba("el inventario de entrada sigue siendo de la pantalla, no del motor", () => {
  assert.doesNotMatch(core, /controlEntradaHecho/);
  assert.match(leer("actividades.html"), /function faltaControlEntrada/);
});

console.log(`\n${pasadas} pasadas, ${fallidas} fallidas`);
process.exit(fallidas ? 1 : 0);
