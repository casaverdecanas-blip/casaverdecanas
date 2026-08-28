// ═══════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — service worker
//  Estrategia: shell precacheado (cache-first) · navegación
//  network-first con fallback al shell · el resto pasa directo
//  (los DATOS van por la caché persistente de Firestore, no
//  por acá — regla del anexo técnico).
//  Al cambiar cualquier archivo del shell: subir la VERSION.
// ═══════════════════════════════════════════════════════════

// v92 (28-ago-2026) — NACE cloudinary-listar. No existia: en el repo solo
//       estaban claude-proxy y notify-whatsapp. Se escribe de cero, con el
//       error de fondo evitado: la cuenta esta en modo Dynamic folders, donde
//       la carpeta va en 'asset_folder' y no en 'folder'. Buscar por el campo
//       viejo NO da error, devuelve cero con HTTP 200 — por eso el editor
//       decia "no hay fotos" con las fotos ahi. Ahora se busca por los DOS
//       campos y ademas por las SUBCARPETAS (cabanas/cabana1...), que una
//       busqueda por carpeta exacta no ve. Los comprobantes de Dinero
//       ('gastos') se excluyen en la propia expresion.
//       La funcion devuelve siempre un diagnostico —donde busco, cuantas
//       encontro por carpeta— y el editor lo muestra cuando la respuesta
//       vuelve vacia, que es cuando hace falta.
//       ⚠ VA A NETLIFY, NO AL SHELL: es codigo de servidor. Netlify no esta
//       enganchado a Git, asi que subirla a GitHub no la despliega: hay que
//       desplegarla a mano y cargar las variables de entorno.
// v91 (28-ago-2026) — REVISAR LAS FOTOS. Pantalla nueva 'fotos.html': junta
//       todas las fotos que muestra el sitio público y las mira una por una.
//       Encuentra las servidas por otro sitio (y las trae a Cloudinary, a la
//       carpeta que les toca, de a una y con confirmación), las que no cargan,
//       las que se piden sin la transformación de entrega —bajan en tamaño
//       original, que en 3G se nota— y las repetidas.
//       ⚠ LO QUE NO PUEDE SABER, Y ES A PROPÓSITO: en qué carpeta está
//       guardada cada foto. En modo Dynamic folders la carpeta es un dato
//       aparte del identificador y NO viaja en la URL, así que desde el
//       navegador es imposible. La pantalla lo dice en vez de fingir que
//       verificó: si cloudinary-listar responde, cruza y marca las mal
//       ubicadas; si no, muestra el identificador y la carpeta que
//       corresponde, para acomodarlas a mano.
//       Las correcciones reescriben el array de fotos ENTERO y lo releen del
//       servidor justo antes: Firestore no cambia un elemento por índice, y
//       'fotos.2' crearía un mapa con la clave "2" en vez de tocar el array.
// v90 (28-ago-2026) — LAS FOTOS SE SUBÍAN A LA RAÍZ. CV2.subirImagen nunca
//       mandaba carpeta, así que TODAS las fotos del sistema —las del sitio,
//       las de los alojamientos, los avatares— caían en la raíz de
//       Cloudinary, mezcladas con los comprobantes de Dinero. Por eso el
//       listado del editor no encontraba ninguna: buscaba en 'sitio',
//       'cabanas' y 'espacios', que estaban vacías.
//       Ahora subirImagen acepta una carpeta y la manda en 'asset_folder'
//       (el campo del modo Dynamic folders; 'folder' es del modo clásico y
//       se ignora sin dar error). El editor la deduce del destino: cada
//       alojamiento va a cabanas/cabanaN, las áreas comunes a 'Espacios'
//       —con E mayúscula, como está en Cloudinary— y el resto a 'sitio'.
//       El mapa de carpetas vive en CV2.CLOUDINARY.carpetas, en un solo
//       lugar. ⚠ PENDIENTE: la función cloudinary-listar de Netlify sigue
//       buscando mal y hasta que se corrija el listado seguirá vacío.
// v89 (28-ago-2026) — LA HOJA DE FOTOS NO SE CERRABA Y TRABABA EL GUARDADO.
//       Era un <dialog> nativo y su cierre pasaba por el parche de nucleo.js,
//       que engancha el botón Atrás moviendo el historial. Pero este editor
//       cambia el src de un iframe —al cambiar de página y al recargar el
//       sitio— y cada cambio de src agrega una entrada al historial de la
//       ventana: la pila de capas y el historial real dejan de coincidir, y
//       el history.back() del cierre retrocede una navegación del iframe en
//       lugar de quitar la entrada de la capa. La hoja quedaba abierta
//       tapando la barra de abajo, con el botón Guardar adentro: se podía
//       editar y no se podía guardar.
//       Pasa a ser un panel propio, el mismo patrón de traducir.html: no
//       toca el historial, el fondo también cierra y el área de la ✕ sube a
//       44px. Se agrega además el diagnóstico de Cloudinary en modo Dynamic
//       folders (asset_folder vs folder) al aviso de "no hay fotos".
// v88 (28-ago-2026) — DOS BOTONES MUERTOS EN EL EDITOR. 'Descartar' y
//       'Volver' seguían usando confirm(), que Chrome deja apagar desde
//       "impedir que esta página cree más diálogos". Apagado, confirm()
//       devuelve 'no' sin mostrar nada: Descartar no descartaba y Volver no
//       dejaba volver, los dos en silencio y sin explicar por qué. Pasan a
//       la capa propia del panel, la misma de traducir.html, que además
//       entra en la pila del botón Atrás. Nada más cambia.
// v87 (28-ago-2026) — EL ENLACE A 'la-casa.html' ESTABA ROTO. Al renombrar
//       las claves de punto a guión bajo en la v86, el reemplazo también
//       alcanzó la CADENA 'casa.html' dentro de 'la-casa.html': el guión
//       cuenta como límite de palabra, así que el patrón la tomó por una
//       clave. Los dos enlaces de la portada, el canonical y el og:url
//       quedaron apuntando a '/la-casa_html' — 404. El editor y el traductor
//       no se vieron afectados porque se escribieron después del reemplazo.
//       Lección: un reemplazo masivo por patrón se verifica contra las RUTAS
//       y las URLs del archivo, no solo contra las claves que se querían
//       tocar. Nada más cambia en esta versión.
// v86 (27-ago-2026) — REVISAR Y TRADUCIR, y un defecto de la v85 corregido
//       antes de que se notara. Nace 'traducir.html': saca TODO el español
//       con su contexto —leyendo las dos páginas del sitio en marcos ocultos,
//       no de una tabla a mano— con el pedido de auditoría adentro, y mete de
//       vuelta las correcciones pieza por pieza. Estado por idioma destino:
//       una pieza puede estar al día en portugués y vieja en inglés.
//       ⚠ EL DEFECTO DE LA v85: las claves nuevas se llamaban 'casa.r.ruido.t'
//       y el editor guarda con updateDoc, que lee CADA PUNTO del camino como
//       un nivel de anidamiento. Se habrían guardado en textos→es→casa→r→
//       ruido→t mientras el sitio lee la clave literal: el texto se guarda,
//       dice "✓ Sitio actualizado" y no se muestra nunca. Todas las claves
//       pasan a guión bajo ('casa_r_ruido_t') y editar.html se niega a
//       guardar una clave con punto en vez de fallar callado.
//       Además: el silencio pasa a ser de 0:00 a 8:00, y 'Editar el sitio'
//       entra a la barra (antes solo se llegaba desde Cabañas).
// v85 (27-ago-2026) — NACE LA PÁGINA DEL ACUERDO. El sitio público suma
//       'la-casa.html' en la RAÍZ: horarios, qué hay en la propiedad y el
//       acuerdo de convivencia, en los tres idiomas y editable encima del
//       sitio como la portada. La portada suma su resumen y el enlace.
//       'textos-sitio.js' pasa de 33 a 108 claves por idioma — POR ESO sube
//       la VERSION: ese archivo SÍ está en este SHELL. 'la-casa.html' NO
//       entra al SHELL y no puede: vive en la raíz, fuera del scope de
//       /interno/, igual que index.html de la raíz (ver v80).
//       Y editar.html suma el selector de página: sin él la página nueva
//       quedaba escrita y sin forma de corregirla.
// v84 (19-ago-2026) — LOS AVISOS DE ACTIVIDADES NO EXISTÍAN: se construyen.
//       Dos llaves nuevas en Mis avisos ('te asignaron una actividad' y
//       'actividad nueva del equipo') y el disparo en actividades.html. Más
//       un SIMULACRO que corre el mismo CV2.avisar y dice, persona por
//       persona, a quién le llega y por qué no. 'keepalive' en los dos
//       envíos: el aviso ya no muere si se cambia de página. Y el Inicio deja
//       de mostrar lo eliminado. nucleo.js + avisos.html + actividades.html +
//       index.html.
// v83 (19-ago-2026) — VOLVER ES VOLVER AL MISMO LUGAR. Salir de la Agenda a
//       editar una actividad y cerrar el formulario dejaba a la persona en
//       Actividades. Ahora los dos caminos —editar y crear— devuelven a la
//       Agenda, a la misma vista, la misma semana y el mismo punto de la
//       lista. agenda.html + actividades.html.
// v82 (19-ago-2026) — LA AGENDA SE ARMA SIN SALIR DE LA AGENDA. El árbol de
//       origen deja de venir todo desplegado: las ramas se pliegan y lo
//       plegado se recuerda. Y cada proyecto y cada actividad tienen un + que
//       lleva al formulario de Actividades con el padre ya elegido y vuelve
//       acá al guardar. agenda.html + actividades.html.
// v81 (19-ago-2026) — ELIMINAR YA NO BORRA. Una actividad se elimina con o sin
//       sub-ítems: se marca 'eliminado' y la rama entera desaparece de la
//       vista. Queda en la PAPELERA, que solo ve el administrador, y desde ahí
//       se vuelve a habilitar entera con una escritura o se borra de verdad.
//       actividades.html.
// v80 (18-ago-2026) — EL SITIO SE EDITA ENCIMA DEL SITIO. Nace editar.html:
//       el sitio público real, dentro de un marco, con los textos abiertos
//       para escribir y las fotos cambiables de un toque. Entra al SHELL.
//       El sitio (index.html de la RAÍZ, que NO está en este shell porque
//       vive fuera del scope de /interno/) suma el modo ?edit=1.
// v79 (7-ago-2026) — ⚠ EL DÍA DE HOY se calculaba en UTC: desde las 21:00 de
//       cada noche el sistema entero creía que ya era mañana. nucleo.js,
//       reservas-core.js, actividades.html y el index.html de la RAÍZ.
// v78 — panel de Airbnb: las dos direcciones de cada cabaña en
//       un solo lugar. Las direcciones .ics pasan a config/airbnb.
// v77 — Airbnb se lee por iCal DIRECTO, sin Google Calendar en
//       el medio, y publicamos nuestro propio .ics por cabaña para que Airbnb
//       bloquee las fechas solo. reservas-core.js + reservas.html.
// v76 — el detalle de una actividad pasa a VENTANA EMERGENTE, y
//       una limpieza muestra los datos de SU RESERVA: quién entra, cuántos,
//       a qué hora y qué pidieron. actividades.html.
// v75 — cada compra muestra su ruta entera: proyecto › … › lista.
// v74 — las COMPRAS pasan a servir para algo: la descripción de
//       una actividad-compra es la lista (una cosa por línea), y el filtro
//       🛒 Compras junta todo por lugar. actividades.html.
// v73 — la agenda se arma con CASILLAS y lo que no tiene fecha
//       flota en hoy. Y una revisión de todos los archivos encontró un
//       'getDoc' sin importar en reservas.html: reventaba al abrir un pago.
// v72 — la agenda tiene DOS vistas: Mi semana y el árbol de
//       Actividades. Se arrastra de una a la otra. El botón 📅 sale de
//       actividades.html: agregaba sin fecha y quedaba invisible.
// v71 — la agenda se arma ARRASTRANDO: franjas mañana/tarde,
//       pestañas fijas que son destino, y nota personal por actividad.
// v70 — la agenda pasa a ser SEMANAL, con hora por actividad,
//       tramos de varios días y un botón por persona para elegir qué ver.
//       agenda.html + actividades.html + nucleo.js.
// v69 — nace agenda.html: las actividades de cada uno por
//       CUÁNDO tocan. Entra al SHELL y a la barra de navegación.
// v68 — los modales de inventario de actividades.html tenían
//       'padding: 0' heredado y NINGÚN desplazamiento: con un inventario
//       largo el botón de confirmar quedaba fuera de la pantalla.
// v67 — las limpiezas se ordenan por FECHA dentro de su
//       proyecto y llevan marca propia (🧹 📤 🛒); el enlace del cronómetro
//       andando lleva a SU actividad. actividades.html + index.html.
// v66 — actividades.html: el Stop del cronómetro pregunta
//       siempre si la tarea quedó terminada, y cerrar una limpieza con el
//       reloj abre el control de check-out igual que con el botón ✓.
// v65 — index.html: una línea por ACUERDO, no por cabaña.
// v64 — manual.html: acuerdos, avisos, monedas y el gesto nuevo
//       de Actividades.
// v63 — las cabañas del acuerdo adoptan .cv-nodo:
//       design-system.css + reservas.html.
// v62 — árbol de nodos: design-system.css + actividades.html.
// v61 — el chat dispara los avisos: comunicacion.html.
// v60 — tanda de acuerdos: reservas.html, reservas-core.js, calendario.html,
//       nucleo.js.
// Subir la VERSION no es un trámite: al activarse, el 'activate' borra TODAS
// las cachés que no sean esta, y esa es la única forma segura de que un
// teléfono deje de servir la mezcla de archivos viejos y nuevos.
const VERSION = 'cv2-shell-v92';

const SHELL = [
  './',
  './index.html',
  './login.html',
  './actividades.html',
  './actividades-core.js',
  './honorarios.html',
  './gestion-sesiones.html',
  './comunicacion.html',
  './avisos.html',
  './usuarios.html',
  './manual.html',
  './reservas.html',
  './cabanas.html',
  './editar.html',
  './traducir.html',
  './fotos.html',
  './espacios.html',
  './calendario.html',
  './agenda.html',
  './clientes.html',
  './dinero.html',
  './balance.html',
  './reservas-core.js',
  './horas-stats.html',
  './recuerdos.html',
  './nucleo.js',
  './textos-sitio.js',
  './firebase-init.js',
  './design-system.css',
  './manifest.json',
  './img/logo-barra.png',
  './icono-192.png',
  './icono-512.png',
  './apple-touch-icon.png'
];

// OJO (lección jul-2026): 'addAll' es todo o nada — si UN archivo de la
// lista falta o da 404, la instalación entera falla y el service worker
// nuevo nunca se activa. La app queda servida por el viejo y parece que
// el deploy "no hizo nada". Se guarda de a uno, tolerando faltantes: lo
// que no esté, se buscará por red igual (la estrategia es red-primero).
self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.all(SHELL.map((u) =>
        c.add(u).catch((e) => console.warn('SW: no se pudo precachear', u, e))
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET') return;

  // Navegación (abrir/recargar páginas): red primero, caché si no hay señal
  if (ev.request.mode === 'navigate') {
    ev.respondWith(
      fetch(ev.request)
        .then((r) => {
          const copia = r.clone();
          caches.open(VERSION).then((c) => c.put(ev.request, copia));
          return r;
        })
        .catch(() =>
          caches.match(ev.request).then((r) => r ?? caches.match('./index.html'))
        )
    );
    return;
  }

  // Estáticos del mismo origen: RED PRIMERO con respaldo en caché.
  // (v14 — lección: con HTML red-primero y JS caché-primero, un deploy
  // podía mezclar página nueva con módulos viejos y romper en silencio.
  // Red-primero en todo el mismo origen elimina el desfase; sin señal,
  // la caché responde igual y la app sigue funcionando offline.)
  if (url.origin === location.origin) {
    ev.respondWith(
      fetch(ev.request)
        .then((r) => {
          const copia = r.clone();
          caches.open(VERSION).then((c) => c.put(ev.request, copia));
          return r;
        })
        .catch(() => caches.match(ev.request))
    );
  }
  // Todo lo demás (gstatic, fonts, Firestore) sigue su camino normal.
});
