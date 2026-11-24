# casaverdecanas — CONTEXTO.md

> **Para una sesión nueva que no sabe nada del ecosistema.** Este archivo explica qué es este repo, cómo funciona y qué no se toca.
> Complementa a `CLAUDE.md` (reglas cortas), `HISTORIA.md` (el porqué de cada regla) y `interno/CASAVERDEDOCUMENTACION.md` (la documentación técnica completa, unos 6.000 renglones: se lee con el índice de § 3). Escrito el 23-nov-2026.
> **El chat le habla a Mauro en castellano rioplatense.** Ningún valor de una credencial entra a un archivo, a un repo ni a un chat.

## 1. Qué es

**Casa Verde Canas** es el negocio de alquiler de cabañas de Mauro y Florencia (Canas, Brasil). Este repo es **el sitio público + el panel interno + las funciones de servidor** de ese negocio:

- **Sitio público** (raíz del repo, GitHub Pages, dominio `casaverdecanas.com.br`, `CNAME`): `index.html` (portada con las cabañas, calendario de disponibilidad, en pt/es/en), `la-casa.html`, `opiniones.html`, `recuerdos.html` (el QR de cada cabaña), `404.html`. Desde el 17-nov: `/?c=c3&lang=pt` abre la portada parada en un espacio.
- **Panel interno** (`interno/`, la app de gestión; instalable, PWA con `sw.js`): reservas, limpiezas y actividades, horas y honorarios, dinero y balance, fiscal, clientes, avisos, recuerdos de huéspedes, editor del sitio, manual.
- **Funciones de servidor** (`netlify/functions/`, ocho archivos; el zip lleva nueve funciones, ver § 8): un Netlify (`serene-scone-76bd4e`) que **además es todavía parte del servidor del ecosistema** (IA, luces de remate, despertar a las Pizarras, avisar a Claude, hielo para llamadas). Se van mudando a `timon-servidor` (`servidor/` del repo `datos`).

Base: Firebase `casaverde-20` (Auth + Firestore). Fotos: Cloudinary (subida sin firma). No hay build, no hay `npm`, no hay Actions. Se edita desde el teléfono: **archivos completos, nunca diffs**.

## 2. Dónde encaja en el ecosistema

| Pieza | Repo | Relación con éste |
|---|---|---|
| Panel de datos (estado, ronda, fichas, claves) | `datos` | Maneja el panel de Mauro; su herramienta `firestore.mjs casaverde …` lee y escribe esta base con copia previa en `_historial/`. La ronda diaria completa reservas, lee notificaciones y propone cambios. |
| **Timón** (la app de gestión del ecosistema) | `tiempos` | Usa Casa Verde **como una app más**, y **sólo por `interno/conector-1.js`** (arrancar/frenar/tildar actividades, compras, subir imagen). |
| App de Android de Timón | `pizarra` | Lee Airbnb y Facebook en el 13C → `notificaciones/`, `pedidos_alquiler/`; tiene su `cuerpoPedidoCasaVerde`, `CAMPOS_PEDIDO` y `huecoDelPedido` que **deben coincidir** con las reglas y las páginas de acá. |
| remateTaller | `remate` | Su puente de luces (Tuya) lo sirve este Netlify (`TUYA_*`); el código vive en `remate`. |
| Bodega privada | `bodega` | Copias diarias de la base; mensajes de Airbnb; borradores. |

**Es una app independiente** que otras apps usan por un contrato numerado. No se la mezcla con Timón: no se copia su lógica allá.

## 3. Mapa de archivos

### Raíz
`index.html`, `la-casa.html`, `opiniones.html`, `recuerdos.html` (público) · `404.html`, `CNAME`, `robots.txt`, `sitemap.xml`, imágenes (y `casa-verde-entorno.mp4` + su póster `.jpg`: el video de la portada, 13,0 MiB, servido por Pages) · `netlify.toml` (explica CÓMO se despliega y qué variable usa cada función) · `CLAUDE.md`, `HISTORIA.md`, `README.md`, este archivo.

### `interno/` (el panel)
- **Núcleo, uno solo, no se duplica**: `nucleo.js` (`CV2`: auth, permisos, navegación, subida de imágenes, avisos, `envolverEscrituras`; sello `CV2.VERSION`, hoy `nucleo-avisos-26`), `firebase-init.js` (**único contacto con el SDK**, diferido con `import()` en un `try`), `actividades-core.js` (`Core`: el motor de actividades, limpiezas, compras, `consultaActividades`), `reservas-core.js` (huellas y cuentas de reservas), `textos-sitio.js`.
- **Contrato con otras apps**: `conector-1.js`. Lo que lista `OFRECE` (`Core`: `consultaActividades`, `limpiezaLatente`, `esLimpiezaEntrada`, `iniciar`, `finalizar`, `tildar`, `itemsDeCompra`, `compradosDe`, `tildarCompra`; `CV2`: `subirImagen`, `comprimirImagen`, `NETLIFY`) **no se saca ni cambia de forma**; un cambio incompatible es un `conector-2.js` al lado. Banco: `netlify/pruebas/conector.mjs`.
- **Páginas del panel**: `index.html` (Inicio con novedades y pendientes), `login.html`, `reservas.html` (la más grande), `revisar-reservas.html`, `calendario.html`, `cabanas.html` y `espacios.html` (editor de todo el contenido público), `editar.html` (editor visual), `fotos.html`, `actividades.html` (limpiezas, tareas, compras), `agenda.html`, `horas-stats.html`, `honorarios.html`, `dinero.html`, `balance.html`, `fiscal.html` (liquidaciones y DARF), `clientes.html`, `avisos.html`, `pedidos-alquiler.html`, `recuerdos.html` (moderación), `opiniones.html`, `llegada.html`, `comprobante.html`, `usuarios.html`, `gestion-sesiones.html`, `traducir.html`, `manual.html`, `diagnostico.html`, `pruebas.html`.
- **Infra**: `sw.js` (service worker; `VERSION` hoy `cv2-shell-v149`), `manifest.json`, `design-system.css`, íconos, `firestore.rules` (**la copia de las reglas**), `CASAVERDEDOCUMENTACION.md`.

### `netlify/`
- `functions/`: `claude-proxy.js` (la IA: facturas, boletas, inventario de remate; **la única clave de Gemini**), `airbnb-ical.js` (lee el .ics de Airbnb), `ical-cabana.js` (publica NUESTRA ocupación, **sólo reservas directas**), `notify-whatsapp.js` (CallMeBot), `cloudinary-listar.js`, `avisar-claude.mjs` (despierta al chat de Claude), `despertar.mjs` (FCM a las Pizarras), `hielo.mjs` (TURN para llamadas).
- `pruebas/`: nueve bancos `avisar-claude`, `conector`, `control-salida`, `despertar-cliente`, `despertar`, `hielo`, `huecos`, `ical-cabana`, `pasajeros`.

### La documentación grande (`interno/CASAVERDEDOCUMENTACION.md`)
Tres libros en un archivo. **Libro 1 · CONVENCIONES** (reglamento técnico, el único que se lee entero): § 1 principios, § 2 infraestructura (**§ 2.1: hay dos cuentas de Netlify y sólo una sirve**), § 3 reglas de código, § 4 modelo de datos, § 5 seguridad/reglas, § 6 interfaz, § 7 flujo de trabajo, § 8 trampas, § 9 lo que no se hace, § 10 flujos F1–F9. **Libro 2 · MASTER BRIEFING**: historia tanda por tanda (lo útil está arriba). **Libro 3**: guía del sitio público, SEO y QR de recuerdos. Cuándo leer qué: tocar un proceso → § 10; escribir código → § 3 y § 8; una colección → § 4; permisos → § 5.

## 4. Flujos principales (el detalle en § 10 de la documentación)

- **F1 Limpieza y control por reserva**: cada reserva genera su ciclo de limpieza con IDs deterministas (check-in, check-out, control de salida); **la limpieza de entrada abre el control de salida por cualquier camino** (la regla vive en el motor `Core`, no en la pantalla).
- **F2 El acuerdo** (`grupos/`): de presupuesto a cobrado; los huéspedes de un acuerdo son el máximo **a la vez** (`CV2.pasajerosSimultaneos`).
- **F3 Avisos**: por WhatsApp (CallMeBot, sólo a quien lo encendió) y buzón `avisos/`.
- **F4 Espejo de disponibilidad pública** (`disponibilidad/`): lo que ve el calendario del sitio.
- **F5 Airbnb en las dos direcciones**: se lee su .ics (`airbnb-ical`) y se publica el nuestro (`ical-cabana?c=`) **sin las reservas de Airbnb** (lo de Airbnb no vuelve a Airbnb). La ida se comprueba sola (`airbnb_estado/`): es un dato, no una alarma.
- **F6 Actividades, ciclos y recurrencias**; **F7 De las horas al cobro**; **F8 Dinero** (movimientos → balance por moneda); **F9 El recuerdo del huésped** (QR de cada cabaña → `recuerdos/`, moderación, clave del QR = la llave).
- **Pedidos de alquiler de Facebook**: la Pizarra del 13C (o el agente) crea `pedidos_alquiler/`; alguien con ficha activa los marca; **publicar la respuesta lo hace una persona**.
- **Reservas desde la ronda**: el agente completa lo vacío; lo que **cambia** se propone en `cambios_reserva/` y se confirma en Reservas con permiso.
- **Guardar despierta a las Pizarras** (`envolverEscrituras`, `QUE_DE_COLECCION`) por `despertar`.

## 5. Datos y bases

Firestore `casaverde-20`. Colecciones (cada una con su bloque en `interno/firestore.rules`): `usuarios`, `actividades`, `sesiones`, `honorarios`, `chequeos`, `grupos`, `reservas`, `pagos`, `movimientos`, `cierres`, `liquidaciones`, `cabanas`, `espacios_comunes`, `clientes`, `comunicaciones` (+`mensajes`, `comunicaciones_lecturas`: retiradas del menú el 9-nov, reglas aún publicadas), `estado_usuario` (la agenda de cada uno), `avisos`, `avisos_contacto`, `pedidos_alquiler`, `pedidos_busqueda/actual`, `notificaciones`, `cambios_reserva`, `airbnb_estado`, `disponibilidad`, `recuerdos`, `claves_recuerdos`, `recuerdos_contactos`, `huespedes`, `reportes`, `config/*`, `_historial`.

- **Permisos**: `usuarios/{uid}` con `rol` y `permisos`; un admin sin restricciones, el resto por permiso (`tiene(p)`); `activo()`, no `logueado()` (hay sesiones anónimas para recuerdos).
- **El agente** (usuario común de Auth, **nunca cuenta de servicio**) lee y escribe todo **menos lo sellado**: `claves_recuerdos`, `config` salvo `config/fiscal`, `avisos_contacto` (sólo un `get` de a uno). Cada cambio deja antes su copia en `_historial/`; sin copia no hay cambio (`firestore.mjs casaverde historial` / `deshacer <id>`). **La lista está en dos lugares**: `interno/firestore.rules` y `selladas` de `datos/herramientas/firestore.mjs`.
- `notificaciones/` (las del 13C): la regla deja sólo CREAR; **códigos y enlaces tapados en el teléfono**; el agente las clasifica y borra lo que no sirve; vencen a los 7 días.
- Datos de personas (LGPD): se leen para trabajar y **no se copian enteros a un chat**.

## 6. Reglas de fondo y su porqué

1. **Las reglas de Firestore son la única frontera real**; la UI sólo oculta. Se editan **completas**, nunca por fragmentos (reemplazar por pocos bloques dejó el sitio inaccesible una vez); sin catch-all; **una colección nueva entra con su regla en la misma tanda** y se dice «hay que publicar `interno/firestore.rules`».
2. **Los derivados no se guardan** (saldos, totales, estados): se calculan al leer.
3. **Cada moneda es un sistema aparte**: reales, dólares y pesos nunca se suman; no hay pivote (la única conversión es `montoEquiv` de un pago).
4. **`gstatic` sólo en `firebase-init.js`**, y el SDK se baja diferido: nada que dependa de Firebase corre al nivel superior de un módulo antes de `CV2.verificarAuth()`.
5. **`onSnapshot` siempre al final del módulo** (la caché entrega el primer snapshot antes de evaluar el módulo → página en blanco).
6. **Toda rama de un `or()` debe ser demostrable** por las reglas (`Core.consultaActividades`).
7. **IDs deterministas** para lo generado (§ 3.5); **`merge` parcial: nunca pisar el trabajo humano** ni escribir `null` sobre un dato que el destino tiene.
8. `escapeHtml` en todo lo que viene de la base. **Subir la `VERSION` de `sw.js` en cada tanda que toque el shell** (la página que no está en el `SHELL` no la sube).
9. **Nada decorativo en el camino de autenticación**; `location.replace`, no `href`; el volver es un enlace, no `history.back()`; todo emergente se cierra con Atrás (`CV2.capaAtras`).
10. **Tener sesión no es permiso**.
11. **Imágenes**: sólo por `nucleo.js` (`CV2.subirImagen`), a Cloudinary sin firma; nunca URL cruda ajena; las del shell no se migran.
12. **Otra app entra sólo por `conector-1.js`**; las reglas del negocio viven en el motor.
13. **Reportes**: una falla se reporta desde donde se vio a `reportes/` de ESTA base; el agente lee y no escribe.
14. **Comprobante**: lee y no escribe; sin teléfono ni mail del huésped; importes sólo si se marca; la cláusula va en tres idiomas.
15. **Nada de números a mano para esquivar las barras** (`--cv-piso`, `--cv-techo`, `.cv-pegado-abajo`).
16. **No se deja viva una función que nadie usa** (cuesta mantenimiento, manual y confusión). La documentación sube en la misma tanda que el código.

Lo que **nunca** hace el ecosistema acá: mandar mensajes a huéspedes (los manda Mauro), automatizar dentro de Airbnb/WhatsApp/Facebook, escribir un extracto bancario a la app (§ 9 de la documentación tiene la lista completa de «lo que no se hace»).

## 7. Cómo se verifica antes de subir

Desde la raíz del repo, sin `npm` ni navegador:

```
for f in interno/*.js netlify/functions/*.js; do node --input-type=module --check < $f; done   # y los módulos de los .html
for b in avisar-claude conector control-salida despertar-cliente despertar hielo huecos ical-cabana pasajeros; do node netlify/pruebas/$b.mjs; done
```

Además: suben los sellos (`CV2.VERSION`, `VERSION` de `sw.js` si cambia algo del shell, `?v=`) y la documentación dice la verdad. El reglamento técnico pide probar en el teléfono (§ 3.8).

## 8. Cómo se despliega

- **Sitio y panel**: se empuja a `main` directo (criterio de Mauro, 3-nov-2026) y GitHub Pages los publica. Antes: reservar el repo (`node herramientas/ronda.mjs reservar casaverdecanas`, desde `datos`) y leer el panel (`ronda.mjs abrir`); al cerrar, `soltar`.
- **Funciones**: **un .zip subido a mano** en Netlify → Deploys (el proyecto NO está enganchado a Git, a propósito, para no gastar los minutos gratuitos). El zip **reemplaza todo**: tiene que llevar **las nueve funciones**, no sólo la que cambió (una que falte se apaga en silencio). **Netlify tiene «Auto Publishing Locked»**: construye y NO publica; hay que ir a Deploys → *Publish deploy*. **Un chat no despliega**: lo hace Mauro.
- **Reglas de Firestore**: las publica Mauro en la consola (copiar `interno/firestore.rules`).
- **Variables de Netlify** (los valores nunca entran acá): `GEMINI_API_KEY`, `CLOUDINARY_API_KEY/SECRET`, `TUYA_*`, `CLAUDE_RUTINA_*`, `FCM_CUENTA`, `TURN_*`, `CALLMEBOT_*`. De quién es cada cuenta: `fichas/` del panel.

## 9. Lo que no se toca y errores que ya costaron

- Una cuenta de Netlify de dos sirve (§ 2.1): confirmar cuál antes de desplegar.
- Netlify construye el despliegue y **no lo publica** (el log dice «Site is live» igual).
- **GitHub: subir a una rama en vez de `main`** no publica nada.
- «Reparar la app» puede dejar Auth trancado; la app se trancó en blanco por estado local del navegador (v5.60).
- Un reemplazo de texto que no encuentra su patrón no avisa: verificar el resultado.
- `onSnapshot` arriba del módulo → página en blanco (TDZ).
- Reglas editadas por fragmentos → sitio inaccesible.
- Un `addAll` en el `install` del service worker rompe la instalación si un archivo falta.
- La alarma de `diagnostico.html` tuvo cinco falsos positivos en v5.74 (una marca que era un sello de versión, una negativa sin saber con qué cuenta corría): leer el diagnóstico con ese antecedente.
- No retirar **Liquidaciones**: son los cobros de Airbnb con su DARF y el centro de `fiscal.html`; retirarlas es una decisión de impuestos de Mauro.
- No publicar hacia Airbnb reservas que vinieron de Airbnb (`ical-cabana` publica sólo las directas).

## 10. Estado actual (24-nov-2026)

- **24-nov**: la portada tiene el video «La casa en su entorno» (de la bahía a la casa, tomas de dron; sección `#entorno` bajo el hero, claves `entorno_*` en `textos-sitio.js`). Sólo se baja cuando se ve y no con ahorro de datos; costo y detalle en la primera entrada de `interno/CASAVERDEDOCUMENTACION.md`.
- Último trabajo previo: `core-3` (compras en el motor y en `conector-1` para la solapa Compras de Timón) y el enlace directo a un espacio (`?c=`/`?lang=`). `CV2.VERSION` `nucleo-avisos-26`, `sw.js` `cv2-shell-v149`.
- Los recuerdos por QR se retiraron el 9-nov y **volvieron el 15-nov**; el chat interno y «migrar reservas» se retiraron.
- Las funciones del ecosistema (IA, luces, despertar, hielo, avisar-claude) **se van mudando a `timon-servidor`**; se sacan del zip cuando la Pizarra cambie de servidor.
- Pendientes del panel de esta app: ver `proyectos/casaverde` y `pendientes/casaverde:*` en el panel de `datos` (`casaverde:A9` plan en espera de Mauro).

## 11. Glosario

- **Timón**: la app de gestión del ecosistema (repo `tiempos`; en Android, `pizarra`).
- **Pizarra**: el nombre viejo de la app de Android; hoy todo lo visible dice Timón.
- **CV2**: el objeto del núcleo (`nucleo.js`) del 2.0.
- **Core**: el motor de actividades (`actividades-core.js`).
- **Conector**: `conector-N.js`, el contrato numerado por el que otra app usa Casa Verde.
- **Acuerdo** (`grupos/`): un presupuesto/cobro que reúne reservas de un mismo grupo.
- **Control de salida**: la revisión de la cabaña al irse el huésped; la abre la limpieza de entrada.
- **DARF**: el impuesto brasileño que vence el día del cobro de Airbnb (liquidaciones).
- **LGPD**: la ley brasileña de protección de datos personales.
- **Ronda**: la corrida diaria del agente desde `datos` (no toca código).
- **Bodega**: repo privado con copias de las bases y mensajes.
- **Sellos**: `CV2.VERSION`, `VERSION` de `sw.js` y `?v=`; si se cambia un archivo, sube su sello.
