// netlify/pruebas/hielo.mjs — Banco de hielo (servidores de conexión para las
// llamadas entre Pizarras), sin red ni npm.   node netlify/pruebas/hielo.mjs
// Lo que importa: STUN siempre; el TURN (que tiene clave) sólo si está
// configurado y sólo para quien tiene sesión y ficha activa.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { manejar, servidores, STUN } from "../functions/hielo.mjs";

let pasadas = 0, fallidas = 0;
const prueba = async (n, f) => { try { await f(); pasadas++; console.log("  ✓ " + n); }
  catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const cert = publicKey.export({ type: "spki", format: "pem" });
const AHORA = Date.parse("2026-10-24T18:00:00Z");
const b64u = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
function token(proyecto) {
  const t = Math.floor(AHORA / 1000);
  const c = b64u({ alg: "RS256", kid: "k1" }), b = b64u({ aud: proyecto, iss: "https://securetoken.google.com/" + proyecto,
    sub: "uid-1", iat: t - 10, exp: t + 3000, firebase: { sign_in_provider: "password" } });
  return c + "." + b + "." + crypto.createSign("RSA-SHA256").update(c + "." + b).sign(privateKey).toString("base64url");
}
const ENV = { TURN_URLS: "turn:turn.ejemplo:80, turns:turn.ejemplo:443?transport=tcp, http://no", TURN_USUARIO: "u", TURN_CLAVE: "c" };
// En Tiempos la ficha es estar en miembros/; en Casa Verde, usuarios/ con activo.
const deps = (ficha = true, env = ENV) => ({ ahora: AHORA, certificados: async () => ({ k1: cert }), env,
  fetch: async () => ficha ? { ok: true, json: async () => ({ fields: { activo: { booleanValue: ficha === true } } }) } : { ok: false, status: 404 } });
const ev = (base, tok, origin) => ({ httpMethod: "POST", headers: { ...(origin ? { Origin: origin } : {}), Authorization: "Bearer " + tok }, body: JSON.stringify({ base }) });

await prueba("sin TURN configurado: sólo STUN (gratis y sin límite)", () => {
  assert.deepEqual(servidores({}), [{ urls: STUN }]);
  assert.deepEqual(servidores({ TURN_URLS: "turn:x:80" }), [{ urls: STUN }]);   // sin usuario y clave, no
});
await prueba("con TURN: sus direcciones válidas, con usuario y clave", () => {
  const t = servidores(ENV)[1];
  assert.deepEqual(t.urls, ["turn:turn.ejemplo:80", "turns:turn.ejemplo:443?transport=tcp"]);
  assert.equal(t.username, "u"); assert.equal(t.credential, "c");
});
await prueba("la Pizarra con ficha activa los recibe; sin ficha, de otra base o de un sitio ajeno, no", async () => {
  const r = await manejar(ev("tiempos", token("tiempos-71d42")), deps());
  assert.equal(r.statusCode, 200);
  assert.equal(JSON.parse(r.body).iceServers.length, 2);
  assert.equal(r.headers["Cache-Control"], "no-store");
  assert.equal((await manejar(ev("tiempos", token("tiempos-71d42")), deps(false))).statusCode, 403);          // no es de miembros/
  assert.equal((await manejar(ev("casaverde", token("casaverde-20")), deps("pausada"))).statusCode, 403);    // ficha pausada
  assert.equal((await manejar(ev("tiempos", token("casaverde-20")), deps())).statusCode, 401);
  assert.equal((await manejar(ev("tiempos", token("tiempos-71d42"), "https://malicioso.example"), deps())).statusCode, 403);
  assert.equal((await manejar(ev("panel", token("datos-830f8")), deps())).statusCode, 400);
});

console.log(`\n  ${pasadas} pasadas, ${fallidas} fallidas\n`);
process.exit(fallidas ? 1 : 0);
