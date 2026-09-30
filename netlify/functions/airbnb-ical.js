// Netlify Function: airbnb-ical
//
// Trae el calendario .ics de Airbnb y lo devuelve. Existe por dos razones:
//
//  1. EL NAVEGADOR NO PUEDE. Airbnb no permite que otro sitio lea su .ics
//     desde el navegador (CORS), así que la petición tiene que salir de un
//     servidor.
//  2. EL SERVIDOR TIENE QUE PARECER UN NAVEGADOR. Airbnb rechazó durante años
//     las peticiones automáticas que no venían de un navegador o de un
//     servicio grande —403 o 406—, y ese fue el motivo original de meter
//     Google Calendar en el medio. Acá se manda un User-Agent de navegador y
//     se corre sobre la red de AWS con TLS al día, que son justamente las dos
//     cosas que le faltaban a un servidor chico.
//
//     ⚠ NO ESTÁ COMPROBADO que hoy alcance. Por eso, si Airbnb rechaza, esta
//     función devuelve el CÓDIGO, LAS CABECERAS y los primeros bytes de lo
//     que contestó: si nos bloquea, vamos a saber cómo, en vez de adivinar.
//
// Uso:  /.netlify/functions/airbnb-ical?u=<url .ics de Airbnb>
//
// SOLO ACEPTA DIRECCIONES DE AIRBNB. Sin ese filtro esto sería un proxy
// abierto: cualquiera podría usar nuestro servidor para pedir lo que quiera,
// y el pedido saldría con nuestra dirección.

var PERMITIDOS = [
  /^https:\/\/(www\.)?airbnb\.[a-z.]{2,8}\/calendar\/ical\//i
];

// Un navegador de verdad manda esto. No es un disfraz para engañar a nadie:
// es lo que Airbnb espera de un lector de calendarios, y una petición sin
// cabeceras se ve como un robot y se rechaza.
var CABECERAS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    + ' (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Accept': 'text/calendar,text/plain,*/*',
  'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache'
};

exports.handler = async function (event) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  var u = (event.queryStringParameters && event.queryStringParameters.u) || '';
  if (!u) {
    return { statusCode: 400, headers: headers,
      body: JSON.stringify({ ok: false, error: 'Falta la dirección del calendario.' }) };
  }
  if (!PERMITIDOS.some(function (re) { return re.test(u); })) {
    return { statusCode: 400, headers: headers,
      body: JSON.stringify({ ok: false,
        error: 'Solo se aceptan direcciones .ics de Airbnb. La que llegó no lo es.' }) };
  }

  try {
    var r = await fetch(u, { headers: CABECERAS, redirect: 'follow' });
    var texto = await r.text();

    if (!r.ok) {
      // Todo lo que sirva para entender un rechazo, junto. Un "no anduvo" sin
      // datos obliga a adivinar, y adivinar sobre Airbnb ya costó una noche.
      var cab = {};
      try { r.headers.forEach(function (v, k) { cab[k] = v; }); } catch (e) { /* sin cabeceras */ }
      return { statusCode: 200, headers: headers, body: JSON.stringify({
        ok: false,
        status: r.status,
        motivo: r.status === 403 ? 'Airbnb rechazó la petición (403). Es el bloqueo histórico: '
              + 'sigue sin aceptar lecturas que no vengan de un navegador o de un servicio reconocido.'
          : r.status === 404 ? 'Esa dirección no existe. Si alguna vez tocaste "Reset URL" en Airbnb, '
              + 'la anterior murió en el instante: hay que copiar la nueva.'
          : r.status === 429 ? 'Demasiadas peticiones. Esperá un rato.'
          : 'Airbnb contestó ' + r.status + '.',
        cabeceras: cab,
        primerosBytes: texto.slice(0, 300)
      }) };
    }

    // Contestó 200, pero eso no alcanza: un muro anti-robots devuelve 200 con
    // una página HTML. Lo que vale es que empiece como un calendario.
    if (texto.indexOf('BEGIN:VCALENDAR') === -1) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({
        ok: false, status: r.status,
        motivo: 'Airbnb contestó 200 pero NO mandó un calendario. Suele ser una página '
          + 'de verificación: el bloqueo existe y llega disfrazado de respuesta buena.',
        primerosBytes: texto.slice(0, 300)
      }) };
    }

    return { statusCode: 200, headers: headers,
      body: JSON.stringify({ ok: true, status: r.status, ics: texto }) };
  } catch (e) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({
      ok: false,
      motivo: 'No se pudo llegar a Airbnb: ' + e.message,
      pista: 'Si dice algo de certificados o TLS, es el otro problema histórico.'
    }) };
  }
};
