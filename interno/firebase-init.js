// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — firebase-init.js
//  Sello: init-2 (14-sep-2026)
//  Punto ÚNICO de contacto con el SDK de Firebase.
//  Regla: ninguna página importa de gstatic directamente;
//  todo pasa por este módulo. La versión del SDK vive SOLO acá.
// ═══════════════════════════════════════════════════════════════
//
//  EL SDK SE CARGA DIFERIDO, Y ESTE PROYECTO YA SABÍA POR QUÉ.
//
//  Hasta el sello init-1 esto eran tres `import` ESTÁTICOS desde gstatic.com.
//  Un import estático es una dependencia dura: si el CDN no contesta, el
//  módulo no evalúa, y con él no evalúa `nucleo.js`, y con él no evalúa el
//  `<script type="module">` de ninguna de las treinta y una páginas que lo
//  importan. No fallaba la parte que usa Firebase: fallaba la página entera,
//  en blanco y sin un solo mensaje.
//
//  Y acá no es una hipótesis: `CV2.ESPERA_ARRANQUE` de `nucleo.js` lo tiene
//  escrito desde julio, con estas palabras — «el SDK de Firebase se importa
//  de gstatic.com, que es otro origen y por eso el service worker NO lo
//  cachea. En un arranque sin señal —el primero después de instalar la app,
//  típicamente— el shell sale de la caché y anda, pero el SDK no llega, el
//  callback no dispara, y el resultado es exactamente "la app se instaló y no
//  abre"». Aquello se tapó con relojes de guardia de 15 y 25 segundos. Esto
//  ataca la causa: ahora se SABE que el SDK no bajó, y se dice, en el acto.
//
//  Es el hallazgo A2 de la primera auditoría de protocolos (2026-09-09): la
//  regla `general:cdn-diferido` existía y no se cumplía en ninguno de los
//  cuatro sitios. El panel lo resolvió primero, después CasaYourte y remate,
//  y esto es el mismo patrón traído acá — `general:llevar-no-reinventar`.
//
//  CÓMO NO OBLIGÓ A TOCAR LAS TREINTA Y UNA PÁGINAS: lo que se exporta son
//  `let`, no `const`. Un `export let` es un ENLACE VIVO — quien escribió
//  `doc(db, …)` ve el valor que la variable tenga al USARLA, no el que tenía
//  al importar. Y las veinticinco páginas internas entran todas por
//  `CV2.verificarAuth()`, que lo espera sola.
//
//  ⚠ LA CONTRA, QUE HAY QUE SABER: hasta que `cargarFirebase()` resuelva,
//  todos valen `undefined`. Nada que dependa de Firebase puede correr al
//  nivel superior de un módulo antes de esa espera.
// ═══════════════════════════════════════════════════════════════

const SDK = 'https://www.gstatic.com/firebasejs/12.16.0/';

// ── Configuración del proyecto casaverde-20 ──────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyDG12FsMYyGVzkodq07N1SSWQfMcTJ-3yM',
  authDomain: 'casaverde-20.firebaseapp.com',
  projectId: 'casaverde-20',
  storageBucket: 'casaverde-20.firebasestorage.app',
  messagingSenderId: '125676938413',
  appId: '1:125676938413:web:537369f37a79d63c935224'
};

/* Enlaces vivos: `undefined` hasta que `cargarFirebase()` los rellena. */
export let app, db, auth;
export let doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
           collection, query, where, orderBy, limit, onSnapshot,
           or, and, documentId,
           getCountFromServer, getAggregateFromServer, sum, average, count,
           serverTimestamp, Timestamp, increment, arrayUnion, arrayRemove,
           deleteField, writeBatch, runTransaction,
           terminate, clearIndexedDbPersistence;
export let onAuthStateChanged, signInWithEmailAndPassword, signOut,
           sendPasswordResetEmail, createUserWithEmailAndPassword,
           signInAnonymously, GoogleAuthProvider, signInWithPopup,
           signInWithRedirect, getRedirectResult;

/* `false` mientras no anduvo. Lo mira el diagnóstico. */
export let sdkCargado = false;

/* Los guarda `crearCuentaAuth`, que arma una app secundaria. */
let _initializeApp, _getApps, _getAuth;

let _promesaSdk = null;

/**
 * Baja el SDK y prepara `app`, `db` y `auth`. Idempotente: si dos cosas la
 * llaman a la vez, se baja una sola vez. Y si FALLÓ, un llamado nuevo
 * REINTENTA —por eso la promesa se borra en el catch—: el caso típico es que
 * vuelva la señal.
 */
export function cargarFirebase() {
  if (_promesaSdk) return _promesaSdk;
  _promesaSdk = (async () => {
    let modApp, modAuth, modFs;
    try {
      [modApp, modAuth, modFs] = await Promise.all([
        import(SDK + 'firebase-app.js'),
        import(SDK + 'firebase-auth.js'),
        import(SDK + 'firebase-firestore.js')
      ]);
    } catch (e) {
      // El error del navegador para un módulo que no baja es genérico
      // («error loading dynamically imported module»). Se traduce acá, una
      // sola vez, para que ninguna pantalla tenga que adivinar.
      const err = new Error(
        'No se pudo cargar Firebase desde gstatic.com. Suele ser falta de '
        + 'señal, o una red que bloquea ese dominio.'
      );
      err.causa = e;
      err.codigo = 'sdk-no-baja';
      _promesaSdk = null;
      throw err;
    }

    ({ initializeApp: _initializeApp, getApps: _getApps } = modApp);
    _getAuth = modAuth.getAuth;

    ({ onAuthStateChanged, signInWithEmailAndPassword, signOut,
       sendPasswordResetEmail, createUserWithEmailAndPassword,
       signInAnonymously, GoogleAuthProvider, signInWithPopup,
       signInWithRedirect, getRedirectResult } = modAuth);
    ({ doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
       collection, query, where, orderBy, limit, onSnapshot,
       or, and, documentId,
       getCountFromServer, getAggregateFromServer, sum, average, count,
       serverTimestamp, Timestamp, increment, arrayUnion, arrayRemove,
       deleteField, writeBatch, runTransaction,
       terminate, clearIndexedDbPersistence } = modFs);

    app = _initializeApp(firebaseConfig);

    // ── Firestore con caché persistente desde el día uno ─────────
    // Lecturas repetidas salen del dispositivo (IndexedDB), la app funciona
    // offline y las escrituras se encolan y sincronizan solas al volver la
    // conexión. Multi-pestaña habilitado.
    //
    // El `try` no es adorno: `initializeFirestore` falla si algo ya llamó a
    // `getFirestore(app)`, y el navegador puede negar el almacenamiento
    // (incógnito, disco lleno, un ajuste). En cualquiera de esos casos vale
    // más una app sin caché que una que no abre.
    try {
      db = modFs.initializeFirestore(app, {
        localCache: modFs.persistentLocalCache({
          tabManager: modFs.persistentMultipleTabManager()
        })
      });
    } catch (e) {
      console.warn('Firestore sin caché persistente:', e && e.message);
      db = modFs.getFirestore(app);
    }

    auth = _getAuth(app);

    sdkCargado = true;
    return true;
  })();
  return _promesaSdk;
}

// ── Alta de cuentas SIN perder la sesión del admin ───────────
// createUserWithEmailAndPassword loguea a la cuenta nueva en la
// instancia donde corre. Usamos una app SECUNDARIA descartable:
// la sesión principal del admin no se toca.
export async function crearCuentaAuth(email, clave) {
  await cargarFirebase();
  const app2 = _getApps().find((a) => a.name === 'alta-usuarios')
    ?? _initializeApp(firebaseConfig, 'alta-usuarios');
  const auth2 = _getAuth(app2);
  const cred = await createUserWithEmailAndPassword(auth2, email, clave);
  const uid = cred.user.uid;
  await signOut(auth2);
  return uid;
}

// ── Ya no hay re-exportación ─────────────────────────────────
// Hasta el sello init-1 había un `export { … }` acá abajo con los cuarenta y
// pico de nombres. Ahora todos están declarados arriba como `export let` y
// los rellena `cargarFirebase()`: una segunda exportación del mismo nombre
// sería un error de sintaxis, y además una segunda lista que mantener.
