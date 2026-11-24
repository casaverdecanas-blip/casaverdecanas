// Banco de netlify/functions/cloudinary-listar.js — sin red ni npm:
//   node netlify/pruebas/cloudinary-listar.mjs
// Lo que importa (24-nov-2026): el listado de la solapa «Cloudinary» del editor no depende
// de una variable PÚBLICA (el nombre de la cuenta); los comprobantes de Dinero nunca viajan;
// y un fallo dice qué falta en vez de devolver una lista vacía.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const f = require("../functions/cloudinary-listar.js");

let pasadas = 0, fallidas = 0;
const prueba = async (n, fn) => { try { await fn(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };
const limpiar = () => { for (const k of ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_CLOUD", "CLOUDINARY_API_KEY", "CLOUDINARY_KEY", "CLOUDINARY_API_SECRET", "CLOUDINARY_SECRET", "CLOUDINARY_URL"]) delete process.env[k]; };

await prueba("sin el nombre de la cuenta pero con clave y secreto: usa la cuenta del sitio", async () => {
  limpiar(); process.env.CLOUDINARY_API_KEY = "k"; process.env.CLOUDINARY_API_SECRET = "s";
  const c = f._credenciales();
  assert.equal(c.cloud, "dnwfu8ffn"); assert.equal(c.key, "k"); assert.equal(c.secret, "s");
});
await prueba("una variable CLOUDINARY_CLOUD_NAME, si existe, manda", async () => {
  limpiar(); process.env.CLOUDINARY_CLOUD_NAME = "otra"; process.env.CLOUDINARY_API_KEY = "k"; process.env.CLOUDINARY_API_SECRET = "s";
  assert.equal(f._credenciales().cloud, "otra");
});
await prueba("CLOUDINARY_URL de una sola pieza también sirve", async () => {
  limpiar(); process.env.CLOUDINARY_URL = "cloudinary://123:abc@dnwfu8ffn";
  const c = f._credenciales();
  assert.deepEqual([c.cloud, c.key, c.secret], ["dnwfu8ffn", "123", "abc"]);
});
await prueba("sin clave ni secreto: 500 que dice cuál falta (y no pide el nombre de la cuenta)", async () => {
  limpiar();
  const r = await f.handler({ httpMethod: "GET", queryStringParameters: {} });
  assert.equal(r.statusCode, 500);
  const b = JSON.parse(r.body);
  assert.match(b.error, /CLOUDINARY_API_KEY/); assert.match(b.error, /CLOUDINARY_API_SECRET/);
  assert.doesNotMatch(b.error, /CLOUDINARY_CLOUD_NAME,|: CLOUDINARY_CLOUD_NAME/);
});
await prueba("la búsqueda pide asset_folder Y folder, con subcarpetas, y excluye 'gastos'", async () => {
  const e = f._expresion(["cabanas/cabana1"]);
  for (const x of ['asset_folder="cabanas/cabana1"', 'asset_folder="cabanas/cabana1/*"', 'folder="cabanas/cabana1"', 'folder="cabanas/cabana1/*"', '-asset_folder="gastos*"', '-folder="gastos*"'])
    assert.ok(e.includes(x), "falta " + x);
});
await prueba("de punta a punta: arma las URLs y la miniatura, y devuelve el cursor", async () => {
  limpiar(); process.env.CLOUDINARY_API_KEY = "k"; process.env.CLOUDINARY_API_SECRET = "s";
  let pedido = null;
  globalThis.fetch = async (url, op) => { pedido = { url, op }; return { ok: true, json: async () => ({ total_count: 2, next_cursor: "SIG", resources: [
    { public_id: "cabanas/cabana1/a", format: "jpg", resource_type: "image", type: "upload", asset_folder: "cabanas/cabana1", display_name: "a" },
    { public_id: "sitio/b", format: "png", resource_type: "image", type: "upload", folder: "sitio" } ] }) }; };
  const r = await f.handler({ httpMethod: "GET", queryStringParameters: { carpetas: "cabanas/cabana1" } });
  assert.equal(r.statusCode, 200);
  assert.ok(pedido.url.includes("/dnwfu8ffn/resources/search"));
  assert.ok(JSON.parse(pedido.op.body).expression.includes('asset_folder="cabanas/cabana1/*"'));
  const b = JSON.parse(r.body);
  assert.equal(b.fotos.length, 2); assert.equal(b.cursor, "SIG");
  assert.equal(b.fotos[0].url, "https://res.cloudinary.com/dnwfu8ffn/image/upload/f_auto,q_auto/cabanas/cabana1/a.jpg");
  assert.ok(b.fotos[0].mini.includes("w_300,h_300,c_fill"));
  assert.equal(b.fotos[1].carpeta, "sitio");
});
await prueba("si Cloudinary contesta con error, se lo dice a la persona", async () => {
  limpiar(); process.env.CLOUDINARY_API_KEY = "k"; process.env.CLOUDINARY_API_SECRET = "s";
  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ error: { message: "Invalid credentials" } }) });
  const r = await f.handler({ httpMethod: "GET", queryStringParameters: {} });
  assert.equal(r.statusCode, 401); assert.match(JSON.parse(r.body).error, /Invalid credentials/);
});

console.log("\n" + pasadas + " pasan, " + fallidas + " fallan");
process.exit(fallidas ? 1 : 0);
