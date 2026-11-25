// ════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — inventario-core.js
//  Lo que sabe la pantalla «Inventario» (inventario.html), sin Firebase ni
//  DOM: así lo prueba `node netlify/pruebas/inventario.mjs`.
//  Sello: inventario-1 (26-nov-2026)
//
//  Mauro, 26-nov-2026: «una pestaña dentro de casaverde para la gestión del
//  inventario de cada cabaña… ítems que se pueden agregar, modificar o eliminar,
//  cargar la foto, cantidad, en qué sección (cocina, electrodomésticos…). Esa
//  información se guarda en la base y se simplifica luego para el control».
//
//  DOS FORMAS, UNA FUENTE (cabanas/{id}):
//    · `inventario`      la RICA, la que edita esta pantalla:
//                        [{ id, item, cantidad, seccion, foto? }]
//    · `inventarioBase`  la SIMPLE, la que ya leen el control de entrada y de
//                        salida (actividades.html) y «La casa» del huésped:
//                        [{ item, cantidad, categoria }]
//  La simple SE DERIVA de la rica en cada guardado (`paraGuardar`): nadie la
//  escribe a mano, y por eso no se pueden desincronizar. Una cabaña que sólo
//  tiene la simple (todas, hasta hoy) se lee igual: sus ítems se acomodan en
//  secciones por lo que dice su categoría o, si no dice, por su nombre.
// ════════════════════════════════════════════════════════════

export const SELLO_INVENTARIO = 'inventario-1';

// Las secciones, en el orden en que se muestran. Las que una cabaña suma por su
// cuenta («Quincho», «Cuarto de juegos»…) van después, por orden alfabético.
export const SECCIONES = [
  { id: 'Cocina', icono: 'restaurant', sugeridos: [
    'Platos llanos', 'Platos hondos', 'Platos de postre', 'Vasos', 'Copas', 'Tazas', 'Cubiertos (juegos)',
    'Cuchillos', 'Ollas', 'Sartenes', 'Fuentes', 'Tabla de cortar', 'Colador', 'Escurridor', 'Abrelatas',
    'Sacacorchos', 'Jarra', 'Repasadores'] },
  { id: 'Electrodomésticos', icono: 'kitchen', sugeridos: [
    'Heladera', 'Cocina / hornalla', 'Microondas', 'Licuadora', 'Pava eléctrica', 'Cafetera', 'Tostadora',
    'Ventilador', 'Aire acondicionado', 'Secador de pelo', 'Plancha', 'Televisor', 'Lavarropas'] },
  { id: 'Ropa blanca', icono: 'bed', sugeridos: [
    'Sábanas 1 plaza', 'Sábanas 2 plazas', 'Fundas de almohada', 'Almohadas', 'Toallas de baño', 'Toallas de mano',
    'Toalla de piso', 'Acolchado', 'Frazadas', 'Cubrecama', 'Mantas'] },
  { id: 'Dormitorio', icono: 'single_bed', sugeridos: [
    'Colchón', 'Almohadas', 'Perchas', 'Mesa de luz', 'Velador', 'Cortinas', 'Mosquitero'] },
  { id: 'Baño', icono: 'bathtub', sugeridos: [
    'Cortina de baño', 'Tapete de baño', 'Cesto de basura', 'Secador de pelo', 'Espejo', 'Alfombra'] },
  { id: 'Living y comedor', icono: 'weekend', sugeridos: [
    'Sillas', 'Mesa', 'Sillón', 'Almohadones', 'Mantel', 'Ventilador', 'Televisor', 'Juegos de mesa'] },
  { id: 'Exterior', icono: 'deck', sugeridos: [
    'Reposeras', 'Mesa de jardín', 'Sillas de jardín', 'Parrilla', 'Utensilios de parrilla', 'Sombrilla', 'Hamaca'] },
  { id: 'Limpieza', icono: 'cleaning_services', sugeridos: [
    'Escoba', 'Pala', 'Trapeador', 'Balde', 'Secador de piso', 'Aspiradora', 'Plumero'] },
  { id: 'Otros', icono: 'category', sugeridos: [] },
];

/** Para comparar nombres: sin acentos, sin mayúsculas, sin espacios de más. */
export const clave = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/\s+/g, ' ').trim();

const POR_CLAVE = new Map(SECCIONES.map((s) => [clave(s.id), s.id]));
// Variantes que la gente escribe y son la misma sección.
for (const [v, id] of [['electrodomesticos', 'Electrodomésticos'], ['ropa de cama', 'Ropa blanca'], ['blancos', 'Ropa blanca'],
  ['bano', 'Baño'], ['banos', 'Baño'], ['living', 'Living y comedor'], ['comedor', 'Living y comedor'], ['sala', 'Living y comedor'],
  ['jardin', 'Exterior'], ['patio', 'Exterior'], ['varios', 'Otros'], ['otro', 'Otros'], ['cuarto', 'Dormitorio'],
  ['habitacion', 'Dormitorio'], ['dormitorios', 'Dormitorio']]) POR_CLAVE.set(v, id);

/** El nombre canónico de una sección escrita a mano («cocina» → «Cocina»); lo desconocido se respeta. */
export function seccionCanonica(nombre) {
  const t = String(nombre == null ? '' : nombre).replace(/\s+/g, ' ').trim().slice(0, 40);
  if (!t) return '';
  return POR_CLAVE.get(clave(t)) || t;
}

export const iconoDe = (sec) => (SECCIONES.find((s) => s.id === sec) || {}).icono || 'label';

// Palabras que delatan la sección de un ítem, para acomodar lo viejo y para sugerir al escribir.
const PISTAS = [
  ['Electrodomésticos', /ventilador|licuadora|pava|cafetera|tostadora|microondas|heladera|freezer|plancha|secador de pelo|televisor|\btv\b|aire acond|lavarropas|batidora|minipimer|multiprocesadora|hornalla|anafe|cocina el|horno el|aspiradora/],
  ['Ropa blanca', /s[aá]bana|toalla|almohada|funda|acolchado|frazada|manta|cobija|cubrecama|colcha|edred[oó]n|cobertor|sabana/],
  ['Limpieza', /escoba|pala\b|trapeador|trapo|balde|secador de piso|plumero|lampazo|cepillo|detergente|lavandina/],
  ['Cocina', /plato|vaso|copa|taza|cubierto|cuchillo|cuchara|tenedor|olla|sart[eé]n|fuente|tabla de cortar|colador|escurridor|abrelatas|sacacorchos|jarra|repasador|pocillo|bowl|ensaladera|cacerola|pava\b|termo|mate|bandeja|rallador|espumadera|cucharon|cucharón|asadera|cafetera de/],
  ['Baño', /cortina de ba[nñ]o|tapete|cesto|jab[oó]n|papel higi|espejo/],
  ['Exterior', /reposera|parrilla|sombrilla|hamaca|jard[ií]n|silla de jard|mesa de jard|carbón|carbon/],
  ['Living y comedor', /sill[aó]n|silla|mesa\b|almohad[oó]n|mantel|juego de mesa|sof[aá]/],
  ['Dormitorio', /colch[oó]n|perchas|mesa de luz|velador|cortina|mosquitero|placard/],
];
/** La sección que mejor le va a un nombre; «Otros» si ninguna pista alcanza. */
export function sugerirSeccion(nombre) {
  const k = clave(nombre);
  if (!k) return 'Otros';
  for (const [sec, re] of PISTAS) if (re.test(k)) return sec;
  return 'Otros';
}

export const idNuevo = () => 'i' + Math.random().toString(36).slice(2, 9);
const entero = (v, tope = 9999) => { const n = Math.round(Number(String(v == null ? '' : v).replace(',', '.'))); return Number.isFinite(n) ? Math.max(0, Math.min(tope, n)) : 0; };

/**
 * Los ítems de una cabaña, en la forma rica. Lee `inventario` si existe; si no, la
 * simple vieja (`inventarioBase`: strings, o {item, cantidad, categoria}).
 */
export function leerInventario(cabana, nuevoId = idNuevo) {
  const c = cabana || {};
  const fuente = Array.isArray(c.inventario) ? c.inventario : (Array.isArray(c.inventarioBase) ? c.inventarioBase : []);
  const usados = new Set(), out = [];
  for (let x of fuente) {
    if (typeof x === 'string') x = { item: x };
    if (!x || typeof x !== 'object') continue;
    const item = String(x.item != null ? x.item : (x.nombre != null ? x.nombre : '')).replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!item) continue;
    const sec = seccionCanonica(x.seccion != null ? x.seccion : x.categoria);
    let id = String(x.id || '');
    if (!id || usados.has(id)) id = nuevoId();
    usados.add(id);
    const foto = typeof x.foto === 'string' && /^https:\/\//.test(x.foto) ? x.foto : '';
    out.push({ id, item, cantidad: entero(x.cantidad != null ? x.cantidad : x.cantidadBase), seccion: sec || sugerirSeccion(item), ...(foto ? { foto } : {}) });
  }
  return out;
}

const posSeccion = (sec) => { const i = SECCIONES.findIndex((s) => s.id === sec); return i === -1 ? SECCIONES.length : i; };

/** Las secciones en su orden (las propias, después, alfabéticas); dentro de cada una, el orden en que se cargó. */
export function ordenar(items) {
  return items.map((x, i) => [x, i]).sort((a, b) => (posSeccion(a[0].seccion) - posSeccion(b[0].seccion))
    || (posSeccion(a[0].seccion) === SECCIONES.length ? clave(a[0].seccion).localeCompare(clave(b[0].seccion)) : 0)
    || (a[1] - b[1])).map((p) => p[0]);
}

/** [{ seccion, icono, items }] en orden, sólo las secciones que tienen algo. */
export function agrupar(items) {
  const out = [];
  for (const x of ordenar(items)) {
    let g = out[out.length - 1];
    if (!g || g.seccion !== x.seccion) { g = { seccion: x.seccion, icono: iconoDe(x.seccion), items: [] }; out.push(g); }
    g.items.push(x);
  }
  return out;
}

/** La lista SIMPLE que leen el control y «La casa»: sin fotos ni ids, con la sección como categoría. */
export function simplificar(items) {
  return ordenar(items).filter((x) => x.item).map((x) => ({ item: x.item, cantidad: entero(x.cantidad), categoria: x.seccion || 'Otros' }));
}

/** Lo que se escribe en cabanas/{id}: la rica y, DERIVADA de ella, la simple. */
export function paraGuardar(items) {
  const limpios = ordenar(items).filter((x) => x.item).map((x) => ({
    id: x.id, item: x.item, cantidad: entero(x.cantidad), seccion: x.seccion || 'Otros', ...(x.foto ? { foto: x.foto } : {}) }));
  return { inventario: limpios, inventarioBase: simplificar(limpios) };
}

export function resumen(items) {
  return { items: items.length, unidades: items.reduce((s, x) => s + entero(x.cantidad), 0), secciones: new Set(items.map((x) => x.seccion)).size };
}

/**
 * «Agregar varios de una vez»: un ítem por línea. La cantidad puede ir al principio («6 platos»,
 * «6x platos») o al final con x o dos puntos («platos x6», «platos: 6»); sin cantidad, 1.
 * Los guiones y viñetas del principio se ignoran.
 */
export function parsearLineas(texto) {
  const out = [];
  for (let l of String(texto || '').split(/\r?\n|;/)) {
    l = l.replace(/^[\s\-•*·–]+/, '').trim();
    if (!l) continue;
    let m, n = 1, nombre = l;
    if ((m = l.match(/^(\d{1,3})\s*(?:x|×)?\s+(.+)$/i))) { n = Number(m[1]); nombre = m[2]; }
    else if ((m = l.match(/^(.+?)\s*(?:x|×|:)\s*(\d{1,3})$/i))) { nombre = m[1]; n = Number(m[2]); }
    nombre = nombre.replace(/\s+/g, ' ').trim().slice(0, 80);
    if (nombre) out.push({ item: nombre, cantidad: Math.max(1, n) });
  }
  return out;
}

/** Los ítems de `origen` que `destino` todavía no tiene (mismo nombre y misma sección), listos para sumar, con id nuevo. */
export function faltantesDe(origen, destino, nuevoId = idNuevo) {
  const tiene = new Set(destino.map((x) => clave(x.item) + '|' + clave(x.seccion)));
  return origen.filter((x) => !tiene.has(clave(x.item) + '|' + clave(x.seccion)))
    .map((x) => ({ ...x, id: nuevoId() }));
}

/** ¿Ya hay un ítem con ese nombre en esa sección (otro que `exceptoId`)? Para avisar, no para impedir. */
export function repetido(items, nombre, seccion, exceptoId) {
  const k = clave(nombre);
  return items.find((x) => x.id !== exceptoId && clave(x.item) === k && clave(x.seccion) === clave(seccion)) || null;
}

/** Los sugeridos de una sección que todavía no están cargados (hasta `max`). */
export function sugeridosFaltantes(items, seccion, max = 8) {
  const sec = SECCIONES.find((s) => s.id === seccion);
  if (!sec) return [];
  const hay = new Set(items.map((x) => clave(x.item)));
  return sec.sugeridos.filter((s) => !hay.has(clave(s))).slice(0, max);
}

/** Miniatura liviana de una foto de Cloudinary (las demás van tal cual). */
export function miniatura(url, lado = 160) {
  const s = String(url || '');
  const i = s.indexOf('/upload/');
  if (i === -1 || s.indexOf('res.cloudinary.com/') === -1) return s;
  const resto = s.slice(i + 8).split('/');
  // Se sacan las transformaciones de adelante (xx_valor,yy_valor); la versión (v123) y el nombre se quedan.
  while (resto.length > 1 && /^[a-z]{1,3}_[^/.]+$/.test(resto[0].split(',')[0]) && resto[0].indexOf('.') === -1) resto.shift();
  return s.slice(0, i + 8) + `f_auto,q_auto,w_${lado},h_${lado},c_fill/` + resto.join('/');
}
