// ═══════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — service worker
//  Estrategia: shell precacheado (cache-first) · navegación
//  network-first con fallback al shell · el resto pasa directo
//  (los DATOS van por la caché persistente de Firestore, no
//  por acá — regla del anexo técnico).
//  Al cambiar cualquier archivo del shell: subir la VERSION.
// ═══════════════════════════════════════════════════════════

const VERSION = 'cv2-shell-v59';

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
  './espacios.html',
  './calendario.html',
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
