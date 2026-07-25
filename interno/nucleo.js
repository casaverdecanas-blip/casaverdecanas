// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — nucleo.js
//  Corazón compartido del panel: auth + perfil, permisos, navegación,
//  helpers de formato y color, toasts, imágenes, registro del SW.
//  Namespace único: CV2 (import { CV2 } from './nucleo.js')
// ═══════════════════════════════════════════════════════════════

import { auth, db, doc, getDoc, onAuthStateChanged, signOut, terminate, clearIndexedDbPersistence } from './firebase-init.js';

export const CV2 = {};

// ── Sesión ───────────────────────────────────────────────────
CV2.usuario = null;   // { uid, nombre, email, rol, permisos, activo }

/**
 * Verifica sesión y carga el perfil. Si no hay sesión o el
 * usuario está inactivo → redirige a login.
 * Uso:  const u = await CV2.verificarAuth();
 */
CV2.verificarAuth = function () {
  return new Promise((resolver) => {
    onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) { location.href = './login.html'; return; }
      try {
        const snap = await getDoc(doc(db, 'usuarios', fbUser.uid));
        if (!snap.exists() || snap.data().activo !== true) {
          await signOut(auth);
          location.href = './login.html?e=inactivo';
          return;
        }
        CV2.usuario = { uid: fbUser.uid, email: fbUser.email, ...snap.data() };
        if (CV2.usuario.rol === 'admin') CV2._listonAdmin();
        resolver(CV2.usuario);
      } catch (e) {
        console.error('verificarAuth:', e);
        await signOut(auth);
        location.href = './login.html?e=error';
      }
    });
  });
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

CV2.cerrarSesion = async function () {
  await signOut(auth);
  // La caché local es UNA por navegador: si otra persona entra en el
  // mismo dispositivo, no debe encontrar datos de la sesión anterior.
  try { await terminate(db); await clearIndexedDbPersistence(db); } catch { /* mejor esfuerzo */ }
  location.href = './login.html';
};

// Listón diagonal amarillo/negro: sesión admin a la vista
CV2._listonAdmin = function () {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;height:8px;z-index:9999;background:repeating-linear-gradient(45deg,#e6b800 0 14px,#1a1a1a 14px 28px);pointer-events:none;';
  document.body.appendChild(el);
};

// ── Navegación ───────────────────────────────────────────────
// `permiso: null`  → visible para cualquiera activo.
// `permiso: 'x'`   → requiere ese permiso.
// `permiso: [...]` → requiere alguno de esos.
// `soloAdmin: true`→ únicamente la cuenta CasaVerde.
CV2.NAV = [
  { id: 'inicio', label: 'Inicio', href: './index.html', icono: 'home', permiso: null },
  { id: 'actividades', label: 'Actividades', href: './actividades.html', icono: 'checklist', permiso: null },
  { id: 'reservas', label: 'Reservas', href: './reservas.html', icono: 'king_bed', permiso: 'reservas' },
  { id: 'calendario', label: 'Calendario', href: './calendario.html', icono: 'calendar_month', permiso: null },
  { id: 'clientes', label: 'Clientes', href: './clientes.html', icono: 'contacts', permiso: 'reservas' },
  { id: 'comunicacion', label: 'Chat', href: './comunicacion.html', icono: 'forum', permiso: null },
  { id: 'sesiones', label: 'Sesiones', href: './gestion-sesiones.html', icono: 'schedule', permiso: null },
  { id: 'horas', label: 'Horas', href: './horas-stats.html', icono: 'insights', permiso: 'horas' },
  { id: 'honorarios', label: 'Cobros', href: './honorarios.html', icono: 'payments', permiso: null },
  { id: 'dinero', label: 'Dinero', href: './dinero.html', icono: 'savings', permiso: ['dinero', 'finanzas'] },
  { id: 'cabanas', label: 'Sitio', href: './cabanas.html', icono: 'cottage', permiso: 'contenido' },
  { id: 'espacios', label: 'Espacios', href: './espacios.html', icono: 'deck', permiso: 'contenido' },
  { id: 'usuarios', label: 'Usuarios', href: './usuarios.html', icono: 'group', permiso: null, soloAdmin: true }
];

CV2.verItem = function (it) {
  if (it.soloAdmin) return CV2.esAdmin();
  if (!it.permiso) return true;
  return Array.isArray(it.permiso) ? CV2.puedeAlguno(it.permiso) : CV2.puede(it.permiso);
};

CV2.renderNav = function (activo) {
  const cont = document.getElementById('nav');
  if (!cont) return;
  const items = CV2.NAV
    .filter(CV2.verItem)
    .map(it => `
      <a href="${it.href}" class="nav-item ${it.id === activo ? 'activo' : ''}">
        <span class="material-icons">${it.icono}</span>${it.label}
      </a>`).join('');
  cont.innerHTML = `
    <nav class="nav">
      <span class="nav-marca">🌿 CasaVerde <b>2.0</b></span>
      ${items}
      <span class="nav-sep"></span>
      <span class="nav-quien">${CV2.esc(CV2.usuario?.nombre ?? '')}</span>
      <a class="nav-item" href="./manual.html#${activo}" title="Ayuda de esta página">
        <span class="material-icons">help</span>
      </a>
      <button class="nav-item" id="btnSalir" title="Cerrar sesión">
        <span class="material-icons">logout</span>
      </button>
    </nav>`;
  document.getElementById('btnSalir')?.addEventListener('click', CV2.cerrarSesion);
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

CV2.hoyISO = () => new Date().toISOString().slice(0, 10);

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
CV2.CLOUDINARY = { cloud: 'dnwfu8ffn', preset: 'preset-comprobantes' };

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

    const hoja = document.createElement('div');
    hoja.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;';
    hoja.innerHTML = '<div style="background:#fff;border-radius:16px 16px 0 0;width:min(440px,100%);padding:16px 16px calc(16px + env(safe-area-inset-bottom));box-shadow:0 -6px 30px rgba(0,0,0,.25);">'
      + '<div style="font-weight:600;font-size:.95rem;margin-bottom:12px;text-align:center;">' + CV2.esc(titulo) + '</div>'
      + '<button type="button" data-cv="camara" style="display:flex;align-items:center;gap:12px;width:100%;border:1px solid #e2e0d8;background:#fff;border-radius:12px;padding:14px;font-size:.95rem;cursor:pointer;margin-bottom:8px;text-align:left;"><span class="material-icons" style="color:#2d5a27;">photo_camera</span>Tomar foto</button>'
      + '<button type="button" data-cv="archivo" style="display:flex;align-items:center;gap:12px;width:100%;border:1px solid #e2e0d8;background:#fff;border-radius:12px;padding:14px;font-size:.95rem;cursor:pointer;margin-bottom:8px;text-align:left;"><span class="material-icons" style="color:#2d5a27;">photo_library</span>Elegir archivo</button>'
      + '<button type="button" data-cv="cancelar" style="width:100%;border:0;background:none;padding:12px;font-size:.9rem;color:#7a776e;cursor:pointer;">Cancelar</button>'
      + '<input type="file" accept="image/*" capture="environment" data-cv="inCamara" style="display:none">'
      + '<input type="file" accept="image/*" data-cv="inArchivo" style="display:none">'
      + '</div>';
    document.body.appendChild(hoja);

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

/** file (de CV2.pedirImagen) → URL de entrega en Cloudinary. */
CV2.subirImagen = async function (file) {
  const blob = await CV2.comprimirImagen(file);
  const fd = new FormData();
  fd.append('file', blob);
  fd.append('upload_preset', CV2.CLOUDINARY.preset);
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
CV2.traerImagenDesdeUrl = async function (url) {
  const fd = new FormData();
  fd.append('file', url);          // Cloudinary acepta una URL remota acá
  fd.append('upload_preset', CV2.CLOUDINARY.preset);
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
  const file = await CV2.pedirImagen(opciones);
  if (!file) return null;
  CV2.toast('Subiendo foto…');
  try {
    const url = await CV2.subirImagen(file);
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
