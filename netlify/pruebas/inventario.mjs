// Banco de interno/inventario-core.js — sin red ni npm:
//   node netlify/pruebas/inventario.mjs
// Lo que importa (26-nov-2026): el inventario rico (con estado y mantenimiento, de cabañas y de espacios comunes) se edita en una pantalla y la lista SIMPLE que leen el control
// de entrada y de salida y «La casa» se DERIVA de él (nadie la escribe a mano); lo viejo se lee igual.
import assert from "node:assert/strict";
import fs from "node:fs";
import { leerInventario, paraGuardar, simplificar, agrupar, ordenar, parsearLineas, faltantesDe, repetido,
  sugerirSeccion, seccionCanonica, sugeridosFaltantes, miniatura, resumen, SECCIONES, clave, ESTADOS, pendientes,
  necesitaAtencion, filtrar, anotarMantenimiento, resolverMantenimiento, claveLugar, paraRepararEn } from "../../interno/inventario-core.js";

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
prueba("si existe `items` (el documento de inventarios/) o `inventario`, manda sobre `inventarioBase`", () => {
  const it = leerInventario({ inventario: [{ id: "a", item: "Copas", cantidad: 4, seccion: "Cocina", foto: "https://res.cloudinary.com/x/image/upload/v1/c.jpg" }], inventarioBase: [{ item: "Otra", cantidad: 1 }] }, id);
  assert.equal(it.length, 1); assert.equal(it[0].id, "a"); assert.ok(it[0].foto);
  const d = leerInventario({ items: [{ id: "q", item: "Pinza", cantidad: 2, seccion: "Parrilla y quincho" }], inventarioBase: [{ item: "Otra", cantidad: 1 }] }, id);
  assert.deepEqual(d.map((x) => x.id), ["q"]);
  assert.deepEqual(leerInventario({ items: [], inventarioBase: [{ item: "Vasos", cantidad: 1 }] }, id), [], "un lugar vaciado a propósito no resucita lo viejo");
});
prueba("se descartan los ítems sin nombre, las cantidades locas y las fotos que no son https", () => {
  const it = leerInventario({ inventario: [{ id: "a", item: "  ", cantidad: 3 }, { id: "b", item: "Vasos", cantidad: "7,4", seccion: "Cocina", foto: "javascript:alert(1)" }, { id: "b", item: "Tazas", cantidad: -5, seccion: "Cocina" }] }, id);
  assert.equal(it.length, 2); assert.equal(it[0].cantidad, 7); assert.equal(it[0].foto, undefined);
  assert.equal(it[1].cantidad, 0); assert.notEqual(it[0].id, it[1].id);
});
prueba("la simple se DERIVA de la rica, con el formato que leen el control y «La casa» ({item, cantidad, categoria})", () => {
  const g = paraGuardar([{ id: "1", item: "Vasos", cantidad: 6, seccion: "Cocina", foto: "https://x/y.jpg" }, { id: "2", item: "Toallas", cantidad: 4, seccion: "Ropa blanca" }]);
  assert.deepEqual(g.inventarioBase, [{ item: "Vasos", cantidad: 6, categoria: "Cocina" }, { item: "Toallas", cantidad: 4, categoria: "Ropa blanca" }]);
  assert.equal(g.items[0].foto, "https://x/y.jpg");
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
  assert.equal(seccionCanonica("  ELECTRODOMESTICOS "), "Electrodomésticos"); assert.equal(seccionCanonica("bano"), "Baño"); assert.equal(seccionCanonica("Quincho"), "Parrilla y quincho"); assert.equal(seccionCanonica("Mi sección"), "Mi sección"); assert.equal(seccionCanonica(""), "");
});
prueba("los sugeridos no repiten lo que ya está cargado", () => {
  const s = sugeridosFaltantes([{ id: "1", item: "Vasos", cantidad: 1, seccion: "Cocina" }], "Cocina", 50);
  assert.ok(!s.some((x) => clave(x) === "vasos") && s.includes("Copas"));
  assert.deepEqual(sugeridosFaltantes([], "Otros"), []);
});
prueba("las pistas de sección", () => {
  assert.equal(sugerirSeccion("Sartén grande"), "Cocina"); assert.equal(sugerirSeccion("Funda de almohada"), "Ropa blanca"); assert.equal(sugerirSeccion("Pava eléctrica"), "Electrodomésticos");
  assert.equal(sugerirSeccion("Escoba"), "Limpieza"); assert.equal(sugerirSeccion(""), "Otros");
  assert.equal(sugerirSeccion("Pinza de asado"), "Parrilla y quincho"); assert.equal(sugerirSeccion("Kayak doble"), "Recreación");
  assert.equal(sugerirSeccion("Mesa de jardín"), "Exterior"); assert.equal(sugerirSeccion("Juego de mesa"), "Living y comedor");
});
prueba("la miniatura reemplaza la entrega por una chica y deja intactas las fotos de afuera", () => {
  assert.equal(miniatura("https://res.cloudinary.com/dnwfu8ffn/image/upload/f_auto,q_auto,w_2000/inventario/a.jpg"), "https://res.cloudinary.com/dnwfu8ffn/image/upload/f_auto,q_auto,w_160,h_160,c_fill/inventario/a.jpg");
  assert.equal(miniatura("https://res.cloudinary.com/dnwfu8ffn/image/upload/v123/inventario/a.jpg"), "https://res.cloudinary.com/dnwfu8ffn/image/upload/f_auto,q_auto,w_160,h_160,c_fill/v123/inventario/a.jpg");
  assert.equal(miniatura("https://otro.com/a.jpg"), "https://otro.com/a.jpg");
});
prueba("el resumen cuenta ítems, unidades y secciones", () => {
  assert.deepEqual(resumen([{ item: "a", cantidad: 2, seccion: "Cocina" }, { item: "b", cantidad: 3, seccion: "Cocina" }, { item: "c", cantidad: 1, seccion: "Baño" }]), { items: 3, unidades: 6, secciones: 2, reparar: 0, desgaste: 0, baja: 0 });
});
prueba("estado, descripción y mantenimiento se leen, se limpian y se guardan", () => {
  const it = leerInventario({ items: [{ id: "a", item: "Parrilla", cantidad: 1, seccion: "Parrilla y quincho", descripcion: "  Hierro, 80 cm  ", estado: "reparar", revisado: "2026-11-20",
    mantenimiento: [{ id: "m1", fecha: "2026-11-20", texto: "Soldar la pata", hecho: false }, { id: "m2", fecha: "x", texto: "  ", hecho: true }, { texto: "Pintar", hecho: true, hechoEn: "2026-11-01" }] },
    { id: "b", item: "Kayak", cantidad: 2, estado: "roto-raro" }] }, id);
  assert.equal(it[0].descripcion, "Hierro, 80 cm"); assert.equal(it[0].estado, "reparar"); assert.equal(it[0].revisado, "2026-11-20");
  assert.equal(it[0].mantenimiento.length, 2); assert.equal(it[0].mantenimiento[1].hechoEn, "2026-11-01"); assert.ok(it[0].mantenimiento[1].id);
  assert.equal(it[1].estado, "bien", "un estado desconocido es «bien»"); assert.ok(!("mantenimiento" in it[1]) && !("descripcion" in it[1]));
  assert.deepEqual(paraGuardar(it).items[0].mantenimiento.map((m) => m.texto), ["Soldar la pata", "Pintar"]);
  assert.deepEqual(ESTADOS.map((e) => e.id), ["bien", "desgaste", "reparar", "baja"]);
});
prueba("lo dado de baja no va a la lista que ve el control ni el huésped; el resto, sí", () => {
  const g = paraGuardar([{ id: "1", item: "Kayak", cantidad: 1, seccion: "Recreación", estado: "baja" }, { id: "2", item: "Remo", cantidad: 2, seccion: "Recreación", estado: "reparar" }]);
  assert.deepEqual(g.inventarioBase, [{ item: "Remo", cantidad: 2, categoria: "Recreación" }]);
  assert.equal(g.items.length, 2, "pero en la rica sigue estando");
});
prueba("anotar una reparación pasa el ítem a «Hay que repararlo»; resolver todo lo devuelve a «Bien»", () => {
  let x = { id: "1", item: "Parrilla", cantidad: 1, seccion: "Parrilla y quincho", estado: "bien" };
  x = anotarMantenimiento(x, "Soldar la pata", "2026-11-26", id);
  assert.equal(x.estado, "reparar"); assert.equal(pendientes(x), 1); assert.ok(necesitaAtencion(x));
  x = anotarMantenimiento(x, "Cambiar la rejilla", "2026-11-26", id);
  const [m1, m2] = x.mantenimiento;
  x = resolverMantenimiento(x, m1.id, true, "2026-11-27");
  assert.equal(x.estado, "reparar", "todavía queda una"); assert.equal(x.mantenimiento[0].hechoEn, "2026-11-27");
  x = resolverMantenimiento(x, m2.id, true, "2026-11-28");
  assert.equal(x.estado, "bien"); assert.equal(pendientes(x), 0); assert.ok(!necesitaAtencion(x));
  x = resolverMantenimiento(x, m2.id, false, "");
  assert.equal(pendientes(x), 1); assert.ok(!("hechoEn" in x.mantenimiento[1]));
  const baja = anotarMantenimiento({ id: "2", item: "k", cantidad: 1, seccion: "Otros", estado: "baja" }, "algo", "2026-11-26", id);
  assert.equal(baja.estado, "baja"); assert.equal(anotarMantenimiento(x, "   ", "2026-11-26", id), x);
});
prueba("filtrar y resumir por estado; buscar también en la descripción; juntar lo que hay que reparar de varios lugares", () => {
  const a = [{ id: "1", item: "Parrilla", cantidad: 1, seccion: "Parrilla y quincho", estado: "reparar", descripcion: "de hierro" },
    { id: "2", item: "Pinza", cantidad: 2, seccion: "Parrilla y quincho", estado: "desgaste" },
    { id: "3", item: "Olla", cantidad: 1, seccion: "Cocina", estado: "bien", mantenimiento: [{ id: "m", fecha: "", texto: "Cambiar la manija", hecho: false }] },
    { id: "4", item: "Kayak", cantidad: 1, seccion: "Recreación", estado: "baja" }];
  assert.deepEqual(filtrar(a, "reparar", "").map((x) => x.id), ["1", "3"]);
  assert.deepEqual(filtrar(a, "desgaste", "").map((x) => x.id), ["2"]); assert.deepEqual(filtrar(a, "baja", "").map((x) => x.id), ["4"]);
  assert.deepEqual(filtrar(a, "todo", "HIERRO").map((x) => x.id), ["1"]);
  const r = resumen(a); assert.equal(r.reparar, 2); assert.equal(r.desgaste, 1); assert.equal(r.baja, 1);
  assert.deepEqual(paraRepararEn([{ nombre: "Piscina", items: a }, { nombre: "Vacío", items: [] }]).map((p) => p.item.id), ["1", "3"]);
  assert.equal(claveLugar("cabana", "c1"), "cabana-c1"); assert.equal(claveLugar("espacio", "piscina"), "espacio-piscina");
});
prueba("la pantalla está cableada: nav, caché, cabanas.html ya no edita el inventario y el control lleva a la pantalla", () => {
  const r = (f) => fs.readFileSync(new URL("../../interno/" + f, import.meta.url), "utf8");
  assert.match(r("nucleo.js"), /id: 'inventario'[^}]*href: '\.\/inventario\.html'[^}]*permiso: 'contenido'/);
  assert.match(r("sw.js"), /'\.\/inventario\.html'/); assert.match(r("sw.js"), /'\.\/inventario-core\.js'/);
  assert.doesNotMatch(r("cabanas.html"), /inventarioBase:\s*invTmp/);
  assert.match(r("actividades.html"), /inventario\.html\?c=/);
  const p = r("inventario.html");
  assert.match(p, /paraGuardar\(/); assert.match(p, /'inventarios'/); assert.match(p, /'espacios_comunes'/); assert.match(p, /writeBatch/);
  const reglas = r("firestore.rules");
  assert.match(reglas, /match \/inventarios\/\{id\} \{\s*allow read, write: if tiene\('contenido'\);/); assert.match(p, /from '\.\/inventario-core\.js'/); assert.match(p, /CV2\.puede\('contenido'\)/);
  assert.match(p, /cv-pegado-abajo/); assert.doesNotMatch(p, /history\.back\(/);
});

console.log("\n" + pasadas + " pasan, " + fallidas + " fallan");
process.exit(fallidas ? 1 : 0);
