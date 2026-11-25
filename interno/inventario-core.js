// ════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — inventario-core.js
//  Lo que sabe la pantalla «Inventario» (inventario.html), sin Firebase ni
//  DOM: así lo prueba `node netlify/pruebas/inventario.mjs`.
//  Sello: inventario-2 (26-nov-2026: espacios comunes, descripción, estado y mantenimiento)
//  inventario-1 (26-nov-2026)
//
//  Mauro, 26-nov-2026: «una pestaña dentro de casaverde para la gestión del
//  inventario de cada cabaña… ítems que se pueden agregar, modificar o eliminar,
//  cargar la foto, cantidad, en qué sección (cocina, electrodomésticos…). Esa
//  información se guarda en la base y se simplifica luego para el control».
//
//  Mauro, 26-nov-2026 (segunda vuelta): «una pantalla completa para controlar el inventario de cada
//  cabaña o de los espacios comunes (parrilla, todas las instancias que tengan utensilios), con una
//  descripción del artículo, para visualización y control nuestro del estado y mantenimiento; si hay
//  que hacer una reparación, que se guarde en la base de datos».
//
//  DÓNDE VIVE: `inventarios/{lugar}` (privada, permiso `contenido`), con el id «cabana-c1» o
//  «espacio-piscina»: { tipo, lugar, items: [...], actualizadoEn, actualizadoPor }. Cada ítem:
//    { id, item, cantidad, seccion, foto?, descripcion?, estado, revisado?, mantenimiento? }
//    · estado         'bien' | 'desgaste' | 'reparar' | 'baja'
//    · revisado       aaaa-mm-dd de la última vez que alguien lo miró
//    · mantenimiento  [{ id, fecha, texto, hecho, hechoEn? }]: reparaciones y arreglos anotados
//  Lo del estado y las reparaciones NO se publica: por eso no vive en `cabanas/` (lectura pública).
//
//  LA SIMPLE, DERIVADA: de una CABAÑA además se escribe `cabanas/{id}.inventarioBase` =
//  [{ item, cantidad, categoria }] —lo que leen el control de entrada y de salida (actividades.html)
//  y «La casa» del huésped—, sin fotos, sin estado y sin lo dado de baja. Nadie la escribe a mano
//  (`paraGuardar`), así que no se desincroniza. Una cabaña que todavía sólo tiene la simple (todas,
//  hasta hoy) se lee igual: sus ítems se acomodan en secciones por su categoría o por su nombre.
// ════════════════════════════════════════════════════════════

export const SELLO_INVENTARIO = 'inventario-2';

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
    'Reposeras', 'Mesa de jardín', 'Sillas de jardín', 'Sombrilla', 'Manguera', 'Regador', 'Escalera'] },
  { id: 'Parrilla y quincho', icono: 'outdoor_grill', sugeridos: [
    'Parrilla', 'Pinza de asado', 'Cuchillo de asado', 'Tabla de asado', 'Espetones', 'Atizador', 'Escobilla', 'Guantes de horno'] },
  { id: 'Recreación', icono: 'pool', sugeridos: [
    'Kayaks', 'Remos', 'Chalecos salvavidas', 'Hamacas', 'Flotadores', 'Pelotas', 'Red de pileta', 'Limpiafondos'] },
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
  ['jardin', 'Exterior'], ['patio', 'Exterior'], ['parrilla', 'Parrilla y quincho'], ['quincho', 'Parrilla y quincho'], ['churrasqueira', 'Parrilla y quincho'],
  ['piscina', 'Recreación'], ['juegos', 'Recreación'], ['recreacion', 'Recreación'], ['deportes', 'Recreación'], ['varios', 'Otros'], ['otro', 'Otros'], ['cuarto', 'Dormitorio'],
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
  ['Parrilla y quincho', /parrilla|asador|pinza de asado|atizador|espet[oó]n|escobilla|carb[oó]n|le[nñ]a|quincho|brasero|churrasco/],
  ['Exterior', /reposera|sombrilla|jard[ií]n|manguera|regador|escalera|exterior/],
  ['Recreación', /kayak|remo\b|remos|chaleco|flotador|pelota|limpiafondo|red de pileta|hamaca|tobog[aá]n|bote|paddle|piscina|pileta|salvavidas|vole/],
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

// El estado de un ítem: cuatro, a un toque. `reparar` es el que pide que alguien haga algo.
export const ESTADOS = [
  { id: 'bien', texto: 'Bien', icono: 'check_circle', color: '#2d5a27' },
  { id: 'desgaste', texto: 'Con desgaste', icono: 'error_outline', color: '#b7791f' },
  { id: 'reparar', texto: 'Hay que repararlo', icono: 'build', color: '#c0392b' },
  { id: 'baja', texto: 'Fuera de uso', icono: 'block', color: '#7a7a7a' },
];
export const estadoDe = (id) => ESTADOS.find((e) => e.id === id) || ESTADOS[0];

export const idNuevo = () => 'i' + Math.random().toString(36).slice(2, 9);
const entero = (v, tope = 9999) => { const n = Math.round(Number(String(v == null ? '' : v).replace(',', '.'))); return Number.isFinite(n) ? Math.max(0, Math.min(tope, n)) : 0; };

const fechaOk = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '');
const texto = (v, n) => String(v == null ? '' : v).replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);

/** Las anotaciones de mantenimiento de un ítem, limpias (hasta 40). */
function leerMantenimiento(lista, nuevoId) {
  if (!Array.isArray(lista)) return [];
  const usados = new Set(), out = [];
  for (const m of lista) {
    if (!m || typeof m !== 'object') continue;
    const t = texto(m.texto, 300); if (!t) continue;
    let id = String(m.id || ''); if (!id || usados.has(id)) id = nuevoId(); usados.add(id);
    out.push({ id, fecha: fechaOk(m.fecha), texto: t, hecho: m.hecho === true, ...(m.hecho === true && fechaOk(m.hechoEn) ? { hechoEn: fechaOk(m.hechoEn) } : {}) });
    if (out.length >= 40) break;
  }
  return out;
}

/**
 * Los ítems de un lugar, en la forma rica. `fuente` puede ser el documento de `inventarios/{lugar}`
 * ({ items }), una cabaña con `inventario` (la rica de la primera versión) o, lo más viejo, con la
 * simple `inventarioBase` (strings, o {item, cantidad, categoria}).
 */
export function leerInventario(fuente, nuevoId = idNuevo) {
  const c = fuente || {};
  const lista = Array.isArray(c.items) ? c.items : (Array.isArray(c.inventario) ? c.inventario : (Array.isArray(c.inventarioBase) ? c.inventarioBase : []));
  const usados = new Set(), out = [];
  for (let x of lista) {
    if (typeof x === 'string') x = { item: x };
    if (!x || typeof x !== 'object') continue;
    const item = String(x.item != null ? x.item : (x.nombre != null ? x.nombre : '')).replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!item) continue;
    const sec = seccionCanonica(x.seccion != null ? x.seccion : x.categoria);
    let id = String(x.id || '');
    if (!id || usados.has(id)) id = nuevoId();
    usados.add(id);
    const foto = typeof x.foto === 'string' && /^https:\/\//.test(x.foto) ? x.foto : '';
    const descripcion = texto(x.descripcion, 400);
    const estado = ESTADOS.some((e) => e.id === x.estado) ? x.estado : 'bien';
    const revisado = fechaOk(x.revisado);
    const mantenimiento = leerMantenimiento(x.mantenimiento, nuevoId);
    out.push({ id, item, cantidad: entero(x.cantidad != null ? x.cantidad : x.cantidadBase), seccion: sec || sugerirSeccion(item),
      ...(foto ? { foto } : {}), ...(descripcion ? { descripcion } : {}), estado, ...(revisado ? { revisado } : {}),
      ...(mantenimiento.length ? { mantenimiento } : {}) });
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

/** La lista SIMPLE que leen el control y «La casa»: sin fotos, ids ni estado, con la sección como categoría; lo dado de baja no está. */
export function simplificar(items) {
  return ordenar(items).filter((x) => x.item && x.estado !== 'baja').map((x) => ({ item: x.item, cantidad: entero(x.cantidad), categoria: x.seccion || 'Otros' }));
}

/** Lo que se escribe en inventarios/{lugar} (`items`) y, DERIVADA de eso, la simple de una cabaña (`inventarioBase`). */
export function paraGuardar(items) {
  const limpios = leerInventario({ items: ordenar(items) }, idNuevo);
  return { items: limpios, inventarioBase: simplificar(limpios) };
}

/** ¿Tiene algo sin resolver? (marcado para repararlo o con una anotación sin hacer) */
export const pendientes = (x) => (x.mantenimiento || []).filter((m) => !m.hecho).length;
export const necesitaAtencion = (x) => x.estado === 'reparar' || pendientes(x) > 0;

export function resumen(items) {
  return { items: items.length, unidades: items.reduce((s, x) => s + entero(x.cantidad), 0), secciones: new Set(items.map((x) => x.seccion)).size,
    reparar: items.filter(necesitaAtencion).length, desgaste: items.filter((x) => x.estado === 'desgaste').length, baja: items.filter((x) => x.estado === 'baja').length };
}

/** Lo que muestra la lista según el filtro («todo», «reparar», «desgaste», «baja») y lo que se busca (nombre, sección o descripción). */
export function filtrar(items, filtro, buscar) {
  const k = clave(buscar);
  return items.filter((x) => {
    if (filtro === 'reparar' && !necesitaAtencion(x)) return false;
    if (filtro === 'desgaste' && x.estado !== 'desgaste') return false;
    if (filtro === 'baja' && x.estado !== 'baja') return false;
    return !k || clave(x.item).includes(k) || clave(x.seccion).includes(k) || clave(x.descripcion || '').includes(k);
  });
}

/** Anota una reparación o un arreglo: queda pendiente y el ítem pasa a «Hay que repararlo» (salvo que esté fuera de uso). */
export function anotarMantenimiento(x, textoNuevo, hoy, nuevoId = idNuevo) {
  const t = texto(textoNuevo, 300); if (!t) return x;
  const m = [...(x.mantenimiento || []), { id: nuevoId(), fecha: fechaOk(hoy), texto: t, hecho: false }].slice(-40);
  return { ...x, mantenimiento: m, estado: x.estado === 'baja' ? 'baja' : 'reparar' };
}

/** Marca una anotación como hecha (o la vuelve a pendiente). Si ya no queda nada pendiente, «Hay que repararlo» pasa a «Bien». */
export function resolverMantenimiento(x, mid, hecho, hoy) {
  const m = (x.mantenimiento || []).map((y) => {
    if (y.id !== mid) return y;
    const { hechoEn, ...resto } = y;
    return hecho ? { ...resto, hecho: true, hechoEn: fechaOk(hoy) } : { ...resto, hecho: false };
  });
  const sigue = m.some((y) => !y.hecho);
  return { ...x, mantenimiento: m, estado: (x.estado === 'reparar' && !sigue) ? 'bien' : x.estado };
}

/** El id del documento de un lugar: «cabana-c1», «espacio-piscina». */
export const claveLugar = (tipo, id) => (tipo === 'espacio' ? 'espacio-' : 'cabana-') + id;

/** Todo lo que pide atención en varios lugares: [{ lugar, item }] en el orden de los lugares. */
export function paraRepararEn(lugares) {
  const out = [];
  for (const l of lugares) for (const item of l.items) if (necesitaAtencion(item)) out.push({ lugar: l, item });
  return out;
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
