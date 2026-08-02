# CONVENCIONES — CasaVerde 2.0
### Reglamento técnico único · v2.20 (julio 2026, al cierre de la tanda 11.19)

> **Si vas a tocar un proceso, empezá por §10 · FLUJOS.** Ahí está, en una página
> por proceso, qué lo dispara, qué crea, cómo termina y —sobre todo— **qué NO
> hace**. Esa sección nació porque tres pantallas distintas describían un modelo
> de limpiezas que había cambiado cuarenta tandas antes, y nadie lo notó: el flujo
> estaba bien escrito, pero enterrado en §4 entre esquemas de datos.

> Este documento manda sobre el código. Si algo acá contradice a una implementación,
> la implementación está mal. Si una decisión nueva contradice a este documento,
> primero se actualiza el documento y después se escribe el código.
>
> **Jerarquía de documentos:**
> 1. `CONVENCIONES.md` (este) — las reglas que no cambian por tanda.
> 2. `Master_briefing_vN.md` — el estado del sistema y el registro de cada tanda.
> 3. `GUIA-SITIO-PUBLICO.md` — cómo es el sitio público hoy (§2 de esa guía manda sobre
>    los archivos de la raíz; este documento manda sobre el panel).
> 4. `manual.html` — cómo se usa el sistema (vive EN EL CÓDIGO, se actualiza en el
>    mismo commit que la funcionalidad que describe).
>
> **Los cuatro viven en el repositorio**, en `interno/` (decisión del administrador,
> tanda 11.17). Un documento que solo existe en una conversación se pierde con la
> conversación; y un briefing que dice "listo" sobre algo que nadie puede abrir no se
> puede verificar. **Hay UN solo briefing en el repositorio**: al subir el nuevo se
> borra el anterior.
>
> **Cambios de v2.18 → v2.19** (tanda 11.17 — la documentación entra al repositorio;
> anunciada en la 11.16 y entregada acá, que es la diferencia que importa):
> · **§2 corregida en tres datos falsos** que arrastraba desde la Fase 0: el despliegue
>   NO usa GitHub Actions (Pages publica directo desde la raíz de `main`), el
>   `index.html` de la raíz **ya no redirige al login** —es el sitio público— y el
>   dominio propio ya no es un pendiente de Fase 6: está en vivo. Se suman `.nojekyll`,
>   `CNAME`, `404.html`, `textos-sitio.js`, el segundo preset de Cloudinary y la
>   documentación.
> · **§2 nota nueva**: los `.md` de `interno/` se sirven en texto plano y **son
>   públicos**.
> · **§3 reordenada**: los bloques 3.15 y 3.16 estaban intercalados entre el 3.9 y el
>   3.10. Se movieron a su lugar. **Ningún número cambió** — el briefing y el manual
>   citan estos números y renumerar los rompería.
> · **§7 punto 7 nuevo** — la documentación se sube en la misma tanda que el código que
>   describe; **§7 punto 8 nuevo** — no se registra como entregado nada que no se haya
>   entregado en la misma tanda.
> · **§7.9 nueva** — al renombrar o retirar una página pública se agrega su entrada al
>   mapa de `404.html`.
> · **§8 y §9** — el respaldo que esconde el defecto que tapa, las medidas declaradas a
>   ojo, el archivo huérfano y el "listo" heredado.

> **Cambios de v2.17 → v2.18** (tanda 11.15 — el muro de recuerdos):
> · §8 — **un mensaje de error sin código es un problema de dos minutos convertido en
>   tres días**, y **lo que solo funciona con una sesión previa no está probado**.

> **Cambios de v2.16 → v2.17** (tanda 11.14 — revisión de coherencia):
> · §8 — **un `catch` que traga un error de permisos es un error invisible**, y una
>   función escrita que nadie llama es una promesa incumplida.
> · §9 — toda colección nueva entra al mismo tiempo que su regla.

> **Cambios de v2.15 → v2.16** (tanda 11.13 — se retira el libro personal):
> · §4 — `movimientos_personales` retirada, con el motivo.
> · §7.8 nueva — **cómo se retira una función**: el orden (código y manual primero,
>   datos después) y por qué.
> · §9 — una función que nadie usa no es neutra.

> **Cambios de v2.14 → v2.15** (tanda 11.12 — foto de persona y borrado de temas):
> · §3.16 nueva — **lo que se puede arreglar en el sistema de diseño no se arregla
>   página por página**.
> · §4 — `usuarios.fotoUrl` y `comunicaciones.ocultoPara`.
> · §6 punto 13 nuevo — **el borrado por persona y su cartel de confirmación**.
> · §8 — trampas nuevas (cascada, garantía de la regla).

> **Cambios de v2.13 → v2.14** (tanda 11.11 — lo que la barra de abajo tapaba):
> · §6.0 punto 12 reescrito — **`--cv-piso` y `--cv-techo`**: nunca más un número a
>   mano para esquivar las barras. Molde `.cv-pegado-abajo`.
> · §8 — trampa nueva.

> **Cambios de v2.12 → v2.13** (tanda 11.10 — la app trancada en blanco):
> · §3.9 ampliada — **reloj de guardia obligatorio** en toda promesa esperada arriba de
>   una página, `location.replace` en el camino de auth, y una sola salida.
> · §3.15 nueva — **el estado local del navegador es parte del sistema**: cómo se toca
>   y cómo se repara desde un teléfono.
> · §8 y §9 — trampas y prohibiciones nuevas.

> **Cambios de v2.11 → v2.12** (tanda 11.8 — cierre de la migración):
> · §3.6 ampliada — **poner al día nunca retrocede ni pisa con `null`**.
> · §7.7 nueva — herramientas de una sola vez: plan antes de escribir, idempotencia por
>   ID y por huella, y **su verificador de solo lectura**.
> · §8 y §9 — trampas y prohibiciones nuevas.
>
> **Cambios de v2.10 → v2.11** (tanda 11.7):
> · §3.14 reescrita — los `<dialog>` ya NO se migran uno por uno: `nucleo.js` los adopta
>   a todos. La regla pasa a ser *cómo se abre una capa que no es un `<dialog>`*.
>
> **Cambios de v2.9 → v2.10** (tanda 11.6 — la navegación baja al pulgar):
> · §3.4 ampliada — el `install` del service worker **nunca usa `addAll`**.
> · §3.14 nueva — toda capa emergente se cierra con `CV2.capaAtras()`.
> · §6.0 puntos 11 y 12 — dónde viven los estilos de la navegación y qué no puede
>   quedar tapado por la barra de abajo.
> · §8 y §9 — trampas y prohibiciones nuevas.
>
> **Cambios de v2.8 → v2.9** (misma tanda 11.5, decisión del administrador):
> · §6.0 nueva y **primera de todas** — *el teléfono Android manda*. Queda registrado
>   que el uso principal del panel es en teléfono Android con la PWA instalada desde
>   Chrome, y qué consecuencias tiene eso para todo diseño de interfaz de acá en más.
>
> **Cambios de v2.7 → v2.8** (tanda 11.5 — muro de recuerdos con clave del QR):
> · §3.13 nueva — **página pública**: sin `nucleo.js`, con su propio preset, y
>   `nombre.es` resuelto siempre.
> · §4 — cuatro colecciones nuevas: `recuerdos`, `claves_recuerdos`,
>   `recuerdos_contactos`, `huespedes`.
> · §5 puntos 13 a 17 — **modelo apikey** para acciones públicas, la regla dura de
>   que *lo que se publica se publica entero*, el molde de las escrituras que vienen
>   de afuera y el consentimiento explícito del huésped.
> · §8 y §9 — trampas y prohibiciones nuevas.
>
> **Cambios de v1.0 → v2.0** (todos ya implementados y verificados en la base):
> · §4 `sesiones.tipo`: el valor de cronómetro es **`'cronometro'`**, no `'crono'`
>   (lo escribe `actividades-core.js`; v1.0 documentaba mal).
> · §4 `usuarios.permisos`: modelo de permisos definitivo (5 permisos), no `{dinero?,
>   cabanas?}`.
> · §4: se agrega **`espacios_comunes`** (faltaba; se descubrió en la migración).
> · §5: reescrita para el modelo de una sola cuenta admin + permisos.
> · §5: **las reglas se suman** (lección dura de la Fase 6) y **se editan siempre
>   completas, nunca por fragmentos**.

---

## 1. PRINCIPIOS

1. **Una sola fuente para cada cosa.** Ningún dato vive en dos lugares. Ninguna
   consulta se escribe dos veces (si dos páginas necesitan la misma, va al core).
2. **Los derivados no se guardan.** Saldos, totales, pendientes, horas acumuladas y
   estados calculables se derivan al leer, siempre. Guardar un derivado es crear una
   mentira con fecha de vencimiento.
3. **El flujo define los saldos.** Lo que entró y salió es la verdad. Los extractos
   bancarios son recibos que verifican; nunca entran a la app ni suman saldos.
4. **Cada moneda es un sistema aparte.** Reales, dólares y pesos uruguayos **nunca se
   suman entre sí**, en ningún total, saldo ni balance. **No hay pivote ni conversión en
   Dinero**: la plata se guarda como es. La única conversión que existe es el
   `montoEquiv` de un pago, y solo porque el saldo de una reserva tiene que cerrar en
   SU moneda — no es un pivote del sistema.
5. **Simple gana.** Ante dos diseños que resuelven lo mismo, va el que tiene menos
   piezas. El sistema viejo murió de acumulación, no de falta de funciones.
6. **Decisión antes que código.** Las decisiones estructurales se discuten y se cierran
   con el administrador antes de escribir la primera línea.
7. **Todo se prueba en el teléfono.** El administrador trabaja desde iPad y Android,
   sin terminal. Si no se puede hacer desde el teléfono, no está terminado.

---

## 2. INFRAESTRUCTURA

| Pieza | Valor |
|---|---|
| Proyecto Firebase | `casaverde-20` (Firestore `southamerica-east1`, Auth email) |
| Repositorio | `casaverdecanas` (owner `casaverdecanas-blip`) |
| Deploy | GitHub Pages **directo desde la raíz de `main`**. No hay Actions, ni build, ni `package.json`. **Lo que se sube queda en vivo, sin etapa intermedia.** |
| URL panel | `casaverdecanas.com.br/interno/` (y `casaverdecanas-blip.github.io/casaverdecanas/interno/`) |
| SDK | Firebase **12.16.0 ESM** vía CDN, sin build, sin frameworks |
| Caché | `persistentLocalCache` + `persistentMultipleTabManager` |
| Imágenes | Cloudinary cloud `dnwfu8ffn`, presets `preset-comprobantes` (panel) y `preset-recuerdos` (muro público) — los dos sin firma |
| Dominio público | `casaverdecanas.com.br` — **en vivo**. `CNAME` y `.nojekyll` no se tocan nunca |
| Documentación | `interno/CONVENCIONES.md` · `interno/Master_briefing_vN.md` · `interno/GUIA-SITIO-PUBLICO.md` |
| Funciones de servidor | Netlify, proyecto **`serene-scone-76bd4e`** — ver abajo |

### 2.1 · Netlify: hay DOS cuentas, y solo una sirve

Esto costó una noche entera de búsqueda en julio de 2026 porque no estaba escrito
en ningún lado.

| | Cuenta del negocio | **Cuenta personal del administrador** |
|---|---|---|
| Cómo se entra | correo y contraseña | **con Google** |
| Proyecto | `casaverdecanas` (Netlify Drop, jun-2026) | **`serene-scone-76bd4e`** |
| Qué tiene | nada útil: copia suelta sin funciones | **las tres funciones y todas las variables** |

La forma más rápida de saber en cuál estás: si `app.netlify.com/projects/serene-scone-76bd4e`
abre, es la buena.

**Las tres funciones** (`netlify/functions/`, sin librerías externas — solo `fetch`
de Node 24, así que **no hace falta `package.json` ni `node_modules`**):

| Función | Para qué | Variables |
|---|---|---|
| `claude-proxy` | leer facturas con Gemini (lo llama `honorarios.html`) | `GEMINI_API_KEY` |
| `notify-whatsapp` | avisos por CallMeBot (lo llama `CV2.enviarWhatsApp`) | `CALLMEBOT_PHONE`, `CALLMEBOT_APIKEY` |
| `notify-recuerdo` | avisar un recuerdo nuevo | `ADMIN_EMAIL`, `EMAILJS_PRIVATE_KEY`, `RECUERDOS_TOKEN` — **ninguna existe: la función está muerta** |

**Cómo se despliega.** El proyecto NO está enganchado a Git: se sube un `.zip` con
`netlify.toml` + `netlify/functions/*.js` en **Deploys**, arrastrándolo. El zip
reemplaza TODO el sitio (`publish = "."`), pero ahí solo tienen que vivir las
funciones — el panel y el sitio público van por GitHub Pages. Para volver atrás:
Deploys → un despliegue anterior → *Publish deploy*.

**⚠ Y antes de dar nada por desplegado, leer la trampa de §8 sobre
"Auto Publishing Locked".**

**Estructura del repositorio:**

```
/index.html              → EL SITIO PÚBLICO (portada trilingüe). NO redirige al login.
/recuerdos.html          → el muro de recuerdos (se entra por el QR)
/404.html                → cartel + mapa de URLs viejas → nuevas (§7.9)
/CNAME                   → el dominio propio. Nada lo puede borrar.
/.nojekyll               → imprescindible: sin él, Pages procesa el sitio con Jekyll
/sitemap.xml             → se actualiza A MANO
/README.md               → lo primero que ve quien abra el repositorio
/logo-sitio.png · /logo-pie.png · /ilustracion-hero.jpg
/interno/                → el panel
   firebase-init.js      → ÚNICO archivo que toca gstatic
   nucleo.js             → CV2: auth, permisos, nav, formatos, toast, SW
   design-system.css     → estilos comunes
   actividades-core.js   → motor de actividades/sesiones/honorarios
   reservas-core.js      → motor de limpiezas y sync Airbnb
   textos-sitio.js       → textos es/pt/en — lo leen el SITIO y el panel
   index.html            → el Inicio del panel (portada de novedades)
   *.html                → una página por módulo
   sw.js, manifest.json, iconos
   CONVENCIONES.md · Master_briefing_vN.md · GUIA-SITIO-PUBLICO.md
```

> **Los `.md` de `interno/` son PÚBLICOS.** GitHub Pages los sirve en texto plano a
> cualquiera que sepa la dirección: `casaverdecanas.com.br/interno/CONVENCIONES.md`.
> No van claves de terceros, no va nada que no pueda circular. Que las reglas de
> Firestore estén descritas no es un riesgo —las aplica el servidor, no el secreto—,
> pero **un mail o un `uid` del equipo escrito ahí es un dato personal publicado**.

---

## 3. REGLAS DE CÓDIGO (las "reglas del 2.0")

Cada una nació de un bug real. Se rompen bajo propio riesgo.

### 3.1 · gstatic solo en `firebase-init.js`
Ninguna otra página importa de `gstatic.com`. Todas importan desde `./firebase-init.js`,
que re-exporta lo que haga falta. Una sola instancia de Firebase, una sola versión de SDK.

### 3.2 · `onSnapshot` SIEMPRE al final del módulo
La caché local entrega el primer snapshot **antes** de que termine de evaluarse el
módulo. Si la suscripción está arriba, el callback corre contra constantes todavía no
inicializadas → error de zona muerta temporal (TDZ) y página en blanco.
**Orden obligatorio:** imports → estado → helpers → render → acciones → cargas
iniciales (`await`) → **suscripciones**.

### 3.3 · Toda rama de un `or()` debe ser demostrable
El motor de reglas rechaza una consulta entera si no puede probar que **cada** rama
devuelve solo documentos permitidos. Una rama como `where('creadoPor','==',uid)` sin
fijar el alcance es indemostrable y tumba toda la consulta.
Forma correcta (la que usa `Core.consultaActividades`):

```js
or(
  where('alcance', '==', 'equipo'),
  and(where('alcance', '==', 'personal'),  where('creadoPor', '==', uid)),
  and(where('alcance', '==', 'asignados'), where('competencias', 'array-contains', uid)),
  and(where('alcance', '==', 'asignados'), where('creadoPor', '==', uid))
)
```

Corolario aplicado en Dinero: quien tiene `dinero` pero no `finanzas` **consulta de
entrada solo lo suyo** (`where('creadoPor','==',uid)`), porque la regla no le permite
una lectura amplia. Pedir más de lo que se puede ver tumba la consulta entera.

### 3.4 · Subir la `VERSION` de `sw.js` en cada tanda que toque el shell
El service worker sirve **red primero con respaldo en caché** para todo el mismo
origen (desde v14). El bump de versión limpia cachés viejas. Tras el deploy, el
administrador **cierra la app por completo y la reabre**.

**El `install` nunca usa `addAll`** (lección jul-2026). `addAll` es todo o nada: si UN
archivo de la lista falta o da 404 —un nombre mal escrito, una imagen que todavía no se
subió—, **la instalación entera falla, el service worker nuevo no se activa** y la app
sigue servida por el viejo. No hay error a la vista: parece que el deploy no hizo nada.
Va `Promise.all(SHELL.map(u => c.add(u).catch(...)))`: precachea de a uno y tolera
faltantes. Lo que no esté se busca por red igual, que es la estrategia de todos modos.

**Todo archivo nuevo del shell entra en `SHELL`** en la misma tanda que lo crea. Una
página que no está en la lista funciona online y desaparece sin señal.

### 3.5 · IDs deterministas para todo lo generado por el sistema
Nada que genere el sistema usa ID aleatorio: `proj-limpiezas`, `limp-<reservaId>`,
`c1`/`c2`/`c3`, `comunicaciones/horas-manuales`. Así el upsert (`setDoc merge`) es
idempotente y correr una sincronización (o una migración) dos veces nunca duplica.

### 3.6 · `merge` parcial: nunca pisar el trabajo humano
Al actualizar algo generado (por ejemplo una limpieza), se escriben **solo** los campos
gestionados por el sistema (título, fecha, monto, vínculos). `hecho`, `estado`,
`sesionActualId` y el historial de trabajo **jamás** se tocan.

**Y una sincronización nunca retrocede ni escribe `null` encima de un dato.** Si el
origen no tiene valor, el campo **no entra en el objeto**; si tiene, se compara con el
que ya está y solo se escribe si es más nuevo. Vale para cualquier "poner al día":
importaciones, espejos entre colecciones, sincronizaciones con calendarios.

> Lo aprendimos caro: `traer-historial.html` copiaba `ultimaRealizacion` siempre. Sobre
> una actividad que ya se había hecho en el 2.0 —o sobre un proyecto, que nunca tiene
> realización— pisaba con `null` y **borraba trabajo bueno**, en silencio y sin error.

### 3.7 · `escapeHtml` en todo lo que venga de la base
Sin excepción, incluso en campos "internos". `CV2.esc()` está para eso.

### 3.8 · Validación antes de entregar
Todo archivo JS o bloque `<script type="module">` pasa por `node --check`. Además se
verifica: sin `gstatic` fuera de `firebase-init.js`, y el `<link>` de Material Icons
**antes** de `design-system.css` en el `<head>`.

### 3.9 · Nada decorativo en el camino crítico de autenticación
`verificarAuth` resuelve **primero**; los adornos van después y aislados en su propio
try/catch. El listón de admin vivía dentro del try, antes de resolver: si fallaba, caía
al catch → `signOut` → login → mismo error, **bucle infinito** que dejaba al admin
afuera con la app aparentemente congelada. Un adorno nunca puede impedir entrar.
Corolario: **el catch de auth no redirige en silencio** — muestra el error en pantalla
con su código. Un rebote mudo es imposible de diagnosticar.

**Ampliación (tanda 11.10, la app trancada en blanco):**

1. **Reloj de guardia obligatorio.** Toda página hace `const u = await
   CV2.verificarAuth()` **arriba de todo**. Una promesa que no resuelve no produce un
   error: produce **una página en blanco para siempre, sin rastro**. Por eso la lectura
   del perfil corre contra `CV2.ESPERA_PERFIL` (15 s) y, si no vuelve, se sale con
   `e=trancado`. La regla vale para cualquier `await` que gobierne el arranque de una
   página, no solo para este.
2. **`location.replace`, nunca `location.href`, en el camino de autenticación.** Con
   `href` cada rebote deja la página anterior en el historial, y el botón **Atrás de
   Android** vuelve a entrar a una página que va a rebotar otra vez: bucle infinito.
3. **Una sola salida.** `onAuthStateChanged` es un oyente **permanente**: el `signOut`
   del propio `verificarAuth` lo despierta con sesión nula y dispara una segunda
   navegación encima de la primera. Se corta la escucha antes de salir y una bandera
   garantiza una única redirección.
4. **Sin perfil ≠ desactivado.** Una sesión en Auth sin documento en `/usuarios/` es
   una cuenta que todavía no fue dada de alta; decirle "estás desactivado" manda a
   buscar el problema del lado equivocado. Cada motivo tiene su código y su texto:
   `sesion`, `sinperfil`, `inactivo`, `trancado`, `error:<código>`.

### 3.10 · Errores con código visible
Los toast de error muestran `e.code ?? e.message`. Un error mudo cuesta una sesión
entera de diagnóstico.

### 3.11 · Toda imagen entra por `CV2.elegirYSubirImagen()`
**Ninguna página arma su propio `<input type="file">` ni llama a Cloudinary.** Un solo
camino, en `nucleo.js`:

    const url = await CV2.elegirYSubirImagen();   // null si la persona cancela
    if (url) { /* guardar url */ }

Motivo (tanda 11.4): había **cuatro** implementaciones distintas de "subir una foto" y
cada una fallaba diferente — `dinero` y `cabanas` con su propia copia de Cloudinary
**sin comprimir**, `espacios` sin cámara, y `actividades` con `capture="environment"`,
que fuerza la cámara y **esconde los archivos**. La lección: cuando la misma decisión
está escrita en cuatro lugares, no hay cuatro copias iguales, hay cuatro comportamientos.

Corolarios:
- **`accept="image/*"` a secas NO garantiza la cámara** (en iPad suele abrir solo
  archivos) y **`capture` la fuerza y esconde los archivos**. Ningún input solo sirve
  para las dos cosas: van **dos inputs** y la persona elige. Eso vive en
  `CV2.pedirImagen()` y no se replica.
- `api.cloudinary.com` aparece en **un único archivo** del sistema (`nucleo.js`).
  Si aparece en otro, es un error.
- Se guarda siempre la **URL de entrega** (`CV2.urlEntrega`, ver §4 `cabanas.fotos`),
  nunca la cruda.

### 3.12 · Verificar la forma real del dato antes de buscar el error en la lógica
Cuando algo "no se actualiza", comparar **el camino que escribe contra el camino que
lee** antes de revisar cualquier otra cosa. Ejemplo (tanda 11.4): el cartel "nuevo" del
chat no se iba nunca en el Inicio. La lógica estaba impecable; `comunicacion.html`
escribía las lecturas planas (`{comId: Timestamp}`) y `index.html` leía un campo
anidado `vistos` **que no existía nunca**, así que siempre recibía `{}` y todo aparecía
sin leer. Un desajuste de forma se disfraza de error de lógica y cuesta horas.

### 3.13 · Una página pública no importa `nucleo.js`
`nucleo.js` es el corazón del PANEL: arranca `verificarAuth` y manda al login a quien
no tenga perfil en `/usuarios/`, que es exactamente el caso de todo visitante. Una
página de la raíz (hoy `index.html` y `recuerdos.html`):

- importa desde `./interno/firebase-init.js` — punto único de contacto con el SDK
  también desde la raíz (regla 3.1 sigue valiendo);
- **repite** las utilidades mínimas que necesite (comprimir y subir imagen) con la
  duplicación asumida y comentada, porque la alternativa es arrastrar el panel entero;
- usa **su propio preset de Cloudinary**. `preset-comprobantes` vive detrás del login;
  `preset-recuerdos` está a la vista en el código de una página pública. Separarlos
  permite apagar el de recuerdos ante un abuso sin tocar comprobantes ni las fotos
  de las cabañas. Un preset por superficie;
- resuelve **`nombre.es` con respaldos** en todo lo que venga de `cabanas` o
  `espacios_comunes` (§4: el nombre es `{es, pt, en}`). Mostrarlo crudo imprime
  `[object Object]` justo donde más se ve.

### 3.14 · Toda capa emergente se cierra con el botón Atrás
En la PWA instalada, **Atrás es el gesto más usado**. Sin registrar la capa en el
historial, el botón Atrás sobre un formulario abierto **sale de la aplicación** y se
pierde lo que se estaba cargando.

**Los `<dialog>` ya están cubiertos y no hay que hacer nada.** `nucleo.js` envuelve una
sola vez `showModal`/`close` (`CV2.dialogosConAtras()`, llamado desde `renderNav`), así
que todo modal del sistema —presente o futuro, y también Escape y los
`<form method="dialog">`— se cierra con Atrás sin tocar la página.

**Para una capa que NO sea un `<dialog>`** (un panel deslizante, una hoja propia, un
visor de fotos a pantalla completa) va el molde:

```js
const cerrar = CV2.capaAtras(() => panel.classList.remove('abierto'));
// ... cerrar();   ← desde el botón Cancelar, el fondo o al guardar
```

Devuelve la función con la que hay que cerrar: limpia su propia entrada del historial,
así el siguiente Atrás vuelve a la página anterior y no reabre nada. Las capas **se
apilan**: si desde una se abre otra, Atrás cierra primero la de arriba.

Nunca se llama a `history.pushState` a mano para esto: hay una sola pila y un solo
listener de `popstate`, y meter otro por afuera hace que un Atrás cierre dos cosas.

### 3.15 · El estado local del navegador es parte del sistema
El panel guarda tres cosas en el teléfono: el **service worker** con sus cachés, la
**base local de Firestore** (IndexedDB) y la **sesión de Auth**. Cuando una de ellas
queda trancada, el código publicado está bien, los datos están bien, y aun así la app no
abre — en ese navegador y en ningún otro. Es la parte del sistema que no se ve desde el
servidor y que, hasta la 11.10, tampoco se podía arreglar desde un teléfono.

1. **Ninguna operación de IndexedDB se espera sin plazo.** `deleteDatabase` —y por lo
   tanto `clearIndexedDbPersistence`— queda **`blocked`** mientras otra pestaña o la PWA
   instalada tenga la base abierta. En un teléfono con la app instalada eso es lo normal.
   Sin plazo, el `await` no vuelve nunca y lo que venga después no se ejecuta.
2. **Nunca en el camino de salida.** Cerrar sesión no puede depender de que una base
   local se destrabe. La limpieza es deseable; salir es obligatorio. Corre contra reloj
   y la salida ocurre igual.
3. **Toda app tiene su botón de reparar, y vive también en la pantalla de ingreso.**
   `CV2.repararApp()` da de baja los service workers, vacía las cachés y borra las bases
   locales de Firebase; no toca **nada** del servidor. Está en la hoja de cuenta y en
   `login.html` ("La app no abre"), porque cuando el panel no abre, la hoja de cuenta es
   justamente lo que no se alcanza.
4. **Ante una falla que aparece en un navegador y no en otro, el sospechoso es el
   estado local, no el código.** Prueba de dos minutos: abrir en incógnito o en otro
   navegador. Si ahí anda, no hay nada que buscar en el servidor.

### 3.16 · Lo que se puede arreglar en el sistema de diseño no se arregla página por página
Cuando un mismo defecto aparece en varias páginas, la pregunta no es "¿cuántas hay que
tocar?" sino "¿dónde vive la regla que falta?". Tres veces ya se resolvió así y las tres
veces fue la decisión correcta:

· `CV2.dialogosConAtras()` — el botón Atrás en más de treinta modales, sin tocar una
  línea de las páginas.
· `dialog { max-height: 88dvh; overflow: auto }` en `design-system.css` — cinco
  formularios que se desbordaban en el teléfono, con Guardar fuera de la pantalla.
· `--cv-piso` / `--cv-techo` — las cuentas para esquivar las barras, en un solo lugar.

El molde: la página define lo suyo (ancho, color, radio) y **no fija** la propiedad que
arregla el defecto; entonces la regla base no la pisa y vale para todas, incluidas las
que se escriban mañana. Migrar a mano es repetir el mismo par de líneas decenas de veces
y olvidarse en alguna — y la que se olvide es justo la que va a fallar.

---

### 3.16b · El árbol de nodos: `.cv-nodo`

Una lista anidada —proyecto → ítems → sub-ítems— se dibuja con las clases
`.cv-nodo`, `.cv-nodo-fila`, `.cv-nodo-hijos`, `.cv-nodo-detalle`, `.cv-sem` y
`.cv-mini`, todas en `design-system.css`. No se vuelve a escribir por página.

Tres reglas que vienen con el patrón:

- **Un solo gesto por zona.** Tocar la fila hace lo **más probable**: si el ítem
  tiene hijos, los abre; si no, abre su detalle. El botón **⋯** de 44px abre el
  detalle siempre. *(Antes competían dos gestos en la misma fila y el caret de los
  hijos medía 18px — menos de la mitad del mínimo táctil.)*
- **La fila cerrada lleva solo lo necesario para decidir si entrar**: título,
  cronómetro si corre, semáforo. Los chips van al detalle, donde además hay lugar
  para escribirlos enteros: *"↻ cada 7 días"* en vez de *"↻7d"*.
- **Sangría de 14+10px por nivel**, con la línea del color del proyecto. A tres
  niveles, 26px grises se comían 78px de los 360 de un teléfono.

### 3.17 · Nunca confiar en el código HTTP de un servicio de terceros

CallMeBot devuelve **HTTP 200 aunque rechace el pedido**, y mete el error como HTML
rojo dentro del cuerpo. Mirar solo el código de estado da un "salió bien" cuando no
salió nada — y esa es la peor falla posible, la que parece un éxito.

Quien lo lee de verdad es `CV2._leerRespuestaWa` en `nucleo.js`: limpia las
etiquetas, busca las marcas conocidas (cuenta en pausa, clave inválida, número sin
alta, límite de uso) y traduce cada una a una frase entendible.

> Esta regla estaba escrita como comentario en el propio código **y aun así se
> implementó al revés**. Un comentario advierte; una regla numerada se revisa.

### 3.18 · Los archivos del núcleo llevan sello de versión visible

`nucleo.js` expone `CV2.VERSION` y la pantalla que lo usa lo muestra
(`pantalla: avisos-4 · motor: nucleo-avisos-4`). Se sube a mano en cada tanda que
toque ese bloque.

Sin eso, *"subí el archivo nuevo"* es una creencia, no un hecho — y su síntoma es
**indistinguible** de un problema de configuración del servidor. Media hora perdida
en julio de 2026 por exactamente eso.

### 3.19 · Un diagnóstico muestra el DATO, no el resultado

"Enviado" no sirve de nada. *"Se pidió mandar al número de esta persona y CallMeBot
dice haber recibido otro"* resolvió en un intento lo que seis horas de suposiciones no
habían resuelto.

Toda pantalla de prueba muestra **qué se mandó**, **qué contestó el servicio** y, si
se puede, **si coinciden**. Vale también para el éxito: la respuesta cruda se muestra
aunque haya salido bien, porque "aceptado y no llegó" es un caso real.

### 3.20 · Una pantalla no afirma nada que no haya leído

El calendario mostraba un chip `🧹 limpieza` en cada salida. Era texto fijo: no leía
ninguna actividad, no consultaba si la limpieza existía, no creaba nada. Nació cuando
la limpieza SÍ colgaba de la salida y sobrevivió cuarenta tandas al cambio de modelo,
enseñando el modelo equivocado a todo el que mirara el calendario.

Si un dato no se leyó, no se muestra. Y si se muestra un estado, sale de consultarlo.

---

## 4. MODELO DE DATOS

Colecciones en uso. Los campos marcados **(derivado)** no existen en la base: se
calculan al leer.

### `usuarios/{uid}`
`nombre, email, rol ('admin'|'colaborador'), activo (bool), permisos {...}`
· **Una sola cuenta con rol `admin`** (CasaVerde): mantenimiento y acceso sin
  restricciones. El resto es `colaborador` con permisos explícitos.
· **`permisos`** es un OBJETO `{permiso: true}`. Los permisos existentes (fuente única
  en `CV2.PERMISOS` de `nucleo.js`):
  · `reservas` — reservas, presupuestos y clientes.
  · `dinero` — registrar movimientos y ver SOLO los propios.
  · `finanzas` — ver todo el dinero, hacer balance y exportar (incluye lo de `dinero`).
  · `contenido` — editar cabañas y espacios comunes.
  · `horas` — gestor de sesiones y análisis de horas de todo el equipo.
· El admin no lleva permisos (puede todo por definición); se guardan vacíos.
· Sin ningún permiso, la persona igual ve Inicio, Actividades, Calendario, Chat, sus
  propios Cobros y el Gestor de Sesiones (donde solo ve y edita lo suyo).
· **`ultimaVisitaInicio`** — marca de cuándo miró el Inicio por última vez; con eso la
  portada decide qué es novedad.
· **`notif`** — `{canalEmail, canalWhatsapp, <evento>: bool}`. Por dónde y de qué se le
  avisa a esta persona. Los eventos son los de `CV2.EVENTOS` (fuente única) y están
  ENCENDIDOS salvo que la persona los apague. Vive acá y no en `estado_usuario` por una
  razón concreta: el navegador de QUIEN AVISA tiene que leer las preferencias del
  DESTINATARIO, y `/usuarios/` lo lee todo el equipo.
· Cada uno puede escribir de su propio documento **solo** `ultimaVisitaInicio`,
  `fotoUrl`, `notif` y `actualizadoEn` (regla acotada con `affectedKeys().hasOnly`);
  nunca su rol ni sus permisos.
· Desactivar nunca borra: el historial de horas y cobros sobrevive.

### `actividades/{id}`
`titulo, detalle, parentId (árbol), color (solo raíces), tipo, alcance
('equipo'|'asignados'|'personal'), competencias [uid], prioridad, recurrenciaDias,
monto (R$), fechaInicio, fechaVencimiento, hecho, estado, sesionActualId,
ultimoCierreEn, orden, cabanaId, creadoPor, creadoNombre`
· Las generadas por reservas suman `reservaId`, `cabanaId` y **`fase`**
  (`'entrada'` = limpieza de preparación · `'salida'` = control de check-out).
· `controlEntradaHecho` (bool) — la limpieza de entrada no se puede cerrar sin él.
· `faltantesData {faltantes[], danios[], huesped, checkIn, checkOut}` — en la actividad
  de faltantes; denormalizado a propósito: no debe depender de que la reserva exista.
· `gastoMovimientoId` — si el faltante ya generó su gasto en Dinero.
· El color se hereda en cascada desde la raíz (pastel para los fondos).

### `sesiones/{id}`
`actividadId, actividadTitulo, uid, nombre, inicio, fin, horas, estado
('en_curso'|'finalizada'), tipo ('cronometro'|'manual'|'tilde'), notas,
cerradoPorCierreDeActividad?, cerradoPorNombre?`
· El valor de cronómetro es **`'cronometro'`** (no `'crono'`).
· Un solo cronómetro en curso por persona.
· Terminar una actividad frena **todos** los cronómetros de esa actividad, de cualquier
  usuario, registrando sus horas en el ciclo que se cierra.
· **Carga manual**: si quien registra a mano no tiene el permiso `horas`, se deja aviso
  en `comunicaciones/horas-manuales` (hilo de ID fijo). El aviso nunca hace fracasar el
  registro.

### `honorarios/{id}`
`actividadId, concepto, uid, nombre, horas, monto, estado ('pendiente'|'pagado'),
cicloCerradoEn, cerradoPor, cerradoNombre, pagadoEn, pagadoFecha, movimientoId, nota`
· Se generan al cerrar el ciclo de una actividad con `monto`, repartidos **en
  proporción a las horas** de cada persona en ese ciclo.
· El **Gestor de Sesiones gobierna**: editar o borrar sesiones recalcula los ciclos
  afectados conservando el pozo. **Un ciclo con algún honorario pagado no se toca**
  (se ajusta a mano en Cobros).
· **Puente con Dinero**: al pagar, se puede crear el movimiento de salida vinculado
  (`movimientoId` ↔ `movimiento.refId`). El vínculo impide pagar dos veces.

### `chequeos/{chequeo-<reservaId>}`
`reservaId, cabanaId,
entrada {items[{item, cantidad}], confirmadaEn, confirmadaPor, confirmadaNombre},
salida {items[], faltantes[{item, entrada, salida, faltan}], danios[{desc, foto}],
registradaEn, registradaPor, registradaNombre}`
· **Es el acta**: el registro de qué había al entrar y qué quedó al salir. La actividad
  de faltantes es el pendiente accionable; esto es la prueba.
· **La línea de base del check-out es la ENTRADA**, no el inventario de referencia de la
  cabaña: quien prepara ajusta las cantidades reales y eso fija contra qué se compara.
· Las dos mitades las escriben actividades distintas, pero comparten el documento.

### Ciclo de limpieza por reserva (IDs deterministas, regla 3.5)
```
proj-limpiezas
 └─ limp-<reservaId>        LIMPIEZA de entrada · fase 'entrada' · lleva tarifa
     └─ checkout-<reservaId>  CONTROL de salida · fase 'salida' · sin tarifa
         └─ falta-<reservaId>   FALTANTES · solo si los hubo
```
· **`limp-` se materializa por fecha**: una semana antes del check-in, `fechaInicio` = un
  día antes (para que el semáforo se ponga rojo). Lo hace `RCore.materializarPendientes`
  al abrir Reservas — no hay servidor, así que se materializa al usar la app.
· **`checkout-` NO nace por fecha**: lo crea "limpieza terminada". Así existe solo si
  hubo una limpieza real y queda agrupado bajo ella.
· **`falta-` cuelga del checkout** y lo mantiene abierto hasta resolverse (el sistema no
  deja cerrar un padre con hijos vivos).
· Anular una reserva borra `limp-` solo si no se hizo; si el checkout ya existe, no se
  toca: alguien estuvo en la cabaña.

### `grupos/{id}` — EL ACUERDO
`total, moneda ('BRL'|'USD'|'UYU'), clienteId, clienteNombre, nota,
creadoEn/Por/Nombre, actualizadoEn`
· Lo **comercial** de una estadía: un precio negociado una vez sobre el conjunto.
· **Existe SIEMPRE**, aunque la estadía sea de una sola cabaña. Así la plata vive
  siempre en el mismo lugar y no hay dos modelos conviviendo.
· **Es invisible hasta que hay dos cabañas.** Con una sola, el formulario pide el
  precio como siempre y la tarjeta se ve igual que antes: la palabra "acuerdo" no
  aparece en ninguna pantalla. Recién al sumar una segunda aparece la insignia, el
  desglose y el botón *Editar el acuerdo*.
· **Por qué es una colección y no un campo de la reserva:** el precio de "las tres
  cabañas por 2000" no es la suma de tres precios. Guardarlo en la reserva raíz
  obligaba a que su campo `total` significara "esta cabaña" a veces y "el acuerdo
  entero" otras. Un campo que significa dos cosas según el contexto es exactamente
  lo que fabrica errores silenciosos.
· **Una sola moneda por acuerdo.** Sumar dólares con reales no significa nada.
· **Qué NO toca el acuerdo:** la limpieza (`limp-<reservaId>`), la disponibilidad
  pública, las barras del calendario y la detección de superposiciones siguen
  siendo POR RESERVA. El acuerdo es comercial; la ocupación es física.
· **(derivado)** pagado, saldo, rango de fechas, cantidad de cabañas.

### `reservas/{id}`
`moneda ('BRL'|'USD'), total,
clienteId, clienteNombre (denormalizado), cabanaId, checkIn, checkOut (YYYY-MM-DD),
horaEntrada ('14:00'), horaSalida ('10:00'), adultos, ninos, totalBRL,
estado ('presupuesto'|'confirmada'|'finalizada'|'anulada'), origen ('directa'|'airbnb'),
googleEventId, notas, historial [{fecha, autorUid, autorNombre, cambio}]`
· **La reserva declara su moneda al nacer y vive ahí toda su vida**: total, señas,
  saldo y "pagada / falta tanto" se calculan y muestran en esa moneda. `totalBRL` queda
  solo por compatibilidad; las reservas sin `moneda` se asumen en R$.
· **`grupoId`** — el ACUERDO al que pertenece. Toda reserva nueva lo lleva.
· **La reserva NO guarda plata.** `total`, `totalBRL` y `moneda` quedan solo en las
  anteriores a julio de 2026; el precio vive en `grupos/{id}`. Mientras queden
  reservas viejas, `totalAcuerdo()` cae en un respaldo que suma esas partes — y ese
  respaldo se saca el día que no quede ninguna.
· **El presupuesto es un estado, no otra colección.**
· **Criterio hotelero — la reserva ocupa las noches desde `checkIn` hasta `checkOut`
  SIN incluir la última.** El día de salida la cabaña ya queda libre para quien entra.
  Vale para el calendario público, la disponibilidad y el conteo de noches: si se
  incluye el último día, se bloquean noches que sí se pueden vender.
· **(derivado)** pagado, saldo, señada, "en casa".

### `pagos/{id}`
`reservaId, monto, moneda, montoEquiv, monedaReserva, concepto ('sena'|'saldo'|'otro'),
metodo, categoria, cuentaDestino, fecha, nota, comprobanteUrl, montoBRL (compatibilidad)`
· **La plata se guarda en la moneda en que ENTRÓ** — la cuenta define la moneda.
· Si el pago viene en una moneda distinta a la de la reserva, se pide **`montoEquiv` en
  la moneda de LA RESERVA** (no siempre en reales): reserva en U$D + pago en R$ → se
  pide el equivalente en U$D, y al revés. El saldo de la reserva suma esos equivalentes.
· **`grupoId`** (opcional) — cuando el pago pertenece a un acuerdo. Con `grupoId`
  presente, **el saldo se calcula por acuerdo y `reservaId` queda solo como rastro** de
  desde qué cabaña se cargó. Sin él, el pago cuenta para su reserva, como siempre.
  El doble conteo se evita con un solo guard: los pagos de una reserva suelta se filtran
  con `p.reservaId === id && !p.grupoId`.
· Crear/editar un pago es de `reservas`; **borrarlo es de `finanzas`** (es tocar plata).

### `movimientos/{id}` — el modelo SIMPLE, único sistema financiero
`fecha, tipo ('entro'|'salio'), monto, moneda, montoBRL, categoria, cuenta, uid,
nombre, detalle, comprobanteUrl, pendiente {clase ('reponer'|'cobrar'), uid, saldado},
creadoPor, creadoNombre, editadoPor?, editadoNombre?, editadoEn?, refTipo?, refId?,
cierreId?, esApertura?`
· **`cuenta`** es una etiqueta libre (dónde entró / de dónde salió), SIN catálogo: el
  select se arma con las cuentas que ya aparecen en movimientos + "agregar nueva".
· **`cierreId`** sella la línea en un balance: sale de la vista, vive en el histórico y
  **da por saldado cualquier pendiente que tuviera**. Ojo: es `m.cierreId` en la raíz,
  NO `m.pendiente.cierreId` (ese era del balance viejo; confundirlos hizo que los
  pendientes sobrevivieran a los balances).
· **La moneda del movimiento es la de su cuenta.** Los totales, los saldos por cuenta y
  los pendientes se agrupan **por moneda** y nunca se suman entre sí. `montoBRL` se
  completa solo cuando el movimiento fue en reales.
· **`creadoPor` es obligatorio en toda alta**: es lo que hace visible el movimiento a
  quien lo cargó cuando solo tiene el permiso `dinero`.
· Un ingreso "por cobrar" NO cuenta hasta saldarse; un gasto "a reponer" cuenta ya.
· `refTipo`/`refId` vinculan un movimiento a su origen (p. ej. un honorario).
· **(derivado)** pendientes por persona, KPIs del período.
· **Libro personal — RETIRADO (tanda 11.13).** Vivía en
  `usuarios/{uid}/movimientos_personales/{id}`. Se sacó porque no resolvía ningún
  problema del negocio —el único cruce real entre plata propia y plata de la casa ya lo
  cubre el pendiente "reponerle a X"— y sí creaba uno: un gasto de Casa Verde podía caer
  ahí por error y quedar fuera de todo balance, en un lugar donde ni el administrador
  entra. Los datos se borraron a mano desde la consola antes de cerrar la regla.

### `cierres/{id}` — inmutable
`fecha, desde, hasta, cerradoPor, cerradoNombre,
totalesPorMoneda [{moneda, entro, salio, resultado}],
totales {entroBRL, salioBRL, resultadoBRL, movimientos} (compatibilidad),
cuentas [{cuenta, moneda, calculado, real, ajuste}], cobrosSaldados [], nota`
· **El balance corre por moneda**: cada una tiene sus cuentas, su saldo calculado, su
  saldo real, su ajuste y su propia línea de apertura. Nunca se suman entre sí.
· Las reglas prohíben `update` y `delete`. Es el registro histórico.
· **El balance no busca cuadrar con el banco**: es un corte de control entre dos
  momentos. La diferencia entre lo calculado y lo real (`ajuste`) ES el gasto no
  registrado — información personal, fuera del negocio, no un error a corregir.
· **El bruto no registrado NO se guarda**: se lee sumando los `ajuste` de cada cierre.
· **El cero**: al cerrar se sellan las líneas del período con `cierreId` y cada cuenta
  recibe una línea de apertura (categoría `Balance`, `esApertura:true`) con su saldo
  REAL. Desde ahí arrancan los próximos registros.

### `cabanas/{c1|c2|c3}`
`nombre {es,pt,en}, descripcion {es,pt,en}, capacidad {base, max}, orden, activa,
tarifas {noche, limpieza, extraPersona, moneda}, amenities [], fotos [url], calendarId,
airbnbUrl, notaEspecial {es,pt,en}, inventarioBase []`
· **Nunca renderizar `nombre` crudo**: resolver `nombre.es` con respaldos.
· Es la fuente del sitio público (Fase 4); se lee sin sesión.
· **`fotos[]` guarda siempre la URL de entrega de Cloudinary**, con las
  transformaciones incluidas: `…/upload/f_auto,q_auto,w_2000/…`. Se arma con
  `CV2.urlEntrega()`, que es **idempotente** (correrla de nuevo no ensucia la URL).
  Motivo: el sitio público **no importa `nucleo.js`** — guardando la URL ya optimizada,
  recibe la versión liviana (WebP/AVIF según el navegador) sin una línea de código.
  Nunca se guarda una URL cruda ni un link a un servidor ajeno. Para traer a Cloudinary
  una imagen que vive en otro servidor está `CV2.traerImagenDesdeUrl()`.
  *(Acá se nombraba `migracion-fotos.html`, una herramienta temporal ya retirada del
  repositorio.)*

### `espacios_comunes/{slug}`
`nombre {es,pt,en}, slug, orden, fotos [url]`
· Barbacoa, entrada, hamacas, juegos, living, piscina.
· Como `cabanas`: contenido del sitio público, lectura sin sesión, escritura de
  `contenido`.

### `clientes/{id}`
`nombre, telefono (→ wa.me), email, pais, notas`
· Solo se puede borrar si no tiene reservas.

### `comunicaciones/{id}` + subcolección `mensajes/{id}`
`titulo, audiencia, participantes [uid], ultimoMensaje, ultimoAutorUid,
ultimoAutorNombre, ultimaActividad, creadoPor, creadoNombre, creadoEn`
· **Única subcolección del sistema.**
· **`audiencia`**: `'equipo'` (la ve y escribe todo el equipo activo) o `'directo'`
  (solo los uid de `participantes`, más el admin). La privacidad es **real, por regla
  de Firestore** (§5), no filtrada en la interfaz. Los mensajes **heredan** el alcance
  del tema padre.
· Un tema **sin** `audiencia` se trata como `'equipo'` (los heredados siguen visibles).
  El admin los rellena solo al abrir el chat, una vez.
· El listado desde el cliente **debe venir filtrado** — `or(audiencia == 'equipo',
  participantes array-contains uid)`. Un `getDocs` sin filtro incluye temas que el
  colaborador no puede leer y **Firestore rechaza la consulta entera** (regla 3.3).
· Cualquier participante puede `update` el tema: cada mensaje mueve `ultimaActividad`.
  Que solo el creador o el admin sumen personas se cumple en la interfaz, no en la
  regla — restringirlo por regla bloquearía el envío normal de mensajes.
· `mensajes/{id}`: `texto, autorUid, autorNombre, creadoEn, imagenUrl?`
· Hilo de sistema con ID fijo: `horas-manuales` (avisos de carga manual de horas).
· ⚠ **Las fotos de un tema privado no son privadas.** El preset de Cloudinary es sin
  firma: cualquiera con la URL ve la imagen. El mensaje es privado, la imagen no.

### `comunicaciones_lecturas/{uid}`
`{ lecturas: {comId: Timestamp}, eliminados: {msgId: true} }`
· Cada uno escribe **solo el suyo**.
· `lecturas` → de acá sale el cartel "nuevo", **en el chat y en el Inicio**. Marca única:
  `usuarios.ultimaVisitaInicio` **no** gobierna la novedad del chat (dos marcas para lo
  mismo fue justo el origen del error de la tanda 11.4).
· `eliminados` → borrado de mensajes **por persona y por mensaje**: oculta en la vista de
  quien borra, sin tocar el mensaje del otro. Por eso no necesita ninguna regla en
  `mensajes`. La interfaz los muestra en una pestaña aparte, con opción de restaurar.
· **Formato viejo** (claves `comId` al ras del documento) se sigue leyendo como respaldo:
  no hubo migración ni día cero.

### `avisos_contacto/{uid}`
`telefono ('+55...'), apikey (CallMeBot), nombre, actualizadoEn`
· El teléfono y la clave de CallMeBot de cada persona. **Colección aparte de
  `/usuarios/`** para no mezclarla con el perfil, aunque hoy la lea el mismo grupo.
· **La lee todo el equipo activo; la escribe solo su dueño y el admin.** La lectura
  abierta no es un descuido: el navegador de quien avisa necesita el contacto del
  destinatario para pasárselo a la función de Netlify. La alternativa era mantener los
  mismos datos duplicados en una variable de entorno, que es lo que se sacó.
· Qué se expone, sin adornos: el equipo ve el teléfono y la clave de los demás. Una
  clave de CallMeBot **solo sirve para mandarle mensajes al número que la generó** — no
  abre ninguna cuenta y su dueño la revoca con `stop`.
· **El teléfono se guarda con `+` y se manda SIN él**: la URL de ejemplo que entrega el
  propio bot va con el número pelado. Lo saca `CV2.enviarWhatsApp`, en un solo lugar.

### `disponibilidad/{reservaId}`
`cabanaId, desde, hasta`
· **Espejo público de ocupación**, mantenido por `reservas-core.js`. Existe para que el
  sitio muestre disponibilidad **sin** exponer `/reservas/` (nombres, teléfonos, montos).
  Lectura pública; escritura de `reservas`. Nunca lleva datos personales.
· Rige el mismo criterio hotelero: ocupa `[desde, hasta)` — el día `hasta` está libre.

### `recuerdos/{id}`
`nombre, texto, foto, cabanaId, estado, uid, proveedor, clave, claveEtiqueta,
creadoEn, moderadoPor, moderadoNombre, moderadoEn`
· El muro público. Estados: `pendiente` → `publicado` → `oculto` (reversible).
  Ocultar guarda; borrar es definitivo.
· `proveedor`: `'google' | 'anonimo'`. `cabanaId` **lo decide la clave del QR**, no el
  visitante — el formulario ni lo pregunta.
· `clave` viaja en el documento porque es lo único que la regla puede mirar, y **se
  borra en la primera moderación** junto con `email`. Ver §5.14.
· `foto` es siempre una URL de entrega de nuestro Cloudinary (preset
  `preset-recuerdos`); la regla lo verifica con `matches()`.
· `creadoEn` es `serverTimestamp()` obligatorio: la regla exige `request.time`.

### `claves_recuerdos/{clave}`
`cabanaId, etiqueta, activa, vence, creadaEn, creadaPor`
· **El ID del documento ES la clave.** Es la llave que viaja dentro del QR pegado en
  cada alojamiento: `recuerdos.html?k=<clave>`. Modelo apikey, ver §5.13.
· `cabanaId` vacío = clave general, sin alojamiento asociado.
· `vence` opcional (`Timestamp` o `null`), comparado contra `request.time`.
· Se generan en el panel: 12 caracteres al azar sobre un alfabeto de 31 sin `0/O`
  ni `1/l/I`, con prefijo `cvc-`.

### `recuerdos_contactos/{mismoIdQueElRecuerdo}`
`nombre, email, clave, claveEtiqueta, cabanaId, uid, proveedor, recuerdoCreadoEn,
guardadoEn`
· Lo privado que **sale** del recuerdo al moderarlo. Nunca público: solo `contenido`.
· Mismo ID que el recuerdo, para poder volver del uno al otro sin índice.

### `huespedes/{uid}`
`nombre, email, proveedor, cabanaId, clave, claveEtiqueta, idioma, novedades,
primeraVez, ultimaVez`
· Registro de quien pasó por el muro, para poder hablarle después (novedades,
  promociones, reserva directa). El ID es su **uid de Auth**.
· Con Google el uid es **estable**: la persona se reconoce entre visitas. Anónimo, el
  uid es **del dispositivo**: vale como contacto, no como identidad.
· `novedades` es un **sí explícito** del huésped, jamás por defecto (§5.16).
· `primeraVez` no se reescribe nunca: la regla lo compara contra el valor guardado.
· Cada uno escribe **solo su propio documento**, y solo con la clave del QR en la mano.

### `config/*`
`config/dinero` → `categorias[]`
`config/sitio` → `whatsapp`, `textos {pt|es|en: {titulo, bajada, c1..c3, tCabanas,
tComunes, tConsulta, pie}}` — **lectura PÚBLICA** (el sitio no tiene login), escritura de
`contenido`. Es el único lugar donde se editan los textos y el contacto del sitio.
`config/integraciones` → `googleApiKey`
· `integraciones` contiene claves de terceros: bloque de reglas propio, **nunca en un
  catch-all**. La lee quien tiene `reservas` (la sync de Airbnb la necesita); la
  escribe solo el admin.

---

## 5. SEGURIDAD

1. Las reglas de Firestore son la única frontera real. La UI oculta botones; las reglas
   impiden acciones. Todo lo que la UI esconde por permiso, la regla lo repite.
2. **Modelo de acceso**: una sola cuenta con rol `admin` (sin restricciones); todos los
   demás con permisos explícitos (§4 `usuarios.permisos`). La regla `tiene(p)` da
   verdadero para el admin siempre, y para el resto si el permiso está en `true`. Usa
   `.get('permisos', {}).get(p, false)` para no romperse ante perfiles sin el campo.
3. **Las reglas se SUMAN.** Basta con que UN bloque permita para abrir el acceso; y
   reemplazar el archivo por unos pocos bloques deniega todo lo demás (dejó el sitio
   inaccesible una vez). **El archivo se edita SIEMPRE completo, nunca por fragmentos.**
4. **Sin catch-all.** Cada colección tiene su bloque explícito. `config/integraciones`
   va aparte y el bloque general de `config` **lo excluye a mano** (si no, lo anularía
   y cualquiera leería la clave de Google).
5. `usuarios/{uid}` se lee con solo estar logueado (no con `activo()`): `verificarAuth`
   necesita leer el propio perfil antes de saber si está activo; exigir `activo()` ahí
   mordería la cola y nadie entraría.
6. La API key de Firebase es un identificador público por diseño — no es un secreto.
   Lo que se protege son las claves de terceros.
7. `sesiones`: lectura para todo el equipo activo; `update` también (frenar el reloj
   ajeno al cerrar una actividad lo exige). `create` en nombre de otro y `delete` ajeno,
   solo con `horas` (o el dueño de la suya).
8. `movimientos`: lo ve `finanzas` entero; con solo `dinero`, únicamente los propios
   (`creadoPor == uid`). `update`/`delete` de `finanzas`, y **nunca** si el movimiento
   está sellado en un balance.
9. `cierres`: `create` de `finanzas`; `update`/`delete` **nunca**.
10. `cabanas` y `espacios_comunes`: lectura **pública** (fuente del sitio); escritura de
    `contenido`.
11. **Tres trampas del motor de reglas que costaron sesiones enteras de diagnóstico**
    (todas se manifiestan igual: funciona para el admin, falla para el colaborador,
    porque la rama `esAdmin()` corta antes de evaluar lo que rompe):
    · **`resource` es null en documentos inexistentes.** Todo upsert hace un `getDoc`
      antes de crear. Si la regla de lectura toca `resource.data.x` sin contemplar el
      documento que no existe, falla entera. Primera rama siempre: `resource == null`.
    · **`array-contains` en la consulta obliga a `in` en la regla**, sobre la misma
      lista. No son equivalentes para el motor: si no coinciden los operadores, la
      consulta se rechaza completa.
    · **No agregar `x is list` sobre el campo que la consulta ya filtra con
      `array-contains`.** La consulta ya garantiza el tipo; la verificación extra
      vuelve la rama indemostrable.
12. Cerrar sesión limpia la caché local (`terminate` + `clearIndexedDbPersistence`):
    la caché es una sola por navegador y el dispositivo puede ser compartido.
13. **Dos clases de sesión, y `logueado()` ya no significa "es del equipo".** Desde el
    muro de recuerdos hay sesiones SIN documento en `/usuarios/` (huésped anónimo o con
    Google). Toda regla y todo código que asuma perfil tiene que comprobarlo primero
    con `tienePerfil()`, que hace `exists()` antes del `get()`. Sin ese `exists()`, el
    `get()` a un documento inexistente devuelve null y `perfil().activo` **no niega:
    revienta la regla entera** — y en una consulta de lista rechaza la consulta
    completa, no el documento suelto.
    · Corolario: **tener sesión tampoco alcanza para escribir.** Una sesión anónima se
      la abre cualquiera desde la consola del navegador.
14. **Modelo apikey para acciones públicas** (molde: `/claves_recuerdos/`). Cuando una
    acción pública tiene que quedar reservada a quien estuvo físicamente en el lugar,
    la llave es una clave con forma de apikey:
    · **el ID del documento ES la clave** — nada de un campo `token` adentro, así la
      regla la resuelve con un `exists()` de una línea. El `get()` de una regla no pasa
      por los permisos de lectura, así que funciona con la colección cerrada;
    · **`get` abierto, `list` cerrado**: se consulta una clave puntual (hay que saberla
      entera, la trae el QR) pero nadie enumera la colección. Eso permite avisar que el
      código no vale ANTES de que la persona escriba, sin regalar la lista;
    · **al azar y con entropía de sobra**, nunca "con sentido" (`cabana-2` jamás);
    · **una clave por superficie física, revocable de a una**: si se filtra el QR de una
      cabaña se da de baja esa y se reimprime solo esa;
    · `vence` opcional contra `request.time`;
    · **la UI valida por cortesía; la regla valida de verdad.** La página muestra un
      código legible (`SIN_CLAVE`, `CLAVE_DESCONOCIDA`, `CLAVE_INACTIVA`,
      `CLAVE_VENCIDA`, `SIN_RED`); nada de eso es seguridad;
    · la clave se saca de la barra de direcciones (`history.replaceState`) y se recuerda
      15 días en el navegador: una captura de pantalla no reparte el código.
15. **Lo que se publica, se publica ENTERO.** No hay seguridad por campo en Firestore:
    si un documento es legible, TODOS sus campos son legibles, incluidos los que la
    interfaz no muestra. Por eso al moderar un recuerdo se **borran del documento** la
    `clave` y el `email` del huésped —archivados en `/recuerdos_contactos/`— y **la
    regla rechaza cualquier `update` que los deje puestos**: no depende de que el código
    se acuerde.
    · El sistema viejo (v4.31, `libro_visitas`) guardaba el token en el documento y lo
      publicaba tal cual. Nunca se notó porque nadie miró la colección con la API.
16. **Molde fijo de toda escritura que viene de afuera** (ver `/recuerdos/`):
    `keys().hasOnly([...])` lista cerrada · `keys().hasAll([...])` obligatorios · estado
    inicial el más restrictivo (`'pendiente'`, nadie se publica solo) · `uid ==
    request.auth.uid` · `creadoEn == request.time` (obliga a `serverTimestamp()` en el
    front: un `Timestamp.now()` del dispositivo se rechaza) · tamaño máximo en todo
    texto · **clave válida** · **URLs de imagen acotadas a nuestro Cloudinary** con
    `matches()` · y **los campos que la clave determina los determina la clave** (el
    `cabanaId` se compara contra el de la clave y el formulario ya no lo pregunta: no se
    puede mentir sobre algo que no se escribe).
    · Las reglas **no** pueden limitar la frecuencia. El freno real es la clave
      revocable, la moderación y el preset de Cloudinary apagable.
17. **El huésped queda registrado, pero solo se le escribe si dijo que sí.**
    `/huespedes/{uid}` se escribe con el uid propio y con la clave del QR. El campo
    `novedades` es un consentimiento explícito y separado, nunca marcado por defecto: es
    la única base legítima para mandarle algo (LGPD). Dar de baja a alguien del registro
    es una acción del equipo y no toca su recuerdo publicado.

---

## 6. INTERFAZ

### 6.0 · EL TELÉFONO ANDROID MANDA (decisión del administrador, jul-2026)
El panel se usa **principalmente en teléfonos Android, con la PWA instalada desde
Chrome**. No es un sistema de escritorio que además anda en el teléfono: es al revés.
Toda decisión de interfaz se diseña primero para esa situación y después se adapta a
pantalla grande — nunca al revés. En concreto:

1. **La navegación va abajo, al alcance del pulgar.** Barra inferior fija con los
   destinos frecuentes y una hoja para el resto. Nada de menús que se despliegan desde
   arriba: en un teléfono grande, la esquina superior no se alcanza con una mano.
   En pantalla ≥900px la misma barra se acomoda arriba; es un `@media`, no otro diseño.
2. **`env(safe-area-inset-bottom)` siempre** en cualquier elemento fijo abajo. Sin eso,
   la franja de gestos de Android se come el último botón. Ídem `inset-top` con la
   barra de estado: instalada, la PWA dibuja debajo de ella.
3. **El botón Atrás cierra lo que esté abierto, no sale de la app.** Toda hoja, modal o
   panel emergente hace `history.pushState` al abrirse y escucha `popstate` para
   cerrarse. En la PWA instalada, Atrás es el gesto más usado; sin esto, cerrar un
   diálogo te expulsa de la aplicación y perdés lo que estabas cargando.
4. **Objetivos táctiles de 44px para arriba**, con separación real. Un ícono de 24px
   suelto no es un botón.
5. **No hay `hover`.** Todo lo que hoy se comunica al pasar el mouse tiene que verse
   sin pasar nada. La devolución al tocar es `:active`, y `-webkit-tap-highlight-color:
   transparent` para que no aparezca el recuadro gris del sistema.
6. **Las hojas suben desde abajo; los modales centrados quedan para pantalla grande.**
   Con `overscroll-behavior: contain`, para que al llegar al final de la hoja no empiece
   a moverse la página de atrás.
7. **`overscroll-behavior-y: contain` en `html, body`**: sin eso, tirar hacia abajo
   recarga la aplicación y se pierde lo no guardado.
8. **El aire vertical es el recurso escaso.** Cabecera mínima (logo + título de la
   página + persona) que se esconde al bajar y vuelve al subir. Nada decorativo ocupa
   alto fijo.
9. **La marca ya la puso el ícono de la app.** Adentro, el logo va chico en la
   cabecera; el protagonismo es del título de la página, que es lo que orienta.
10. Se prueba **en el teléfono, con la app instalada**, no en la ventana angosta del
    navegador de escritorio: la barra de estado, la de gestos y el botón Atrás solo
    aparecen ahí.
11. **La navegación la arma `nucleo.js` (`CV2.renderNav`) y la viste `design-system.css`**
    (clases `cv-*`). Ninguna página define nada de la barra, y `nucleo.js` no inyecta
    estilos: cada cosa en su archivo. `CV2.NAV` sigue siendo la fuente única del orden,
    los permisos y ahora también el agrupamiento (`grupo`).
12. **Nada fijo abajo puede quedar tapado por la barra, y nada fijo arriba por la
    cabecera.** No se hace la cuenta a mano: `design-system.css` publica **`--cv-piso`**
    (lo que come la barra de abajo) y **`--cv-techo`** (lo que come la cabecera, con el
    listón de admin ya sumado). En ≥900px la barra se va arriba y `--cv-piso` vale 0
    solo, así que lo que use la variable se acomoda sin tocar nada.
    · Pegado abajo → clase **`.cv-pegado-abajo`** (`bottom: var(--cv-piso)`,
      `z-index: 90`: arriba del contenido, debajo de la barra 95, la tapa 105 y las
      hojas 110).
    · Pegado arriba (`sticky`) → `top: var(--cv-techo)`.
    · Una lista con algo fijo abajo reserva `calc(<alto de eso> + var(--cv-piso))` de
      relleno, o su último renglón nace tapado.
    **Un número escrito a mano queda viejo** el día que la barra cambia de alto — y en
    un teléfono con muesca ni siquiera es el mismo número. El aviso que no se lee es
    peor que no avisar, y el botón que no se ve es peor que no tenerlo.

1. **Voseo rioplatense** en todo texto visible. Nada de "pulse aquí".
2. Material Icons, `<link>` **antes** de `design-system.css` (para que los íconos
   carguen incluso en vista previa suelta).
3. Colores por proyecto y por cabaña: color fuerte para el borde y el texto, pastel
   derivado (`CV2.pastelDe`) para el fondo.
4. **Lo urgente va arriba y primero**: el cronómetro en curso es un banner fijo antes
   que cualquier otra cosa.
5. **Listas mantenibles con alta inline**: todo selector de lista viva termina en
   "➕ Agregar nueva…" → prompt → `arrayUnion` en `config` → queda seleccionada. Una
   lista nunca frena un registro.
6. **Multimoneda**: si no es R$, se pide el equivalente en R$ al cambio del día. Se
   muestra el monto original y el `≈R$`.
7. Los formularios se abren con `<dialog>`; `max-height: 88dvh` y scroll interno.
8. Confirmación (`confirm`) antes de cualquier borrado o cambio de estado irreversible.
9. Todo estado vacío explica el próximo paso, no dice solo "sin datos".
10. **El Inicio es una portada de novedades, no un tablero.** Junta lo que necesita
    atención (vencidos, mensajes sin leer, cronómetro andando, cobros, pendientes),
    respetando permisos y **en el mismo orden de `CV2.NAV`**, para que portada y menú se
    lean igual. La marca de visita se escribe **después** de pintar, así lo que se acaba
    de mostrar como nuevo no desaparece en la misma mirada. Si no hay nada, dice
    "Todo al día" en vez de quedar vacío.
11. **Lo que la UI esconde por permiso debe estar también en las reglas** (§5.1): la
    UI es comodidad, no seguridad.
12. **Borrar es por persona, y el cartel dice la verdad de cada caso.** En lo compartido
    —mensajes, temas del chat— borrar saca la cosa de TU vista, no de la de los demás.
    Cuando ya no le sirve a nadie, recién ahí desaparece de verdad. La confirmación se
    calcula **antes** de escribir y dice cuál de los dos casos es: "los demás lo siguen
    viendo" o "sos el último: se elimina definitivamente y no se puede deshacer". Un
    cartel genérico en el caso irreversible es una trampa.
13. **Lo que revive, revive para todos.** Si alguien escribe en algo que otro había
    borrado de su vista, reaparece: un mensaje que nadie recibe es peor que una lista con
    un elemento de más.

---

## 7. FLUJO DE TRABAJO (tandas)

1. Una **tanda** = uno o más archivos completos + actualización del Master Briefing.
   El **manual se genera al final**, cuando está entregado todo el código de la tanda
   (o del bloque de tandas) — no en paralelo (instrucción del administrador, T3.2).
2. **Siempre archivos completos**, listos para subir y reemplazar. Nunca diffs ni
   parches parciales.
3. Numeración: `TF.N` donde F es la fase (T2.3 = fase 2, tanda 3). Las correcciones
   llevan sufijo (T2.3b).
4. El briefing sube de versión menor por tanda (`v5.19` → `v5.20`).
5. Antes de entregar: validación del punto 3.8 completa.
6. Al entregar: qué archivo es nuevo, cuál reemplaza, y **qué acción manual** queda
   pendiente (republicar reglas, cerrar y reabrir la app, cargar una clave).
7. **La documentación se sube en la misma tanda que el código que describe.** Los tres
   `.md` viven en `interno/` (§2). Al subir un briefing nuevo **se borra el anterior**:
   dos briefings casi iguales conviviendo garantizan que alguien —persona o asistente—
   lea el viejo y trabaje sobre un estado que ya no existe.
8. **No se registra como entregado nada que no se haya entregado en la misma tanda.**
   Y al leer un registro viejo, **lo que dice "listo" no está probado que lo esté**: hasta
   la tanda 11.16 el briefing daba por creados una guía que no existía, un preset de
   Cloudinary que nunca se creó y un `<link>` de íconos que faltaba en varias páginas.
   Un registro es la intención de quien lo escribió; la verificación es abrir el archivo.
9. **Cuando cambia un flujo, se revisan TODAS las pantallas y documentos que lo
   mencionan** — el flujo de §10 lleva la lista de dónde se muestra. La tanda 11.1
   cambió el modelo de limpiezas y dejó atrás tres fósiles que nadie vio hasta julio:
   un chip inventado en el calendario, una función `enBRL()` llamada sin existir (que
   rompía la página entera de reservas al primer pago en otra moneda) y un manual que
   decía lo contrario del código. Ninguno era un error de programación: los tres eran
   el mismo error de documentación.

### 7.7 · Herramientas de una sola vez (migraciones, importaciones, arreglos masivos)
Una página que escribe muchos documentos de golpe no se parece a un módulo: se parece a
una operación quirúrgica. Molde fijo:

1. **Los datos van embebidos y ya procesados** en la propia página, traducidos al molde
   del 2.0. No se le pide al administrador que cargue un archivo desde el teléfono.
2. **Plan antes de escribir, siempre.** Primero un botón que solo lee y muestra qué se
   va a crear, qué se va a poner al día y qué se va a omitir. **No se escribe nada hasta
   que la persona aprueba el plan.**
3. **Idempotente por dos caminos**: por **ID** y por **huella** (una combinación de
   campos que identifique el hecho — por ejemplo actividad + instante exacto de inicio).
   Correrla dos veces no puede duplicar. Si una importación anterior cambió los IDs, la
   huella la caza.
4. **Los IDs originales se conservan.** Hace que los vínculos (`parentId`,
   `actividadId`, `reservaId`) sigan apuntando bien y que reimportar sea inofensivo.
5. **Los uid de Auth NO se conservan entre proyectos Firebase**: se traduce por **mail**,
   que sí es estable, y se guarda `uidViejo` para poder auditar. Si alguien no tiene
   equivalente, se avisa por pantalla en vez de escribir con el uid viejo en silencio.
6. **Ninguna sesión se importa `en_curso`**: un cronómetro fantasma hace creer al sistema
   que alguien está trabajando.
7. **Toda herramienta que escribe tiene su verificador de SOLO LECTURA**, aparte. No
   alcanza con el registro de la importación: hay que poder preguntarle a la base, más
   tarde y desde cero, si está todo. El verificador informa faltantes, diferencias y
   —por separado, sin alarmar— lo que existe solo en el destino, que es el trabajo hecho
   después de migrar.
8. **Solo admin**, fuera del menú y fuera del `SHELL` del service worker: se abren
   escribiendo la dirección. No son parte de la aplicación.
9. Registro visible de lo que hizo, descargable, y el consejo de volver a correrla si
   hubo errores (que es seguro, por el punto 3).

### 7.8 · Cómo se retira una función
Sacar algo tiene tantos lugares como ponerlo, y uno más: los datos que quedaron.

1. **El orden es: código y manual primero, datos después.** Al revés, entre que borrás
   los datos y subís el código hay una ventana en la que alguien abre la función y ve un
   error o una lista vacía. Con este orden, los datos quedan unas horas huérfanos y a
   nadie le molesta.
2. **Los datos se borran antes de cerrar la regla.** Firestore niega por defecto: apenas
   sacás el bloque, esos documentos quedan inalcanzables desde la aplicación —invisibles,
   ocupando lugar y sin manera cómoda de llegar a ellos. La consola del proyecto no pasa
   por las reglas, así que desde ahí se puede igual; pero lo que no se borra a tiempo, no
   se borra nunca.
3. **Ojo con las subcolecciones**: si lo retirado colgaba del documento de cada persona,
   hay que ir una por una. Borrar el documento padre NO se lleva a los hijos (§8).
4. **En el archivo de reglas queda el hueco documentado**, no el silencio: qué había,
   cuándo se fue y cuál era el bloque. El día que alguien se pregunte por qué no se puede
   escribir ahí, la respuesta está en el mismo lugar donde va a mirar.
5. **En CONVENCIONES §4 la colección no se borra: se marca RETIRADA con el motivo.** Un
   dato viejo en la base sin explicación es una trampa para el que venga después.

### 7.9 · Renombrar, mover o retirar una página pública
1. **Su dirección vieja va al mapa de `404.html`**, apuntando a la nueva. Google y
   WhatsApp tienen memoria larga: una URL que se compartió alguna vez sigue llegando
   meses después. La regla "ninguna URL indexada termina en 404" la cumple ese mapa, no
   la buena voluntad.
2. **Si estaba en el `SHELL` de `sw.js`, se saca del `SHELL` y se sube la `VERSION` en la
   MISMA tanda** (§3.4). `addAll` es todo o nada: un solo 404 en la lista y el service
   worker nuevo **no se activa nunca**, sin ningún error visible. Borrar un archivo del
   repositorio y dejarlo en el `SHELL` deja a todo el equipo con la copia vieja de la
   aplicación, y el síntoma no se parece en nada a la causa.
3. **Un archivo que no referencia nadie se borra.** No queda "por si acaso": el sistema
   viejo murió de acumulación (§1.5). Si vale la pena guardarlo, va al historial del
   repositorio, que es exactamente para eso.

---

## 8. TRAMPAS CONOCIDAS

- **`window.CV2` duplicado**: dos definiciones y la segunda pisa a la primera en
  silencio.
- **Reglas parciales**: reemplazar `firestore.rules` por unos pocos bloques deniega
  todo lo demás → sitio inaccesible. Se edita siempre el archivo completo (§5.3).
- **Cronómetro y cierre remoto**: al dar Stop sobre una sesión ya frenada por otro, se
  lanza `sin-sesion` y **no** se vuelve a cerrar el ciclo (duplicaría honorarios).
- **Reservas de Airbnb sin `googleEventId`** no se detectan como canceladas.
- **Calendar ID ≠ URL de iCal**: el ID es `algo@group.calendar.google.com`; el
  calendario debe ser público y la key tener la Calendar API habilitada.
- **Regla que mira `resource.data` sin contemplar el documento inexistente**: rompe
  todo upsert para quien no es admin (ver §5.11).
- **Una sola rama caída de un `or()` tumba la consulta entera**, no ese documento: el
  usuario deja de ver TODO, no solo lo problemático.
- **Contar el día de salida como ocupado**: bloquea noches vendibles. La ocupación es
  `[checkIn, checkOut)` — ver §4 reservas.
- **Confundir `m.cierreId` con `m.pendiente.cierreId`**: el primero es del balance
  actual, el segundo del viejo. Mirar solo el segundo hizo que los pendientes
  sobrevivieran a todos los balances.
- **Sumar montos sin mirar la moneda**: un total que mezcla R$ y U$D miente y no avisa.
  Todo agrupamiento de plata lleva la moneda en la clave.
- **Un movimiento en otra moneda sin `montoBRL`** cuenta como CERO en cualquier total
  que use el pivote en reales. Por eso los totales se calculan por moneda.
- **Movimiento sin `creadoPor`**: queda invisible para quien solo tiene `dinero`.
- **Literales con saltos de línea**: en JS embebido en HTML hay que escribir `\n`
  escapado, no un salto real dentro de comillas.
- **Escribir con una forma y leer con otra**: el error se disfraza de lógica. Comparar
  el camino de escritura contra el de lectura ANTES de revisar cualquier otra cosa
  (regla 3.12).
- **Dos marcas para la misma novedad**: si una cosa "ya vista" se guarda en dos lugares
  (p. ej. `comunicaciones_lecturas` y `usuarios.ultimaVisitaInicio`), tarde o temprano se
  contradicen. Una novedad, una marca.
- **`accept="image/*"` no garantiza la cámara** y **`capture` esconde los archivos**:
  ver regla 3.11. Todo lo de imágenes pasa por `CV2`.
- **Una URL de foto ajena en `fotos[]`** es una foto que desaparece del sitio el día que
  ese servidor cambie. Se trae la copia a Cloudinary, no se guarda el link.
- **Un `getDocs` sin filtrar sobre una colección con reglas por documento** falla
  ENTERO, no parcialmente (regla 3.3). Al cerrar una colección por regla hay que
  revisar TODAS las páginas que la consultan, no solo la que se está tocando.
- **Caché mezclada**: si la app "pierde" datos tras un deploy, casi siempre es un
  desfase de versiones del service worker → cerrar del todo y reabrir.
- **Una promesa que nunca resuelve no deja rastro.** No hay error, no hay toast, no hay
  nada en la consola: solo una página en blanco. Si el arranque de una página depende de
  un `await`, ese `await` lleva reloj (§3.9).
- **`clearIndexedDbPersistence` se queda esperando** si otra pestaña o la PWA instalada
  tiene la base abierta. Puesto en el camino de salida y sin plazo, dejó la base local a
  medio cerrar y **toda lectura posterior de Firestore quedó esperando para siempre**
  (§3.15).
- **Anda en un navegador y en otro no**: es estado local, no código. Antes de tocar una
  línea, probar en incógnito.
- **Dos elementos fijos en `bottom: 0`**: el de mayor `z-index` gana y el otro
  desaparece sin dejar rastro en la consola. La barra de navegación va en 95: todo lo
  demás pegado abajo usa `.cv-pegado-abajo` (§6.0 punto 12).
- **Firestore NO borra subcolecciones en cascada.** Borrar el documento padre deja los
  hijos vivos, invisibles y ocupando lugar para siempre. Primero se vacían los hijos —en
  lotes—, después se borra el padre.
- **Un `<dialog>` sin `max-height`** se desborda en un teléfono y deja los botones fuera
  de la pantalla: el formulario se ve pero no se puede guardar ni cancelar.
- **Un mensaje de error sin el código es un problema de dos minutos convertido en tres
  días.** El panel vive en un teléfono: no hay consola, no hay pestaña de red. Si el
  mensaje no dice el código, nadie puede saber qué pasó. Todo error que el usuario ve
  lleva su código entre paréntesis, y todo servicio externo que explica el fallo en la
  respuesta (Cloudinary lo hace siempre) se muestra con SU texto, no con uno inventado.
- **Un código de error esperado se verifica contra el servicio, no contra la memoria.**
  El muro tenía el mensaje correcto para "proveedor deshabilitado" y no lo mostraba
  nunca: buscaba `auth/operation-not-allowed` y Firebase moderno devuelve
  `auth/admin-restricted-operation`. Un `if` sobre un código viejo es peor que no
  tenerlo: aparenta estar cubierto.
- **Lo que solo funciona con una sesión previa no está probado.** El muro de recuerdos
  "andaba" en el teléfono del administrador y no funcionó nunca para un huésped: la
  línea que fallaba estaba detrás de un `if (!auth.currentUser)`. Toda función que
  empieza con alguien de afuera se prueba **en incógnito o en otro dispositivo**, que es
  la única forma de ver lo que ve quien llega por primera vez.
- **Un `catch` que traga un error de permisos es un error invisible.** Las estrellas de
  Actividades no funcionaron para nadie durante meses: faltaba la regla de
  `estado_usuario`, y la lectura estaba envuelta en `catch { /* primera vez */ }`. El
  fallo se disfrazaba de "todavía no marcaste ninguna". Un catch que da por buena la
  ausencia de datos tiene que distinguir `permission-denied` del caso vacío, o avisar.
- **Una función escrita que nadie llama es una promesa incumplida**, no código de más.
  `CV2.marcarNovedad` existía, el estilo existía, el manual lo prometía y el punto rojo
  no aparecía nunca. Antes de dar por hecha una función, se busca quién la invoca.
- **Cuando el mismo cálculo se escribe dos veces, la segunda sale mal.** El agrupamiento
  de pendientes por moneda estaba bien en `dinero.html` y mal en `index.html`: la misma
  trampa de §8, cometida de nuevo al escribir un archivo nuevo. Si un cálculo de plata
  hace falta en dos lados, va a `nucleo.js`.
  *(Acá decía `utils.js`, que es el núcleo del sistema **1.0** y ya no existe en el
  repositorio: seguir esa instrucción era escribir en un archivo muerto. Corregido en
  julio de 2026 revisando §10.)*
- **Una regla no puede recorrer una colección para saber "todos".** Si la comprobación
  necesita la lista completa de personas, o la lista vive dentro del propio documento
  (y ahí sí es demostrable), o la comprobación queda del lado de la página — y entonces
  **se escribe hasta dónde llega la garantía**, en la regla y en el briefing. Lo que no
  se hace es dar por cubierto lo que no está cubierto.
- **UIDs entre proyectos**: un proyecto Firebase nuevo tiene otros UIDs de Auth; migrar
  personas exige traducir los identificadores (paso de emparejamiento, Fase 6).
- **Un `null` del origen borra el destino.** Copiar un campo "tal cual" en una
  sincronización parece inofensivo hasta que el origen no lo tiene (§3.6).
- **Una migración parcial deja huérfanos.** Si se traen las sesiones pero solo una parte
  de las actividades, las sesiones de las que faltan se omiten sin ruido. Se trae el
  árbol completo o se avisa por pantalla cuáles quedaron afuera y por qué.
- **El texto exportado puede venir roto** (emojis y acentos mal leídos). Se regenera
  desde el export, no se corrige a mano cada aparición.
- **Habilitar el login anónimo cambia el significado de `logueado()` en TODO el archivo
  de reglas**, no solo en la colección nueva. Uno de esos `allow read: if logueado()`
  exponía `/usuarios/` entera —mails y roles— a cualquier visitante del sitio público.
- **Un campo privado dentro de un documento público no es privado** (§5.15). Vale para
  cualquier colección con lectura abierta, no solo para recuerdos.
- **Una clave con `/` adentro rompe la ruta del `get()`** de la regla. Se filtra con
  `matches('^[A-Za-z0-9._-]+$')` antes de armar el path.
- **Un enlace que empieza con `/` está roto en GitHub Pages.** El sitio vive en
  `casaverdecanas-blip.github.io/casaverdecanas/`, así que `href="/"` apunta a la raíz
  de la organización y da 404. **Todo enlace interno es relativo** (`./index.html`,
  `../recuerdos.html`): funciona igual antes y después de la mudanza al dominio propio.
  Lo mismo vale para `src` de imágenes y para el `manifest`.
- **Un QR impreso no se corrige.** Lleva la dirección DEFINITIVA
  (`casaverdecanas.com.br`), no la de prueba de `github.io`, aunque todavía se esté
  probando ahí.
- **`addAll` en el service worker es todo o nada**: un solo 404 y el SW nuevo no se
  activa nunca, sin ningún error visible (§3.4).
- **La barra de abajo tapa lo que esté fijo abajo.** Le pasó al toast: aparecía detrás,
  invisible justo cuando había algo que leer.
- **El uid anónimo es del dispositivo, no de la persona**: dos personas en el mismo
  iPad son el mismo huésped, y la misma persona en otro teléfono es otro.
- **Un respaldo que funciona demasiado bien esconde el defecto que tapa.** Las imágenes
  del sitio se pedían en una carpeta `./img/` que no existe, y se veían igual porque cada
  `<img>` tiene un `onerror` que reintenta en la raíz. **`<link>`, `<meta>` y el JSON-LD
  no tienen `onerror`**: ahí no había red. Resultado invisible durante meses — el sitio
  sin ícono en la pestaña y **cada enlace compartido por WhatsApp saliendo sin imagen**,
  siendo WhatsApp el canal de contacto principal del negocio. Cuando algo anda "a pesar
  de" estar mal escrito, lo que hay que arreglar es lo que está mal escrito.
- **Lo que solo lo prueba quien lo escribió, con su sesión ya abierta, no está probado.**
  Hermana de la trampa anterior y de la del muro de recuerdos (11.15).
- **Declarar `width` y `height` de una imagen que nadie midió** es peor que no
  declararlos: el navegador reserva un hueco del tamaño equivocado y el que consume la
  metadata —WhatsApp, Facebook— recorta donde no va.
- **Borrar un archivo que está en el `SHELL` del service worker** rompe la actualización
  de TODA la aplicación, para todo el equipo, sin un solo error a la vista (§7.9).

---

### Netlify construye el despliegue y NO lo publica

**"Auto Publishing Locked".** El registro dice *"Site is live ✨"*, todo parece
perfecto, y el proyecto sigue sirviendo el despliegue anterior. El síntoma no se
parece en nada a la causa:

- se cambia una variable de entorno y no tiene efecto → *"Netlify no aplica variables
  sin desplegar"* (falso);
- se sube código nuevo y sigue el comportamiento viejo → *"la app manda mal el dato"*
  (falso).

Se destraba en **Deploys → Unlock auto publishing**, y después *Publish deploy* sobre
el despliegue que corresponda. **No confiar en el registro: probar el comportamiento.**
Costó seis horas en julio de 2026.

### GitHub: subir a una rama en vez de a `main`

Al subir un archivo desde la web, la pantalla de confirmación ofrece *"Create a new
branch and start a pull request"*. Si queda marcada, el archivo va a una rama y **el
sitio no lo ve nunca**: GitHub Pages publica solo desde `main`. El aviso *"X had recent
pushes"* en la portada del repositorio es la señal.

Se confunde con la caché: se espera, se repara la app, y el archivo sigue sin
aparecer porque nunca llegó. **Siempre "Commit directly to the `main` branch".**

### "Reparar la app" puede dejar Auth trancado

`clearIndexedDbPersistence` y el borrado de `firebaseLocalStorageDb` fallan a medias
si otra pestaña tiene la base abierta. Firebase Auth queda sin poder abrirla y
**`onAuthStateChanged` no se dispara nunca**: la sesión no arranca y el login falla
con `auth/network-request-failed` — un error de red que no es de red.

Cómo se reconoce: en `diagnostico.html`, la sección de sesión avisa que Auth no
arranca. Cómo se comprueba en diez segundos: **abrir en incógnito**, donde la base
nace limpia. Cómo se arregla: borrar los datos del sitio desde Chrome.

### Un reemplazo de texto que no encuentra su patrón no avisa

Editando `reservas.html` se insertó un elemento suponiendo `<h1>Reservas</h1>`, y el
real era `<h1 style="margin-right:auto;">Reservas</h1>`. El reemplazo **no se aplicó y
no falló**: el elemento nunca se creó, `$('sello').textContent` encontró `null`, y el
script murió tres líneas antes de suscribirse a Firestore. La página quedó en
"Cargando…" para siempre.

Dos consecuencias, las dos ya aplicadas: **todo reemplazo automático verifica que su
patrón exista**, y **antes de entregar se comprueba que cada `id` que busca el JS
exista en el HTML** (§3.8).

---

## 9. LO QUE NO SE HACE

- No se guardan derivados.
- No se suman monedas distintas en un mismo total.
- No se ejecuta nada opcional antes de resolver la autenticación.
- No se espera sin plazo nada de lo que dependa el arranque de una página (§3.9).
- No se usa `location.href` en el camino de autenticación: siempre `replace` (§3.9).
- No se borra la base local en el camino de salida, ni sin reloj (§3.15).
- No entran extractos bancarios a la app.
- No se crean colecciones paralelas para estados de una misma cosa.
- No se escribe una consulta de permisos fuera de su core.
- No se edita `firestore.rules` por fragmentos: siempre completo.
- No se entregan parches: archivos completos.
- No se arma un `<input type="file">` ni se llama a Cloudinary fuera de `nucleo.js`.
- No se guardan URLs de imagen crudas ni ajenas: siempre la copia propia, con entrega.
- No se migran al Cloudinary las imágenes del **shell** (`logo-sitio`, `logo-pie`,
  `ilustracion-hero`, `icono-192`, `apple-touch-icon`): las precachea el service worker
  y `manifest.json` las necesita del mismo origen para instalar la app.
- No se le manda nada a un huésped que no marcó `novedades`.
- No se guarda un dato privado en una colección de lectura pública.
- No se confía en la sesión como permiso para escribir desde afuera: va la clave.
- No se diseña una pantalla pensando primero en el escritorio.
- No se pone un elemento fijo abajo sin `safe-area-inset-bottom`.
- No se abre nada emergente sin que el botón Atrás de Android lo cierre (`CV2.capaAtras`).
- No se maneja el historial a mano para cerrar una capa: hay una sola pila (§3.14).
- No se escribe en masa sin mostrar el plan y esperar la aprobación (§7.7).
- No se da por cerrada una migración sin correr su verificador (§7.7).
- No se escribe `null` encima de un dato que el destino sí tiene (§3.6).
- No se usa `addAll` en el `install` del service worker.
- No se inyectan estilos desde JavaScript: el CSS vive en `design-system.css`.
- No se deja viva una función que nadie usa: no es neutra. Se paga todos los meses en
  mantenimiento, en manual y en confusión — y si además guarda plata, es un lugar donde
  algo se pierde sin que nadie lo note.
- No se cierra la regla de algo antes de haber borrado sus datos (§7.8).
- No se agrega una colección sin su bloque de reglas en la MISMA tanda: este archivo
  niega por defecto, así que una colección sin regla no falla al escribirse — falla al
  usarse, más tarde y en manos de otro.
- No se implementa una decisión estructural sin cerrarla antes con el administrador.
- No se declaran medidas de una imagen que no se midió.
- No se deja en el repositorio un archivo que no referencia nadie (§7.9).
- No se borra un archivo sin mirar antes si está en el `SHELL` de `sw.js` (§7.9).
- No se renombra una página pública sin agregarla al mapa de `404.html` (§7.9).
- No se registra como entregado algo que no se entregó, ni se da por hecho lo que un
  registro viejo dice que está hecho (§7 puntos 7 y 8).
- No conviven dos briefings en el repositorio: al subir el nuevo se borra el viejo.
- No va en un `.md` de `interno/` nada que no pueda ser público (§2).

---

## 10. FLUJOS

Un flujo cuenta **cómo se comporta el sistema de punta a punta**. No es el dato en
reposo (§4), ni la historia de cómo llegamos (briefing), ni cómo se usa una pantalla
(manual). Es la capa que faltaba.

Nació el 31 de julio de 2026, después de que el administrador tuviera que preguntar
cómo funcionaba el ciclo de limpieza. Estaba documentado —y bien— pero enterrado en
§4, entre esquemas de colecciones. Un **proceso** escrito en un catálogo de **datos**
no lo encuentra nadie.

**Cada flujo contesta las mismas seis preguntas.** La que más sirve es la última que
uno escribiría: *qué NO hace*.

> **Qué lo dispara** — el hecho concreto, nunca "una fecha"
> **Qué crea** — documentos, con sus IDs deterministas
> **Quién lo ve** — permisos y alcance
> **Cómo termina** — la condición de cierre
> **Qué NO hace** — los límites, para cortar suposiciones
> **Dónde se muestra** — las pantallas que lo describen, para revisarlas cuando cambie

Esa última línea es una obligación, no una nota: **cuando cambia un flujo se revisan
todas las pantallas que lo mencionan** (§7.9).

| | Flujo | Empieza en |
|---|---|---|
| **F1** | Limpieza y control por reserva | una reserva confirmada entra en la ventana de 7 días |
| **F2** | El acuerdo: de presupuesto a cobrado | se crea una reserva |
| **F3** | Los avisos | un hecho concreto en una página |
| **F4** | El espejo de disponibilidad pública | cualquier cambio de estado de una reserva |
| **F5** | Sincronización con Airbnb | el botón, a mano · **sin verificar** |
| **F6** | Actividades, ciclos y recurrencias | alguien da una actividad por hecha |
| **F7** | De las horas al cobro | el cierre de ciclo de F6 |
| **F8** | Dinero, del movimiento al balance | se carga un movimiento |
| **F9** | El recuerdo del huésped | alguien escanea el QR |

---

### F1 · Limpieza y control por reserva

**Qué lo dispara**
Una reserva **confirmada** cuyo `checkIn` entra en la ventana de 7 días. Lo hace
`RCore.sincronizarLimpiezas`, que corre al abrir Reservas, al confirmar y al editar.
**No lo dispara la salida ni el paso del tiempo.**

**Qué crea**

```
proj-limpiezas
 └─ limp-<reservaId>        LIMPIEZA de entrada · con tarifa
     └─ checkout-<reservaId>  CONTROL de salida · sin tarifa
         └─ falta-<reservaId>   FALTANTES · solo si los hubo
```

`limp-` nace una semana antes del check-in, con `fechaInicio` un día antes para que el
semáforo se ponga rojo a tiempo. **`checkout-` no nace por fecha**: lo crea la acción
de terminar la limpieza, así existe solo si hubo limpieza real.

**Quién lo ve** — todo el equipo activo. Las actividades de limpieza son de alcance
`equipo`.

**Cómo termina** — con el control de salida hecho. Si hubo faltantes, queda `falta-`
abierta hasta que alguien registre el gasto de reponer.

**Qué NO hace**
- **La salida NO genera limpieza.** El día del check-out solo puede aparecer el
  **control de inventario**, y solo si la limpieza de entrada ya se hizo.
- El control de salida **no es una limpieza y no lleva tarifa**.
- Anular una reserva borra su `limp-` **solo si nadie la hizo todavía**.
- El acuerdo no interviene: cada cabaña genera su limpieza y su control por separado,
  aunque se cobren juntas.

**Dónde se muestra** — `actividades.html` (la lista y el botón de terminar),
`calendario.html` (entradas y salidas), `reservas.html` (el botón 🧹 del admin),
`reservas-core.js` (el motor).

> **Fósil, para no repetirlo.** Hasta julio de 2026 el calendario ponía un chip
> `🧹 limpieza` en cada salida. Era texto fijo: no leía ninguna actividad. Nació
> cuando la limpieza SÍ colgaba de la salida, el modelo cambió cuarenta tandas antes,
> y el chip siguió enseñando el modelo equivocado — hasta confundir al propio
> administrador. De ahí sale §3.20.

---

### F2 · El acuerdo: de presupuesto a cobrado

**Qué lo dispara** — crear una reserva. Siempre nace un acuerdo con ella.

**Qué crea**
`grupos/{id}` con el precio y la moneda, más `reservas/{id}` con `grupoId`. Al sumar
cabañas con **Otra cabaña**, cada una es una reserva nueva con el mismo `grupoId` y
**sin precio propio**.

**Quién lo ve** — lectura para el equipo activo; crear y editar, permiso `reservas`.
Borrar un pago, `finanzas`.

**Cómo termina** — todas las cabañas en `finalizada` y el saldo del acuerdo en cero.
Confirmar y finalizar actúan sobre el acuerdo entero con una sola pregunta; **anular y
editar siguen siendo por cabaña**: se puede caer una sola sin tocar las demás.

**Qué NO hace**
- **No mezcla monedas.** Un acuerdo tiene una.
- **No guarda el saldo ni el total pagado**: se derivan de los pagos.
- **No hay saldo por cabaña.** Nadie le debe nada a una cabaña; la deuda es del
  acuerdo. Mostrar un saldo por cabaña es mostrar una deuda que no existe.
- **No toca la ocupación.** Fechas, limpiezas, disponibilidad y superposiciones siguen
  siendo por reserva. Las cabañas de un acuerdo **pueden tener fechas distintas**.
- **No convierte monedas.** Si el pago entra en otra, se pide el equivalente **en la
  moneda del acuerdo** y la plata se guarda como entró.

**Dos estilos de identificador, y es a propósito**
- Los acuerdos **migrados** en julio de 2026 tienen ID `grp-<idDeLaPrimeraReserva>`:
  la herramienta lo armó así para que la reserva raíz fuera deducible.
- Los acuerdos **nuevos** tienen un ID automático de Firestore.

Conviven sin problema porque nada depende de la forma del ID salvo `raizDeAcuerdo()`,
que le saca el prefijo `grp-` si lo tiene y, si no encuentra esa reserva, cae en la
primera del grupo. **No unificar por prolijidad**: renombrar un ID obliga a reescribir
todas las reservas y todos los pagos que lo apuntan, y el beneficio sería estético.

**Dónde se muestra** — `reservas.html`, `revisar-reservas.html`, `calendario.html`
(que enlaza a la reserva), `dinero.html` (el movimiento que genera cada pago).

> **Fósil.** `reservas.html` llamaba a `enBRL()`, una función que **no existía en el
> archivo**: resto del pivote en reales anterior a la tanda 11.1. Como estaba dentro
> del `map` que arma la lista, un solo pago en moneda distinta rompía la página
> entera. Nadie lo vio porque todavía no había habido un pago así.

---

### F3 · Los avisos

**Qué lo dispara** — un hecho concreto en una página: alguien escribe en el chat.
**No corre ningún reloj**: el aviso sale en el momento, desde el navegador de quien lo
produjo.

**Qué crea** — nada en Firestore. Manda un correo por EmailJS y un WhatsApp por
CallMeBot, según lo que cada persona haya elegido en `usuarios/{uid}.notif`.

**Quién lo ve** — quien corresponda por audiencia (`'todos'` o una lista de uid).
**Nunca se avisa a quien lo produjo.**

**Cómo termina** — no termina: es un disparo y se olvida.

**Qué NO hace**
- **Un aviso NUNCA hace fracasar la acción que lo produjo.** Se llama después de que
  el dato está guardado y sin `await` que frene la interfaz.
- **No avisa estados.** Una tarea vencida, una llegada de hoy o un cronómetro olvidado
  no son eventos: se vuelven ciertos solos, a medianoche, sin ningún navegador
  abierto. Eso lo cubre el Inicio, y avisarlo necesitaría un reloj en el servidor.
- **No manda al número por defecto** cuando falta el contacto de alguien: le sonaría
  el teléfono al administrador por un aviso ajeno.
- **No reintenta.** Dentro del minuto, el segundo WhatsApp al mismo número no sale — y
  está bien: en una conversación de diez mensajes nadie quiere diez avisos.

**Dónde se muestra** — `avisos.html` (los interruptores y las pruebas), `nucleo.js`
(`CV2.avisar`), `netlify/functions/notify-whatsapp.js`.

---

### F4 · El espejo de disponibilidad pública

**Qué lo dispara** — cualquier paso de una reserva por `sincronizarLimpiezas`:
crearla, confirmarla, editarla, anularla. Se llama en `espejarDisponibilidad(r)`,
una por reserva.

**Qué crea** — `disponibilidad/{reservaId}` con **solo tres campos**: `cabanaId`,
`desde`, `hasta`. Nada más.

**Quién lo ve** — **todo el mundo, sin sesión.** Es la única colección de ocupación
que el sitio público puede leer.

**Cómo termina** — el documento se borra cuando la reserva deja de ocupar: al
anularse, al volver a presupuesto o al perder las fechas.

**Qué NO hace**
- **No expone ni un dato del huésped.** Existe precisamente para que el sitio muestre
  disponibilidad sin abrir `/reservas/`, que tiene nombres, teléfonos y montos.
- **No cuenta los presupuestos.** Solo `confirmada` ocupa: un presupuesto no bloquea
  una fecha en el sitio.
- **No hace fracasar nada.** Si el espejo falla, se anota en la consola y la reserva
  se guarda igual. Un problema de publicidad no puede impedir un cobro.
- **Nada lo borra en cascada.** Si una reserva se elimina desde afuera —una
  herramienta, la consola de Firebase— su documento queda huérfano y el sitio muestra
  ocupado algo que está libre. `migrar-reservas.html` lo limpia a mano por eso.

**Dónde se muestra** — `reservas-core.js` (`espejarDisponibilidad`), el sitio público
(`index.html` de la raíz), `migrar-reservas.html`.

---

### F5 · Sincronización con Airbnb

> ⚠ **SIN VERIFICAR.** Nunca corrió con reservas reales de Airbnb (julio de 2026).
> Hoy esas reservas se cargan a mano, porque el calendario tampoco trae los detalles
> que hacen falta. Este flujo describe lo que el código **dice** que hace, no lo que
> se comprobó que hace.

**Qué lo dispara** — el botón **Airbnb** de `reservas.html`. **Es manual**: no hay
ningún reloj y nadie sincroniza solo.

**Qué crea**
Por cada cabaña con `calendarId`, lee su calendario de Google (eventos desde 30 días
atrás) y, por cada evento:
- si no existe reserva con ese `googleEventId` → crea `grupos/{id}` en cero y
  `reservas/{id}` con `origen: 'airbnb'`;
- si existe y cambiaron las fechas → la actualiza;
- si la reserva existe y el evento **ya no está** → la anula.
Después llama a `sincronizarLimpiezas` sobre todo lo tocado.

**Quién lo ve** — el botón es de quien tiene permiso `reservas`. La clave de Google
Calendar vive en `config/integraciones`, que solo leen el admin y `reservas`.

**Cómo termina** — devuelve un recuento: nuevas, actualizadas, anuladas y cabañas sin
calendario configurado.

**Qué NO hace**
- **No trae el precio.** El calendario de Airbnb no lo informa: el acuerdo nace en
  cero, con la nota *"falta el precio"*, y se completa a mano.
- **No trae huésped, ni teléfono, ni cantidad de personas.** Pone 2 adultos por
  defecto y el nombre `Airbnb · <código>` si logra extraerlo de la descripción.
- **No borra reservas**: las anula. Anular conserva los pagos y el historial.
- **No toca las reservas directas.** Solo mira las que tienen `googleEventId`.
- **No sincroniza en sentido inverso**: nada de lo que hagas acá vuelve a Airbnb.

**Dónde se muestra** — `reservas.html` (el botón y el recuento), `reservas-core.js`
(`RCore.sincronizarAirbnb`), `cabanas.html` (el `calendarId` de cada cabaña).

---

### F6 · Actividades, ciclos y recurrencias

**Qué lo dispara** — que alguien la dé por hecha, de dos maneras:
**⏹ Stop con "terminada"** (con cronómetro) o **✔ Tildar** (sin él). Las dos pasan por
`_cerrarCiclo()` en `actividades-core.js`. **Nada cierra un ciclo por fecha.**

**Qué crea**
1. Frena **todos** los cronómetros abiertos en esa actividad, de cualquier persona, y
   registra sus horas.
2. Si la actividad tiene `monto`, crea uno o varios `honorarios` **proporcionales a
   las horas de cada uno en ese ciclo**. Sin horas registradas —un tilde puro— el
   monto entero va a quien cierra.
3. Reprograma o tacha: si `recurrenciaDias > 0`, la actividad vuelve a `pendiente` con
   `fechaInicio` a N días; si no, queda `hecho: true`.

El corte entre ciclos es `ultimoCierreEn`: una sesión cuyo `fin` sea anterior
**pertenece a un ciclo ya cerrado** y no se vuelve a pagar.

**Quién lo ve** — según `alcance`: `equipo` (todos), `personal` (solo su creador) o
`asignados` (creador + los uid de `competencias`). La regla de Firestore espeja
exactamente las cuatro ramas de la consulta: **si la consulta no viene filtrada,
Firestore la rechaza entera**, aunque los documentos sean legibles.

**Cómo termina** — una única queda tachada; una recurrente **no termina nunca**: cada
cierre abre el ciclo siguiente.

**Qué NO hace**
- **No deja dos cronómetros a la vez por persona.** `Core.iniciar` falla con
  `crono-ocupado` si ya tenés uno corriendo en otra actividad.
- **No cierra el ciclo dos veces.** Si otro terminó la actividad y tu reloj quedó
  frenado por ese cierre, tu Stop devuelve `sin-sesion` y no genera honorarios
  duplicados.
- **"Stop, todavía no" NO cierra nada**: registra tus horas y deja los relojes de los
  demás corriendo.
- **No borra el registro.** Todo —incluido un tilde sin tiempo— queda como sesión en
  `/sesiones/`, así el historial de realizaciones vive en un solo lugar.

**Dónde se muestra** — `actividades.html` (el árbol y los botones),
`actividades-core.js` (el motor), `gestion-sesiones.html`, `honorarios.html`,
`horas-stats.html`, `index.html` (vencidas y atrasadas).

---

### F7 · De las horas al cobro

**Qué lo dispara** — el cierre de ciclo de F6. El honorario nace **`pendiente`**.

**Qué crea** — `honorarios/{id}` con `uid`, `horas`, `monto`, `actividadId` y
`cicloCerradoEn`. Al pagarlo desde Cobros, se crea además el movimiento de salida en
`/movimientos/` con `refTipo: 'honorario'` y `refId`, y el honorario guarda su
`movimientoId`.

**Quién lo ve** — cada uno ve **los suyos**; `finanzas` ve y paga los de todos;
`horas` puede actualizarlos porque el gestor de sesiones recalcula ciclos.

**Cómo termina** — `estado: 'pagado'`, con `movimientoId` apuntando a la salida de
plata.

**Qué NO hace**
- **No se paga dos veces.** El vínculo `honorario.movimientoId ↔ movimiento.refId` es
  la garantía: con `movimientoId` presente, la casilla de crear el movimiento queda
  deshabilitada.
- **El Gestor de Sesiones gobierna los cobros, pero no toca lo pagado.** Editar o
  borrar sesiones dispara `Core.recalcularCiclos`, que rehace el reparto **conservando
  el pozo de cada ciclo** — cambia quién cobra cuánto, no cuánto se paga en total. Un
  ciclo con algún honorario **ya pagado no se toca**: se informa para ajustarlo a mano.
- **No convierte monedas.** Los honorarios son en reales.

**Dónde se muestra** — `honorarios.html`, `gestion-sesiones.html`, `horas-stats.html`,
`dinero.html` (el movimiento resultante), `actividades-core.js`.

---

### F8 · Dinero, del movimiento al balance

**Qué lo dispara** — cargar un movimiento a mano en Dinero, o un puente automático:
un cobro de reserva genera su ingreso, un honorario pagado genera su salida.

**Qué crea** — `movimientos/{id}`: fecha, `tipo` (`entro`/`salio`), monto, moneda,
categoría, cuenta, quién, detalle y comprobante opcional. Si queda algo colgando lleva
`pendiente`: **`reponer`** (alguien puso plata suya) o **`cobrar`** (todavía no entró).

**Quién lo ve** — `finanzas` ve el libro entero; `dinero` **solo los que cargó él**
—por eso toda alta debe sellar `creadoPor`, o el movimiento le queda invisible a su
propio autor.

**Cómo termina** — con **Hacer balance** (`balance.html`, solo `finanzas`), que en un
solo paso:
1. crea la foto inmutable en `cierres/{id}` con los totales **por moneda**, los
   ajustes por cuenta y los cobros saldados;
2. **sella** cada movimiento del período con `cierreId` — sale de la vista de Dinero y
   pasa al histórico;
3. abre el período siguiente con una **línea de apertura por cuenta** con su saldo
   real.

**Qué NO hace**
- **El balance NO busca cuadrar con el banco.** Es un corte de control entre dos
  momentos. La diferencia entre lo calculado y lo real **es** el gasto no registrado,
  y el ajuste la absorbe dejándola escrita en el cierre para poder leerla después.
- **Un cierre no se retoca nunca**: la regla lo prohíbe (`update, delete: if false`).
- **Un movimiento sellado tampoco.** Ojo: la regla solo mira `pendiente.cierreId`,
  pero el balance sella con **`cierreId` en la raíz** — por eso las herramientas que
  borran movimientos comprueban los dos.
- **Un "por cobrar" no cuenta como ingreso** hasta saldarse. Un "reponer" sí cuenta
  como gasto real desde el momento en que se cargó.
- **No convierte monedas.** Cada una se totaliza por separado.

**Dónde se muestra** — `dinero.html`, `balance.html`, `honorarios.html`,
`reservas.html` (el puente del cobro), `actividades.html` (el gasto de un faltante).

---

### F9 · El recuerdo del huésped

**Qué lo dispara** — un huésped escanea el QR pegado en el alojamiento y escribe. Es
**la única colección donde escribe alguien de afuera del equipo**.

**Qué crea** — `recuerdos/{id}` en estado `pendiente`, más `huespedes/{uid}` con su
contacto. La llave es la **clave que viaja dentro del QR**: el ID de un documento de
`claves_recuerdos` es la clave misma, y la regla la verifica con un `exists()`.

**Quién lo ve** — afuera, **solo los `publicado`**. El equipo con permiso `contenido`
ve todo y modera.

**Cómo termina** — al moderar, en dos pasos y en este orden: **primero** se archiva lo
privado en `recuerdos_contactos/{id}`, **después** se borran `clave` y `email` del
recuerdo con `deleteField()` y se le pone el estado. Si el archivado falla, no se
sigue: se perdería el mail y de qué QR vino.

**Qué NO hace**
- **Nada se publica solo.** Nace `pendiente` siempre.
- **Tener sesión no es permiso.** Una sesión anónima se la abre cualquiera desde la
  consola; hace falta la clave del QR, que es revocable de a una.
- **El `cabanaId` no se le pregunta al visitante**: lo decide la clave.
- **La foto solo puede ser de nuestro Cloudinary.** Sin esa comprobación, el campo
  sería un agujero para colgar cualquier imagen ajena en nuestro sitio.
- **La clave y el mail NO pueden quedar en el documento publicado.** Un recuerdo
  publicado lo lee cualquier navegador del mundo y en Firestore **no hay seguridad por
  campo**: si el documento es legible, todos sus campos lo son. La regla lo garantiza
  aunque el código se olvide.
- **No hay límite de frecuencia posible desde las reglas.** Los frenos reales son: la
  clave revocable, la moderación previa, y el preset propio de Cloudinary, que se
  puede apagar solo para recuerdos sin tocar comprobantes ni fotos del panel.
- **⚠ No avisa a nadie** — ver §5.5b de la Guía del Sitio Público: `notify-recuerdo`
  está muerta. El recuerdo espera moderación sin que nadie se entere.

**Dónde se muestra** — `recuerdos.html` de la raíz (el muro público y el formulario),
`recuerdos.html` del panel (moderación, claves y huéspedes), `firestore.rules`
(la validación real).

---

### Flujos que faltan escribir

Ninguno: los nueve procesos del sistema están escritos.

Lo que falta es **mantenerlos**. Cada tanda que toque un proceso actualiza su flujo
antes de darse por cerrada (§7.9), y la línea *"dónde se muestra"* es la lista de
pantallas que hay que revisar. **Un flujo escrito de memoria es el próximo fósil**: si
falta el archivo, se pide — no se reconstruye.
