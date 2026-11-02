// Banco de «Por pagar» (interno/nucleo.js) — sin red ni npm:
//   node netlify/pruebas/por-pagar.mjs
// Lo que importa (2-nov-2026, Mauro: «una lista de los pagos pendientes a
// hacer como ser el IPTU, pagos de impuestos, devoluciones… honorarios»):
// una sola lista que junta lo cargado a mano con lo que ya vive en Cobros,
// Dinero e Impuestos, sin copiarlo, sin sumar monedas distintas, con lo
// vencido primero, y un vencimiento que se repite cae en una fecha que existe.
// Las funciones se sacan de nucleo.js entre sus marcas: nucleo.js importa
// Firebase y no se puede cargar en node.
import assert from "node:assert/strict";
import fs from "node:fs";
const fuente = fs.readFileSync(new URL("../../interno/nucleo.js", import.meta.url), "utf8");
const ini = fuente.indexOf("// ═══ POR PAGAR ═══"), fin = fuente.indexOf("// ═══ FIN POR PAGAR ═══");
assert.ok(ini > 0 && fin > ini, "faltan las marcas POR PAGAR en nucleo.js");
const P = new Function(fuente.slice(ini, fin) +
  "\nreturn { TIPOS_PAGO, REPITE_PAGO, siguienteVencimiento, estadoDelPago, pagosPorHacer, totalesPorMoneda };")();

let pasadas = 0, fallidas = 0;
const prueba = (n, f) => { try { f(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };
const HOY = "2026-11-02";

prueba("un vencimiento mensual, trimestral y anual cae en el mes que toca", () => {
  assert.equal(P.siguienteVencimiento("2026-11-10", "mensual"), "2026-12-10");
  assert.equal(P.siguienteVencimiento("2026-12-10", "mensual"), "2027-01-10");
  assert.equal(P.siguienteVencimiento("2026-11-10", "trimestral"), "2027-02-10");
  assert.equal(P.siguienteVencimiento("2026-02-15", "anual"), "2027-02-15");
});
prueba("el 31 en un mes más corto cae en su último día, también en febrero bisiesto", () => {
  assert.equal(P.siguienteVencimiento("2027-01-31", "mensual"), "2027-02-28");
  assert.equal(P.siguienteVencimiento("2028-01-31", "mensual"), "2028-02-29");
  assert.equal(P.siguienteVencimiento("2026-08-31", "trimestral"), "2026-11-30");
});
prueba("lo que no se repite, o sin fecha, no tiene siguiente", () => {
  assert.equal(P.siguienteVencimiento("2026-11-10", "no"), null);
  assert.equal(P.siguienteVencimiento("", "mensual"), null);
  assert.equal(P.siguienteVencimiento("10/11/2026", "mensual"), null);
});
prueba("vencido, pronto (hasta 7 días), en fecha y sin fecha", () => {
  assert.equal(P.estadoDelPago("2026-11-01", HOY), "vencido");
  assert.equal(P.estadoDelPago("2026-11-02", HOY), "pronto");
  assert.equal(P.estadoDelPago("2026-11-09", HOY), "pronto");
  assert.equal(P.estadoDelPago("2026-11-10", HOY), "en fecha");
  assert.equal(P.estadoDelPago(null, HOY), "sin fecha");
});

const FUENTES = {
  propios: [
    { id: "iptu", tipo: "impuesto", concepto: "IPTU 2027", a: "Prefeitura", monto: 1200, moneda: "BRL", vence: "2027-02-10", repite: "anual" },
    { id: "tasa", tipo: "impuesto", concepto: "Taxa de lixo", monto: 80, moneda: "BRL", vence: "2026-10-30" },
    { id: "dev", tipo: "devolucion", concepto: "Devolver la seña", a: "Huésped", monto: 100, moneda: "USD", vence: "2026-11-05" },
    { id: "ya", tipo: "servicio", concepto: "Luz", monto: 300, moneda: "BRL", vence: "2026-10-01", estado: "pagado" },
  ],
  honorarios: [
    { uid: "flo", nombre: "Florencia", monto: 150, estado: "pendiente" },
    { uid: "flo", nombre: "Florencia", monto: 50, estado: "pendiente" },
    { uid: "flo", nombre: "Florencia", monto: 999, estado: "pagado" },
  ],
  movimientos: [
    { nombre: "Mauro", uid: "m", monto: 40, moneda: "BRL", fecha: "2026-10-20", pendiente: { clase: "reponer", uid: "m" } },
    { nombre: "Mauro", uid: "m", monto: 10, moneda: "USD", fecha: "2026-10-21", pendiente: { clase: "reponer", uid: "m" } },
    { nombre: "Mauro", uid: "m", monto: 5, moneda: "BRL", pendiente: { clase: "reponer", uid: "m", saldado: true } },
    { nombre: "Mauro", uid: "m", monto: 7, moneda: "BRL", cierreId: "c1", pendiente: { clase: "reponer", uid: "m" } },
    { nombre: "Ana", monto: 500, moneda: "BRL", pendiente: { clase: "cobrar", uid: "a" } },
  ],
  liquidaciones: [
    { id: "l1", fecha: "2026-11-01", neto: 2979.5, moneda: "BRL", darf: { pagado: false } },
    { id: "l2", fecha: "2026-10-01", darf: { pagado: true } },
  ],
};

prueba("lo pagado, lo saldado, lo sellado por un balance y lo POR COBRAR no entran", () => {
  const l = P.pagosPorHacer(FUENTES, HOY);
  assert.ok(!l.some((r) => r.concepto === "Luz"));
  assert.ok(!l.some((r) => r.a === "Ana"));
  assert.equal(l.filter((r) => r.origen === "fiscal").length, 1);
});
prueba("honorarios: uno por persona con la deuda junta, y lleva a Cobros", () => {
  const h = P.pagosPorHacer(FUENTES, HOY).filter((r) => r.origen === "honorarios");
  assert.equal(h.length, 1); assert.equal(h[0].monto, 200); assert.equal(h[0].href, "./honorarios.html");
});
prueba("reponer en Dinero: por persona Y por moneda, nunca sumados", () => {
  const r = P.pagosPorHacer(FUENTES, HOY).filter((x) => x.origen === "dinero");
  assert.equal(r.length, 2);
  assert.deepEqual(r.map((x) => x.moneda + x.monto).sort(), ["BRL40", "USD10"]);
});
prueba("el DARF vence el día del cobro, no repite la cuenta del impuesto y no suma", () => {
  const d = P.pagosPorHacer(FUENTES, HOY).find((r) => r.origen === "fiscal");
  assert.equal(d.vence, "2026-11-01"); assert.equal(d.estado, "vencido"); assert.equal(d.monto, null);
  assert.equal(d.href, "./fiscal.html");
});
prueba("orden: vencido primero (por fecha), después lo de esta semana, después el resto", () => {
  const l = P.pagosPorHacer(FUENTES, HOY);
  assert.deepEqual(l.slice(0, 3).map((r) => r.concepto), ["Taxa de lixo", "DARF del cobro de Airbnb del 2026-11-01", "Devolver la seña"]);
  assert.equal(l[3].concepto, "IPTU 2027");
  assert.equal(l.at(-1).estado, "sin fecha");
});
prueba("los totales van por moneda y lo sin monto no suma", () => {
  const l = P.pagosPorHacer(FUENTES, HOY);
  assert.deepEqual(P.totalesPorMoneda(l), { BRL: 1200 + 80 + 200 + 40, USD: 110 });
  assert.deepEqual(P.totalesPorMoneda(l, (r) => r.estado === "vencido"), { BRL: 80 });
});
prueba("sin nada cargado, una lista vacía (no se rompe con fuentes faltantes)", () => {
  assert.deepEqual(P.pagosPorHacer({}, HOY), []);
});
prueba("cada tipo tiene su categoría de Dinero, y los repetidos son los cuatro de la pantalla", () => {
  for (const t of P.TIPOS_PAGO) assert.ok(t.categoria && t.label && t.icono, t.id);
  assert.deepEqual(Object.keys(P.REPITE_PAGO), ["no", "mensual", "trimestral", "anual"]);
});

// La pantalla ofrece exactamente esos tipos y esas repeticiones, y la regla
// existe: una colección nueva entra con su regla en la misma tanda.
const pagina = fs.readFileSync(new URL("../../interno/por-pagar.html", import.meta.url), "utf8");
const reglas = fs.readFileSync(new URL("../../interno/firestore.rules", import.meta.url), "utf8");
prueba("la colección por_pagar tiene su regla, sólo para finanzas", () => {
  const b = reglas.slice(reglas.indexOf("match /por_pagar/{id}"));
  assert.ok(reglas.includes("match /por_pagar/{id}"));
  assert.match(b.slice(0, 300), /allow read, create, update, delete: if tiene\('finanzas'\);/);
});
prueba("la pantalla pide finanzas, escribe sólo por_pagar y movimientos, y toma tipos y repeticiones del núcleo", () => {
  assert.match(pagina, /CV2\.puede\('finanzas'\)/);
  const cols = [...pagina.matchAll(/escuchar\('([a-z_]+)'/g)].map((m) => m[1]);
  const escribe = [...pagina.matchAll(/(?:addDoc|setDoc|updateDoc|deleteDoc)\((?:collection|doc)\(db, '([a-z_]+)'/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(escribe)].sort(), ["movimientos", "por_pagar"]);
  for (const c of ["por_pagar", "honorarios", "movimientos", "liquidaciones"]) assert.ok(cols.includes(c), c);
  assert.match(pagina, /CV2\.TIPOS_PAGO/); assert.match(pagina, /CV2\.REPITE_PAGO/);
});
prueba("el menú la muestra con finanzas y el service worker la guarda", () => {
  assert.match(fuente, /id: 'por-pagar'[^\n]*permiso: 'finanzas'/);
  const sw = fs.readFileSync(new URL("../../interno/sw.js", import.meta.url), "utf8");
  assert.ok(sw.includes("'./por-pagar.html'"));
});

console.log(`\n  ${pasadas} pasaron, ${fallidas} fallaron`);
process.exit(fallidas ? 1 : 0);
