// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — nucleo.js
//  Corazón compartido del panel: auth + perfil, permisos, navegación,
//  helpers de formato y color, toasts, imágenes, registro del SW.
//  Namespace único: CV2 (import { CV2 } from './nucleo.js')
// ═══════════════════════════════════════════════════════════════

import { auth, db, doc, getDoc, updateDoc, collection, getDocs, serverTimestamp, onAuthStateChanged, signOut, terminate, clearIndexedDbPersistence } from './firebase-init.js';

export const CV2 = {};

// ── Sesión ───────────────────────────────────────────────────
CV2.usuario = null;   // { uid, nombre, email, rol, permisos, activo }

/**
 * Verifica sesión y carga el perfil. Si no hay sesión, no hay perfil o el
 * usuario está inactivo → sale a login con el MOTIVO en la dirección.
 * Uso:  const u = await CV2.verificarAuth();
 *
 * Cuatro cosas que acá se hacen así a propósito (lección jul-2026, el
 * rebote infinito con un usuario nuevo):
 *
 * 1. **`location.replace`, nunca `location.href`.** Con `href`, cada
 *    rebote deja una entrada en el historial: index → login queda con
 *    index atrás. En la PWA instalada, Atrás es el gesto más usado, y
 *    volver a index vuelve a rebotar a login… para siempre. `replace`
 *    pisa la entrada y corta el ciclo de raíz.
 * 2. **Se corta la escucha antes de salir.** `onAuthStateChanged` es un
 *    oyente permanente: el `signOut` de más abajo lo despierta otra vez
 *    con sesión nula y disparaba una SEGUNDA navegación encima de la
 *    primera. Una carrera entre dos redirecciones no se depura nunca.
 * 3. **Si ya estamos en login, no se navega.** Cualquier futuro rebote
 *    contra sí mismo muere acá.
 * 4. **Nada puede quedar colgado.** Si la lectura del perfil no vuelve
 *    en 15 segundos (base local trancada, red muerta), se sale con
 *    `e=trancado` en vez de dejar la página en blanco para siempre:
 *    esta promesa está esperada con `await` arriba de todo, y una
 *    promesa que nunca resuelve es una app que nunca arranca.
 */
CV2.ESPERA_PERFIL = 15000;

CV2.verificarAuth = function () {
  return new Promise((resolver) => {
    let quitar = null;
    let listo = false;

    const salir = (motivo) => {
      if (listo) return;
      listo = true;
      if (quitar) { try { quitar(); } catch { /* ya cortada */ } }
      if (location.pathname.indexOf('login.html') !== -1) return;   // ya estamos ahí
      location.replace('./login.html?e=' + encodeURIComponent(motivo));
    };

    quitar = onAuthStateChanged(auth, async (fbUser) => {
      if (listo) return;
      if (!fbUser) { salir('sesion'); return; }
      try {
        // Reloj de guardia: la promesa que gana es la primera que vuelve.
        const snap = await Promise.race([
          getDoc(doc(db, 'usuarios', fbUser.uid)),
          new Promise((_, rechazar) => setTimeout(() => {
            const e = new Error('La lectura del perfil no volvió.');
            e.code = 'trancado';
            rechazar(e);
          }, CV2.ESPERA_PERFIL))
        ]);

        // Sesión en Auth SIN documento en /usuarios/ NO es lo mismo que
        // "desactivado": es una cuenta que todavía no fue dada de alta.
        // Decirle "estás desactivado" a alguien que entra por primera vez
        // manda a buscar el problema al lado equivocado.
        if (!snap.exists()) { await CV2._salirLimpio(); salir('sinperfil'); return; }
        if (snap.data().activo !== true) { await CV2._salirLimpio(); salir('inactivo'); return; }

        CV2.usuario = { uid: fbUser.uid, email: fbUser.email, ...snap.data() };
        if (listo) return;
        listo = true;
        if (quitar) { try { quitar(); } catch { /* ya cortada */ } }
        if (CV2.usuario.rol === 'admin') CV2._listonAdmin();
        resolver(CV2.usuario);
      } catch (e) {
        // §3.9: el catch de auth NO redirige en silencio. El código viaja
        // en la dirección y login lo muestra: un rebote mudo es imposible
        // de diagnosticar desde un teléfono.
        console.error('verificarAuth:', e);
        await CV2._salirLimpio();
        salir(e && e.code === 'trancado' ? 'trancado' : 'error:' + ((e && e.code) || 'desconocido'));
      }
    });
  });
};

/** signOut que nunca revienta ni frena la salida. */
CV2._salirLimpio = async function () {
  try { await signOut(auth); } catch (e) { console.warn('signOut:', e); }
};

// ── Permisos ─────────────────────────────────────────────────
// FUENTE ÚNICA del catálogo: lo usan la navegación, el editor de
// usuarios y cada página que gobierne una acción fuerte. Si un permiso
// nuevo no está acá, no existe.
//
// El rol 'admin' es UNA sola cuenta (CasaVerde): mantenimiento y acceso
// sin restricciones. Todos los demás trabajan con permisos explícitos.
CV2.PERMISOS = [
  {
    id: 'reservas', label: 'Reservas', icono: 'king_bed',
    detalle: 'Reservas, presupuestos y clientes.'
  },
  {
    id: 'dinero', label: 'Registrar gastos', icono: 'savings',
    detalle: 'Carga movimientos y ve SOLO los suyos. Sin balances ni totales del negocio.'
  },
  {
    id: 'finanzas', label: 'Finanzas completas', icono: 'account_balance',
    detalle: 'Ve todo el dinero, hace balance y exporta. Incluye lo de "Registrar gastos".'
  },
  {
    id: 'contenido', label: 'Contenido del sitio', icono: 'cottage',
    detalle: 'Editar cabañas y espacios comunes.'
  },
  {
    id: 'horas', label: 'Horas del equipo', icono: 'insights',
    detalle: 'Gestor de sesiones y análisis de horas de todas las personas.'
  }
];

CV2.esAdmin = () => CV2.usuario?.rol === 'admin';

/** ¿Tiene este permiso? El admin siempre puede. */
CV2.puede = (permiso) =>
  CV2.esAdmin() || CV2.usuario?.permisos?.[permiso] === true;

/** ¿Tiene alguno de estos permisos? */
CV2.puedeAlguno = (lista) =>
  CV2.esAdmin() || (lista || []).some((p) => CV2.usuario?.permisos?.[p] === true);

/**
 * Cerrar sesión. La caché local es UNA por navegador: si otra persona
 * entra en el mismo dispositivo, no debe encontrar datos de la anterior.
 * Por eso se borra — pero NUNCA a costa de poder salir.
 *
 * Antes esto era `await terminate(db); await clearIndexedDbPersistence(db);`
 * sin plazo. `clearIndexedDbPersistence` se queda esperando si hay OTRA
 * pestaña (o la PWA instalada) con la base abierta: el `await` no vuelve,
 * la línea del `location` de abajo no se ejecuta nunca y el botón "Cerrar
 * sesión" parece no hacer nada. Ahora la limpieza corre contra un reloj de
 * 3 segundos y la salida ocurre igual.
 */
// ── Foto de persona ──────────────────────────────────────────
// Cada uno tiene su foto en usuarios/{uid}.fotoUrl. Si no la tiene, van
// las iniciales: mismo tamaño y misma forma, para que ninguna lista salte
// cuando alguien sube la suya.
//
// POR QUÉ NO SE SACA DE GMAIL: no existe forma de obtener la foto de una
// cuenta de Google a partir del mail. Google la entrega SOLO cuando la
// persona inicia sesión con Google, y acá se entra con mail y contraseña.
// Así que la sube cada uno, por el mismo camino que toda foto del sistema
// (CV2.elegirYSubirImagen → Cloudinary con la URL de entrega liviana).
CV2.inicialesDe = function (nombre) {
  return String(nombre || '').trim().split(/\s+/).slice(0, 2)
    .map((p) => p[0] || '').join('').toUpperCase() || '·';
};

/** Devuelve el <img> con la foto o el <span> con las iniciales. */
CV2.avatarHTML = function (persona) {
  const p = persona || {};
  if (p.fotoUrl) {
    return '<img class="cv-foto" src="' + CV2.esc(p.fotoUrl) + '" alt="'
      + CV2.esc(p.nombre || '') + '">';
  }
  return '<span class="cv-inicial">' + CV2.esc(CV2.inicialesDe(p.nombre)) + '</span>';
};

/** Cambia MI foto. La regla deja que cada uno escriba solo su 'fotoUrl'. */
CV2.cambiarMiFoto = async function () {
  const url = await CV2.elegirYSubirImagen({ titulo: 'Tu foto' });
  if (!url) return false;
  try {
    await updateDoc(doc(db, 'usuarios', CV2.usuario.uid), {
      fotoUrl: url, actualizadoEn: serverTimestamp()
    });
    CV2.usuario.fotoUrl = url;
    CV2._refrescarAvatar();
    CV2.toast('Foto actualizada', 'success');
    return true;
  } catch (e) {
    CV2.toast('No se pudo guardar la foto: ' + (e.code ?? e.message), 'error');
    return false;
  }
};

CV2.quitarMiFoto = async function () {
  try {
    await updateDoc(doc(db, 'usuarios', CV2.usuario.uid), {
      fotoUrl: '', actualizadoEn: serverTimestamp()
    });
    CV2.usuario.fotoUrl = '';
    CV2._refrescarAvatar();
    CV2.toast('Foto quitada', 'success');
  } catch (e) {
    CV2.toast('No se pudo quitar: ' + (e.code ?? e.message), 'error');
  }
};

// Repinta el avatar sin recargar la página: la cabecera y la hoja de cuenta.
CV2._refrescarAvatar = function () {
  const html = CV2.usuario.fotoUrl
    ? '<img src="' + CV2.esc(CV2.usuario.fotoUrl) + '" alt="">'
    : CV2.esc(CV2.inicialesDe(CV2.usuario.nombre));
  document.querySelectorAll('.cv-avatar').forEach((el) => { el.innerHTML = html; });
  const q = document.getElementById('cv-btn-quitar-foto');
  if (q) q.classList.toggle('oculto', !CV2.usuario.fotoUrl);
};

CV2.cerrarSesion = async function () {
  await CV2._salirLimpio();
  try {
    await Promise.race([
      (async () => { await terminate(db); await clearIndexedDbPersistence(db); })(),
      new Promise((r) => setTimeout(r, 3000))
    ]);
  } catch (e) { console.warn('limpieza de caché local:', e); }
  location.replace('./login.html');
};

/**
 * SALIDA DE EMERGENCIA — "Reparar la app".
 *
 * Para qué: el panel vive en el teléfono, dentro de una PWA instalada, y
 * ahí no hay consola ni forma cómoda de borrar datos del sitio. Cuando
 * algo del lado del navegador queda trancado (un service worker viejo
 * sirviendo mezcla, una base local a medio cerrar, una sesión que rebota),
 * hasta hoy la única salida era entrar a la configuración de Chrome a
 * borrar los datos del sitio. Esto hace lo mismo desde un botón.
 *
 * Qué borra: los service workers, TODAS las cachés del shell y las bases
 * locales de Firebase (perfil de sesión + caché de Firestore). NO toca
 * nada del servidor: ni un documento, ni una foto, ni un usuario.
 */
CV2.repararApp = async function (avisar) {
  const decir = avisar || function () {};
  try { await CV2._salirLimpio(); } catch { /* seguimos */ }
  try { await terminate(db); } catch { /* puede estar ya muerta */ }

  decir('Sacando el service worker…');
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) { try { await r.unregister(); } catch { /* sigue */ } }
    }
  } catch (e) { console.warn('reparar · sw:', e); }

  decir('Vaciando las cachés…');
  try {
    if (window.caches) {
      const claves = await caches.keys();
      for (const k of claves) { try { await caches.delete(k); } catch { /* sigue */ } }
    }
  } catch (e) { console.warn('reparar · cachés:', e); }

  decir('Borrando la base local…');
  try {
    let nombres = [];
    // indexedDB.databases() no está en todos los navegadores: si no está,
    // se van a buscar las dos bases de Firebase por nombre conocido.
    if (indexedDB.databases) {
      try { nombres = (await indexedDB.databases()).map((d) => d.name).filter(Boolean); } catch { nombres = []; }
    }
    if (!nombres.length) nombres = ['firebaseLocalStorageDb', 'firebase-heartbeat-database'];
    for (const n of nombres) await CV2._borrarBase(n);
  } catch (e) { console.warn('reparar · indexedDB:', e); }

  decir('Listo. Volviendo a empezar…');
  return true;
};

/** deleteDatabase con plazo: si otra pestaña la tiene abierta, queda
 *  'blocked' y esperaría para siempre. Se le dan 2,5 segundos. */
CV2._borrarBase = function (nombre) {
  return new Promise((resolver) => {
    let cerrado = false;
    const fin = () => { if (!cerrado) { cerrado = true; resolver(); } };
    setTimeout(fin, 2500);
    try {
      const p = indexedDB.deleteDatabase(nombre);
      p.onsuccess = fin; p.onerror = fin; p.onblocked = fin;
    } catch { fin(); }
  });
};

// Listón diagonal amarillo/negro: sesión admin a la vista
CV2._listonAdmin = function () {
  document.body.classList.add('cv-admin');   // la cabecera le deja 8px
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;height:8px;z-index:9999;background:repeating-linear-gradient(45deg,#e6b800 0 14px,#1a1a1a 14px 28px);pointer-events:none;';
  document.body.appendChild(el);
};

// ═════════════════════════════════════════════════════════════
//  NAVEGACIÓN — pensada para TELÉFONO ANDROID con la PWA instalada
//  (CONVENCIONES §6.0: el teléfono manda; el escritorio se adapta).
//
//  Cómo quedó y por qué:
//  · La barra va ABAJO. En un teléfono grande la esquina de arriba no
//    se alcanza con una mano; el pulgar vive en el tercio inferior.
//    Cuatro destinos de todos los días + "Más".
//  · "Más" y la cuenta abren HOJAS que suben desde abajo, no menús que
//    caen desde arriba: se alcanzan y se cierran con el pulgar.
//  · El botón ATRÁS de Android cierra la hoja y NO sale de la app
//    (pushState al abrir + popstate al volver). Sin esto, cerrar algo
//    con Atrás te expulsa de la aplicación y perdés lo que cargabas.
//  · env(safe-area-inset-*): instalada, la app dibuja debajo de la barra
//    de estado y por encima de la franja de gestos. Sin esos respiros,
//    el último botón queda tapado.
//  · La cabecera es mínima (logo + título + persona) y se esconde al
//    bajar: el alto de pantalla es el recurso escaso.
//  · En ≥900px la MISMA barra se acomoda arriba en horizontal. Es un
//    @media, no un segundo diseño.
//
//  Los estilos viven en design-system.css, bloque "NAVEGACIÓN"
//  (clases cv-*). Acá solo se arma el HTML y se atan los gestos.
// ═════════════════════════════════════════════════════════════

// `permiso: null`  → visible para cualquiera activo.
// `permiso: 'x'`   → requiere ese permiso.
// `permiso: [...]` → requiere alguno de esos.
// `soloAdmin: true`→ únicamente la cuenta CasaVerde.
// `grupo`          → 'directo' va en la barra de abajo; el resto, en la
//                    hoja de "Más", bajo el título de su grupo.
CV2.NAV = [
  { id: 'inicio', label: 'Inicio', corto: 'Inicio', href: './index.html', icono: 'home', permiso: null, grupo: 'directo' },
  { id: 'actividades', label: 'Actividades', corto: 'Tareas', href: './actividades.html', icono: 'checklist', permiso: null, grupo: 'directo' },
  { id: 'calendario', label: 'Calendario', corto: 'Ocupación', href: './calendario.html', icono: 'calendar_month', permiso: null, grupo: 'directo' },
  // Agenda y Calendario se parecen en la forma y no tienen nada que ver en el
  // contenido: el Calendario muestra la OCUPACIÓN de las cabañas —quién entra,
  // quién sale— y sale de las reservas; la Agenda muestra el TRABAJO de cada
  // uno y sale de las actividades. Por eso el Calendario pasa a decir
  // "Ocupación" en la barra: dos cosas con el mismo nombre no se distinguen.
  { id: 'agenda', label: 'Agenda', corto: 'Agenda', href: './agenda.html', icono: 'event_note', permiso: null, grupo: 'directo' },
  { id: 'comunicacion', label: 'Chat', corto: 'Chat', href: './comunicacion.html', icono: 'forum', permiso: null, grupo: 'directo' },

  { id: 'reservas', label: 'Reservas', href: './reservas.html', icono: 'king_bed', permiso: 'reservas', grupo: 'alojamiento' },
  { id: 'clientes', label: 'Clientes', href: './clientes.html', icono: 'contacts', permiso: 'reservas', grupo: 'alojamiento' },

  { id: 'dinero', label: 'Dinero', href: './dinero.html', icono: 'savings', permiso: ['dinero', 'finanzas'], grupo: 'plata' },
  { id: 'honorarios', label: 'Cobros', href: './honorarios.html', icono: 'payments', permiso: null, grupo: 'plata' },
  { id: 'sesiones', label: 'Sesiones', href: './gestion-sesiones.html', icono: 'schedule', permiso: null, grupo: 'plata' },
  { id: 'horas', label: 'Horas', href: './horas-stats.html', icono: 'insights', permiso: 'horas', grupo: 'plata' },

  { id: 'cabanas', label: 'Cabañas', href: './cabanas.html', icono: 'cottage', permiso: 'contenido', grupo: 'sitio' },
  { id: 'espacios', label: 'Espacios', href: './espacios.html', icono: 'deck', permiso: 'contenido', grupo: 'sitio' },
  { id: 'recuerdos', label: 'Recuerdos', href: './recuerdos.html', icono: 'photo_library', permiso: 'contenido', grupo: 'sitio' },
  // Opiniones ≠ Recuerdos, y por eso son dos pantallas: los recuerdos son
  // fotos que suben los huéspedes DESPUÉS de la estadía; las opiniones son
  // palabra ajena que se lee ANTES de decidir. Juntarlas mezclaría dos
  // cosas que ni se cargan igual ni se muestran en el mismo lugar.
  { id: 'opiniones', label: 'Opiniones', href: './opiniones.html', icono: 'reviews', permiso: 'contenido', grupo: 'sitio' },
  // Editar y Traducir trabajan sobre el MISMO contenido y desde acá se llega
  // a los dos. Hasta la T11.46 el editor solo se alcanzaba desde Cabañas: una
  // pantalla a la que no lleva ningún camino visible es una pantalla que no
  // existe para quien no la escribió.
  { id: 'editar', label: 'Editar el sitio', href: './editar.html', icono: 'edit_note', permiso: 'contenido', grupo: 'sitio' },
  { id: 'traducir', label: 'Revisar y traducir', href: './traducir.html', icono: 'translate', permiso: 'contenido', grupo: 'sitio' },
  { id: 'fotos', label: 'Revisar las fotos', href: './fotos.html', icono: 'photo_camera_back', permiso: 'contenido', grupo: 'sitio' },

  // Grupo 'cuenta' → hoja de la persona (el botón redondo de la cabecera).
  // "Mis avisos" es la PRIMERA pantalla del 2.0 donde alguien configura algo
  // suyo, así que va sin permiso: cada uno decide por dónde le llegan las
  // cosas. 'Usuarios' sigue siendo del administrador.
  { id: 'avisos', label: 'Mis avisos', href: './avisos.html', icono: 'notifications', permiso: null, grupo: 'cuenta' },
  { id: 'usuarios', label: 'Usuarios', href: './usuarios.html', icono: 'group', permiso: null, soloAdmin: true, grupo: 'cuenta' }
];

// Títulos de los grupos en la hoja de "Más". El orden manda.
CV2.GRUPOS = [
  { id: 'alojamiento', label: 'Alojamiento' },
  { id: 'plata', label: 'Plata' },
  { id: 'sitio', label: 'Sitio' }
];

CV2.verItem = function (it) {
  if (it.soloAdmin) return CV2.esAdmin();
  if (!it.permiso) return true;
  return Array.isArray(it.permiso) ? CV2.puedeAlguno(it.permiso) : CV2.puede(it.permiso);
};

/**
 * Capa emergente (hoja, modal, panel) que se cierra con el botón ATRÁS
 * de Android en vez de salir de la aplicación.
 *
 *   const cerrar = CV2.capaAtras(() => dialogo.close());
 *   ...  cerrar();     // desde Cancelar, desde el fondo, al guardar
 *
 * Devuelve la función con la que hay que cerrar: limpia su propia
 * entrada del historial, así el siguiente Atrás vuelve a la página
 * anterior y no reabre nada.
 *
 * Las capas se apilan: si desde un modal se abre otro, Atrás cierra
 * primero el de arriba. Por eso hay UN solo listener de 'popstate' y
 * una pila, en vez de un listener por capa (con uno por capa, un solo
 * Atrás cerraba todas juntas).
 */
CV2._capas = [];
CV2._ignorarPop = 0;

CV2.capaAtras = function (cerrar) {
  const capa = { cerrar, viva: true };
  CV2._capas.push(capa);
  history.pushState({ cvCapa: CV2._capas.length }, '');
  return function () {
    if (!capa.viva) return;
    capa.viva = false;
    const i = CV2._capas.indexOf(capa);
    if (i >= 0) CV2._capas.splice(i, 1);
    // Sacamos del historial la entrada que agregamos al abrir. Ese
    // back() dispara un 'popstate' que NO es del usuario: se ignora,
    // si no cerraría también la capa de abajo.
    if (history.state && history.state.cvCapa) {
      CV2._ignorarPop++;
      history.back();
    }
    cerrar();
  };
};

window.addEventListener('popstate', () => {
  if (CV2._ignorarPop > 0) { CV2._ignorarPop--; return; }
  const capa = CV2._capas.pop();
  if (capa && capa.viva) { capa.viva = false; capa.cerrar(); }
});

/**
 * Hace que TODOS los <dialog> del sistema se cierren con el botón Atrás,
 * sin tocar ni una línea de las páginas.
 *
 * Por qué así y no página por página: son catorce páginas con más de
 * treinta modales, y cada uno abre y cierra desde varios lugares
 * (Cancelar, guardar, la cruz, Escape). Migrarlos a mano es repetir el
 * mismo par de líneas decenas de veces y olvidarse en alguno — y el que
 * se olvide sigue expulsando de la app justo cuando hay un formulario
 * lleno. Se envuelve una vez `showModal` y `close`, y queda cubierto
 * todo, incluso los modales que se escriban mañana.
 *
 * Contrapartida honesta: es "magia" a nivel del navegador. Si algún día
 * un modal se comporta raro con Atrás, el sospechoso es esto y está
 * todo acá, en un solo lugar.
 */
CV2.dialogosConAtras = function () {
  if (CV2._dialogosListos) return;
  CV2._dialogosListos = true;
  const P = window.HTMLDialogElement && window.HTMLDialogElement.prototype;
  if (!P || !P.showModal) return;

  const abrirNativo = P.showModal;
  const cerrarNativo = P.close;
  const cierres = new WeakMap();

  P.showModal = function () {
    const r = abrirNativo.apply(this, arguments);
    if (!cierres.has(this)) {
      const dlg = this;
      cierres.set(dlg, CV2.capaAtras(() => {
        cierres.delete(dlg);
        cerrarNativo.call(dlg);
      }));
      // Escape y los <form method="dialog"> cierran por dentro, sin
      // pasar por close(): ahí hay que limpiar el historial igual.
      dlg.addEventListener('close', function alCerrar() {
        const pendiente = cierres.get(dlg);
        if (pendiente) { cierres.delete(dlg); pendiente(); }
      }, { once: true });
    }
    return r;
  };

  P.close = function (valor) {
    const cerrar = cierres.get(this);
    if (!cerrar) return cerrarNativo.apply(this, arguments);
    cierres.delete(this);
    if (valor !== undefined) this.returnValue = valor;
    cerrar();
  };
};

// ── Puntito de novedad sobre una pestaña ─────────────────────
// Lo enciende la página que sabe (por ejemplo el Inicio, con los
// mensajes sin leer):  CV2.marcarNovedad('comunicacion', true)
CV2.marcarNovedad = function (id, hay) {
  const t = document.querySelector('.cv-tab[data-id="' + id + '"]');
  if (t) t.classList.toggle('con-novedad', hay !== false);
};

CV2.renderNav = function (activo) {
  const cont = document.getElementById('nav');
  if (!cont) return;
  CV2.dialogosConAtras();          // el Atrás cierra modales, no la app
  document.body.classList.add('cv-conbarra');

  const visibles = CV2.NAV.filter(CV2.verItem);
  const directos = visibles.filter((it) => it.grupo === 'directo');
  const enHoja = visibles.filter((it) => it.grupo !== 'directo' && it.grupo !== 'cuenta');
  const deCuenta = visibles.filter((it) => it.grupo === 'cuenta');
  const activoEnHoja = enHoja.some((it) => it.id === activo);

  const itemActual = CV2.NAV.find((it) => it.id === activo);
  const titulo = (itemActual && itemActual.label)
    || document.title.replace(/^CasaVerde 2\.0\s*·\s*/, '');

  const nombre = CV2.usuario?.nombre ?? '';
  const iniciales = CV2.inicialesDe(nombre);
  // Dentro del botón redondo va la foto o las iniciales. El <img> ocupa el
  // botón entero (.cv-avatar img en design-system.css), así que el círculo
  // mide lo mismo en los dos casos.
  const caraHTML = CV2.usuario?.fotoUrl
    ? '<img src="' + CV2.esc(CV2.usuario.fotoUrl) + '" alt="">'
    : CV2.esc(iniciales);

  const tab = (it) =>
    '<a class="cv-tab ' + (it.id === activo ? 'activo' : '') + '" data-id="' + it.id + '"'
    + ' href="' + it.href + '">'
    + '<span class="material-icons">' + it.icono + '</span>' + CV2.esc(it.corto || it.label)
    + '</a>';

  const enlaceHoja = (it) =>
    '<a href="' + it.href + '" class="' + (it.id === activo ? 'activo' : '') + '">'
    + '<span class="material-icons">' + it.icono + '</span>' + CV2.esc(it.label) + '</a>';

  const grupos = CV2.GRUPOS.map((g) => {
    const items = enHoja.filter((it) => it.grupo === g.id);
    if (!items.length) return '';
    return '<h4>' + CV2.esc(g.label) + '</h4>' + items.map(enlaceHoja).join('');
  }).join('');

  cont.innerHTML =
    '<header class="cv-cab" id="cv-cab"><div class="cv-cab-in">'
    // Si todavía no está la copia de /interno/img/, cae en el logo del
    // shell; si tampoco está, se saca y no deja el ícono roto.
    + '<img src="./img/logo-barra.png" alt="Casa Verde Canas"'
    + ' onerror="if(!this.dataset.r){this.dataset.r=1;this.src=\'./logo-sitio.png\';}else{this.remove();}">'
    + '<span class="cv-titulo">' + CV2.esc(titulo) + '</span>'
    + '<button class="cv-avatar" id="cv-btn-yo" title="' + CV2.esc(nombre) + '">'
    + caraHTML + '</button>'
    + '</div></header>'

    + '<nav class="cv-barra"><div class="cv-barra-in">'
    + directos.map(tab).join('')
    + '<button class="cv-tab ' + (activoEnHoja ? 'activo' : '') + '" id="cv-btn-mas">'
    + '<span class="material-icons">apps</span>Más</button>'
    + '</div></nav>'

    + '<div class="cv-tapa" id="cv-tapa"></div>'

    + '<div class="cv-hoja" id="cv-hoja-mas"><div class="cv-agarre"></div>'
    + (grupos || '<h4>Nada más por acá</h4>')
    + '</div>'

    + '<div class="cv-hoja" id="cv-hoja-yo"><div class="cv-agarre"></div>'
    + '<div class="cv-quien"><span class="cv-avatar" style="cursor:default">'
    + caraHTML + '</span><span><b>' + CV2.esc(nombre) + '</b>'
    + '<span class="rol">' + (CV2.esAdmin() ? 'administrador' : 'colaborador') + '</span></span></div>'
    + deCuenta.map(enlaceHoja).join('')
    + '<a href="./manual.html#' + CV2.esc(activo || '') + '">'
    + '<span class="material-icons">help</span>Ayuda de esta página</a>'
    + '<button id="cv-btn-foto"><span class="material-icons">photo_camera</span>'
    + (CV2.usuario?.fotoUrl ? 'Cambiar mi foto' : 'Poner mi foto') + '</button>'
    + '<button id="cv-btn-quitar-foto" class="' + (CV2.usuario?.fotoUrl ? '' : 'oculto') + '">'
    + '<span class="material-icons">hide_image</span>Quitar mi foto</button>'
    + '<button id="cv-btn-reparar"><span class="material-icons">healing</span>Reparar la app</button>'
    + '<button id="cv-btn-salir"><span class="material-icons">logout</span>Cerrar sesión</button>'
    + '</div>';

  // ── Hojas ──────────────────────────────────────────────────
  const tapa = document.getElementById('cv-tapa');
  let cerrarActual = null;

  const abrir = (id) => {
    if (cerrarActual) return;
    const hoja = document.getElementById(id);
    hoja.classList.add('abierta');
    tapa.classList.add('abierta');
    // El Atrás de Android cierra la hoja, no la aplicación.
    cerrarActual = CV2.capaAtras(() => {
      hoja.classList.remove('abierta');
      tapa.classList.remove('abierta');
      cerrarActual = null;
    });
  };
  const cerrar = () => { if (cerrarActual) cerrarActual(); };

  document.getElementById('cv-btn-mas').addEventListener('click', () => abrir('cv-hoja-mas'));
  document.getElementById('cv-btn-yo').addEventListener('click', () => abrir('cv-hoja-yo'));
  tapa.addEventListener('click', cerrar);
  document.getElementById('cv-btn-salir').addEventListener('click', CV2.cerrarSesion);
  document.getElementById('cv-btn-foto').addEventListener('click', async () => {
    cerrar();                       // la hoja se va: la cámara necesita la pantalla
    await CV2.cambiarMiFoto();
  });
  document.getElementById('cv-btn-quitar-foto').addEventListener('click', async () => {
    if (!confirm('¿Quitar tu foto? Vuelven tus iniciales.')) return;
    cerrar();
    await CV2.quitarMiFoto();
  });
  document.getElementById('cv-btn-reparar').addEventListener('click', async () => {
    if (!confirm('Reparar borra lo que la app guardó en ESTE teléfono (cachés y sesión) y te pide entrar de nuevo.\n\nNo se toca nada del servidor: ni datos, ni fotos, ni usuarios.\n\n¿Seguimos?')) return;
    CV2.toast('Reparando…');
    await CV2.repararApp((m) => CV2.toast(m));
    location.replace('./login.html?e=reparada');
  });

  // ── La cabecera se esconde al bajar ────────────────────────
  const cab = document.getElementById('cv-cab');
  let ultimo = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    cab.classList.toggle('escondida', y > 70 && y > ultimo);
    ultimo = y;
  }, { passive: true });
};

// ── Helpers de texto y formato ───────────────────────────────
CV2.esc = (s) => String(s ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

/** 'YYYY-MM-DD' | Timestamp | Date → 'dd/mm/aaaa' */
CV2.fmtFecha = function (f) {
  if (!f) return '—';
  let d;
  if (typeof f === 'string') { const [a, m, dd] = f.split('-'); return `${dd}/${m}/${a}`; }
  d = f.toDate ? f.toDate() : f;
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/** horas decimales → '2h 30m' */
CV2.fmtHM = function (h) {
  h = Number(h) || 0;
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return mm === 0 ? `${hh}h` : (hh === 0 ? `${mm}m` : `${hh}h ${mm}m`);
};

CV2.fmtMonto = (n, moneda = 'BRL') =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moneda }).format(Number(n) || 0);

// La fecha LOCAL de un Date, en formato 'YYYY-MM-DD'.
//
// NO usa toISOString(): eso da la fecha en UTC, y Brasil está tres horas
// atrás. A las 21:00 del 6 de agosto en Canasvieiras, en UTC ya son las 00:00
// del 7 — así que desde las 21:00 TODAS LAS NOCHES el sistema creía que ya era
// mañana. Consecuencias: una tarea de hoy aparecía vencida, la agenda ponía
// "hoy" en el día siguiente, y el calendario del sitio público deshabilitaba
// el día de hoy. Encontrado el 7-ago-2026 revisando el sitio público.
//
// Cuidado al sumar días: hacerlo sobre medianoche local puede caer del otro
// lado del cambio de horario. Se hace siempre desde el MEDIODÍA
// ('YYYY-MM-DDT12:00:00'), que deja doce horas de margen para cualquier zona.
CV2.fechaLocal = (d) => (d || new Date()).getFullYear()
  + '-' + String((d || new Date()).getMonth() + 1).padStart(2, '0')
  + '-' + String((d || new Date()).getDate()).padStart(2, '0');

CV2.hoyISO = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
    + '-' + String(d.getDate()).padStart(2, '0');
};

// ── Colores de proyecto (cascada, heredado del diseño viejo) ─
const _pastelCache = {};
CV2.pastelDe = function (hex) {
  if (!hex || hex[0] !== '#' || hex.length !== 7) hex = '#2d5a27';
  if (_pastelCache[hex]) return _pastelCache[hex];
  const mez = (c) => Math.round(c + (255 - c) * 0.86).toString(16).padStart(2, '0');
  const out = '#' + mez(parseInt(hex.slice(1, 3), 16))
                  + mez(parseInt(hex.slice(3, 5), 16))
                  + mez(parseInt(hex.slice(5, 7), 16));
  _pastelCache[hex] = out;
  return out;
};

// ── Toasts ───────────────────────────────────────────────────
CV2.toast = function (msj, tipo = 'info') {
  const el = document.createElement('div');
  el.className = `toast toast-${tipo}`;
  el.textContent = msj;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));
  setTimeout(() => { el.classList.remove('visible'); setTimeout(() => el.remove(), 300); }, 3200);
};

// ═════════════════════════════════════════════════════════════
//  AVISOS — que el canal avise SIN abrir la aplicación
//
//  Es lo único que le faltaba al canal de coordinación desde la Fase 1.
//  Dos vías, las dos heredadas del sistema viejo porque ya estaban
//  probadas y andando:
//    · WhatsApp por CallMeBot, a través de la función de Netlify
//      'notify-whatsapp'. La clave de cada persona NUNCA pasa por acá:
//      vive en la variable CALLMEBOT_RECIPIENTS del servidor y la función
//      resuelve el destinatario por uid. Este archivo solo manda el uid.
//    · Email por EmailJS, directo desde el navegador.
//
//  QUÉ SE DEJÓ AFUERA A PROPÓSITO: el resumen diario del sistema viejo.
//  No corría en ningún servidor — corría en el navegador del primero que
//  abría la app cada día, con una traba en 'config/notificaciones' para
//  que no saliera dos veces. Si nadie abría la app, no había resumen; si
//  abría un colaborador, el correo de todo el equipo salía de su teléfono.
//  Eso no es un sistema de avisos. Con avisos instantáneos no hace falta
//  reloj: el aviso sale en el momento del hecho, desde el navegador de
//  quien lo hizo. La colección 'resumenes' no existe en el 2.0.
//
//  REGLA DE ORO: un aviso NUNCA hace fracasar la acción que lo produjo.
//  Se llama después de que el dato está guardado y sin 'await' que frene
//  la interfaz. Si CallMeBot no contesta, el mensaje ya está enviado.
//  (Misma lección que el aviso de horas manuales, T7.4.)
// ═════════════════════════════════════════════════════════════
// Sello de versión de ESTE archivo. Se muestra en 'Mis avisos'.
// Existe porque el 30-jul-2026 se perdió media hora diagnosticando un envío
// que fallaba por tener una versión anterior de nucleo.js subida: el síntoma
// (el WhatsApp iba al número por defecto) era idéntico a un problema de
// configuración, y no había forma de saber qué código estaba corriendo.
// Se sube a mano cada vez que se toca el bloque de avisos.
CV2.VERSION = 'nucleo-avisos-11';

CV2.NETLIFY = 'https://serene-scone-76bd4e.netlify.app/.netlify/functions';

// Identificadores públicos por diseño, igual que la apiKey de Firebase: el
// navegador los necesita para hablar con EmailJS. Los nombres de los
// 'template_params' NO se pueden cambiar: los espera la plantilla que ya
// está creada del lado de EmailJS.
CV2.EMAILJS = {
  serviceId: 'Mailcasaverde',
  templateId: 'template_txtqg87',
  publicKey: 'v9IeaS5cXuzPAKCXh'
};

// FUENTE ÚNICA del catálogo de avisos: lo usan 'avisos.html' (para dibujar
// los interruptores) y cada página que avise. Un evento que no está acá no
// existe — y no se agrega hasta que la página que lo dispara esté entregada
// (§7: no se anota como hecho lo que no se hizo). Hoy hay uno.
CV2.EVENTOS = [
  {
    id: 'mensaje', label: 'Mensajes del chat', icono: 'forum',
    detalle: 'Cuando alguien escribe en un tema que te toca.'
  },
  {
    id: 'actividad_mia', label: 'Actividades que te asignan', icono: 'assignment_ind',
    detalle: 'Cuando alguien crea una actividad y te pone en ella, o te suma a una que ya existía.'
  },
  {
    id: 'actividad_nueva', label: 'Actividades nuevas del equipo', icono: 'playlist_add',
    detalle: 'Cuando alguien crea una actividad para todo el equipo. Las limpiezas '
      + 'que se generan solas por una reserva NO avisan: aparecen en el Inicio.'
  }
];

/**
 * Mis preferencias de aviso. Viven en usuarios/{uid}.notif porque el
 * navegador de QUIEN AVISA tiene que poder leer las del destinatario para
 * saber si le manda o no, y /usuarios/ lo lee todo el equipo.
 *
 * Los valores por defecto están del lado seguro y son asimétricos a
 * propósito: el mail queda ENCENDIDO (llega solo, no molesta a nadie) y el
 * WhatsApp APAGADO (suena en el bolsillo un sábado a la noche, y además
 * necesita que la persona dé de alta su número).
 */
CV2.NOTIF_POR_DEFECTO = { canalEmail: true, canalWhatsapp: false };

CV2.miNotif = function () {
  return (CV2.usuario && CV2.usuario.notif) || {};
};

// ── WhatsApp ─────────────────────────────────────────────────
// El plan gratis de CallMeBot acepta ~1 mensaje por minuto Y POR NÚMERO.
// El freno es por destinatario: avisarle a tres personas a la vez está
// bien, son tres números distintos.
//
// Qué pasa con el segundo mensaje dentro del minuto: NO se manda y no se
// reintenta. Es a propósito y es deseable — en una conversación de diez
// mensajes seguidos nadie quiere diez WhatsApps; el primero avisa que hay
// algo y el resto se lee en el chat. El freno vive en memoria, así que se
// olvida al recargar la página: eso es aceptable para lo que hace.
CV2._ultimoWa = {};
CV2.WA_ESPERA = 60000;

/**
 * Lee la respuesta de CallMeBot DE VERDAD.
 *
 * POR QUÉ EXISTE ESTA FUNCIÓN: CallMeBot contesta HTTP 200 aunque rechace
 * el pedido, y mete el error como HTML rojo dentro del cuerpo. Mirar solo
 * el código de estado da un "salió bien" cuando no salió nada — que fue
 * exactamente lo que pasó la primera vez que probamos esto (jul-2026): la
 * pantalla dijo "aceptado" y la cuenta estaba en pausa.
 *
 * Devuelve { ok, motivo, detalle } con el texto ya limpio de etiquetas.
 */
CV2._leerRespuestaWa = function (txt) {
  const crudo = String(txt || '');
  const plano = crudo.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const b = plano.toLowerCase();

  if (b.indexOf('paused') !== -1 || b.indexOf('pausada') !== -1) {
    // El número del bot lo dice la propia respuesta y CAMBIA con el tiempo:
    // por eso se extrae de acá y no se escribe fijo en ningún lado.
    const tel = plano.match(/\+\s?\d[\d\s]{7,}/);
    return {
      ok: false, motivo: 'pausada',
      detalle: 'La cuenta de CallMeBot de ese número está EN PAUSA. Hay que mandarle '
        + 'la palabra "resume" por WhatsApp al bot'
        + (tel ? ' (' + tel[0].trim() + ')' : '') + ' desde ese mismo teléfono.'
    };
  }
  if (b.indexOf('apikey') !== -1
      && (b.indexOf('not valid') !== -1 || b.indexOf('invalid') !== -1
       || b.indexOf('missing') !== -1 || b.indexOf('wrong') !== -1)) {
    return {
      ok: false, motivo: 'clave',
      detalle: 'CallMeBot no acepta esa clave. Mandale "Recover APIKey" al bot desde '
        + 'ese teléfono y te devuelve la que corresponde.'
    };
  }
  if (b.indexOf('not found') !== -1 || b.indexOf('no registrado') !== -1
      || b.indexOf('not registered') !== -1) {
    return {
      ok: false, motivo: 'sin_alta',
      detalle: 'Ese número no está dado de alta en CallMeBot.'
    };
  }
  if (b.indexOf('limit') !== -1 || b.indexOf('too many') !== -1) {
    return {
      ok: false, motivo: 'limite',
      detalle: 'CallMeBot frenó el envío por límite de uso. Probá de nuevo en un rato.'
    };
  }
  // Marca genérica: el servicio pinta sus errores de rojo.
  if (crudo.toLowerCase().indexOf('color:red') !== -1) {
    return { ok: false, motivo: 'rechazado', detalle: plano.slice(0, 240) };
  }
  return { ok: true, motivo: '', detalle: plano.slice(0, 240) };
};

/**
 * Manda un WhatsApp.
 * Nunca revienta: devuelve { ok, motivo, detalle } pase lo que pase.
 *
 *   CV2.enviarWhatsApp(texto)                    → al número por defecto del
 *                                                  servidor (CALLMEBOT_PHONE)
 *   CV2.enviarWhatsApp(texto, { telefono, apikey }) → a esa persona
 *
 * El contacto viaja EN EL PEDIDO y sale de avisos_contacto, que es la fuente
 * única. Antes vivía duplicado en una variable de entorno de Netlify indexada
 * por uid; se sacó porque Netlify no aplica variables nuevas sin desplegar y
 * cada alta obligaba a rearmar el paquete a mano (jul-2026).
 */
CV2.enviarWhatsApp = function (texto, contacto) {
  const c = contacto || {};
  const clave = c.telefono || '_defecto';
  const ahora = Date.now();
  if (CV2._ultimoWa[clave] && (ahora - CV2._ultimoWa[clave]) < CV2.WA_ESPERA) {
    return Promise.resolve({
      ok: false, motivo: 'espera',
      detalle: 'Hay que esperar un minuto entre WhatsApps al mismo número (límite del plan gratis de CallMeBot).'
    });
  }
  CV2._ultimoWa[clave] = ahora;
  const cuerpo = { text: String(texto || '').slice(0, 900) };
  if (c.telefono && c.apikey) {
    // SIN el '+': la URL de ejemplo que el propio bot de CallMeBot entrega va
    // con el número pelado ('phone=554891720737'), y esa es la que está
    // probada. El '+' se guarda y se muestra porque se lee mejor, pero no
    // viaja. Verificado el 30-jul-2026 contra la respuesta real del bot.
    cuerpo.phone = String(c.telefono).replace(/[^\d]/g, '');
    cuerpo.apikey = c.apikey;
  }
  return fetch(CV2.NETLIFY + '/notify-whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // keepalive: el aviso sale SIN await y la persona puede cambiar de página
    // en el mismo segundo —al crear una actividad desde la Agenda se vuelve
    // allá enseguida—. Sin esto el navegador corta el pedido a la mitad y el
    // aviso se pierde sin dejar rastro en ningún lado.
    keepalive: true,
    body: JSON.stringify(cuerpo)
  })
    .then((r) => r.json())
    .then((d) => {
      // La función de Netlify ya falló por su cuenta (falta una variable, el
      // teléfono mal formado): eso viene con ok:false y su propio error.
      if (!d || d.ok !== true) {
        return { ok: false, motivo: 'servidor', detalle: (d && d.error) ?? 'sin detalle' };
      }
      // Llegó a CallMeBot. Ahora sí, leer lo que contestó.
      const r = CV2._leerRespuestaWa(d.respuesta);
      return { ok: r.ok, motivo: r.motivo, detalle: r.detalle };
    })
    .catch((e) => ({ ok: false, motivo: 'red', detalle: e.message }));
};

/**
 * El contacto de WhatsApp de una persona, de avisos_contacto.
 * Devuelve null si no lo cargó (o si la regla no deja leerlo).
 */
CV2.contactoWa = async function (uid) {
  try {
    const s = await getDoc(doc(db, 'avisos_contacto', uid));
    if (!s.exists()) return null;
    const c = s.data() || {};
    return (c.telefono && c.apikey) ? { telefono: c.telefono, apikey: c.apikey } : null;
  } catch (e) {
    console.warn('contactoWa:', e);
    return null;
  }
};

// ── Email ────────────────────────────────────────────────────
/** Manda un mail. Nunca revienta: devuelve { ok, ... } pase lo que pase. */
CV2.enviarMail = function (asunto, cuerpoHtml, paraEmail) {
  if (!paraEmail) {
    return Promise.resolve({ ok: false, error: 'Esa persona no tiene mail cargado.' });
  }
  return fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,   // por lo mismo que el WhatsApp: sobrevive al cambio de página
    body: JSON.stringify({
      service_id: CV2.EMAILJS.serviceId,
      template_id: CV2.EMAILJS.templateId,
      user_id: CV2.EMAILJS.publicKey,
      template_params: {
        enviar_a: paraEmail,
        nombre_remitente: 'Casa Verde Canas',
        asunto: asunto || 'Aviso de Casa Verde',
        mensaje: cuerpoHtml || ''
      }
    })
  })
    .then(async (r) => {
      if (r.ok) return { ok: true, status: r.status };
      let det = 'HTTP ' + r.status;
      try { det = (await r.text()) || det; } catch { /* sin detalle */ }
      return { ok: false, status: r.status, error: det };
    })
    .catch((e) => ({ ok: false, error: e.message }));
};

// TEXTO PLANO, a propósito.
// La plantilla de EmailJS escapa el HTML en vez de interpretarlo, así que un
// cuerpo con etiquetas llega con las etiquetas a la vista y es ilegible
// (comprobado jul-2026). Y para un aviso —tres líneas que se leen en la
// notificación del teléfono— el formato no aporta nada. Si algún día hiciera
// falta HTML, el arreglo NO es acá: es la plantilla de EmailJS.
CV2._cuerpoMail = function (texto, enlace) {
  const lineas = String(texto || '').split('\n').filter((l) => l.trim() !== '');
  let cuerpo = lineas.join('\n');
  if (enlace) {
    // Un './comunicacion.html' no significa nada dentro de un correo: hay que
    // resolverlo contra la dirección real desde donde se está mandando. Así
    // sirve igual en casaverdecanas.com.br, en GitHub Pages o en una prueba
    // local, sin escribir el dominio a mano en ningún lado.
    let url = enlace;
    try { url = new URL(enlace, location.href).href; } catch (e) { /* queda como vino */ }
    cuerpo += '\n\n' + url;
  }
  cuerpo += '\n\n--\nAviso automático de Casa Verde Canas.'
    + '\nPodés elegir qué te llega y por dónde en "Mis avisos", dentro del panel.';
  return cuerpo;
};

// ¿A esta persona le toca este aviso?
//   'todos' (o nada) → a todo el equipo activo.
//   [uid, uid]       → solo a esos.
// El sistema viejo tenía además 'admins' y 'colaboradores'. Se sacaron: en
// el 2.0 hay UNA sola cuenta admin y el resto trabaja por permisos, así que
// esas dos audiencias ya no describen a nadie útil.
CV2._leToca = function (uid, para) {
  if (!para || para === 'todos') return true;
  return Array.isArray(para) && para.indexOf(uid) !== -1;
};

/**
 * EL DISPARADOR. Recorre el equipo y avisa a quien corresponda, por donde
 * cada uno pidió.
 *
 *   CV2.avisar({
 *     evento: 'mensaje',              // tiene que estar en CV2.EVENTOS
 *     asunto: 'Casa Verde · Limpiezas',
 *     texto: 'Flor escribió en "Limpiezas":\nFalta lavandina en C2.',
 *     para: 'todos',                  // o ['uid1','uid2']
 *     excluir: u.uid,                 // nunca se avisa a quien lo produjo
 *     enlace: './comunicacion.html'   // opcional, solo para el mail
 *   });
 *
 * NO se espera con await desde la página. Devuelve un resumen por si algún
 * día hace falta (la pantalla de prueba lo usa), pero nunca rechaza.
 */
CV2.avisar = async function (op) {
  const o = op || {};
  const informe = [];
  const anotar = (uid, nombre, canal, estado, detalle) => {
    informe.push({ uid, nombre: nombre || uid, canal, estado, detalle: detalle || '' });
  };
  if (!o.evento || !o.texto) {
    return { intentos: 0, enviados: 0, informe, error: 'falta el evento o el texto' };
  }
  try {
    // Las dos colecciones de una: quién es cada uno y por dónde se le llega.
    const [snapU, snapC] = await Promise.all([
      getDocs(collection(db, 'usuarios')),
      getDocs(collection(db, 'avisos_contacto'))
    ]);
    const contactos = {};
    snapC.forEach((d) => { contactos[d.id] = d.data() || {}; });

    // Cada envío se guarda junto a QUIÉN y POR DÓNDE, no suelto: un
    // Promise.all de promesas anónimas dice cuántas fallaron y ninguna otra
    // cosa. Con esto, el simulacro de 'Mis avisos' puede decir "a Flor no le
    // llega porque tiene la llave de WhatsApp apagada" en vez de "0 de 3".
    const tareas = [];
    snapU.forEach((d) => {
      const x = d.data() || {};
      const uid = d.id;
      const nombre = x.nombre || uid;
      if (x.activo === false) { anotar(uid, nombre, '—', 'salteado', 'está desactivado'); return; }
      if (o.excluir && uid === o.excluir) { anotar(uid, nombre, '—', 'salteado', 'es quien lo produjo'); return; }
      if (!CV2._leToca(uid, o.para)) { anotar(uid, nombre, '—', 'salteado', 'no es de la audiencia de este aviso'); return; }
      const n = x.notif || {};
      // Cada evento está encendido salvo que la persona lo haya apagado.
      if (n[o.evento] === false) { anotar(uid, nombre, '—', 'salteado', 'apagó este aviso en Mis avisos'); return; }

      if (n.canalEmail === false) anotar(uid, nombre, 'mail', 'salteado', 'tiene el correo apagado');
      else if (!x.email) anotar(uid, nombre, 'mail', 'salteado', 'no tiene correo cargado en su perfil');
      else if (o.simular) anotar(uid, nombre, 'mail', 'iría', x.email);
      else {
        tareas.push({
          uid, nombre, canal: 'mail', a: x.email,
          promesa: CV2.enviarMail(o.asunto || 'Aviso de Casa Verde',
            CV2._cuerpoMail(o.texto, o.enlace), x.email)
        });
      }

      const c = contactos[uid];
      const tieneWa = !!(c && c.telefono && c.apikey);
      if (n.canalWhatsapp !== true) anotar(uid, nombre, 'whatsapp', 'salteado', 'tiene la llave de WhatsApp apagada');
      // Sin número cargado no hay a dónde mandar. NO se cae al número por
      // defecto: le sonaría el teléfono al admin por un aviso ajeno.
      else if (!tieneWa) anotar(uid, nombre, 'whatsapp', 'salteado', 'encendió la llave pero no cargó su número y su clave');
      else if (o.simular) anotar(uid, nombre, 'whatsapp', 'iría', c.telefono);
      else {
        tareas.push({
          uid, nombre, canal: 'whatsapp', a: c.telefono,
          promesa: CV2.enviarWhatsApp(o.texto, { telefono: c.telefono, apikey: c.apikey })
        });
      }
    });

    const res = await Promise.all(tareas.map((t) => t.promesa));
    let enviados = 0;
    tareas.forEach((t, i) => {
      const r = res[i] || {};
      // El mail devuelve { ok, error } y el WhatsApp { ok, motivo, detalle }:
      // los dos se leen igual acá para que el informe no dependa del canal.
      const det = r.detalle || r.error || '';
      if (r.ok) { enviados++; anotar(t.uid, t.nombre, t.canal, 'enviado', t.a); }
      else anotar(t.uid, t.nombre, t.canal, 'falló', (r.motivo ? r.motivo + ' · ' : '') + (det || 'sin detalle'));
    });
    return { intentos: tareas.length, enviados, informe, simulado: !!o.simular };
  } catch (e) {
    // Un aviso que falla se anota y se olvida. Lo que importaba ya está
    // guardado antes de llegar acá. El motivo más probable de caer acá es que
    // las reglas no dejen LISTAR /usuarios/ o /avisos_contacto/: sin esas dos
    // listas no hay a quién avisarle, y el aviso muere entero y en silencio.
    console.warn('avisar:', e);
    return { intentos: 0, enviados: 0, informe, error: (e && e.code) || e.message };
  }
};

// ═════════════════════════════════════════════════════════════
//  IMÁGENES — camino ÚNICO para toda foto del sistema
//  (comprobantes, daños, mensajes, cabañas, espacios).
//
//  POR QUÉ ESTÁ ACÁ Y NO EN CADA PÁGINA (lección jul-2026):
//  cada página armaba su propio <input type="file">, y ahí se colaba el
//  error: con accept="image/*" a secas, el sistema decide qué ofrecer y
//  en iPad (sobre todo dentro de la PWA) abre el explorador de archivos
//  SIN ofrecer la cámara. El atributo 'capture' hace lo contrario: fuerza
//  cámara y esconde los archivos. NINGÚN input solo da las dos opciones
//  de forma confiable en iOS + Android.
//  Solución: DOS inputs y que la persona elija. Vive en un solo lugar,
//  así el día que cambie algo (tamaño, calidad, Cloudinary) se toca
//  un archivo y no ocho.
// ═════════════════════════════════════════════════════════════
// ── Cloudinary ───────────────────────────────────────────────
// CARPETAS: la cuenta está en modo Dynamic folders, donde la carpeta va en
// 'asset_folder' y NO en 'folder' (el del modo clásico). Mandar el campo
// viejo no da error: la foto sube igual y aparece en la raíz, que es donde
// terminaron todas las del sitio hasta la T11.50.
//
// Estos nombres son los que EXISTEN hoy en Cloudinary y se escriben tal
// cual, respetando mayúsculas: Cloudinary distingue 'Espacios' de
// 'espacios' y una diferencia de una letra crea una carpeta paralela en
// silencio. Si algún día se renombra una carpeta allá, se cambia acá y en
// ningún otro lado.
//
// Mover una foto entre carpetas NO cambia su dirección de entrega, así que
// reordenar en Cloudinary nunca rompe el sitio.
CV2.CLOUDINARY = {
  cloud: 'dnwfu8ffn',
  preset: 'preset-comprobantes',
  carpetas: {
    sitio: 'sitio',              // portada, La casa, ilustraciones
    espacios: 'Espacios',        // ⚠ con E mayúscula: así está en Cloudinary
    recuerdos: 'recuerdos',
    comprobantes: 'gastos',
    personas: 'personas',
    // Cada alojamiento tiene su carpeta. La clave es el id del documento
    // en 'cabanas'; el valor, la carpeta real. Son distintos (c1 vs
    // cabana1) porque las carpetas se armaron a mano antes que esto: se
    // mapea en lugar de renombrar, que obligaría a tocar Cloudinary.
    c1: 'cabanas/cabana1',
    c2: 'cabanas/cabana2',
    c3: 'cabanas/cabana3'
  },
  // A dónde va lo que no cae en ninguna de las anteriores.
  carpetaPorDefecto: 'sitio'
};

/**
 * Traduce una clave o un nombre de carpeta al nombre REAL de Cloudinary.
 *   CV2.carpetaDe('c1')      → 'cabanas/cabana1'
 *   CV2.carpetaDe('sitio')   → 'sitio'
 *   CV2.carpetaDe('lo-que-sea') → 'lo-que-sea'  (se respeta tal cual)
 *   CV2.carpetaDe()          → la carpeta por defecto
 * Se acepta un nombre suelto a propósito: obliga a que el mapa cubra los
 * casos conocidos sin bloquear uno nuevo el día que aparezca.
 */
CV2.carpetaDe = function (clave) {
  if (!clave) return CV2.CLOUDINARY.carpetaPorDefecto;
  const c = CV2.CLOUDINARY.carpetas[clave];
  return c ? c : String(clave);
};

// Transformaciones de ENTREGA. No tocan el archivo guardado: Cloudinary
// las aplica al servir. 'f_auto' manda WebP/AVIF si el navegador los
// soporta, 'q_auto' ajusta la calidad y 'w_2000' pone un techo de ancho.
// Guardar la URL ya transformada hace que TODO lo que la muestre (panel y
// sitio público, que no importa nucleo.js) reciba la versión liviana sin
// cambiar una línea de código.
CV2.ENTREGA = 'f_auto,q_auto,w_2000';

/** ¿Es una URL de nuestro Cloudinary? */
CV2.esCloudinary = function (url) {
  return typeof url === 'string'
    && url.indexOf('res.cloudinary.com/' + CV2.CLOUDINARY.cloud + '/') !== -1;
};

/**
 * Mete las transformaciones de entrega en una URL de Cloudinary.
 * IDEMPOTENTE: si ya las tiene, la devuelve igual (se puede correr mil
 * veces sin ensuciar la URL). Si no es de Cloudinary, la devuelve igual.
 */
CV2.urlEntrega = function (url) {
  if (!CV2.esCloudinary(url)) return url;
  const marca = '/upload/';
  const i = url.indexOf(marca);
  if (i === -1) return url;
  const antes = url.slice(0, i + marca.length);
  const resto = url.slice(i + marca.length);
  const primer = resto.split('/')[0];
  if (CV2._esTransformacion(primer)) return url;   // ya transformada
  return antes + CV2.ENTREGA + '/' + resto;
};

// ¿Ese segmento de la URL es una lista de transformaciones y no el nombre
// del archivo ni la versión? Una transformación es 'q_auto', 'w_2000' o
// varias con coma. OJO: no alcanza con "tiene guión bajo" — un archivo
// llamado 'mi_foto.jpg' lo tiene, y darlo por transformado hacía que esa
// foto se saltara para siempre. Se pide que TODOS los pedazos separados por
// coma tengan la forma 'xx_valor' y que no haya extensión de archivo.
CV2._esTransformacion = function (seg) {
  if (!seg || seg.indexOf('.') !== -1) return false;   // tiene extensión → archivo
  if (/^v\d+$/.test(seg)) return false;                // es la versión
  const partes = seg.split(',');
  return partes.every((p) => /^[a-z]{1,3}_[A-Za-z0-9.:%-]+$/.test(p));
};

/**
 * Hoja de elección: Tomar foto (cámara) o Elegir archivo (galería/archivos).
 * Devuelve el File elegido, o null si la persona cancela.
 * Uso:  const file = await CV2.pedirImagen();
 */
CV2.pedirImagen = function (opciones) {
  const op = opciones || {};
  const titulo = op.titulo || 'Agregar foto';
  return new Promise((resolver) => {
    let resuelto = false;
    const terminar = (valor) => {
      if (resuelto) return;
      resuelto = true;
      window.removeEventListener('focus', alVolverElFoco);
      // close() antes de remove(): es lo que devuelve la capa del historial
      // y saca la hoja de la capa superior del navegador.
      try { if (hoja.open) hoja.close(); } catch { /* ya cerrada */ }
      if (hoja.parentNode) hoja.remove();
      resolver(valor);
    };

    // Si la persona abre la cámara o los archivos y CANCELA, el navegador
    // no dispara ningún evento: la promesa quedaría colgada para siempre.
    // Al volver el foco a la ventana, damos un margen y cerramos con null.
    let esperandoArchivo = false;
    const alVolverElFoco = () => {
      if (!esperandoArchivo) return;
      setTimeout(() => { if (esperandoArchivo) terminar(null); }, 900);
    };

    // Es un <dialog>, no un <div>. Por qué importa: un elemento fijo, por
    // más z-index que tenga, NO se dibuja arriba de un <dialog> abierto con
    // showModal — los modales viven en una capa aparte del navegador (top
    // layer) que está por encima de todo lo demás. Con un <div>, esta hoja
    // quedaba INVISIBLE cada vez que el botón de la foto estaba adentro de
    // un formulario, que es donde está en casi todas las páginas.
    // De paso hereda el botón Atrás: showModal ya está adoptado por
    // CV2.dialogosConAtras().
    const hoja = document.createElement('dialog');
    hoja.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;max-width:100%;max-height:100%;border:0;padding:0;overflow:hidden;z-index:10000;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;';
    hoja.innerHTML = '<div style="background:#fff;border-radius:16px 16px 0 0;width:min(440px,100%);padding:16px 16px calc(16px + env(safe-area-inset-bottom));box-shadow:0 -6px 30px rgba(0,0,0,.25);">'
      + '<div style="font-weight:600;font-size:.95rem;margin-bottom:12px;text-align:center;">' + CV2.esc(titulo) + '</div>'
      + '<button type="button" data-cv="camara" style="display:flex;align-items:center;gap:12px;width:100%;border:1px solid #e2e0d8;background:#fff;border-radius:12px;padding:14px;font-size:.95rem;cursor:pointer;margin-bottom:8px;text-align:left;"><span class="material-icons" style="color:#2d5a27;">photo_camera</span>Tomar foto</button>'
      + '<button type="button" data-cv="archivo" style="display:flex;align-items:center;gap:12px;width:100%;border:1px solid #e2e0d8;background:#fff;border-radius:12px;padding:14px;font-size:.95rem;cursor:pointer;margin-bottom:8px;text-align:left;"><span class="material-icons" style="color:#2d5a27;">photo_library</span>Elegir archivo</button>'
      + '<button type="button" data-cv="cancelar" style="width:100%;border:0;background:none;padding:12px;font-size:.9rem;color:#7a776e;cursor:pointer;">Cancelar</button>'
      + '<input type="file" accept="image/*" capture="environment" data-cv="inCamara" style="display:none">'
      + '<input type="file" accept="image/*" data-cv="inArchivo" style="display:none">'
      + '</div>';
    document.body.appendChild(hoja);
    hoja.showModal();

    const q = (n) => hoja.querySelector('[data-cv="' + n + '"]');

    // Un solo manejador para los dos inputs.
    const alElegir = (ev) => {
      const f = ev.target.files && ev.target.files[0];
      esperandoArchivo = false;
      if (f) terminar(f); else terminar(null);
    };
    q('inCamara').addEventListener('change', alElegir);
    q('inArchivo').addEventListener('change', alElegir);

    // El click nace de un gesto de la persona: iOS exige eso para abrir
    // la cámara. Por eso se dispara acá y no desde ninguna promesa previa.
    q('camara').addEventListener('click', () => {
      esperandoArchivo = true;
      window.addEventListener('focus', alVolverElFoco);
      q('inCamara').click();
    });
    q('archivo').addEventListener('click', () => {
      esperandoArchivo = true;
      window.addEventListener('focus', alVolverElFoco);
      q('inArchivo').click();
    });
    q('cancelar').addEventListener('click', () => terminar(null));
    // Tocar el fondo gris también cancela.
    hoja.addEventListener('click', (ev) => { if (ev.target === hoja) terminar(null); });
  });
};

/**
 * Reduce a 2000px de lado mayor y JPEG 0.85 ANTES de subir: una foto de
 * teléfono de 8 MB viaja como ~300 KB.
 */
CV2.comprimirImagen = function (file, maxLado) {
  const max = maxLado || 2000;
  return new Promise((resolver, rechazar) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > max) { h = h * max / w; w = max; }
      if (h > max) { w = w * max / h; h = max; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          blob ? resolver(blob) : rechazar(new Error('no se pudo comprimir'));
        },
        'image/jpeg', 0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rechazar(new Error('formato de imagen no soportado'));
    };
    img.src = url;
  });
};

/**
 * file (de CV2.pedirImagen) → URL de entrega en Cloudinary.
 *
 * 'carpeta' es opcional y va en 'asset_folder', el campo del modo Dynamic
 * folders. Sin él, la foto cae en la raíz — que es donde vivían TODAS las
 * fotos del sitio hasta la T11.50, mezcladas con los comprobantes de
 * Dinero, y por eso el listado del editor no encontraba ninguna: buscaba
 * en carpetas que estaban vacías.
 *
 * Se puede pasar el nombre de una carpeta ('sitio') o una clave del mapa
 * CV2.CLOUDINARY.carpetas ('c1' → 'cabanas/cabana1'), lo que sea más
 * cómodo en cada llamada.
 */
CV2.subirImagen = async function (file, carpeta) {
  const blob = await CV2.comprimirImagen(file);
  const fd = new FormData();
  fd.append('file', blob);
  fd.append('upload_preset', CV2.CLOUDINARY.preset);
  const destino = CV2.carpetaDe(carpeta);
  if (destino) fd.append('asset_folder', destino);
  const r = await fetch(
    'https://api.cloudinary.com/v1_1/' + CV2.CLOUDINARY.cloud + '/image/upload',
    { method: 'POST', body: fd }
  );
  if (!r.ok) throw new Error('Cloudinary ' + r.status);
  // Se guarda la URL de entrega, no la cruda: quien la muestre recibe la
  // versión liviana sin tener que saber nada de Cloudinary.
  return CV2.urlEntrega((await r.json()).secure_url);
};

/**
 * Trae a Cloudinary una imagen que vive en OTRO servidor.
 * La baja Cloudinary desde su lado (no el navegador), así que no hay
 * problema de CORS. Contra: no se puede comprimir antes — la sirve liviana
 * igual gracias a las transformaciones de entrega.
 * Devuelve la URL de entrega de nuestra copia.
 */
CV2.traerImagenDesdeUrl = async function (url, carpeta) {
  const fd = new FormData();
  fd.append('file', url);          // Cloudinary acepta una URL remota acá
  fd.append('upload_preset', CV2.CLOUDINARY.preset);
  const destino = CV2.carpetaDe(carpeta);
  if (destino) fd.append('asset_folder', destino);
  const r = await fetch(
    'https://api.cloudinary.com/v1_1/' + CV2.CLOUDINARY.cloud + '/image/upload',
    { method: 'POST', body: fd }
  );
  if (!r.ok) {
    let det = 'HTTP ' + r.status;
    try { det = (await r.json()).error.message; } catch { /* sin detalle */ }
    throw new Error('Cloudinary: ' + det);
  }
  return CV2.urlEntrega((await r.json()).secure_url);
};

/**
 * CAMINO RECOMENDADO para cualquier página: pide (cámara o archivo),
 * comprime, sube y devuelve la URL. Null si la persona cancela.
 * Muestra el aviso de "Subiendo foto…" y el error con su código.
 * Uso:  const url = await CV2.elegirYSubirImagen();
 *       if (url) { ...guardar url... }
 */
CV2.elegirYSubirImagen = async function (opciones) {
  const o = opciones || {};
  const file = await CV2.pedirImagen(o);
  if (!file) return null;
  CV2.toast('Subiendo foto…');
  try {
    // o.carpeta: clave del mapa ('c1') o nombre suelto ('sitio').
    const url = await CV2.subirImagen(file, o.carpeta);
    return url;
  } catch (e) {
    CV2.toast('No se pudo subir la foto: ' + (e.code ?? e.message), 'error');
    return null;
  }
};

// ── PWA: registro del service worker ─────────────────────────
CV2.registrarSW = async function () {
  if (!('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.register('./sw.js');
  } catch (e) {
    console.warn('SW no registrado:', e);
    return null;
  }
};
