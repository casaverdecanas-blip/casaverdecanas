// ═════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — netlify/functions/cloudinary-listar.js
//
//  QUÉ HACE
//  Lista las imágenes que ya están en Cloudinary para que el editor
//  visual del sitio (interno/editar.html) las muestre en una grilla y
//  se pueda elegir una tocándola. Devuelve la URL DE ENTREGA ya
//  transformada (f_auto,q_auto,w_2000), la misma que guarda
//  CV2.urlEntrega(): lo que se guarde en la base sale listo.
//
//  POR QUÉ HACE FALTA UNA FUNCIÓN Y NO SE HACE DESDE EL NAVEGADOR
//  Subir a Cloudinary se puede sin credenciales (preset sin firma).
//  LISTAR no: la Admin API exige la API secret, y esa clave no puede
//  viajar al navegador ni estar en el repositorio. Por eso vive acá,
//  en las variables de entorno de Netlify.
//
//  ⚠ LO IMPORTANTE DE SEGURIDAD — LA LISTA BLANCA DE CARPETAS
//  En este mismo Cloudinary viven los COMPROBANTES de Dinero (facturas,
//  transferencias) y las fotos del muro de recuerdos. Una función que
//  liste "todo" las expondría a cualquiera que sepa la dirección.
//  Por eso esta función NUNCA acepta una consulta armada por el cliente:
//  solo busca dentro de PERMITIDAS, y punto. Si mañana hace falta otra
//  carpeta, se agrega acá a mano.
//
//  MODOS
//  · ?modo=carpetas  → diagnóstico: qué carpetas existen y cuántas
//    imágenes tiene cada una. SIN URLs. Sirve para ver cómo está
//    organizado el Cloudinary hoy y decidir qué va en PERMITIDAS.
//    (Este modo mira TODO el cloud a propósito: es para ordenar. Una
//    vez ordenado se puede apagar poniendo DIAGNOSTICO en false.)
//  · (por defecto)   → fotos de una carpeta permitida, paginadas.
//    ?carpeta=cabanas/c1  &cursor=...  &buscar=texto
//
//  VARIABLES DE ENTORNO EN NETLIFY (proyecto serene-scone-76bd4e,
//  cuenta maurogasta@gmail.com — la que tiene las funciones activas):
//    CLOUDINARY_API_KEY      obligatoria
//    CLOUDINARY_API_SECRET   obligatoria
//    CLOUDINARY_CLOUD_NAME   opcional (por defecto dnwfu8ffn)
//  Si falta alguna, la función lo DICE con el nombre de la variable.
//  Una función anterior de este proyecto estuvo muerta meses por tres
//  variables que nunca se cargaron y un error que no explicaba nada.
// ═════════════════════════════════════════════════════════════

'use strict';

// ⚠ ESTA CUENTA ESTÁ EN MODO "DYNAMIC FOLDERS" (verificado en el panel
//   de Cloudinary: Dashboard → Product Environment → Folder mode).
//   En ese modo la carpeta NO va dentro del public_id: viaja aparte, en
//   el campo 'asset_folder'. Buscar por 'folder' —el campo del modo
//   clásico— no devuelve NADA, y el error sería silencioso: una grilla
//   vacía sin ningún mensaje. Si algún día la cuenta se pasa al modo
//   clásico, se cambia esta línea y nada más.
var CAMPO_CARPETA = 'asset_folder';   // clásico: 'folder'

// Carpetas de Cloudinary que el editor del sitio puede mirar.
// TODO lo que no esté acá es invisible para esta función.
var PERMITIDAS = ['sitio', 'cabanas', 'espacios'];

// Modo diagnóstico de carpetas. Poner en false cuando el Cloudinary
// ya esté ordenado y no haga falta volver a mirar.
var DIAGNOSTICO = true;

// Las mismas transformaciones de entrega que usa CV2.ENTREGA.
// Si cambian allá, cambian acá.
var ENTREGA = 'f_auto,q_auto,w_2000';
var MINIATURA = 'c_fill,w_320,h_240,f_auto,q_auto';

// Orígenes que pueden llamar a esta función.
var ORIGENES = [
  'https://casaverdecanas.com.br',
  'https://www.casaverdecanas.com.br',
  'https://casaverdecanas-blip.github.io'
];

var POR_PAGINA = 60;

// ── ayudas ───────────────────────────────────────────────────

function cabeceras(origen) {
  var permitido = ORIGENES.indexOf(origen) !== -1 ? origen : ORIGENES[0];
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': permitido,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    // El editor pide la lista cada vez que se abre la hoja de fotos.
    // Un minuto de caché alcanza para no golpear la Admin API de más
    // (tiene límite de llamadas por hora) sin que una foto recién
    // subida tarde en aparecer.
    'Cache-Control': 'public, max-age=60'
  };
}

function respuesta(codigo, cuerpo, origen) {
  return {
    statusCode: codigo,
    headers: cabeceras(origen),
    body: JSON.stringify(cuerpo)
  };
}

// Mete las transformaciones en una URL de Cloudinary. Idempotente:
// si ya las tiene, la devuelve igual. Es la misma lógica que
// CV2.urlEntrega() en nucleo.js, replicada acá porque esto corre en
// el servidor y no puede importar el núcleo del panel.
function conTransformacion(url, transf) {
  if (typeof url !== 'string') return '';
  var marca = '/upload/';
  var i = url.indexOf(marca);
  if (i === -1) return url;
  var antes = url.slice(0, i + marca.length);
  var resto = url.slice(i + marca.length);
  var primer = resto.split('/')[0];
  if (esTransformacion(primer)) {
    // Ya viene transformada: se reemplaza el bloque, no se apila otro.
    resto = resto.slice(primer.length + 1);
  }
  return antes + transf + '/' + resto;
}

function esTransformacion(seg) {
  if (!seg || seg.indexOf('.') !== -1) return false;   // tiene extensión → archivo
  if (/^v\d+$/.test(seg)) return false;                // es la versión
  return seg.split(',').every(function (p) {
    return /^[a-z]{1,3}_[A-Za-z0-9.:%-]+$/.test(p);
  });
}

// La carpeta de un recurso. En esta cuenta manda 'asset_folder'
// (carpetas dinámicas); se acepta 'folder' igual, por si alguna imagen
// vieja lo trae, y como último recurso se deduce del public_id.
function carpetaDe(r) {
  var f = r.asset_folder || r.folder || '';
  if (f) return f;
  // Sin campo de carpeta: se deduce del public_id ("sitio/hero" → "sitio").
  var p = String(r.public_id || '');
  var corte = p.lastIndexOf('/');
  return corte === -1 ? '' : p.slice(0, corte);
}

// ¿Esta carpeta está dentro de alguna de las permitidas?
function permitida(carpeta) {
  var c = String(carpeta || '');
  for (var i = 0; i < PERMITIDAS.length; i++) {
    var p = PERMITIDAS[i];
    if (c === p || c.indexOf(p + '/') === 0) return true;
  }
  return false;
}

// Un pedazo de texto libre que llega del cliente y va a entrar en una
// consulta de Cloudinary. Se limita a lo que no puede romper nada:
// letras, números, espacio, guión, guión bajo, punto y barra.
function limpio(s) {
  return String(s || '').replace(/[^A-Za-z0-9 ._\/-]/g, '').slice(0, 80);
}

// ── Cloudinary Admin API · búsqueda ──────────────────────────

async function buscar(cred, expresion, cursor, cuantos) {
  var cuerpo = {
    expression: expresion,
    max_results: cuantos,
    sort_by: [{ created_at: 'desc' }]
  };
  if (cursor) cuerpo.next_cursor = cursor;

  var r = await fetch(
    'https://api.cloudinary.com/v1_1/' + cred.cloud + '/resources/search',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + cred.basica
      },
      body: JSON.stringify(cuerpo)
    }
  );

  if (!r.ok) {
    // Cloudinary SIEMPRE explica el motivo en el cuerpo. Ese texto
    // tiene que llegar a la pantalla: es la diferencia entre
    // arreglarlo en dos minutos y adivinar.
    var motivo = 'HTTP ' + r.status;
    try {
      var j = await r.json();
      if (j && j.error && j.error.message) motivo = j.error.message;
    } catch (e) { /* la respuesta no era JSON */ }
    var err = new Error(motivo);
    err.http = r.status;
    throw err;
  }
  return r.json();
}

// ── el manejador ─────────────────────────────────────────────

exports.handler = async function (evento) {
  var origen = (evento.headers && (evento.headers.origin || evento.headers.Origin)) || '';

  if (evento.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cabeceras(origen), body: '' };
  }
  if (evento.httpMethod !== 'GET') {
    return respuesta(405, { error: 'Solo GET.' }, origen);
  }

  var clave = process.env.CLOUDINARY_API_KEY;
  var secreto = process.env.CLOUDINARY_API_SECRET;
  var cloud = process.env.CLOUDINARY_CLOUD_NAME || 'dnwfu8ffn';

  var faltan = [];
  if (!clave) faltan.push('CLOUDINARY_API_KEY');
  if (!secreto) faltan.push('CLOUDINARY_API_SECRET');
  if (faltan.length) {
    return respuesta(500, {
      error: 'Faltan variables de entorno en Netlify: ' + faltan.join(', ')
        + '. Se cargan en el proyecto serene-scone-76bd4e → Site configuration '
        + '→ Environment variables, y después hay que volver a desplegar.'
    }, origen);
  }

  var cred = {
    cloud: cloud,
    basica: Buffer.from(clave + ':' + secreto).toString('base64')
  };

  var q = evento.queryStringParameters || {};

  try {
    // ── modo diagnóstico: qué carpetas hay y cuántas fotos ──
    if (q.modo === 'carpetas') {
      if (!DIAGNOSTICO) {
        return respuesta(403, { error: 'El diagnóstico de carpetas está apagado.' }, origen);
      }
      var cuenta = {};
      var total = 0;
      var cur = null;
      var vueltas = 0;
      do {
        var pag = await buscar(cred, 'resource_type:image', cur, 500);
        (pag.resources || []).forEach(function (r) {
          var c = carpetaDe(r) || '(raíz)';
          cuenta[c] = (cuenta[c] || 0) + 1;
          total++;
        });
        cur = pag.next_cursor;
        vueltas++;
      } while (cur && vueltas < 6);   // techo: 3000 imágenes

      var carpetas = Object.keys(cuenta).sort().map(function (c) {
        return { carpeta: c, cantidad: cuenta[c], permitida: permitida(c) };
      });
      return respuesta(200, {
        modo: 'carpetas',
        total: total,
        truncado: !!cur,
        permitidas: PERMITIDAS,
        carpetas: carpetas
      }, origen);
    }

    // ── modo normal: fotos de una carpeta permitida ──
    var carpeta = limpio(q.carpeta);
    var trozos = [];

    if (carpeta) {
      if (!permitida(carpeta)) {
        return respuesta(403, {
          error: 'Esa carpeta no está habilitada para el editor del sitio. '
            + 'Habilitadas: ' + PERMITIDAS.join(', ') + '.'
        }, origen);
      }
      // La carpeta exacta Y lo que tenga adentro.
      trozos.push('(' + CAMPO_CARPETA + '="' + carpeta + '" OR '
        + CAMPO_CARPETA + ':"' + carpeta + '/*")');
    } else {
      // Sin carpeta: todo lo permitido, junto.
      trozos.push('(' + PERMITIDAS.map(function (p) {
        return CAMPO_CARPETA + '="' + p + '" OR ' + CAMPO_CARPETA + ':"' + p + '/*"';
      }).join(' OR ') + ')');
    }

    trozos.push('resource_type:image');

    var texto = limpio(q.buscar);
    if (texto) trozos.push('public_id:*' + texto + '*');

    var pagina = await buscar(cred, trozos.join(' AND '), q.cursor || null, POR_PAGINA);

    var fotos = (pagina.resources || [])
      // Cinturón y tirantes: aunque la consulta ya filtra, se vuelve a
      // revisar acá. Si un día la consulta se escribe mal, el filtro de
      // este lado sigue tapando los comprobantes.
      .filter(function (r) { return permitida(carpetaDe(r)); })
      .map(function (r) {
        return {
          public_id: r.public_id,
          carpeta: carpetaDe(r),
          nombre: r.display_name || String(r.public_id).split('/').pop(),
          ancho: r.width || 0,
          alto: r.height || 0,
          creada: r.created_at || '',
          // La URL que se guarda en la base: ya optimizada.
          url: conTransformacion(r.secure_url, ENTREGA),
          // La que se muestra en la grilla del selector: liviana.
          mini: conTransformacion(r.secure_url, MINIATURA)
        };
      });

    return respuesta(200, {
      fotos: fotos,
      cursor: pagina.next_cursor || null,
      carpeta: carpeta || '(todas las permitidas)'
    }, origen);

  } catch (e) {
    var codigo = e.http === 401 || e.http === 403 ? 502 : 500;
    return respuesta(codigo, {
      error: 'Cloudinary: ' + (e.message || 'error desconocido')
        + (e.http === 401
          ? ' — la API key o la API secret no son correctas.'
          : '')
    }, origen);
  }
};
