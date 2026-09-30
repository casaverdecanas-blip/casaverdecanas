// Netlify Function: ical-cabana
//
// PUBLICA nuestra ocupación como un calendario .ics para que Airbnb —o
// cualquier otra plataforma— lo importe y bloquee esas fechas solo.
//
//   /.netlify/functions/ical-cabana?c=c1   → solo esa cabaña
//   /.netlify/functions/ical-cabana        → todas juntas, para uso propio
//
// De dónde saca los datos: de la colección 'disponibilidad', que es el espejo
// público de la ocupación y tiene SOLO cabaña y fechas — ni nombres, ni
// teléfonos, ni montos. Esa colección existe justamente para esto (§10 · F4)
// y su regla permite lectura sin sesión, así que la función la lee con la
// clave pública de Firebase y NO necesita credenciales de servidor.
//
// SOLO CONFIRMADAS. 'disponibilidad' solo tiene confirmadas por diseño: un
// presupuesto no bloquea una fecha. Decisión del administrador, ago-2026 —
// bloquear presupuestos en Airbnb taparía fechas que quizás no se concreten.
//
// ⚠ ESTA DIRECCIÓN ES PÚBLICA. Quien la tenga ve qué días están ocupados.
// No ve quién, ni cuánto, ni por qué: cada evento dice "Ocupado" y nada más.
// Es exactamente lo mismo que ya muestra el sitio público.

// Identificador público por diseño, igual que en firebase-init.js: el
// navegador la necesita para hablar con Firestore y lo que protege los datos
// son las reglas, no esta clave.
var PROYECTO = 'casaverde-20';
var CLAVE = 'AIzaSyDG12FsMYyGVzkodq07N1SSWQfMcTJ-3yM';
var BASE = 'https://firestore.googleapis.com/v1/projects/' + PROYECTO
  + '/databases/(default)/documents/';

// Firestore REST devuelve los valores envueltos por tipo:
//   { stringValue: 'c1' }  ·  { integerValue: '3' }
function val(campo) {
  if (!campo) return null;
  if (campo.stringValue !== undefined) return campo.stringValue;
  if (campo.integerValue !== undefined) return Number(campo.integerValue);
  if (campo.doubleValue !== undefined) return Number(campo.doubleValue);
  if (campo.booleanValue !== undefined) return campo.booleanValue;
  if (campo.mapValue) {
    var o = {};
    var f = campo.mapValue.fields || {};
    for (var k in f) o[k] = val(f[k]);
    return o;
  }
  return null;
}

async function leer(coleccion) {
  var out = [];
  var token = '';
  // Paginado: por ahora son unas pocas decenas de documentos, pero una
  // colección que crece sin tope y se lee sin paginar es una bomba de tiempo.
  for (var i = 0; i < 20; i++) {
    var url = BASE + coleccion + '?pageSize=300&key=' + CLAVE
      + (token ? '&pageToken=' + encodeURIComponent(token) : '');
    var r = await fetch(url);
    if (!r.ok) throw new Error('Firestore ' + coleccion + ': HTTP ' + r.status);
    var d = await r.json();
    (d.documents || []).forEach(function (doc) {
      var o = { _id: doc.name.split('/').pop() };
      var f = doc.fields || {};
      for (var k in f) o[k] = val(f[k]);
      out.push(o);
    });
    if (!d.nextPageToken) break;
    token = d.nextPageToken;
  }
  return out;
}

// 'YYYY-MM-DD' → 'YYYYMMDD', que es lo que pide iCalendar para una fecha
// sin hora. Devuelve null si no tiene forma de fecha: una línea DTSTART
// inválida rompe el archivo ENTERO y la plataforma lo descarta sin avisar.
function fechaICS(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  return iso.replace(/-/g, '');
}

// El texto de una línea iCalendar se escapa: coma, punto y coma, barra y
// salto de línea tienen significado propio en el formato.
function escICS(t) {
  return String(t == null ? '' : t)
    .replace(/\\/g, '\\\\').replace(/;/g, '\\;')
    .replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

// Ninguna línea puede pasar de 75 octetos: se parten y la continuación
// arranca con un espacio. Los lectores estrictos rechazan el archivo si no.
function plegar(linea) {
  if (linea.length <= 73) return linea;
  var out = [linea.slice(0, 73)];
  var resto = linea.slice(73);
  while (resto.length > 72) {
    out.push(' ' + resto.slice(0, 72));
    resto = resto.slice(72);
  }
  if (resto) out.push(' ' + resto);
  return out.join('\r\n');
}

exports.handler = async function (event) {
  var cab = (event.queryStringParameters && event.queryStringParameters.c) || '';
  cab = String(cab).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);

  try {
    var ocupaciones = await leer('disponibilidad');
    var cabanas = [];
    try { cabanas = await leer('cabanas'); } catch (e) { /* el nombre es un lujo */ }

    if (cab) ocupaciones = ocupaciones.filter(function (o) { return o.cabanaId === cab; });

    var nombre = 'Casa Verde Canas';
    if (cab) {
      var c = cabanas.filter(function (x) { return x._id === cab; })[0];
      // 'nombre' es un mapa {es, pt, en}: siempre se resuelve con nombre.es
      // y con respaldos, nunca directo.
      var n = c && c.nombre;
      var txt = (n && (n.es || n.pt || n.en)) || cab;
      nombre = 'Casa Verde · ' + txt;
    } else {
      nombre = 'Casa Verde · todas las cabañas';
    }

    var ahora = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    var l = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Casa Verde Canas//Disponibilidad//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      plegar('X-WR-CALNAME:' + escICS(nombre)),
      // Sugerencia de cada cuánto refrescar. Airbnb tiene su propio ritmo
      // (2 a 4 horas) y esto no lo apura, pero otros lectores sí lo miran.
      'X-PUBLISHED-TTL:PT1H',
      'REFRESH-INTERVAL;VALUE=DURATION:PT1H'
    ];

    ocupaciones.forEach(function (o) {
      var d1 = fechaICS(o.desde);
      var d2 = fechaICS(o.hasta);
      if (!d1 || !d2) return;   // una fecha rota tira el archivo entero
      l.push('BEGIN:VEVENT');
      l.push('UID:' + escICS(o._id) + '@casaverdecanas.com.br');
      l.push('DTSTAMP:' + ahora);
      l.push('DTSTART;VALUE=DATE:' + d1);
      // DTEND es EXCLUSIVO en un evento de día entero: la última noche
      // ocupada es la anterior al check-out, así que poner la fecha de salida
      // deja ese día libre para que entre otro huésped. Es justo lo que
      // queremos, y es el error clásico si uno le suma un día "para que
      // cierre bien".
      l.push('DTEND;VALUE=DATE:' + d2);
      // Nada de nombres ni montos: esta dirección es pública.
      l.push('SUMMARY:Ocupado');
      l.push(plegar('LOCATION:' + escICS(o.cabanaId || '')));
      l.push('TRANSP:OPAQUE');
      l.push('END:VEVENT');
    });

    l.push('END:VCALENDAR');

    return {
      statusCode: 200,
      headers: {
        // El tipo importa: con text/plain, algunas plataformas se niegan a
        // importar aunque el contenido sea correcto.
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="casaverde' + (cab ? '-' + cab : '') + '.ics"',
        'Cache-Control': 'public, max-age=600',
        'Access-Control-Allow-Origin': '*'
      },
      // CRLF obligatorio: el formato lo exige y los lectores estrictos
      // rechazan un archivo con saltos de línea de Unix.
      body: l.join('\r\n') + '\r\n'
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'No se pudo armar el calendario: ' + e.message
    };
  }
};
