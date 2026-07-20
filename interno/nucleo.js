// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — nucleo.js
//  Corazón compartido del panel: auth + perfil, navegación,
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

CV2.esAdmin = () => CV2.usuario?.rol === 'admin';

CV2.puede = (seccion) =>
  CV2.esAdmin() || CV2.usuario?.permisos?.[seccion] === true;

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

// ── Navegación (crece por fase; T0.3 = mínima) ───────────────
CV2.NAV = [
  { id: 'inicio', label: 'Inicio', href: './index.html', icono: 'home' },
  { id: 'actividades', label: 'Actividades', href: './actividades.html', icono: 'checklist' },
  { id: 'reservas', label: 'Reservas', href: './reservas.html', icono: 'king_bed' },
  { id: 'calendario', label: 'Calendario', href: './calendario.html', icono: 'calendar_month' },
  { id: 'clientes', label: 'Clientes', href: './clientes.html', icono: 'contacts' },
  { id: 'comunicacion', label: 'Chat', href: './comunicacion.html', icono: 'forum' },
  { id: 'sesiones', label: 'Sesiones', href: './gestion-sesiones.html', icono: 'schedule' },
  { id: 'horas', label: 'Horas', href: './horas-stats.html', icono: 'insights' },
  { id: 'honorarios', label: 'Cobros', href: './honorarios.html', icono: 'payments' },
  { id: 'cabanas', label: 'Cabañas', href: './cabanas.html', icono: 'cottage' },
  { id: 'usuarios', label: 'Usuarios', href: './usuarios.html', icono: 'group' }
];

CV2.renderNav = function (activo) {
  const cont = document.getElementById('nav');
  if (!cont) return;
  const SIEMPRE = ['inicio', 'actividades', 'reservas', 'calendario', 'clientes', 'comunicacion', 'sesiones', 'horas', 'honorarios'];
  const items = CV2.NAV
    .filter(it => CV2.puede(it.id) || SIEMPRE.includes(it.id))
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
