// netlify/pruebas/despertar.mjs — Banco de despertar, sin red ni npm.
//   node netlify/pruebas/despertar.mjs
// Lo que importa: sólo despierta quien tiene sesión y ficha activa en ESA base,
// el aviso no lleva contenido, la Pizarra (sin Origin) puede llamar y un
// navegador ajeno no, y la cuenta de servicio firma bien su JWT.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { manejar, mensajeFCM, jwtDeCuenta, temaDe, QUE, BASES_PIZARRA, olvidarAcceso } from "../functions/despertar.mjs";

let pasadas = 0, fallidas = 0;
const prueba = async (n, f) => { try { await f(); pasadas++; console.log("  ✓ " + n); }
  catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const cert = publicKey.export({ type: "spki", format: "pem" });
const cuenta = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const FCM_CUENTA = JSON.stringify({ client_email: "despertar-pizarras@avisos-23b6a.iam.gserviceaccount.com",
  private_key: cuenta.privateKey.export({ type: "pkcs8", format: "pem" }) });
const b64u = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
let AHORA = Date.parse("2026-10-24T18:00:00Z");
function token(proyecto, extra = {}) {
  const t = Math.floor(AHORA / 1000);
  const c = b64u({ alg: "RS256", kid: "k1" }), b = b64u({ aud: proyecto, iss: "https://securetoken.google.com/" + proyecto,
    sub: "uid-" + Math.random().toString(36).slice(2, 8), iat: t - 10, exp: t + 3000, firebase: { sign_in_provider: "password" }, ...extra });
  return c + "." + b + "." + crypto.createSign("RSA-SHA256").update(c + "." + b).sign(privateKey).toString("base64url");
}
let llamadas;
const deps = (ficha = { activo: { booleanValue: true }, nombre: { stringValue: "Florencia" } }, env = { FCM_CUENTA }) => ({
  ahora: AHORA, certificados: async () => ({ k1: cert }), env,
  fetch: async (url, op) => {
    llamadas.push({ url, op });
    if (url.includes("firestore.googleapis.com")) return ficha ? { ok: true, json: async () => ({ fields: ficha }) } : { ok: false, status: 404 };
    if (url.includes("oauth2.googleapis.com")) return { ok: true, json: async () => ({ access_token: "acc-de-mentira", expires_in: 3600 }) };
    return { ok: true, status: 200, text: async () => "" };
  },
});
const ev = (base, que, tok, origin) => ({ httpMethod: "POST",
  headers: { ...(origin ? { Origin: origin } : {}), Authorization: "Bearer " + tok }, body: JSON.stringify({ base, que }) });
const avisos = () => llamadas.filter((l) => l.url.startsWith("https://fcm.googleapis.com/"));

await prueba("la Pizarra (sin Origin) con ficha activa despierta al tema de su base, sin contenido", async () => {
  llamadas = []; olvidarAcceso();
  const r = await manejar(ev("tiempos", "mensajes", token("tiempos-71d42")), deps({ nombre: { stringValue: "Mauro" } }));
  assert.equal(r.statusCode, 200);
  assert.equal(avisos().length, 1);
  assert.equal(avisos()[0].url, "https://fcm.googleapis.com/v1/projects/avisos-23b6a/messages:send");
  assert.equal(avisos()[0].op.headers.Authorization, "Bearer acc-de-mentira");
  const m = JSON.parse(avisos()[0].op.body).message;
  assert.equal(m.topic, "pizarra-tiempos");
  assert.deepEqual(Object.keys(m.data).sort(), ["base", "de", "que"]);
  assert.equal(m.android.priority, "HIGH");
});
await prueba("un sitio de la lista (con Origin) también; uno ajeno, no", async () => {
  llamadas = [];
  assert.equal((await manejar(ev("casaverde", "reservas", token("casaverde-20"), "https://casaverdecanas.com.br"), deps())).statusCode, 200);
  assert.equal((await manejar(ev("casaverde", "reservas", token("casaverde-20"), "https://malicioso.example"), deps())).statusCode, 403);
});
await prueba("sin ficha activa, con token de otra base o sesión anónima: no despierta a nadie", async () => {
  llamadas = [];
  assert.equal((await manejar(ev("casaverde", "tareas", token("casaverde-20")), deps({ activo: { booleanValue: false } }))).statusCode, 403);
  assert.equal((await manejar(ev("casaverde", "tareas", token("tiempos-71d42")), deps())).statusCode, 401);
  assert.equal((await manejar(ev("casaverde", "tareas", token("casaverde-20", { firebase: { sign_in_provider: "anonymous" } })), deps())).statusCode, 401);
  assert.equal(avisos().length, 0);
});
await prueba("base o «qué» desconocidos, o el panel: no", async () => {
  llamadas = [];
  assert.equal((await manejar(ev("otra", "tareas", token("x")), deps())).statusCode, 400);
  assert.equal((await manejar(ev("tiempos", "<script>", token("tiempos-71d42")), deps())).statusCode, 400);
  assert.equal((await manejar(ev("panel", "tareas", token("datos-830f8")), deps())).statusCode, 400);
  assert.ok(!BASES_PIZARRA.includes("panel"));
});
await prueba("dos guardados seguidos de lo mismo despiertan una vez; a los 5 s, otra", async () => {
  llamadas = [];
  const t = token("tiempos-71d42");
  assert.equal((await manejar(ev("tiempos", "agenda", t), deps({}))).statusCode, 200);
  assert.equal((await manejar(ev("tiempos", "agenda", t), deps({}))).statusCode, 202);
  AHORA += 6000;
  assert.equal((await manejar(ev("tiempos", "agenda", t), deps({}))).statusCode, 200);
  assert.equal(avisos().length, 2);
});
await prueba("sin FCM_CUENTA en Netlify lo dice (503) y no rompe", async () => {
  llamadas = []; olvidarAcceso();
  assert.equal((await manejar(ev("tiempos", "tareas", token("tiempos-71d42")), deps({}, {}))).statusCode, 503);
});
await prueba("el JWT de la cuenta de servicio está bien firmado y pide sólo el permiso de mensajería", async () => {
  const j = jwtDeCuenta(JSON.parse(FCM_CUENTA), AHORA).split(".");
  assert.ok(crypto.createVerify("RSA-SHA256").update(j[0] + "." + j[1]).verify(cuenta.publicKey, Buffer.from(j[2], "base64url")));
  const c = JSON.parse(Buffer.from(j[1], "base64url").toString());
  assert.equal(c.scope, "https://www.googleapis.com/auth/firebase.messaging");
  assert.equal(c.aud, "https://oauth2.googleapis.com/token");
  assert.equal(c.exp - c.iat, 3600);
});
await prueba("el aviso nunca lleva otra cosa que qué, base y quién", () => {
  for (const q of QUE) assert.deepEqual(Object.keys(mensajeFCM("tiempos", q, "u").message.data).sort(), ["base", "de", "que"]);
  assert.equal(temaDe("casaverde"), "pizarra-casaverde");
});

console.log(`\n  ${pasadas} pasadas, ${fallidas} fallidas\n`);
process.exit(fallidas ? 1 : 0);
