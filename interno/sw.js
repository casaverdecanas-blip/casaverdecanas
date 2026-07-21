// ═══════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — service worker
//  Estrategia: shell precacheado (cache-first) · navegación
//  network-first con fallback al shell · el resto pasa directo
//  (los DATOS van por la caché persistente de Firestore, no
//  por acá — regla del anexo técnico).
//  Al cambiar cualquier archivo del shell: subir la VERSION.
// ═══════════════════════════════════════════════════════════

const VERSION = 'cv2-shell-v24';

const SHELL = [
  './',
  './index.html',
  './login.html',
  './actividades.html',
  './actividades-core.js',
  './honorarios.html',
  './gestion-sesiones.html',
  './comunicacion.html',
  './usuarios.html',
  './manual.html',
  './reservas.html',
  './cabanas.html',
  './calendario.html',
  './clientes.html',
  './dinero.html',
  './reservas-core.js',
  './horas-stats.html',
  './nucleo.js',
  './firebase-init.js',
  './design-system.css',
  './manifest.json',
  './icono-192.png',
  './icono-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
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
