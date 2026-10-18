// Banco de netlify/functions/ical-cabana.js — sin red ni npm:
//   node netlify/pruebas/ical-cabana.mjs
// Lo que importa (18-oct-2026): el calendario de UNA cabaña, que es el que lee
// Airbnb, no le devuelve a Airbnb sus propias reservas; el de todas, sí.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { handler } = require("../functions/ical-cabana.js");

const s = (v) => ({ stringValue: v });
const docs = [
  { name: "x/disponibilidad/D1", fields: { cabanaId: s("c2"), desde: s("2026-12-20"), hasta: s("2026-12-28"), origen: s("directa") } },
  { name: "x/disponibilidad/A1", fields: { cabanaId: s("c2"), desde: s("2026-11-27"), hasta: s("2026-11-29"), origen: s("airbnb") } },
  { name: "x/disponibilidad/V1", fields: { cabanaId: s("c2"), desde: s("2027-01-03"), hasta: s("2027-01-12") } },
  { name: "x/disponibilidad/C1", fields: { cabanaId: s("c1"), desde: s("2027-01-03"), hasta: s("2027-01-09"), origen: s("directa") } },
  { name: "x/disponibilidad/R1", fields: { cabanaId: s("c1"), desde: s("roto"), hasta: s("2027-01-09"), origen: s("directa") } },
];
globalThis.fetch = async (url) => ({ ok: true, json: async () => (url.includes("/disponibilidad") ? { documents: docs } : { documents: [] }) });

let pasadas = 0, fallidas = 0;
const prueba = async (n, f) => { try { await f(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };
const uids = (b) => [...b.matchAll(/UID:([^@]+)@/g)].map((m) => m[1]);

await prueba("una cabaña: sólo lo directo, y lo viejo sin origen por las dudas; nada de Airbnb", async () => {
  const r = await handler({ queryStringParameters: { c: "c2" } });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(uids(r.body), ["D1", "V1"]);
});
await prueba("todas juntas (uso propio): también lo de Airbnb", async () => {
  const r = await handler({ queryStringParameters: {} });
  assert.deepEqual(uids(r.body).sort(), ["A1", "C1", "D1", "V1"]);
});
await prueba("el formato: CRLF, fechas de día entero, salida exclusiva, una fecha rota no entra", async () => {
  const b = (await handler({ queryStringParameters: { c: "c1" } })).body;
  assert.ok(b.endsWith("\r\n") && !/[^\r]\n/.test(b));
  assert.ok(b.includes("DTSTART;VALUE=DATE:20270103") && b.includes("DTEND;VALUE=DATE:20270109"));
  assert.deepEqual(uids(b), ["C1"]);
  assert.ok(!/Natalia|airbnb/i.test(b.replace(/PRODID.*\r\n/, "")));
});

console.log(`\n  ${pasadas} pasadas, ${fallidas} fallidas\n`);
process.exit(fallidas ? 1 : 0);
