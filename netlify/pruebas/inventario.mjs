// Banco de interno/inventario-core.js — sin red ni npm:
//   node netlify/pruebas/inventario.mjs
// Lo que importa (26-nov-2026): el inventario rico se edita en una pantalla y la lista SIMPLE que leen el control
// de entrada y de salida y «La casa» se DERIVA de él (nadie la escribe a mano); lo viejo se lee igual.
import assert from "node:assert/strict";
import fs from "node:fs";
import { leerInventario, paraGuardar, simplificar, agrupar, ordenar, parsearLineas, faltantesDe, repetido,
  sugerirSeccion, seccionCanonica, sugeridosFaltantes, miniatura, resumen, SECCIONES, clave } from "../../interno/inventario-core.js";

let pasadas = 0, fallidas = 0;
const prueba = (n, f) => { try { f(); pasadas++; console.log("  ✓ " + n); } catch (e) { fallidas++; console.log("  ✗ " + n + "\n      " + e.message); } };
let k = 0; const id = () => "t" + (++k);

prueba("lo viejo se lee: la simple con categoría acomoda cada ítem en su sección", () => {
  const it = leerInventario({ inventarioBase: [{ item: "Platos", cantidad: 6, categoria: "cocina" }, { item: "Toallas", cantidad: 6, categoria: "Ropa blanca" }, { item: "Licuadora", cantidad: 1, categoria: "Electrodomésticos" }] }, id);
  assert.deepEqual(it.map((x) => [x.item, x.cantidad, x.seccion]), [["Platos", 6, "Cocina"], ["Toallas", 6, "Ropa blanca"], ["Licuadora", 1, "Electrodomésticos"]]);
});
prueba("lo viejo sin categoría se acomoda por su nombre; lo que no se reconoce va a «Otros»", () => {
  const it = leerInventario({ inventarioBase: [{ item: "Vasos", cantidad: 6 }, { item: "sabanas casal", cantidad: 1 }, "Ventilador", { item: "Cosa rara", cantidad: 2 }] }, id);
  assert.deepEqual(it.map((x) => x.seccion), ["Cocina", "Ropa blanca", "Electrodomésticos", "Otros"]);
  assert.equal(it[2].cantidad, 0);
});
prueba("si existe `inventario` (la rica), manda sobre `inventarioBase`", () => {
  const it = leerInventario({ inventario: [{ id: "a", item: "Copas", cantidad: 4, seccion: "Cocina", foto: "https://res.cloudinary.com/x/image/upload/v1/c.jpg" }], inventarioBase: [{ item: "Otra", cantidad: 1 }] }, id);
  assert.equal(it.length, 1); assert.equal(it[0].id, "a"); assert.ok(it[0].foto);
});
prueba("se descartan los ítems sin nombre, las cantidades locas y las fotos que no son https", () => {
  const it = leerInventario({ inventario: [{ id: "a", item: "  ", cantidad: 3 }, { id: "b", item: "Vasos", cantidad: "7,4", seccion: "Cocina", foto: "javascript:alert(1)" }, { id: "b", item: "Tazas", cantidad: -5, seccion: "Cocina" }] }, id);
  assert.equal(it.length, 2); assert.equal(it[0].cantidad, 7); assert.equal(it[0].foto, undefined);
  assert.equal(it[1].cantidad, 0); assert.notEqual(it[0].id, it[1].id);
});
prueba("la simple se DERIVA de la rica, con el formato que leen el control y «La casa» ({item, cantidad, categoria})", () => {
  const g = paraGuardar([{ id: "1", item: "Vasos", cantidad: 6, seccion: "Cocina", foto: "https://x/y.jpg" }, { id: "2", item: "Toallas", cantidad: 4, seccion: "Ropa blanca" }]);
  assert.deepEqual(g.inventarioBase, [{ item: "Vasos", cantidad: 6, categoria: "Cocina" }, { item: "Toallas", cantidad: 4, categoria: "Ropa blanca" }]);
  assert.equal(g.inventario[0].foto, "https://x/y.jpg");
  assert.ok(!("foto" in g.inventarioBase[0]) && !("id" in g.inventarioBase[0]));
});
prueba("el control lee la simple con su normalizarInv: item + cantidad, y los de cantidad 0 siguen estando", () => {
  const norm = new Function(fs.readFileSync(new URL("../../interno/actividades.html", import.meta.url), "utf8").match(/function normalizarInv\(inv\) \{[\s\S]*?\n\}/)[0] + "\nreturn normalizarInv;")();
  const s = simplificar([{ id: "1", item: "Vasos", cantidad: 6, seccion: "Cocina" }, { id: "2", item: "Ventilador", cantidad: 0, seccion: "Electrodomésticos" }]);
  assert.deepEqual(norm(s).map((x) => [x.item, x.cantidad]), [["Vasos", 6], ["Ventilador", 0]]);
});
prueba("el orden: las secciones conocidas en su orden, las propias después y alfabéticas; dentro, como se cargó", () => {
  const it = ordenar([{ id: "1", item: "b", seccion: "Quincho" }, { id: "2", item: "z", seccion: "Cocina" }, { id: "3", item: "a", seccion: "Cocina" }, { id: "4", item: "c", seccion: "Acolchados raros" }, { id: "5", item: "t", seccion: "Ropa blanca" }]);
  assert.deepEqual(it.map((x) => x.id), ["2", "3", "5", "4", "1"]);
  assert.deepEqual(agrupar(it).map((g) => g.seccion), ["Cocina", "Ropa blanca", "Acolchados raros", "Quincho"]);
});
prueba("agregar varios: cantidad al principio o al final, viñetas, líneas vacías", () => {
  const r = parsearLineas("6 platos hondos\n- 4x copas\n• Cuchillos x 3\nSartenes: 2\n\nTabla de cortar\n  12   vasos");
  assert.deepEqual(r.map((x) => [x.item, x.cantidad]), [["platos hondos", 6], ["copas", 4], ["Cuchillos", 3], ["Sartenes", 2], ["Tabla de cortar", 1], ["vasos", 12]]);
});
prueba("un nombre con número (sábanas 2p) no se parte", () => {
  assert.deepEqual(parsearLineas("Sábanas 2p").map((x) => [x.item, x.cantidad]), [["Sábanas 2p", 1]]);
});
prueba("copiar de otra cabaña: sólo lo que falta (mismo nombre y sección, sin mirar acentos ni mayúsculas), con id nuevo", () => {
  const origen = [{ id: "a", item: "Vasos", cantidad: 6, seccion: "Cocina" }, { id: "b", item: "Licuadora", cantidad: 1, seccion: "Electrodomésticos", foto: "https://x/l.jpg" }];
  const destino = [{ id: "z", item: "vasos", cantidad: 2, seccion: "cocina" }];
  const f = faltantesDe(origen, destino.map((x) => ({ ...x, seccion: seccionCanonica(x.seccion) })), id);
  assert.deepEqual(f.map((x) => x.item), ["Licuadora"]); assert.notEqual(f[0].id, "b"); assert.equal(f[0].foto, "https://x/l.jpg");
});
prueba("repetido avisa sin impedir, y no se cuenta a sí mismo", () => {
  const it = [{ id: "1", item: "Vasos", cantidad: 1, seccion: "Cocina" }];
  assert.ok(repetido(it, "vásos", "Cocina", "2")); assert.equal(repetido(it, "Vasos", "Cocina", "1"), null); assert.equal(repetido(it, "Vasos", "Baño", "2"), null);
});
prueba("las secciones conocidas tienen ícono y sugeridos; las variantes escritas a mano se reconocen", () => {
  assert.ok(SECCIONES.every((s) => s.id && s.icono && Array.isArray(s.sugeridos)));
  assert.equal(seccionCanonica("  ELECTRODOMESTICOS "), "Electrodomésticos"); assert.equal(seccionCanonica("bano"), "Baño"); assert.equal(seccionCanonica("Quincho"), "Quincho"); assert.equal(seccionCanonica(""), "");
});
prueba("los sugeridos no repiten lo que ya está cargado", () => {
  const s = sugeridosFaltantes([{ id: "1", item: "Vasos", cantidad: 1, seccion: "Cocina" }], "Cocina", 50);
  assert.ok(!s.some((x) => clave(x) === "vasos") && s.includes("Copas"));
  assert.deepEqual(sugeridosFaltantes([], "Otros"), []);
});
prueba("las pistas de sección", () => {
  assert.equal(sugerirSeccion("Sartén grande"), "Cocina"); assert.equal(sugerirSeccion("Funda de almohada"), "Ropa blanca"); assert.equal(sugerirSeccion("Pava eléctrica"), "Electrodomésticos");
  assert.equal(sugerirSeccion("Escoba"), "Limpieza"); assert.equal(sugerirSeccion(""), "Otros");
});
prueba("la miniatura reemplaza la entrega por una chica y deja intactas las fotos de afuera", () => {
  assert.equal(miniatura("https://res.cloudinary.com/dnwfu8ffn/image/upload/f_auto,q_auto,w_2000/inventario/a.jpg"), "https://res.cloudinary.com/dnwfu8ffn/image/upload/f_auto,q_auto,w_160,h_160,c_fill/inventario/a.jpg");
  assert.equal(miniatura("https://res.cloudinary.com/dnwfu8ffn/image/upload/v123/inventario/a.jpg"), "https://res.cloudinary.com/dnwfu8ffn/image/upload/f_auto,q_auto,w_160,h_160,c_fill/v123/inventario/a.jpg");
  assert.equal(miniatura("https://otro.com/a.jpg"), "https://otro.com/a.jpg");
});
prueba("el resumen cuenta ítems, unidades y secciones", () => {
  assert.deepEqual(resumen([{ item: "a", cantidad: 2, seccion: "Cocina" }, { item: "b", cantidad: 3, seccion: "Cocina" }, { item: "c", cantidad: 1, seccion: "Baño" }]), { items: 3, unidades: 6, secciones: 2 });
});
prueba("la pantalla está cableada: nav, caché, cabanas.html ya no edita el inventario y el control lleva a la pantalla", () => {
  const r = (f) => fs.readFileSync(new URL("../../interno/" + f, import.meta.url), "utf8");
  assert.match(r("nucleo.js"), /id: 'inventario'[^}]*href: '\.\/inventario\.html'[^}]*permiso: 'contenido'/);
  assert.match(r("sw.js"), /'\.\/inventario\.html'/); assert.match(r("sw.js"), /'\.\/inventario-core\.js'/);
  assert.doesNotMatch(r("cabanas.html"), /inventarioBase:\s*invTmp/);
  assert.match(r("actividades.html"), /inventario\.html\?c=/);
  const p = r("inventario.html");
  assert.match(p, /paraGuardar\(/); assert.match(p, /from '\.\/inventario-core\.js'/); assert.match(p, /CV2\.puede\('contenido'\)/);
  assert.match(p, /cv-pegado-abajo/); assert.doesNotMatch(p, /history\.back\(/);
});

console.log("\n" + pasadas + " pasan, " + fallidas + " fallan");
process.exit(fallidas ? 1 : 0);
