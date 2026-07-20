// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — firebase-init.js
//  Punto ÚNICO de contacto con el SDK de Firebase.
//  Regla: ninguna página importa de gstatic directamente;
//  todo pasa por este módulo. La versión del SDK vive SOLO acá.
// ═══════════════════════════════════════════════════════════════

import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  terminate, clearIndexedDbPersistence,
  // — lectura/escritura —
  doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit, onSnapshot,
  // — consultas modernas —
  or, and, documentId,
  // — agregaciones del servidor —
  getCountFromServer, getAggregateFromServer, sum, average, count,
  // — tipos y utilidades —
  serverTimestamp, Timestamp, increment, arrayUnion, arrayRemove,
  deleteField, writeBatch, runTransaction
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail, createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';

// ── Configuración del proyecto casaverde-20 ──────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyDG12FsMYyGVzkodq07N1SSWQfMcTJ-3yM',
  authDomain: 'casaverde-20.firebaseapp.com',
  projectId: 'casaverde-20',
  storageBucket: 'casaverde-20.firebasestorage.app',
  messagingSenderId: '125676938413',
  appId: '1:125676938413:web:537369f37a79d63c935224'
};

const app = initializeApp(firebaseConfig);

// ── Firestore con caché persistente desde el día uno ─────────
// Lecturas repetidas salen del dispositivo (IndexedDB), la app
// funciona offline y las escrituras se encolan y sincronizan
// solas al volver la conexión. Multi-pestaña habilitado.
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const auth = getAuth(app);

// ── Alta de cuentas SIN perder la sesión del admin ───────────
// createUserWithEmailAndPassword loguea a la cuenta nueva en la
// instancia donde corre. Usamos una app SECUNDARIA descartable:
// la sesión principal del admin no se toca.
export async function crearCuentaAuth(email, clave) {
  const app2 = getApps().find((a) => a.name === 'alta-usuarios')
    ?? initializeApp(firebaseConfig, 'alta-usuarios');
  const auth2 = getAuth(app2);
  const cred = await createUserWithEmailAndPassword(auth2, email, clave);
  const uid = cred.user.uid;
  await signOut(auth2);
  return uid;
}

// ── Re-exportación: las páginas importan TODO desde acá ──────
export {
  app, db, auth,
  doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit, onSnapshot,
  or, and, documentId,
  getCountFromServer, getAggregateFromServer, sum, average, count,
  serverTimestamp, Timestamp, increment, arrayUnion, arrayRemove,
  deleteField, writeBatch, runTransaction,
  onAuthStateChanged, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail,
  terminate, clearIndexedDbPersistence
};
