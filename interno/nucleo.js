// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — nucleo.js
//  Corazón compartido del panel: auth + perfil, permisos, navegación,
//  helpers de formato y color, toasts, registro del service worker.
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
  { id: 'cabanas', label: 'Cabañas', href: './cabanas.html', icono: 'cottage', permiso: 'contenido' },
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

// ── Imágenes: comprimir y subir a Cloudinary ─────────────────
// Un solo camino para toda foto del sistema (comprobantes, daños): se
// reduce a 2000px lado mayor y JPEG 0.85 ANTES de subir — así una foto de
// teléfono de 8 MB viaja como ~300 KB. Devuelve la secure_url.
CV2.CLOUDINARY = { cloud: 'dnwfu8ffn', preset: 'preset-comprobantes' };

CV2.comprimirImagen = function (file, maxLado) {
  const max = maxLado || 2000;
  return new Promise((resolver, rechazar) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > max) { h = h * max / w; w = max; }
      if (h > max) { w = w * max / h; h = max; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => blob ? resolver(blob) : rechazar(new Error('no se pudo comprimir')),
        'image/jpeg', 0.85
      );
    };
    img.onerror = () => rechazar(new Error('imagen inválida'));
    img.src = URL.createObjectURL(file);
  });
};

/** file (de <input type=file capture>) → secure_url en Cloudinary. */
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
  return (await r.json()).secure_url;
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
