// ═══════════════════════════════════════════════════════════════
//  cloudinary-listar — las fotos del sitio que hay en Cloudinary
//
//  QUIÉN LA LLAMA
//    · interno/editar.html  → la solapa "Cloudinary" de la hoja de fotos.
//    · interno/fotos.html   → para cruzar cada foto contra su carpeta real.
//
//  CONTRATO (no cambiarlo sin tocar esas dos pantallas):
//    GET  /cloudinary-listar
//    GET  /cloudinary-listar?cursor=XXX          ← la página siguiente
//    GET  /cloudinary-listar?carpetas=sitio,Espacios
//    →  { fotos: [ { url, mini, nombre, publicId, carpeta } ],
//         cursor: "…" | null,
//         diagnostico: { … } }
//    En error →  { error: "explicación en castellano", diagnostico: { … } }
//
//  ── POR QUÉ ESTA FUNCIÓN EXISTE DEL LADO DEL SERVIDOR ──────────
//  Listar el contenido de Cloudinary pide la Admin API, y la Admin API pide
//  el api_secret. Ese secreto NO puede estar en el navegador: cualquiera
//  que abra el panel podría leerlo y borrar toda la biblioteca. Por eso la
//  consulta sale de acá, donde el secreto vive en una variable de entorno
//  de Netlify y nunca viaja al teléfono.
//
//  ── EL ERROR QUE HAY QUE NO VOLVER A COMETER ───────────────────
//  La cuenta está en modo DYNAMIC FOLDERS. Ahí la carpeta de una foto se
//  guarda en el campo 'asset_folder', que es un dato aparte del
//  identificador. En el modo clásico —el viejo— la carpeta viajaba DENTRO
//  del public_id y se consultaba con el campo 'folder'.
//
//  Buscar por 'folder' en una cuenta con Dynamic folders NO da error:
//  devuelve cero resultados, con HTTP 200 y una lista vacía. Eso es
//  exactamente lo que pasaba antes de esta versión, y por eso el editor
//  decía "no hay fotos en las carpetas del sitio" mientras las fotos
//  estaban ahí. Un fallo que no se queja es el más caro de encontrar.
//
//  Acá se busca por 'asset_folder' Y por 'folder' en la misma expresión.
//  Cuesta lo mismo y funciona en los dos modos, así que la cuenta puede
//  cambiar de modo sin que nadie tenga que acordarse de esto.
//
//  ── SUBCARPETAS ───────────────────────────────────────────────
//  Las fotos de los alojamientos no están en 'cabanas' sino en
//  'cabanas/cabana1', 'cabanas/cabana2'… Una búsqueda por la carpeta
//  exacta no las ve. Por cada carpeta pedida se busca la carpeta Y todo lo
//  que cuelga de ella.
//
//  ── LO QUE NUNCA SE DEVUELVE ──────────────────────────────────
//  Los comprobantes de Dinero (carpeta 'gastos'). Son facturas, boletas y
//  papeles del negocio: no tienen por qué aparecer cuando alguien está
//  eligiendo una foto para la portada. La exclusión es explícita y va en
//  la expresión, no en un filtro posterior — filtrar después significaría
//  traerlos igual hasta acá.
//
//  ── VARIABLES DE ENTORNO EN NETLIFY ───────────────────────────
//  Hay que cargarlas en el panel de Netlify (Site configuration →
//  Environment variables) y volver a desplegar. Se aceptan varios nombres
//  porque no todas las cuentas usan los mismos:
//      CLOUDINARY_CLOUD_NAME   (o CLOUDINARY_CLOUD)     — 'dnwfu8ffn'
//      CLOUDINARY_API_KEY      (o CLOUDINARY_KEY)
//      CLOUDINARY_API_SECRET   (o CLOUDINARY_SECRET)
//  También sirve una sola:
//      CLOUDINARY_URL = cloudinary://api_key:api_secret@cloud_name
//
//  Si falta alguna, la respuesta dice CUÁL falta y qué nombres se aceptan.
//  Adivinar el nombre de una variable de entorno cuesta una tarde.
//
//  ⚠ El proyecto de Netlify tiene Auto Publishing Locked y no está
//  enganchado a Git: subir este archivo a GitHub NO lo despliega. Hay que
//  desplegarlo a mano desde Netlify.
// ═══════════════════════════════════════════════════════════════

// Las carpetas del SITIO. 'gastos' no está y no puede estar.
const CARPETAS_POR_DEFECTO = ['sitio', 'cabanas', 'Espacios', 'recuerdos'];

// Nunca se devuelve nada de acá, se pida lo que se pida.
const PROHIBIDAS = ['gastos'];

// La misma transformación de entrega que usa el panel: la foto baja
// liviana y en el formato que el teléfono entienda mejor.
const ENTREGA = 'f_auto,q_auto';
const MINIATURA = 'f_auto,q_auto,w_300,h_300,c_fill';

const CABECERAS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

/** Lee la primera variable de entorno que exista, de varios nombres. */
function variable(nombres) {
  for (let i = 0; i < nombres.length; i++) {
    const v = process.env[nombres[i]];
    if (v && String(v).trim()) return String(v).trim();
  }
  return '';
}

/**
 * Saca las credenciales. Acepta las tres variables sueltas o la
 * CLOUDINARY_URL de una sola pieza, que es la que copia y pega la mayoría.
 */
function credenciales() {
  let cloud = variable(['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_CLOUD']);
  let key = variable(['CLOUDINARY_API_KEY', 'CLOUDINARY_KEY']);
  let secret = variable(['CLOUDINARY_API_SECRET', 'CLOUDINARY_SECRET']);

  const url = variable(['CLOUDINARY_URL']);
  if (url && (!cloud || !key || !secret)) {
    // cloudinary://123456789:abcXYZ@dnwfu8ffn
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) {
      if (!key) key = m[1];
      if (!secret) secret = m[2];
      if (!cloud) cloud = m[3];
    }
  }
  return { cloud, key, secret };
}

/**
 * Arma la expresión de búsqueda.
 *
 * Por cada carpeta se piden cuatro formas, y las cuatro hacen falta:
 *   asset_folder="X"    → la carpeta exacta, en modo Dynamic folders
 *   asset_folder="X/*"  → todo lo que cuelga de ella (cabanas/cabana1…)
 *   folder="X"          → lo mismo en el modo clásico
 *   folder="X/*"        → y sus subcarpetas
 *
 * Pedir los dos campos no es no saber en qué modo está la cuenta: es que
 * la respuesta correcta no dependa de eso. Una cuenta puede migrarse de
 * modo, y esta función tiene que seguir andando sin que nadie se acuerde
 * de venir a tocarla.
 */
function expresion(carpetas) {
  const trozos = [];
  for (let i = 0; i < carpetas.length; i++) {
    const c = String(carpetas[i]).replace(/"/g, '').trim();
    if (!c) continue;
    trozos.push('asset_folder="' + c + '"');
    trozos.push('asset_folder="' + c + '/*"');
    trozos.push('folder="' + c + '"');
    trozos.push('folder="' + c + '/*"');
  }
  let e = 'resource_type:image';
  if (trozos.length) e += ' AND (' + trozos.join(' OR ') + ')';
  for (let i = 0; i < PROHIBIDAS.length; i++) {
    // El menos excluye. Va en la expresión y no en un filtro de después:
    // así los comprobantes ni siquiera viajan hasta acá.
    e += ' AND -asset_folder="' + PROHIBIDAS[i] + '*"';
    e += ' AND -folder="' + PROHIBIDAS[i] + '*"';
  }
  return e;
}

/** Arma la URL de entrega a partir del identificador. */
function urlDe(cloud, recurso, transformacion) {
  const tipo = recurso.resource_type || 'image';
  const entrega = recurso.type || 'upload';
  const ext = recurso.format ? ('.' + recurso.format) : '';
  return 'https://res.cloudinary.com/' + cloud + '/' + tipo + '/' + entrega + '/'
    + transformacion + '/' + recurso.public_id + ext;
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CABECERAS, body: '' };
  }

  const { cloud, key, secret } = credenciales();
  if (!cloud || !key || !secret) {
    const faltan = [];
    if (!cloud) faltan.push('CLOUDINARY_CLOUD_NAME');
    if (!key) faltan.push('CLOUDINARY_API_KEY');
    if (!secret) faltan.push('CLOUDINARY_API_SECRET');
    return {
      statusCode: 500,
      headers: CABECERAS,
      body: JSON.stringify({
        error: 'Faltan credenciales de Cloudinary en Netlify: ' + faltan.join(', ')
          + '. Se cargan en Site configuration → Environment variables y hay que '
          + 'volver a desplegar. También sirve una sola variable CLOUDINARY_URL '
          + 'con la forma cloudinary://api_key:api_secret@cloud_name.',
        diagnostico: { cloud: !!cloud, key: !!key, secret: !!secret }
      })
    };
  }

  const q = (event.queryStringParameters || {});
  const carpetas = q.carpetas
    ? String(q.carpetas).split(',').map((s) => s.trim()).filter(Boolean)
    : CARPETAS_POR_DEFECTO;
  const cursor = q.cursor ? String(q.cursor) : '';
  const expr = expresion(carpetas);

  const cuerpo = {
    expression: expr,
    max_results: 60,
    // Lo último que se subió, primero: es lo que se está buscando el 90%
    // de las veces.
    sort_by: [{ created_at: 'desc' }],
    // Sin esto la respuesta no trae asset_folder, que es justo el dato que
    // fotos.html necesita para decir si una foto está donde le toca.
    with_field: ['context', 'tags']
  };
  if (cursor) cuerpo.next_cursor = cursor;

  try {
    const r = await fetch(
      'https://api.cloudinary.com/v1_1/' + cloud + '/resources/search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + Buffer.from(key + ':' + secret).toString('base64')
        },
        body: JSON.stringify(cuerpo)
      }
    );

    const datos = await r.json();
    if (!r.ok) {
      const det = (datos && datos.error && datos.error.message) || ('HTTP ' + r.status);
      return {
        statusCode: r.status,
        headers: CABECERAS,
        body: JSON.stringify({
          error: 'Cloudinary respondió: ' + det,
          diagnostico: { expresion: expr, carpetas: carpetas }
        })
      };
    }

    const recursos = Array.isArray(datos.resources) ? datos.resources : [];
    const fotos = recursos.map((x) => ({
      url: urlDe(cloud, x, ENTREGA),
      mini: urlDe(cloud, x, MINIATURA),
      publicId: x.public_id,
      // asset_folder es el del modo nuevo; folder, el del viejo. Se
      // devuelve el que venga, y las pantallas no tienen que saber en qué
      // modo está la cuenta.
      carpeta: x.asset_folder || x.folder || '',
      nombre: x.display_name || String(x.public_id).split('/').pop() || '',
      subida: x.created_at || '',
      bytes: x.bytes || 0
    }));

    // El diagnóstico viaja SIEMPRE, no sólo cuando algo falla. Cuando la
    // respuesta vuelve vacía, la pregunta es siempre la misma —¿buscó
    // donde tenía que buscar?— y sin esto hay que adivinarla.
    const porCarpeta = {};
    for (let i = 0; i < fotos.length; i++) {
      const c = fotos[i].carpeta || '(raíz)';
      porCarpeta[c] = (porCarpeta[c] || 0) + 1;
    }

    return {
      statusCode: 200,
      headers: CABECERAS,
      body: JSON.stringify({
        fotos: fotos,
        cursor: datos.next_cursor || null,
        diagnostico: {
          carpetas_pedidas: carpetas,
          expresion: expr,
          total_en_cloudinary: typeof datos.total_count === 'number' ? datos.total_count : null,
          devueltas: fotos.length,
          por_carpeta: porCarpeta
        }
      })
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: CABECERAS,
      body: JSON.stringify({
        error: 'No se pudo consultar Cloudinary: ' + (e.message || String(e)),
        diagnostico: { expresion: expr, carpetas: carpetas }
      })
    };
  }
};
