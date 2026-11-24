// Banco de los adjuntos de una tarea (interno/actividades-core.js, core-4) — sin red ni npm:
//   node netlify/pruebas/adjuntos.mjs
// Lo que importa (Mauro, 24-nov-2026: «una tarea compleja necesita un documento de
// respaldo que lea el propio chat… como si fuese también una foto»; «privados»):
//   · sólo entra lo que el chat y la gente pueden abrir (PDF, texto, imágenes) y con techo;
//   · la ficha de la tarea se depura: lo que no tiene la forma no se muestra ni se inyecta;
//   · la forma del documento es la de `firestore.mjs adjuntar` y la regla la exige igual;
//   · la regla es PRIVADA: sigue la visibilidad de la actividad y nadie edita un adjunto.
// Las funciones puras se sacan de actividades-core.js entre sus marcas (ese archivo
// importa Firebase y no se carga en node).
import assert from "node:assert/strict";
import fs from "node:fs";
const base = (r) => new URL(r, import.meta.url);
const fuente = fs.readFileSync(base("../../interno/actividades-core.js"), "utf8");
const ini = fuente.indexOf("// ═══ ADJUNTOS ═══"), fin = fuente.indexOf("// ═══ FIN ADJUNTOS ═══");
assert.ok(ini > 0 && fin > ini, "faltan las marcas ADJUNTOS en actividades-core.js");
const A = new Function(fuente.slice(ini, fin) +
  "\nreturn { ADJ_DOCS, ADJ_IMGS, ADJ_MAX, ADJ_MAX_POR_TAREA, nombreDeAdjunto, evaluarAdjunto, adjuntosDeTarea, tamanoLegible, fichaDeAdjunto };")();

let pasadas = 0, fallidas = 0;
const prueba = (n, f) => { try { f(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };

prueba("un PDF y un texto entran como documento; una foto como imagen", () => {
  assert.deepEqual(A.evaluarAdjunto("Diagnostico heladera.pdf", 120000), { ok: true, nombre: "Diagnostico heladera.pdf", tipo: "documento", mime: "application/pdf" });
  assert.equal(A.evaluarAdjunto("notas.MD", 500).tipo, "documento");
  assert.equal(A.evaluarAdjunto("foto.JPG", 500).tipo, "imagen");
});
prueba("lo que no se puede abrir no entra (ejecutables, comprimidos, sin extensión)", () => {
  for (const n of ["virus.exe", "todo.zip", "script.js", "sin-extension", "pagina.html", "doc.docx"])
    assert.equal(A.evaluarAdjunto(n, 100).ok, false, n);
});
prueba("el techo es el de firestore.mjs y el de la regla: 900000 bytes", () => {
  assert.equal(A.ADJ_MAX, 900000);
  assert.equal(A.evaluarAdjunto("a.pdf", 900000).ok, true);
  const r = A.evaluarAdjunto("a.pdf", 900001);
  assert.equal(r.ok, false); assert.match(r.motivo, /techo/);
  assert.equal(A.evaluarAdjunto("a.pdf", 0).ok, false, "vacío");
});
prueba("el nombre se limpia: sin ruta, sin caracteres de control ni < > \", y con tope", () => {
  assert.equal(A.nombreDeAdjunto("C:\\Users\\x\\informe.pdf"), "informe.pdf");
  assert.equal(A.nombreDeAdjunto("../../etc/passwd.txt"), "passwd.txt");
  assert.equal(A.nombreDeAdjunto('a<b>"c".txt'), "abc.txt");
  assert.equal(A.nombreDeAdjunto("x".repeat(300) + ".pdf").length, 120);
  assert.equal(A.evaluarAdjunto("   ", 10).ok, false);
});
prueba("la ficha se depura: id raro, tipo raro, url que no es https, o basura, no pasan", () => {
  const it = { adjuntos: [
    { id: "a-1", tipo: "documento", nombre: "ok.pdf", mime: "application/pdf", tam: 2048, por: "Mauro", en: "2026-11-24T10:00:00Z" },
    { id: "a-2", tipo: "imagen", nombre: "f.jpg", url: "https://res.cloudinary.com/x/f.jpg", en: "2026-11-24T09:00:00Z" },
    { id: "a-3", tipo: "imagen", nombre: "mala.jpg", url: "javascript:alert(1)", en: "2026-11-24T11:00:00Z" },
    { id: "'); alert(1);//", tipo: "documento", nombre: "inyeccion.pdf" },
    { id: "a-4", tipo: "ejecutable", nombre: "x.exe" },
    { id: "a-5", tipo: "documento" },
    null, "texto", 7,
  ] };
  const l = A.adjuntosDeTarea(it);
  assert.deepEqual(l.map((x) => x.id), ["a-2", "a-1", "a-3"], "orden por fecha; la inyección y lo malformado, afuera");
  assert.equal(l.find((x) => x.id === "a-3").url, "", "una url que no es https se descarta");
  assert.equal(l.find((x) => x.id === "a-2").url, "https://res.cloudinary.com/x/f.jpg");
});
prueba("una tarea sin adjuntos, o con algo que no es lista, da lista vacía", () => {
  assert.deepEqual(A.adjuntosDeTarea({}), []);
  assert.deepEqual(A.adjuntosDeTarea(undefined), []);
  assert.deepEqual(A.adjuntosDeTarea({ adjuntos: "x" }), []);
});
prueba("el tamaño se lee fácil", () => {
  assert.equal(A.tamanoLegible(0), ""); assert.equal(A.tamanoLegible(500), "500 B");
  assert.equal(A.tamanoLegible(2048), "2 KB"); assert.equal(A.tamanoLegible(1572864), "1.5 MB");
});
prueba("la ficha guardada: un documento no lleva url; una foto sí", () => {
  const ev = A.evaluarAdjunto("a.pdf", 10);
  const f = A.fichaDeAdjunto("a-9", ev, 10, "Mauro", "2026-11-24T10:00:00Z");
  assert.ok(!("url" in f)); assert.equal(f.tipo, "documento"); assert.equal(f.tam, 10);
  const g = A.fichaDeAdjunto("a-8", { nombre: "f.jpg", tipo: "imagen", mime: "image/jpeg" }, 0, "", "2026-11-24T10:00:00Z", "https://x/f.jpg");
  assert.equal(g.url, "https://x/f.jpg");
});
prueba("hay un tope de adjuntos por tarea, y el motor lo usa", () => {
  assert.equal(A.ADJ_MAX_POR_TAREA, 12);
  assert.ok(/length >= ADJ_MAX_POR_TAREA/.test(fuente), "agregarDocumento/agregarFoto tienen que mirar el tope");
});

// ── La regla: privada, con la forma del agente, sin ediciones ──────────────
const reglas = fs.readFileSync(base("../../interno/firestore.rules"), "utf8");
const bloque = (() => {
  const i = reglas.indexOf("match /actividades/{actId}/adjuntos/{aid}");
  assert.ok(i > 0, "falta el bloque de adjuntos en las reglas");
  const j = reglas.indexOf("// Sesiones:", i);
  return reglas.slice(i, j);
})();
prueba("la regla sigue la visibilidad de la actividad (alcance), no es abierta al equipo", () => {
  assert.match(bloque, /laActividad\(\)\.alcance == 'equipo'/);
  assert.match(bloque, /alcance == 'personal'[\s\S]*creadoPor == request\.auth\.uid/);
  assert.match(bloque, /alcance == 'asignados'[\s\S]*in laActividad\(\)\.get\('competencias', \[\]\)/);
  assert.doesNotMatch(bloque, /allow read: if activo\(\);/, "no puede ser lectura libre para todo activo");
});
prueba("la regla exige la forma de `firestore.mjs adjuntar` y el mismo techo", () => {
  for (const k of ["tipo", "mime", "nombre", "datos", "en", "por"]) assert.ok(bloque.includes(`'${k}'`), k);
  assert.match(bloque, /datos\.size\(\) <= 900000/);
  assert.match(bloque, /datos is bytes/);
  assert.match(bloque, /\.keys\(\)\.hasOnly\(/);
  assert.ok(bloque.includes(A.ADJ_MAX.toString()));
});
prueba("un adjunto no se edita; se borra sólo quien lo subió o el admin", () => {
  assert.match(bloque, /allow update: if false;/);
  assert.match(bloque, /allow delete: if esAdmin\(\) \|\| \(activo\(\)[\s\S]*resource\.data\.get\('uid', ''\) == request\.auth\.uid/);
});
prueba("el agente no queda como autor de otro uid: si `uid` viene, es el de quien escribe", () => {
  assert.match(bloque, /\('uid' in request\.resource\.data\) \|\| request\.resource\.data\.uid == request\.auth\.uid/);
});
prueba("el bloque está dentro de `match /databases` y no hay catch-all", () => {
  assert.doesNotMatch(reglas, /match \/\{document=\*\*\}[\s\S]{0,80}allow [^;]*: if true/);
});

console.log(`\n${pasadas} pasaron, ${fallidas} fallaron`);
process.exit(fallidas ? 1 : 0);
