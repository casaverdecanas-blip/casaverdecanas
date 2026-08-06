# CASA VERDE CANAS — Documentación del sistema

**Edición del 31 de julio de 2026 · cierre de la tanda 11.23**

Los tres documentos del proyecto en un solo archivo, para subirlo de una vez al
conocimiento. Antes eran `CONVENCIONES.md`, `GUIA-SITIO-PUBLICO.md` y
`Master_briefing_vN.md`; su contenido no cambió, solo viven juntos.

---

## Por dónde empezar, según lo que haya que hacer

| Si vas a… | Andá a |
|---|---|
| **tocar un proceso** (limpiezas, cobros, avisos, recuerdos) | **Libro 1 · §10 · FLUJOS** — qué lo dispara, qué crea y sobre todo **qué NO hace** |
| escribir o corregir código | **Libro 1 · §3** — reglas de código · **§8** — trampas conocidas |
| entender una colección de datos | **Libro 1 · §4** — modelo de datos |
| tocar permisos | **Libro 1 · §5** — el criterio de las reglas de Firestore |
| entrar a Netlify | **Libro 1 · §2.1** — hay **dos cuentas** y solo una sirve |
| saber por qué algo está como está | **Libro 2** — el registro de tandas, de la más nueva a la más vieja |
| tocar el sitio público o el QR de recuerdos | **Libro 3** |

## Las tres partes

- **Libro 1 · CONVENCIONES** — el reglamento técnico. Lo que hay que respetar al escribir.
  Es el único que se lee entero alguna vez.
- **Libro 2 · MASTER BRIEFING** — qué se hizo y por qué, tanda por tanda. Se consulta, no
  se lee: la parte útil está arriba de todo, en el registro más reciente.
- **Libro 3 · GUÍA DEL SITIO PÚBLICO** — el sitio de la raíz, el dominio, el SEO y el
  circuito del QR de recuerdos.

> **Una advertencia sobre el tamaño.** El libro 2 son unas 3.000 líneas y la enorme
> mayoría es historia: registros de la v5.67 hacia atrás. Si algún día molesta, el
> corte natural es sacar esos registros viejos a un `HISTORIAL.md` fuera del
> conocimiento y dejar acá solo los últimos. **No se hizo por decisión propia**: la
> historia explica por qué el sistema es como es, y borrarla es cómo nacen los
> fósiles que esta documentación viene a evitar.

---
---

# LIBRO 1 · CONVENCIONES

---

### Reglamento técnico único · v2.21 (julio 2026, al cierre de la tanda 11.23)

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

**Hubo una tercera, `notify-recuerdo`, y se retiró en julio de 2026.** Estaba muerta
dos veces: le faltaban sus tres variables de entorno y, sobre todo, **la página que
tenía que llamarla nunca la llamó**. El aviso de recuerdo nuevo sale ahora desde la
página pública con `notify-whatsapp` + EmailJS, sin variables nuevas. La copia
desplegada es inerte y desaparece en el próximo despliegue.

**Las variables que quedan vivas** (agosto 2026): `GEMINI_API_KEY`, `CALLMEBOT_PHONE`
y `CALLMEBOT_APIKEY`. `CALLMEBOT_RECIPIENTS` se borró — el contacto de cada persona
viaja ahora en el pedido, desde `avisos_contacto`.

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
Los **cuatro controles**, sobre todo archivo tocado. Ninguno reemplaza a otro:

1. **`node --check`** sobre cada archivo JS y cada bloque `<script type="module">`.
2. **Cada `id` que busca el JS existe en el HTML.** Un `$('x')` sobre algo que no está
   devuelve `null`, y la línea siguiente mata el script entero — la página queda en
   "Cargando…" para siempre sin decir nada (§8).
3. **Nada usa una función de Firestore sin importarla.** `node --check` valida
   sintaxis, **no nombres**: un `getDoc` sin importar pasa el control y revienta recién
   cuando alguien abre esa pantalla. *Encontrado así en agosto de 2026 en
   `reservas.html`, donde llevaba meses fallando en silencio dentro de un `try` al
   abrir el modal de un pago.*
4. **Cada marca de `diagnostico.html` existe en su archivo**, o la herramienta que dice
   qué versión está subida miente.

Además: sin `gstatic` fuera de `firebase-init.js`, y el `<link>` de Material Icons
**antes** de `design-system.css` en el `<head>`.

> Y una advertencia sobre el método: **un reemplazo de texto que no encuentra su patrón
> no avisa**. Si se edita un archivo buscando y sustituyendo, hay que comprobar que la
> sustitución ocurrió — pasó dos veces en agosto de 2026, una dejando una página en
> blanco y otra dejando clases huérfanas.

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

Una lista anidada —proyecto → ítems → sub-ítems, acuerdo → cabañas— se dibuja con las
clases `.cv-nodo`, `.cv-nodo-fila`, `.cv-nodo-hijos`, `.cv-nodo-detalle`, `.cv-sem` y
`.cv-mini`, todas en `design-system.css`. No se vuelve a escribir por página.
La usan hoy **Actividades** (el árbol) y **Reservas** (las cabañas de un acuerdo).

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
- **`.cv-nodo-fila.estatico`** para una fila que se **ve** como nodo pero no se toca:
  no tiene hijos ni detalle propio, solo muestra y ofrece sus botones. Lo declara la
  clase, así nadie lo descubre tocándola y esperando que pase algo.

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
· **La reserva NO guarda plata.** El precio vive en `grupos/{id}`. Los campos `total`,
  `totalBRL` y `moneda` se borraron de todas las reservas el **3 de agosto de 2026**.
· **El respaldo que suma las partes sigue en `totalAcuerdo()`** y ya no se usa: hoy no
  queda ninguna reserva con precio propio. Se conserva para que una reserva importada
  o restaurada desde un backup viejo no muestre cero. **Si alguna vez se saca, hay que
  comprobar antes que `revisar-reservas.html` no reporte ningún `precioDe: RESPALDO`.**
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

### `actividades/{id}` — compras
· **`esCompra`** (bool) y **`proveedor`** (texto, opcional).
· **`detalle` ES LA LISTA.** Cuando `esCompra` está en `true`, cada salto de línea de
  `detalle` es un ítem. **No hay array de ítems**: el texto es el dato. Un formulario
  con un botón "agregar ítem" por cada cosa para comprar no lo llena nadie, y una lista
  que no se llena no sirve.
· **`comprados`** — array con el **TEXTO** de los ítems ya comprados. Por texto y no por
  posición: si alguien edita una línea, se destilda sola —cambió de cosa— y eso es
  predecible. Por índice, agregar una línea arriba habría corrido todas las marcas.
· **Se escribe con `arrayUnion`/`arrayRemove`**, nunca reescribiendo el array: dos
  personas tildando cosas distintas al mismo tiempo no se pisan.
· **Lo comprado lo ve todo el equipo** y vive en la actividad, no en `estado_usuario`:
  si Flor tilda la lavandina, Esteban no la compra de nuevo. Es lo contrario de la
  agenda, que es de cada uno.

### `config/compras` — los lugares
`proveedores: ['Ferretería del centro', 'Supermercado', …]`
· La lista que aparece al cargar una compra. Se edita **desde la propia vista de
  Compras**, que es donde se usa. Borrar un lugar no toca las compras que ya lo tenían.
· Vive en `config/`, que ya tiene permiso para el equipo activo — igual que las
  categorías de Dinero. **Cero cambios en las reglas.**
· El campo era **texto libre** hasta agosto de 2026, y por eso agrupar no servía:
  *"Ferretería"*, *"ferreteria"* y *"Ferretería del centro"* eran tres lugares distintos.

### `actividades/{id}` — campos de agenda
· **`hora`** (`'HH:MM'`, opcional) y **`duracionHoras`** (número, opcional). Las dos
  son opcionales a propósito: la enorme mayoría de las tareas de la casa no tienen
  hora, se hacen ese día. En la agenda, **lo que tiene hora va primero**.
· Una actividad **ocupa un tramo de días** cuando `fechaVencimiento > fechaInicio`:
  aparece en cada día del tramo. No hace falta ningún campo nuevo para eso.

### `estado_usuario/{uid}` — la agenda de cada uno
`agenda: { <actId>: { dia, franja, hora, nota } }`
· Que la clave **exista** significa *"está en mi agenda"*. Los cuatro campos son
  opcionales.
· **Lo agendado SIN FECHA propia flota en HOY.** No se le guarda ningún día: aparece
  hoy, y mañana también, hasta que pase una de cuatro cosas — se le da un día, se
  destilda, alguien la borra, o alguien la da por hecha. Es una bandeja de entrada.
  *Guardarle `dia: hoy` al agregarla la habría clavado en una fecha que nadie eligió, y
  en tres días figuraría "atrasada" sin que nadie la hubiera atrasado.*
· **Lo hecho desaparece de la semana**, lo haya cerrado quien lo haya cerrado. La marca
  en `agenda` se conserva: si la actividad es recurrente y vuelve, vuelve agendada.
  Las marcas de actividades ya terminadas o borradas quedan en el mapa sin hacer nada
  —son invisibles y pesan unos bytes—; **no se limpian solas a propósito**, porque
  distinguir "terminada para siempre" de "recurrente entre ciclos" con una heurística
  es cómo se borra lo que alguien quería conservar.
· **`dia`, `franja` ('manana'|'tarde') y `hora` son SOBRESCRITURAS personales**: mandan
  sobre la fecha y la hora de la actividad, **solo para esta persona**. Mover algo al
  jueves a la tarde no le cambia la fecha a nadie más.
· **`nota`** — una línea que escribe su dueño y **el equipo no ve**. Es para lo que no
  es parte de la tarea: *"traer la escalera"*, *"avisar a Flor antes"*. Si fuera parte
  de la tarea, iría en el `detalle` de la actividad.
· Vive acá y no en la actividad porque **es de la persona, no de la tarea**. La regla
  ya lo garantiza —solo su dueño lee y escribe— sin tocar nada.
· **Se escribe con `deleteField()` sobre la clave**, nunca reescribiendo el mapa
  entero: `merge: true` no borra claves ausentes (§4), y pisar el mapa borraría lo que
  se haya guardado desde otra pestaña.
· **Compatibilidad:** la primera versión guardaba un **array** de ids. Se convierte a
  mapa al leer, sin migración.
· **Las limpiezas están siempre y no se pueden sacar.** Tienen detrás la fecha de
  llegada de un huésped. Moverlas de día sí; sacarlas, no.

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

**Los dos caminos para cerrarla hacen lo mismo — y hubo que arreglarlo**
Una limpieza se cierra con **✓ Realizada** o con **⏹ Stop** del cronómetro. Las dos
exigen el control de inventario de entrada y las dos abren el control de salida.
Hasta agosto de 2026 **solo el primer camino lo hacía**: cerrar con el reloj salteaba
las dos condiciones y el `checkout-` no nacía nunca. La regla estaba escrita en un solo
lugar de los dos. Ahora vive en `abrirControlDeSalida()` y `faltaControlEntrada()`, y
la llaman ambos. *(Lo encontró la primera corrida de `pruebas.html`.)*

**Frenar el reloj no es terminar la tarea**
El Stop **siempre** pregunta si quedó terminada, sea recurrente o no. Antes esa
pregunta solo aparecía en las recurrentes y en el resto se daba por terminada sin
consultar: quien paraba un rato a mitad de una limpieza cerraba el ciclo sin querer.
Cancelar registra las horas y deja la tarea pendiente.

**Qué NO hace**
- **La salida NO genera limpieza.** El día del check-out solo puede aparecer el
  **control de inventario**, y solo si la limpieza de entrada ya se hizo.
- El control de salida **no es una limpieza y no lleva tarifa**.
- Anular una reserva borra su `limp-` **solo si nadie la hizo todavía**.
- El acuerdo no interviene: cada cabaña genera su limpieza y su control por separado,
  aunque se cobren juntas.

**Las limpiezas tienen prioridad estructural, no estética**
Una limpieza lleva detrás la fecha de llegada de un huésped y **no se puede correr un
día**. Por eso:
- en **Actividades**, `proj-limpiezas` va siempre primero entre los proyectos, y **sus
  hijos se ordenan por FECHA** — el orden general (por `orden`, después alfabético) las
  dejaba ordenadas por nombre de cabaña, así que la de dentro de una semana podía
  aparecer arriba de la de mañana;
- llevan **marca propia** antes del título —🧹 entrada, 📤 salida, 🛒 faltantes— para
  reconocerlas sin leer;
- en el **Inicio** tienen bloque propio, arriba de todo, desde que existen y con los
  días que faltan. *(Antes aparecían recién el día del check-in: su
  `fechaVencimiento` es ese día, así que el bloque de vencidas no las mostraba durante
  los siete días en que justamente se pueden organizar.)*

**Todo enlace lleva a SU actividad**, no a la lista: `actividades.html?a=<id>` despliega
la rama, abre el detalle y la trae a la vista. Vale para el Inicio y para el aviso de
cronómetro andando — ese era el último que caía en la lista, y el más urgente.

**Dónde se muestra** — `actividades.html` (la lista y el botón de terminar),
`index.html` (el bloque de limpiezas), `calendario.html` (entradas y salidas),
`reservas.html` (el botón 🧹 del admin), `reservas-core.js` (el motor).

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
(que enlaza a la reserva), `index.html` (que agrupa por acuerdo: un huésped con tres
cabañas es **una** llegada, no tres), `dinero.html` (el movimiento de cada pago).

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
- **El aviso no puede hacer fracasar el recuerdo.** Sale desde la página pública, sin
  `await` y después de guardar: WhatsApp por `notify-whatsapp` (que sin destinatario
  cae en el número del negocio) y correo por EmailJS con la clave pública. Si el aviso
  falla, el recuerdo igual queda esperando moderación.

**Dónde se muestra** — `recuerdos.html` de la raíz (el muro público y el formulario),
`recuerdos.html` del panel (moderación, claves y huéspedes), `firestore.rules`
(la validación real).

---

### La huella de una reserva

Borrar una reserva **no es borrar un documento**: deja rastro en siete lados, y
olvidarse de uno deja basura que después nadie sabe de dónde salió.

| | Se borra |
|---|---|
| `grupos/{id}` | **solo si queda huérfano** — si otra reserva comparte el acuerdo, se conserva |
| `pagos` | todos los de esa reserva |
| `movimientos` | los que generaron esos pagos · **nunca uno sellado en un cierre** |
| `disponibilidad/{reservaId}` | o el sitio público muestra ocupado algo libre |
| `actividades` | `limp-`, `checkout-`, `falta-` y todo lo que cuelgue de ellas |
| `chequeos` | los de inventario · **solo el administrador puede borrarlos** (`allow delete: if esAdmin()`), así que un colaborador los deja huérfanos |
| `reservas/{id}` | al final |

El orden importa: **primero lo que cuelga**, después lo que lo sostiene. Si algo falla a
mitad de camino, lo que queda es un huérfano visible y no una referencia rota.

Vive en `huellaDe()` y `borrarHuellas()` de `migrar-reservas.html`, y lo usan las dos
secciones que borran. La sección **`1e · Huérfanos`** barre lo que quedó de borrados
anteriores: actividades y chequeos que apuntan a una reserva inexistente, y acuerdos
que ninguna reserva usa. **Nadie los ve nunca** —no aparecen en ninguna pantalla— y sin
esa sección no habría forma de saber que están. *(Hasta agosto de 2026 la depuración borraba solo cuatro de los
siete: el acuerdo, las actividades y los chequeos quedaban dando vueltas.)*

### Cómo se prueba un flujo

`interno/pruebas.html` acompaña un flujo entero paso a paso mientras se hace **en las
pantallas de verdad, en otra pestaña**. Entre paso y paso saca una foto de las
colecciones y compara: qué apareció, qué cambió, qué se borró.

**No automatiza nada, y es deliberado.** Una prueba que escribe los documentos por su
cuenta no prueba el sistema: prueba la prueba. Cada paso lleva su expectativa sacada
del código real —`limp-<reservaId>` viene de `RCore.sincronizarLimpiezas`,
`checkout-<id>` de `actividades.html`— y si no se cumple lo dice y sigue: saber qué
más falla después es parte del diagnóstico.

Al terminar sabe **exactamente qué documentos creó** y los puede borrar sin tocar nada
que ya estuviera. Lo que no logra borrar queda en la lista, con el motivo: una lista
vacía cuando quedó basura sería peor que no haber probado.

**Un flujo nuevo se agrega al array `PRUEBAS`**, con sus pasos y sus expectativas. Hoy
está el F1 (ciclo de limpieza).

### Las cuatro herramientas de diagnóstico

Viven en `interno/`, **fuera del service worker**, y se entra por dirección directa —
así se pueden abrir cuando el resto está roto. Las cuatro llevan arriba la misma barra
para saltar entre ellas:

| | Para qué |
|---|---|
| `diagnostico.html` | navegador, archivos en el servidor, sesión, permisos, conexión con Google |
| `revisar-reservas.html` | foto del estado de acuerdos, reservas y pagos · **solo lee** |
| `migrar-reservas.html` | agrupar, limpiar notas, limpiar plata vieja, **borrar datos de prueba**, depurar · **escribe y borra** |
| `pruebas.html` | probar un flujo de punta a punta, guiado |

Ninguna se declara en el `SHELL` de `sw.js`: son temporales por naturaleza y no tienen
que sobrevivir a una caché vieja.

### Flujos que faltan escribir

Ninguno: los nueve procesos del sistema están escritos.

Lo que falta es **mantenerlos**. Cada tanda que toque un proceso actualiza su flujo
antes de darse por cerrada (§7.9), y la línea *"dónde se muestra"* es la lista de
pantallas que hay que revisar. **Un flujo escrito de memoria es el próximo fósil**: si
falta el archivo, se pide — no se reconstruye.


---
---

# LIBRO 2 · MASTER BRIEFING

> El registro de tandas, de la más reciente a la más vieja. **Lo que importa está
> arriba**: el resto es historia consultable.

---

# v5.68 — Avisos, el acuerdo, y una noche de fósiles (T11.18 a T11.23)

> **Registro v5.68 (Tandas 11.18 y 11.19 — 30 y 31 de julio de 2026):**
>
> **T11.18 · Avisos instantáneos.** El canal de coordinación pasa a avisar sin abrir
> la aplicación. `nucleo.js` suma `CV2.avisar()`, `CV2.enviarWhatsApp()`,
> `CV2.enviarMail()` y `CV2.EVENTOS`. Nace **`avisos.html`** ("Mis avisos"), la
> primera pantalla del 2.0 donde una persona configura algo suyo. Reglas: `notif` en
> el `hasOnly` de `/usuarios/`, bloque nuevo `/avisos_contacto/`. `sw.js` → v59.
> **Se dejó afuera a propósito el resumen diario del sistema viejo:** no corría en
> ningún servidor sino en el navegador del primero que abría la app cada día.
>
> **T11.19 · El acuerdo.** Una estadía puede ocupar varias cabañas y cobrarse junta.
> Nace **`grupos/{id}`**: un precio negociado una vez sobre el conjunto. Las reservas
> pierden `total`, `totalBRL` y `moneda`; guardan solo la ocupación física. El
> acuerdo es **invisible con una sola cabaña**: el formulario y la tarjeta se ven
> igual que siempre. Archivos: `reservas.html`, `reservas-core.js`, `calendario.html`,
> `firestore.rules`, `sw.js` → v60. Herramientas temporales: `revisar-reservas.html`,
> `migrar-reservas.html`, **`diagnostico.html`**.
>
> **Tres fósiles encontrados el mismo día**, todos supervivientes del rediseño de la
> tanda 11.1: un chip `🧹 limpieza` inventado en el calendario, una llamada a
> `enBRL()` sin definición que rompía la página entera de reservas al primer pago en
> otra moneda, y un manual que decía lo contrario del código. Ninguno era un error de
> programación: los tres eran el mismo error de documentación. De ahí nace
> **`CONVENCIONES` §10 · FLUJOS**, y la regla §7.9.
>
> **Documentación:** `CONVENCIONES.md` → **v2.20** (§2.1 el mapa de Netlify, §3.17 a
> §3.20, esquemas de `grupos` y `avisos_contacto`, cuatro trampas nuevas, y §10
> FLUJOS con F1 limpieza, F2 acuerdo y F3 avisos). `GUIA-SITIO-PUBLICO.md` → **v1.4**
> (§5.5b: el aviso de recuerdo nuevo no está llegando).
>
> **Lo que costó la noche, para no repetirlo:** dos cuentas de Netlify sin documentar,
> "Auto Publishing Locked" sirviendo funciones viejas mientras el registro decía que
> todo estaba bien, archivos subidos a una rama en vez de a `main`, y "Reparar la app"
> dejando Firebase Auth trancado. Todo está escrito en `CONVENCIONES` §2.1 y §8.
>
> **T11.20 · Cierre de los pendientes de la noche.** `comunicacion.html` dispara el
> aviso al escribir y al abrir un tema —con esto el canal por fin avisa sin tener la
> app abierta—. `actividades.html` rediseñado sobre **`.cv-nodo`**, que sube a
> `design-system.css`: un solo gesto por zona (tocar abre hijos, ⋯ abre detalle), los
> chips bajan al detalle y la sangría pasa de 26 a 24px con la línea del color del
> proyecto. `sw.js` → v62. `CONVENCIONES` §3.16b y §10 · F4 (disponibilidad pública) y
> F5 (Airbnb, **marcado sin verificar**).
>
> **T11.21 · §10 completa.** Los nueve flujos del sistema escritos, cada uno con su
> archivo delante: F6 actividades y ciclos, F7 de las horas al cobro, F8 dinero hasta
> el balance, F9 el recuerdo del huésped. Con índice. A partir de acá la sección ya no
> crece: **se mantiene** — cada tanda que toque un proceso actualiza su flujo antes de
> cerrarse (§7.9), y la línea "dónde se muestra" es la lista de pantallas a revisar.
>
> **Y tres referencias muertas encontradas al escribirlos**, que es exactamente para
> lo que sirve leer un proceso entero: §3.16 mandaba el código compartido a `utils.js`
> —el núcleo del **1.0**, que ya no existe: seguir esa instrucción era escribir en un
> archivo muerto—; §4 nombraba `migracion-fotos.html` en presente, una herramienta ya
> retirada; y §3.13 listaba `cabana.html` entre las páginas del sitio público.
> Corregidas las tres.
>
> **T11.22 · Un solo lenguaje visual.** Las cabañas de un acuerdo adoptan `.cv-nodo`:
> Actividades y Reservas dibujan sus listas anidadas con las mismas clases. Nace el
> modificador **`.estatico`** para una fila que se ve como nodo pero no se toca — lo
> declara la clase en vez de que se descubra tocándola. `sw.js` → v63,
> sello `reservas-acuerdos-2`.
>
> **T11.23 · El balance sella de verdad, y los recuerdos avisan.**
> `movSellado()` en `firestore.rules` pasa a mirar **`cierreId` en la raíz** además de
> dentro de `pendiente`: hasta ahora un movimiento ya contado en un cierre cerrado se
> podía borrar y descuadrar un balance que ya es historia. Lo destapó escribir el
> flujo F8 — leer un proceso entero sirve para esto. Efecto colateral atendido: borrar
> un pago cuyo ingreso ya está balanceado ahora falla, y `reservas.html` lo **dice**
> en vez de fallar en silencio.
>
> **`notify-recuerdo` retirada.** Estaba muerta dos veces: le faltaban tres variables
> de entorno y **la página pública nunca la llamó**. El aviso sale ahora desde
> `recuerdos.html` de la raíz con lo que ya existe y está probado —`notify-whatsapp`
> sin destinatario, y EmailJS con la clave pública—: cero variables nuevas, cero
> despliegues, una función menos que mantener. `GUIA-SITIO-PUBLICO` §5.5b reescrita.
>
> **T11.24 · Un solo archivo y el manual al día.** Los tres documentos pasan a vivir
> juntos en `CASAVERDE-DOCUMENTACION.md` (libros 1, 2 y 3): se sube uno en vez de tres.
> `manual.html` actualizado — capítulo nuevo de **Mis avisos**, los **acuerdos** de
> varias cabañas, el gesto nuevo de **Actividades**, y **corregida una contradicción
> vieja**: decía que el saldo de una reserva *"siempre cierra en R$"*, que es lo
> contrario de lo que hace el sistema desde la tanda 11.1. `sw.js` → v64.
> `firestore.rules` con la cabecera en orden cronológico.
>
> **T11.25 · Migración hecha.** Los dos acuerdos con su precio real cargado (2000 y
> 1200) y **las cinco reservas limpias**: ya no guardan `total`, `totalBRL` ni
> `moneda`. El modelo de acuerdos queda completo.
>
> **Y la propia herramienta de revisión era un fósil.** Después de migrar reportó
> siete "problemas" que no lo eran —*"no tiene campo moneda"*, *"su parte del total es
> cero"*— porque seguía validando contra el modelo anterior. Corregida: ahora se queja
> al revés, si una reserva **todavía** guarda esos campos, y compara los pagos contra
> la moneda del **acuerdo**. Se le sumó `precioDe` al volcado, que dice si el total
> salió del acuerdo o del respaldo — sin eso, leyendo el JSON no se podía distinguir.
>
> **T11.26 · Limpieza final.** `CALLMEBOT_RECIPIENTS` borrada de Netlify y
> `notify-recuerdo.js` fuera del repositorio. Quedan **dos** funciones —`claude-proxy`
> y `notify-whatsapp`— y tres variables. `netlify.toml` reescrito: se le sacaron dos
> redirecciones de `/interno` que apuntaban a un archivo inexistente desde que el
> panel se mudó a GitHub Pages.
>
> **Se detectó que el repositorio nuevo estaba incompleto**: `netlify/functions/` tenía
> solo `notify-whatsapp.js`. Faltaban `claude-proxy.js` —la que lee las facturas, que
> está corriendo en producción— y `netlify.toml`. El sistema andaba, pero sin código
> fuente de dónde recuperarlo. Repuestos.
>
> **Nada de esto necesita desplegar en Netlify**: lo que corre allá ya es correcto.
> Es poner el repositorio a la par de la realidad.
>
> **T11.27 · El Inicio entiende los acuerdos.** Un huésped que toma tres cabañas
> aparecía **tres veces** —"Llega hoy: Alejandro" repetido— y la novedad de verdad
> quedaba enterrada entre repeticiones. Ahora es una línea por acuerdo, que además
> dice cuántas cabañas. Y cada línea **enlaza directo a su reserva** (`?r=`), igual
> que desde el calendario, en vez de caer en la lista. `sw.js` → v65.
> *(Revisado también que el Inicio no leyera el precio de las reservas: no lo hace,
> así que no arrastraba ningún fósil de la migración.)*
>
> **T11.28 · Banco de pruebas guiadas.** Nace `interno/pruebas.html`: acompaña un flujo
> paso a paso mientras se hace en las pantallas de verdad, saca una foto de las
> colecciones entre paso y paso y dice si pasó lo que tenía que pasar. Primer flujo
> cargado: **F1, el ciclo de limpieza** —seis pasos, de crear la reserva hasta anularla,
> con las expectativas sacadas del código real—. Al terminar borra exactamente lo que
> creó. Las cuatro herramientas de diagnóstico quedan unificadas con una barra común.
>
> *(Escribiendo las expectativas apareció un paso que casi se saltea: la limpieza de
> entrada **no se puede dar por terminada sin el control de inventario hecho**. El
> sistema lo impide a propósito y la prueba lo comprueba.)*
>
> **T11.29 · La primera corrida encontró un bug de verdad.** Los pasos 1 y 2 pasaron;
> el 3 y el 4 fallaron, y por una razón real:
>
> · **El Stop del cronómetro solo preguntaba «¿quedó terminada?» en las actividades
>   recurrentes.** En el resto —una limpieza incluida— cerraba el ciclo sin consultar.
>   Frenar el reloj es *"dejé de trabajar"*; que la tarea esté lista es otra pregunta y
>   no siempre coinciden. Ahora se pregunta siempre. *(Lo planteó el administrador.)*
> · **Cerrar una limpieza con ⏹ y con ✓ hacían cosas distintas.** Solo el botón ✓
>   exigía el control de inventario de entrada y hacía nacer el `checkout-`. Con el
>   cronómetro, **el control de salida no aparecía nunca** — en el flujo más trabajado
>   del sistema. La misma regla escrita en un lugar de dos; ahora en uno solo, llamado
>   por ambos. `sw.js` → v66.
>
> **T11.30 · Las limpiezas primero, y de un vistazo.** Dentro de `proj-limpiezas` los
> hijos se ordenan **por fecha** —antes quedaban alfabéticos por cabaña, así que la
> limpieza de dentro de una semana podía aparecer arriba de la de mañana— y llevan
> marca propia antes del título: 🧹 entrada, 📤 salida, 🛒 faltantes. El aviso de
> **cronómetro andando** en el Inicio era el último enlace que caía en la lista en vez
> de abrir su actividad, y justo el más urgente: es el único lugar donde se puede
> frenar. `sw.js` → v67.
>
> **T11.31 · Borrar de verdad.** La depuración borraba **cuatro de los siete lugares**
> donde una reserva deja rastro: el acuerdo, las actividades de limpieza y los chequeos
> se quedaban sin nada que los explicara. Ahora hay una sola función —`huellaDe()` y
> `borrarHuellas()`— que la levanta completa, en orden de hija a madre, y que el
> acuerdo lo borra **solo si queda huérfano**.
>
> **Y una sección nueva, `1d · Datos de prueba`**: la reserva que dejan las pruebas
> guiadas está confirmada y con fechas futuras, así que la sección 2 no la alcanzaba
> —pide anulada o finalizada y ya pasada— y había que anularla a mano y esperar tres
> días. Ahora se borran por el nombre del cliente, con toda su huella.
>
> *(De paso: la revisión mostraba «parte R$ 0,00» en cada cabaña. Un cero inventado y
> en la moneda equivocada, porque sin campo `moneda` se asume reales. Otro resto de la
> migración.)*
>
> **T11.32 · Un registro que se borraba solo.** La depuración avisó *"terminó con
> errores"* y no había manera de saber cuáles: el recuadro del registro vive dentro del
> contenedor que `render()` reescribe entero, y **cada acción borraba su propio
> registro** justo después de escribirlo —todas terminan con `cargar(); render()`—.
> Ahora el registro vive en una variable, fuera del DOM.
>
> **El error escondido era un permiso:** borrar un chequeo de inventario es solo del
> administrador, y un colaborador con todos los permisos igual no puede. Ahora se
> avisa **antes** de borrar, en la propia fila, y no cuenta como falla: es una regla.
>
> **Sección `1e · Huérfanos`** para barrer lo que quedó de borrados anteriores.
>
> **T11.33 · Un modal sin salida.** Los diálogos de **control de inventario** y de
> **historial** de `actividades.html` heredaban el `padding: 0` del estilo base —que
> está pensado para los diálogos que traen su propia estructura `.m-head/.m-body/.m-pie`—
> y no tenían **ningún desplazamiento**. Con un inventario largo, el botón de confirmar
> quedaba fuera de la pantalla y **no había forma de llegar**: no era estético, era una
> pantalla sin salida. Ahora el diálogo entero se desplaza y respeta la franja de
> gestos. `sw.js` → v68.
>
> *(Revisadas las demás páginas con diálogos —reservas, dinero, honorarios,
> gestión de sesiones—: todas traen su propio relleno y desplazamiento. El problema
> era solo de estas dos.)*
>
> **T11.34 · El ciclo de limpieza, verificado.** La prueba guiada corrió entera:
> se creó la reserva con su acuerdo, su `limp-` y su disponibilidad; el control de
> entrada marcó `controlEntradaHecho`; cerrar la limpieza hizo nacer el `checkout-`
> —lo que fallaba antes—; el control de salida generó `falta-`; y anular borró la
> disponibilidad conservando la limpieza hecha. **El flujo F1 pasó de punta a punta.**
>
> *(Un paso dio «falló» y era una falsa alarma de la herramienta: el chequeo es UNO
> por reserva —`chequeo-<reservaId>` con `entrada` y `salida` adentro— y el control de
> salida lo ACTUALIZA en vez de crear otro. Corregida la expectativa, y sumados esos
> dos campos a los que el diff observa: sin ellos el cambio era invisible.)*
>
> **T11.35 · Nace la Agenda** (`interno/agenda.html`). Actividades muestra el árbol
> —correcto para organizar, equivocado para arrancar el día: hay que abrir cada rama
> para descubrir qué toca—. La Agenda toma las mismas actividades y las ordena por su
> fecha real, en tramos por cercanía: vencidas · hoy · mañana · próximos 7 días · más
> adelante · sin fecha. Tres filtros: **las mías** (creadas, asignadas, **y todas las
> limpiezas** — una limpieza no se le asigna a nadie y la tiene que ver quien la haga),
> todo lo que veo, y solo limpiezas.
>
> **Calendario pasa a llamarse «Ocupación» en la barra.** Se parecen en la forma y no
> tienen nada que ver: el Calendario muestra la ocupación de las cabañas y sale de las
> reservas; la Agenda muestra el trabajo y sale de las actividades. Dos cosas con el
> mismo nombre no se distinguen. `sw.js` → v69, `CV2.VERSION` → `nucleo-agenda-5`.
>
> **A revisar en el teléfono:** la barra de abajo queda con **cinco pestañas + Más**,
> una más de las cuatro que fija §6.0. Si resulta apretada, mover `calendario` al
> grupo `alojamiento` de `CV2.NAV` es una línea.
>
> **T11.36 · La Agenda pasa a ser semanal.** Reescrita: lunes a domingo, cada día con
> sus actividades **ordenadas por hora**, navegación entre semanas y vuelta a la
> actual. Cuatro cambios de fondo:
>
> · **Las actividades aceptan `hora` y `duracionHoras`**, las dos opcionales — la
>   mayoría de las tareas de la casa no tienen hora. Sin hora, van al final del día.
> · **Una actividad puede ocupar varios días**: si su vencimiento es posterior a su
>   inicio, aparece en cada día del tramo con una etiqueta *día 2/5*. No hizo falta
>   ningún campo nuevo.
> · **Cada uno elige qué ve**: botón 📅 en el detalle de cualquier actividad, guardado
>   en `estado_usuario/{uid}.agenda`. Es de la persona, no de la tarea. Las limpiezas
>   aparecen siempre, sin que nadie las agende.
> · **Tocar abre la EDICIÓN**, no el detalle (`?a=<id>&editar=1`): desde la agenda lo
>   que se quiere hacer casi siempre es mover la fecha o la hora.
>
> Las **vencidas** van arriba de todo y fuera de la semana: en su día real
> desaparecerían al pasar de semana, y son las que no hay que perder de vista.
> `sw.js` → v70, `CV2.VERSION` → `nucleo-agenda-6`.
>
> **T11.37 · La agenda se arma arrastrando.** Rediseño completo:
>
> · **Mañana y tarde en cada día.** Se cambia de franja con un gesto. Sin hora se cae
>   en la mañana; desde las 13:00, en la tarde — salvo que la persona diga otra cosa.
> · **Las tres pestañas quedan fijas arriba del menú** (`.cv-pegado-abajo`) y son
>   filtro **y destino**: soltar en *En mi agenda* la suma, soltar en las otras la saca.
>   Mientras se arrastra cambian de aspecto para decir qué hace cada una.
> · **Arrastre a mano con eventos de puntero**: la API del navegador no existe en el
>   teléfono. Con **agarre propio** de 44px y no con pulsación larga, para que tocar la
>   pastilla siga abriendo la actividad — dos gestos en la misma zona es lo que se
>   arregló en Actividades (§3.16b). Con desplazamiento automático cerca de los bordes:
>   una semana no entra en una pantalla y sin eso no se puede soltar en el viernes.
> · **Cada pastilla tiene su ajuste propio**, pegado debajo: día, hora, franja y **una
>   nota personal que el equipo no ve**. Nada de eso toca la actividad.
>
> Una decisión que puede discutirse: **soltar en una franja no inventa una hora.** Solo
> dice en qué mitad del día va. Poner "13:00" porque alguien soltó en la tarde sería
> escribir un dato que nadie puso. `sw.js` → v71, `CV2.VERSION` → `nucleo-agenda-7`.
>
> **T11.38 · La agenda se arma desde la agenda.** El botón 📅 de `actividades.html`
> **agregaba a la agenda una actividad sin fecha y quedaba invisible**: se guardaba y no
> aparecía en ninguna semana, porque nada sabía en qué día ponerla. Se retiró.
>
> Ahora la agenda tiene **dos vistas**, que son también los dos destinos del arrastre:
> **Mi semana** y **Actividades** —el árbol entero, en cascada y ya desplegado, sin
> nada que abrir: es un depósito y esconder ramas obligaría a buscar—. Se arrastra de
> una a la otra para sumar y para sacar, y **el lugar se elige al ponerla**, que es
> cuando se sabe. Una actividad sin fecha propia cae en el día que se está mirando.
> Las que ya están en la semana se ven en verde. `sw.js` → v72.
>
> **T11.39 · Casillas en vez de arrastre, y lo sin fecha flota en hoy.** Agregar a la
> agenda pasa a ser una **casilla** en la vista de Actividades: agregar es una decisión
> de sí o no y una casilla la dice en un toque, mientras que arrastrar desde una lista
> larga hasta una pestaña de abajo obliga a cruzar media pantalla con el dedo apretado.
> El arrastre se queda donde sirve: **mover algo dentro de la semana**.
>
> Y lo agendado **sin fecha propia no recibe un día: flota en hoy** hasta que se le dé
> uno, se destilde, se borre o alguien la dé por hecha.
>
> **T11.40 · Revisión de punta a punta.** Se pasaron por cuatro controles los quince
> archivos vivos: sintaxis (`node --check`), que **cada `id` que busca el JS exista en
> el HTML**, que **nada use una función de Firestore sin importarla**, y que cada marca
> del diagnóstico exista de verdad en su archivo. Más el `SHELL` contra la navegación.
>
> **Apareció un error real: `reservas.html` usaba `getDoc` sin importarlo.** Se ejecuta
> al abrir el modal de un pago, para traer las cuentas de `config/dinero`: reventaba
> ahí, en silencio, dentro de un `try`. Estaba desde antes de esta serie de tandas y no
> lo habría encontrado ninguna prueba manual — solo mirar los imports contra los usos.
> **Ese control queda como parte del cierre de tanda** (§3.8). `sw.js` → v73.
>
> **T11.41 · Las compras pasan a servir para algo.** Diagnóstico previo, dicho sin
> vueltas: **no funcionaban**. `esCompra` pintaba un chip y nada más; `proveedor` era
> texto libre que ningún código leía. Dos campos huérfanos de la misma familia que
> `enBRL` y el chip de limpieza del calendario: puestos pensando en algo que después no
> se construyó.
>
> **El objetivo NO es control económico** (decisión del administrador): es una lista
> práctica. *"Voy a la ferretería — ¿qué había que comprar ahí?"*, incluido lo que anotó
> otro y yo no sabía. El gasto lo registra cada uno en Dinero como le sirva, y no es
> asunto de esta lista.
>
> · **La descripción ES la lista**: una cosa por línea, sin formulario de ítems.
> · **Los ítems se tildan** desde el detalle o desde la vista de Compras, y es lo mismo
>   — el dato vive en la actividad y lo ve todo el equipo.
> · **Filtro `🛒 Compras`** en Actividades: junta los ítems de **todas** las
>   actividades-compra, separados por lugar, con los lugares definidos primero y "sin
>   definir" al final. Cada grupo muestra **la ruta entera** —📁 proyecto › ítem › …
>   › lista— y lleva hasta la actividad. La ruta completa y no solo el nombre: *"pincel"*
>   puede ser de la pintura de la fachada o del arreglo de una puerta, y saber cuál
>   cambia qué pincel se compra. `rutaDe()` lleva un tope de 12 niveles: un `parentId`
>   que apunte en círculo colgaría la pantalla, y el árbol se edita a mano desde varias.
> · **Los lugares se editan ahí mismo** y pasan de texto libre a lista elegible; se
>   puede agregar uno desde el propio formulario de la actividad, porque si hay que
>   salir a otra pantalla para terminar de cargar una compra, la compra no se carga.
>
> `sw.js` → v74.
>
> **T11.42 · La prueba guiada pasó 6/6 — y destapó otra falta.** El ciclo de limpieza
> funciona de punta a punta. Pero la corrida dejó a la vista algo que ninguna
> comprobación automática podía marcar: **la limpieza no decía nada de su reserva.**
> Quien la va a hacer no sabía cuántas personas entran, a qué hora, ni qué pidieron —
> había que ir a buscarlo a Reservas.
>
> · **El detalle de una actividad pasa a ventana emergente.** Con los chips, el resumen,
>   la lista de compra y hasta trece botones, desplegado dentro de la fila empujaba
>   media pantalla hacia abajo y en un árbol profundo uno perdía de vista dónde estaba.
>   Y no había lugar para los datos de la reserva. Como `<dialog>`, el botón Atrás de
>   Android la cierra sin salir de la app (`CV2.dialogosConAtras()` ya lo adopta).
> · **Una actividad con `reservaId` muestra su reserva**: huésped, estado, entrada y
>   salida con hora, personas, las otras cabañas del acuerdo si las hay, y las notas.
>   Se carga **a pedido** al abrir el detalle: traerlo con el árbol serían cinco
>   lecturas más en cada arranque para algo que se mira de a uno.
> · **La ruta del proyecto va arriba**: en un modal, sin el árbol a la vista, es lo
>   único que ubica.
>
> Dos huecos encontrados y tapados en el camino: tildar un ítem de compra **dentro del
> modal** no guardaba nada —el oyente estaba solo en el árbol—, y el modal no se
> refrescaba cuando otro tildaba algo. `sw.js` → v76.
>
> **Sigue sin verificarse:** la sincronización con Airbnb.

---

# v5.67 — La documentación entra al repositorio (T11.17)

> **Registro v5.67 (Tanda 11.17 — `interno/CONVENCIONES.md` → v2.19 ·
> `interno/GUIA-SITIO-PUBLICO.md` → v1.3 · `interno/Master_briefing_v5_67.md` [este] ·
> borrado de huérfanos en `interno/`):**
>
> ## La decisión
>
> **Los tres `.md` pasan a vivir en el repositorio, en `interno/`** (decisión del
> administrador). Hasta hoy existían solo en el conocimiento de las conversaciones: un
> documento que vive ahí se pierde con la conversación, no se puede abrir desde el
> teléfono y —sobre todo— **no se puede verificar**. La v5.66 registró
> `CONVENCIONES.md → v2.19` como entregada y el archivo nunca existió; con los documentos
> en el repositorio, ese registro se comprueba abriendo una dirección.
>
> **Hay UN solo briefing en el repositorio.** Al subir el v5.67 se borra el v5.66. Dos
> briefings casi iguales conviviendo garantizan que alguien lea el viejo: pasó en esta
> misma serie de conversaciones.
>
> **La contrapartida, dicha sin adornos**: Pages sirve los `.md` en texto plano a
> cualquiera que sepa la dirección. No hay claves de terceros —verificado en la
> auditoría—, pero **este briefing contiene mails y `uid` del equipo**, y quedan
> publicados. No es un agujero de seguridad (las reglas las aplica el servidor, no el
> secreto), es un dato personal expuesto. **Decisión pendiente**: depurarlos o aceptarlo.
>
> ## CONVENCIONES v2.19 — lo que cambió
>
> · **§2 tenía tres datos falsos**, arrastrados desde la Fase 0 y desmentidos por la
>   auditoría de la 11.16:
>   1. *"Deploy: GitHub Actions → `.github/workflows/deploy-pages.yml`"* — **no existe**.
>      Pages publica directo desde la raíz de `main`. Lo que se sube queda en vivo.
>   2. *"`/index.html` → redirige a `./interno/login.html`"* — hace tandas que el
>      `index.html` de la raíz **es el sitio público**.
>   3. *"Dominio propio: corte en Fase 6"* — el dominio está **en vivo**.
>   Se suman a la estructura `.nojekyll`, `CNAME`, `404.html`, `sitemap.xml`, `README.md`,
>   `textos-sitio.js`, el preset `preset-recuerdos` y la propia documentación.
> · **§3 reordenada**: los bloques 3.15 y 3.16 estaban intercalados entre el 3.9 y el
>   3.10, así que la sección se leía 3.9 → 3.15 → 3.16 → 3.10. Se movieron a su lugar.
>   **Ningún número cambió**: el briefing y el manual citan estos números, y renumerar
>   habría roto todas las referencias para ganar prolijidad. La confusión estaba en el
>   orden, no en los números.
> · **§7 puntos 7 y 8 nuevos** — la documentación se sube en la misma tanda que el código
>   que describe, un solo briefing en el repositorio, y **no se registra como entregado
>   nada que no se haya entregado en la misma tanda**. Con su corolario: al leer un
>   registro viejo, lo que dice "listo" no está probado que lo esté.
> · **§7.9 nueva — renombrar, mover o retirar una página pública**: su dirección vieja va
>   al mapa de `404.html`; si estaba en el `SHELL` de `sw.js` se saca del `SHELL` y se
>   sube la `VERSION` **en la misma tanda**; y un archivo que no referencia nadie se
>   borra, no queda "por si acaso".
> · **§8 y §9** — el respaldo que esconde el defecto que tapa (el `onerror` de las
>   imágenes), lo que solo funciona con la sesión de quien lo escribió, las medidas
>   declaradas a ojo, y el archivo borrado que sigue en el `SHELL`.
>
> ## GUÍA DEL SITIO PÚBLICO v1.3
>
> · El encabezado decía v1.2 y el cuerpo decía *"En la v1.1 no quedan huecos"*: se subió
>   el número y no se actualizó el texto. Corregido y desligado de la versión.
> · Se documenta dónde vive el archivo y que **es público**.
> · §12 punto 10: los huérfanos quedan marcados con su borrado pendiente y con la
>   aclaración de que no están en el `SHELL`.
> · §12 punto 13 nuevo: la documentación publicada, con los mails y `uid` del equipo.
>
> ## Limpieza de `interno/` — lo confirmado y lo que hay que confirmar
>
> **Se borran ahora (verificado en la auditoría de la 11.16: no los referencia nada, no
> están en el `SHELL`):**
> · `interno/ilutracion-hero.jpg` — el nombre mal escrito, sin la "s".
> · `interno/icono-alternativo-512.png`
>
> **Candidatas, a confirmar contra el `SHELL` de `sw.js` antes de tocarlas** — son las
> herramientas de una sola vez (§7.7), que por convención están fuera del menú y fuera
> del `SHELL`, pero eso hay que **verificarlo archivo por archivo**, no suponerlo:
> `traer-historial.html` · `cargar-datos.html` · `importar-viejo.html` ·
> `diagnostico-sesiones.html` · `diagnostico-actividades.html` ·
> `reparar-actividades.html` · `limpiar-ramas.html` · `dashboard.html`.
> · **`verificar-migracion.html` sale ÚLTIMA**, y solo después del veredicto verde: es el
>   verificador, y §7.7 dice que una migración no se da por cerrada sin correrlo.
> · **`migracion-fotos.html` NO se borra sin más: entró al `SHELL` en la v5.48.** Si sale,
>   sale del `SHELL` y con `VERSION` nueva, en la misma tanda (§7.9). Borrarla sola deja a
>   **todo el equipo con la copia vieja de la aplicación**, porque `addAll` es todo o nada
>   y el service worker nuevo no se activa nunca — sin un solo error a la vista.
>
> ## Acción
>
> 1. Subir a `interno/`: `CONVENCIONES.md` (v2.19), `GUIA-SITIO-PUBLICO.md` (v1.3) y
>    `Master_briefing_v5_67.md`.
> 2. **Borrar `interno/Master_briefing_v5_66.md`** si se subió, y sacar el v5.65 y el
>    v5.66 del conocimiento del proyecto: un solo briefing.
> 3. Borrar `interno/ilutracion-hero.jpg` e `interno/icono-alternativo-512.png`.
> 4. **Sin cambios de código, sin cambios de reglas, sin tocar `sw.js`.** Los `.md` no van
>    al `SHELL`: no son parte de la aplicación y no tienen que estar disponibles sin red.
> 5. Para cerrar la limpieza: pasar el `SHELL` de `sw.js` y se resuelve la lista de
>    candidatas con el `sw.js` corregido en la misma entrega.
>
> ## Pendientes abiertos (heredados, sin cambios en esta tanda)
>
> 1. **Avisos**: no hay notificación push ni WhatsApp. Registrado desde la Fase 1. Es lo
>    único que le falta al canal de coordinación para funcionar sin abrir la app.
> 2. **El asistente de Balance sigue siendo solo en R$** (T11.2): no cerrar un balance si
>    hay movimientos en dólares.
> 3. **El muro de recuerdos, solo en español** (§12.8 de la guía): tanda propia.

# v5.66 — Auditoría del sitio público y la Guía que nunca existió (T11.16)

> **Registro v5.66 (Tanda 11.16 — index.html [RAÍZ] · recuerdos.html [RAÍZ] ·
> textos-sitio.js · GUIA-SITIO-PUBLICO.md v1.2 [NUEVO, DE VERDAD] ·
> CONVENCIONES.md → v2.19):**
>
> ## Primero, una corrección del propio briefing
>
> **La v5.44 (T11.7) registró `GUIA-SITIO-PUBLICO.md` como creada, con descripción y
> todo. Nunca existió.** Es el mismo patrón que el punto rojo del chat, el preset de
> recuerdos y el ícono de Material en las páginas: cosas anotadas como hechas que no
> estaban. **Al leer el briefing viejo, no dar por hecho lo que dice "listo"** — y de
> ahora en más, no registrar como entregado nada que no se haya entregado en la misma
> tanda.
>
> ## Cómo se armó la guía
>
> Juntando los aportes de tres conversaciones anteriores (identidad visual · muro de
> recuerdos y dominio · portada y textos) más un informe del agente con acceso al
> repositorio, más la lectura directa de los archivos. **Los estados se corrigieron a la
> fecha**: varios aportes daban por pendientes cosas ya hechas, porque cada chat quedó
> congelado en su momento.
>
> Doce secciones, quince reglas de "no romper", tabla de síntoma → causa y doce puntos de
> deuda conocida. **Sin huecos**: lo que queda no es información faltante, es deuda.
>
> ## Lo que la auditoría destapó
>
> ### El defecto que las propias defensas escondían
>
> Las tres imágenes del sitio están en la **raíz**, y el HTML las pedía en **`./img/`**,
> carpeta **que no existe**. Se veían igual porque cada `<img>` tiene un `onerror` que
> reintenta en la raíz. Pero:
>
> · **`<link>` y `<meta>` no tienen `onerror`. Tampoco el JSON-LD.** Ahí no había red.
> · **El favicon** apuntaba a `./img/logo-sitio.png`: el sitio no tenía ícono en la
>   pestaña.
> · **`og:image` y `twitter:image`** apuntaban a `img/og-preview.jpg`, **un archivo que
>   nunca se subió**. WhatsApp, Facebook y Google no ejecutan JavaScript: **cada enlace
>   compartido salía sin imagen**, siendo WhatsApp el canal de contacto principal del
>   negocio.
> · **La `image` del JSON-LD `LodgingBusiness`**: Google no podía bajar la foto de la
>   ficha del alojamiento.
>
> **Que las imágenes se vieran ocultó que las rutas estaban mal.** Un respaldo que
> funciona demasiado bien esconde el problema que tapa. Corregido: la raíz primero,
> `./img/` como respaldo, y og/twitter/JSON-LD/favicon apuntando a rutas reales.
> `og:image` usa `ilustracion-hero.jpg` y **ya no declara `width` ni `height`**: declarar
> medidas que no son las reales es peor que no declararlas.
>
> ### Lo que se cerró y no estaba documentado
>
> · **El despliegue.** No hay `.github/workflows/`, no hay `package.json`, no hay build.
>   GitHub Pages publica **directo desde la raíz de `main`**; el entorno `github-pages`
>   acumula más de 120 despliegues, todos "Add files via upload". Nada puede borrar el
>   `CNAME`. **`.nojekyll` es imprescindible** y está. Contrapartida: **lo que se sube
>   queda en vivo sin etapa intermedia**.
> · **Analítica: no hay ninguna.** Ni Analytics, ni Tag Manager, ni Plausible, ni píxel.
>   El sitio no mide nada. Decisión pendiente, no olvido.
> · **`404.html` no es solo un cartel**: su script tiene un mapa de URLs viejas
>   (`/index.html`, `/admin.html`, `/interno/index.html`) que redirige a las nuevas. Es el
>   mecanismo que cumple "ninguna URL indexada termina en 404". **Al renombrar una página,
>   se agrega su entrada a ese mapa.**
> · **Datos estructurados**: la portada lleva `LodgingBusiness` con teléfono, dirección,
>   coordenadas, amenities y `sameAs`. Tan parte del contrato con Google como las metas.
> · **Secretos: limpio.** Lo único en el repositorio es la configuración pública de
>   Firebase y el cloud/preset de Cloudinary, públicos por diseño. Ninguna clave de
>   terceros. **No hay `.gitignore`, y en este proyecto casi no importa**: sin build, sin
>   `node_modules`, sin archivos de entorno y subiendo archivo por archivo desde el
>   navegador, no hay commits masivos accidentales de los que protegerse. El informe del
>   agente lo puso como el hallazgo más grave: **ordenó por buena práctica genérica, no
>   por la realidad del proyecto.**
> · **`textos-sitio.js` auditado**: no falta ninguna clave y **los tres idiomas definen
>   exactamente el mismo conjunto** — la comprobación que importa, porque una clave
>   presente en español y ausente en portugués solo se nota al cambiar de idioma. La clave
>   `recuerdos` que faltaba (v5.65) ya está publicada.
> · **`sw.js` en v58 y su `SHELL` coherente**: ningún archivo listado falta, ningún
>   `.html`/`.js`/`.css` del panel quedó fuera.
> · **Huérfanos**: `interno/ilutracion-hero.jpg` (con el nombre mal escrito, sin la "s") e
>   `interno/icono-alternativo-512.png`. No los referencia nada.
>
> ### Lo que queda como deuda
>
> **El muro de recuerdos está solo en español.** `recuerdos.html` público no usa `data-t`
> ni `t()`: los textos están fijos. El resto del sitio es trilingüe. Un huésped brasileño
> escanea el QR y encuentra todo en español, **justo en el momento en que se le pide que
> escriba**. Es una tanda propia: son unas treinta claves nuevas en tres idiomas, más los
> mensajes de la puerta que hoy son un objeto en español, y toca el archivo que leen el
> sitio Y el panel. No se cuelga de un arreglo de imágenes.
>
> ## Acción
>
> 1. `index.html` y `recuerdos.html` **de la RAÍZ** (no los de `/interno/`).
> 2. `textos-sitio.js` en `/interno/`, si todavía no estaba subido.
> 3. La guía va al conocimiento del proyecto, al lado del briefing y de CONVENCIONES.
> 4. **Verificar el arreglo compartiendo el enlace del sitio por WhatsApp**: tiene que
>    aparecer la ilustración. Y mirar que la pestaña del navegador tenga el ícono.

# v5.65 — El muro de recuerdos nunca funcionó, y por qué tardamos en verlo (T11.15)

> **Registro v5.65 (Tanda 11.15 — recuerdos.html [SITIO PÚBLICO] · index.html ·
> sw.js → v58 · CONVENCIONES.md → v2.18):**
>
> ## El síntoma
>
> El QR de recuerdos daba error desde otro teléfono. Desde el del administrador
> "andaba" — pero solo porque ya había una sesión abierta de una prueba anterior:
> `if (!auth.currentUser) await signInAnonymously(auth)` nunca llegaba a ejecutarse.
> **Para cualquier huésped que llegara por primera vez, el muro no funcionó nunca.** No
> era una regresión: era una función que se dio por terminada sin probarla en frío.
>
> ## Las tres causas
>
> 1. **El proveedor Anónimo estaba deshabilitado** en Firebase Authentication. (Al
>    habilitarlo, el botón Guardar del diálogo quedaba fuera de la pantalla y el cambio
>    no se aplicaba — la misma clase de defecto que arreglamos en la 11.11 con
>    `max-height` en los `<dialog>`, esta vez en la consola de Google.)
> 2. **El preset `preset-recuerdos` de Cloudinary no existía.** Estaba planificado desde
>    el diseño —"su PROPIO preset, para poder apagarlo sin tocar comprobantes"— y nunca
>    se creó.
> 3. **`casaverdecanas.com.br`** tenía que estar en los dominios autorizados.
>
> ## La causa de fondo: los mensajes se tragaban el código
>
> Las tres se habrían resuelto en dos minutos. Tardaron días porque **ningún mensaje
> decía qué había pasado**:
>
> · Cloudinary explica el problema en el cuerpo de la respuesta ("Upload preset not
>   found"). El código lo descartaba entero y mostraba "No se pudo subir la foto".
> · El error de sesión mostraba "No pudimos abrir tu sesión" sin el código.
> · **Y el peor**: el archivo SÍ tenía un mensaje bueno para "el muro no está
>   habilitado", pero solo lo mostraba con `auth/operation-not-allowed`. **Firebase
>   moderno devuelve `auth/admin-restricted-operation`** cuando el proveedor Anónimo
>   está apagado. O sea que **la causa número uno caía justo en el mensaje genérico**: el
>   sistema sabía la respuesta y no la podía decir.
>
> **Corregido en los cuatro puntos**: subida de foto (con el texto de Cloudinary), sesión
> anónima (con el código, y reconociendo los dos códigos), Google (con el código) y
> verificación de la clave del QR (el código técnico queda en `ultimoFallo` y se muestra
> bajo el cartel de la puerta, donde antes una clave inválida y unas reglas sin publicar
> se veían idénticas).
>
> ## Además — la sesión heredada
>
> `signInAnonymously` se pedía solo `if (!auth.currentUser)`. Ahora también **si la
> sesión que hay no es anónima**. Sin eso, un recuerdo escrito en un navegador con otra
> sesión del mismo proyecto quedaba firmado con ESE uid, no con el del huésped.
>
> ## Y lo que faltaba del otro lado — aviso en el Inicio
>
> Un recuerdo pendiente **no se ve en el sitio hasta que alguien lo aprueba**, y el
> Inicio no lo mencionaba: había que entrar a Recuerdos a mirar. Algo que hay que ir a
> buscar, tarde o temprano no se busca. Bloque nuevo **"Recuerdos por revisar"** para
> quien tiene `contenido`, con el texto del recuerdo y hace cuánto llegó.
>
> ## Acción
>
> 1. `recuerdos.html` **del SITIO PÚBLICO** (la raíz, no el del panel: son dos archivos
>    distintos con el mismo nombre).
> 2. `index.html` y `sw.js` (v58).
> 3. Cerrar la app del todo y reabrir.

# v5.64 — Revisión de coherencia: seis cosas que se nos habían pasado (T11.14)

> **Registro v5.64 (Tanda 11.14 — firestore.rules · index.html · horas-stats.html ·
> manual.html · usuarios.html · cabanas.html · sw.js → v57):**
>
> Revisión cruzada de los 22 archivos del sistema pedida por el administrador. Seis
> hallazgos, todos confirmados contra el código y las reglas. Ninguno cambia una decisión
> de diseño: son cosas que se dijeron en un lado y no se cumplieron en otro.
>
> ## 1 · Las estrellas de Actividades no funcionaban para NADIE
>
> `actividades.html` guarda las destacadas en **`estado_usuario/{uid}`**, y esa colección
> **no tenía bloque en las reglas**. El archivo niega por defecto y no tiene catch-all:
> escribir daba error y leer también.
> **Por qué nunca se notó**: la lectura está envuelta en `catch { /* primera vez */ }`.
> El fallo se disfrazaba de "todavía no marcaste ninguna" y el filtro Destacadas se veía
> vacío para siempre. **Un catch que traga un error de permisos es un error invisible**
> — vale para todo el sistema, no solo para acá.
> Se agrega el bloque: `read, write` solo para el dueño del uid.
>
> ## 2 · El Inicio sumaba monedas distintas
>
> El bloque "Dinero pendiente" agrupaba por `nombre|clase` **sin la moneda**, y mostraba
> el total con `fmtMonto` sin unidad: reales y dólares sumados y presentados como R$.
> **Es exactamente la trampa que arreglamos en `dinero.html` en la 12.2 y que está
> escrita en CONVENCIONES §8** — se volvió a cometer al escribir un archivo nuevo.
> Ahora la moneda va en la clave y se muestra con la suya, igual que `pendientesVivos()`.
> De paso: tampoco miraba `m.pendiente.cierreId`, así que mostraba pendientes que un
> balance del modelo viejo ya había cerrado.
>
> ## 3 · El permiso "Horas del equipo" estaba a medias
>
> El permiso se describe como *"gestor de sesiones y análisis de horas de todas las
> personas"*. `gestion-sesiones.html` usa `CV2.puede('horas')` — bien. **`horas-stats.html`
> usaba `CV2.esAdmin()`** en tres lugares decisivos: el selector de personas no se
> dibujaba y la consulta quedaba filtrada al propio uid. Para quien tiene el permiso y no
> es admin, la página aparecía en el menú y no hacía la mitad de lo que promete.
> (El cuarto `esAdmin()` del archivo se deja: es el alcance de *actividades*, no de horas.)
>
> ## 4 · El punto rojo del Chat no existía
>
> `CV2.marcarNovedad()` estaba escrita en `nucleo.js`, el estilo `.cv-tab.con-novedad` en
> `design-system.css`, **y nadie la llamaba nunca**. El manual lo prometía. Lo enciende
> ahora el Inicio, que es el único lugar que tiene la cuenta hecha.
>
> ## 5 · Desde Espacios, "Ayuda de esta página" no llevaba a ningún lado
>
> El menú arma `manual.html#espacios` y el manual **no tiene ese ancla**: cabañas y
> espacios comparten el capítulo `#cabanas`. La página abría arriba de todo, sin ir a
> nada ni resaltar nada. Se resuelve con una tabla `ALIAS` en el script del manual —y no
> con un ancla vacía— para que el resaltado caiga sobre el capítulo de verdad.
>
> ## 6 · Dos porteros con `location.href`
>
> `usuarios.html` y `cabanas.html` echan a quien no tiene permiso con `location.href`.
> Es el patrón que sacamos de `nucleo.js` en la 11.10: deja la página en el historial y
> el botón Atrás vuelve a entrar para que lo echen de nuevo. Pasan a `location.replace`.
>
> ## Observaciones que NO se tocaron (quedan anotadas)
>
> · **Solo 2 de 16 páginas tienen portero propio**; las demás se apoyan únicamente en las
>   reglas. No es una falla —la regla es la que manda (§5.1)— pero es una inconsistencia:
>   quien entra por URL a una página sin permiso ve la pantalla y recibe un error de
>   lectura en vez de un desvío limpio. Decidir si se unifica.
> · **`clientes.html` muestra el botón de borrar solo a `esAdmin()`**, pero la regla lo
>   permite a cualquiera con `reservas`. Acá la interfaz es MÁS estricta que la regla: no
>   es un agujero, es un permiso que no se puede ejercer.
> · **`calendario.html` limita "Sincronizar limpiezas" al admin.** Parece deliberado y
>   correcto: el borrado de actividades ajenas es solo del admin, así que con cualquier
>   otro permiso la sincronización fallaría a la mitad. Se deja como está.
>
> ## Acción
>
> 1. **Publicar `firestore.rules`** — sin eso las estrellas siguen sin andar.
> 2. Subir `index.html`, `horas-stats.html`, `manual.html`, `usuarios.html`,
>    `cabanas.html`, `sw.js` (v57).
> 3. Cerrar la app del todo y reabrir.

# v5.63 — Se retira el libro personal (T11.13)

> **Registro v5.63 (Tanda 11.13 — dinero.html · firestore.rules · manual.html ·
> sw.js → v56 · CONVENCIONES.md → v2.16):**
>
> · **Decisión del administrador**, a partir de una duda suya leyendo el manual: *"no
>   comprendo la utilidad de mi libro personal"*. La duda era la correcta.
>
> · **Por qué se va.** El libro personal existía para anotar gastos propios sin ensuciar
>   el del negocio. Pero **el único cruce real entre plata propia y plata de la casa
>   —poner algo de tu bolsillo— ya lo cubre el pendiente "reponerle a X"**. Lo que
>   quedaba adentro eran gastos que no tienen nada que ver con Casa Verde.
>   Y no era gratis: una pestaña, una colección, una regla, un capítulo de manual, y
>   sobre todo **un lugar donde un gasto del negocio podía caer por error y quedar fuera
>   de todo balance, sin que nadie lo notara — porque ahí no entra ni el administrador**.
>
> · **`dinero.html`**: fuera las dos pestañas, el aviso azul, `esPersonal()` y todas sus
>   ramas (catálogo de categorías propio, ocultar cuenta/quién/pendientes, nombre del
>   CSV, mensaje de error). `pintarLibro()` pasa a llamarse **`pintarPermisos()`**, que
>   es lo que de verdad hacía una vez sacado el libro: decidir qué se ve según
>   `finanzas`. La suscripción pierde la carrera entre libros (`destino !== libro`), que
>   ya no puede ocurrir.
>
> · **`firestore.rules`**: se retira el bloque
>   `match /usuarios/{uid}/movimientos_personales/{id}`. Como el archivo **niega por
>   defecto y no tiene catch-all**, sacarlo alcanza. En su lugar queda **el hueco
>   documentado** —qué había, cuándo se fue y cuál era el bloque— porque el día que
>   alguien se pregunte por qué no se puede escribir ahí, va a mirar justo en ese lugar.
>
> · **`manual.html`**: fuera el capítulo. Y de paso **se reescribió "Lo que queda
>   pendiente"**, que era el otro punto que el administrador no entendía. El defecto era
>   del manual: explicaba el mecanismo y **nunca decía qué problema resuelve**. Ahora
>   arranca por ahí —*el gasto y la salida de plata no pasan el mismo día*— con el
>   ejemplo de la cerradura de R$80 que compra Esteban, y sigue con las dos formas del
>   pendiente como consecuencia de eso. Se agregó también el aviso de que los pendientes
>   se muestran completos, sin importar el filtro de fechas.
>
> · **CONVENCIONES v2.16**: §4 marca la colección como RETIRADA con el motivo (no se
>   borra la entrada: un dato viejo en la base sin explicación es una trampa para el que
>   venga después). **§7.8 nueva — cómo se retira una función**, con el orden y el porqué.
>   §9 suma que una función que nadie usa no es neutra.
>
> ## Acción — EL ORDEN IMPORTA
>
> 1. **Subir primero el código y el manual**: `dinero.html`, `manual.html`, `sw.js` (v56).
>    Si se borraran los datos antes, entre una cosa y la otra alguien abre la pestaña y
>    ve un error o un libro vacío.
> 2. **Borrar los datos a mano desde la consola**, uno por uno: Firestore → `usuarios` →
>    el documento de cada persona → subcolección `movimientos_personales` → Eliminar
>    colección. **Revisar las tres cuentas**, no solo la del administrador. Lo que se
>    quiera conservar, copiarlo antes: esto no se deshace.
> 3. **Recién ahí publicar `firestore.rules`.** Al revés, los documentos quedan
>    inalcanzables desde la app y no se borran nunca.
>
> ## Nota para la simplificación financiera
>
> Esto **no adelanta ni contradice** el rediseño pendiente: lo aliviana. El modelo
> acordado —una sola colección `movimientos`, la marca de pendiente en sus dos formas,
> balances derivados nunca guardados— sigue igual, con **una colección menos que
> arrastrar** el día que se haga el corte.

# v5.62 — Foto de cada persona · borrar temas del chat (T11.12)

> **Registro v5.62 (Tanda 11.12 — nucleo.js · comunicacion.html · index.html ·
> design-system.css · firestore.rules · sw.js → v55 · CONVENCIONES.md → v2.15):**
>
> ## Barrido de la 11.11 — resultado
>
> · **En las once páginas revisadas no hay un solo elemento fijo ni pegajoso**: la barra
>   de abajo no tapa nada más. El defecto era exclusivo del chat.
> · **Pero apareció otra cosa**: cinco formularios (`clientes`, `gestion-sesiones`,
>   `honorarios` ×2, y uno de los tres de `dinero` y de `recuerdos`) **no tenían
>   `max-height`**. En un teléfono, un formulario largo se desborda y **Guardar y
>   Cancelar quedan fuera de la pantalla**, sin manera de llegar a ellos.
>   **Arreglado con una sola regla base en `design-system.css`** —`max-height: 88dvh`,
>   `overflow: auto`, `overscroll-behavior: contain` y respiro de `safe-area`— que sirve
>   de piso para TODOS los `<dialog>` del sistema. Las páginas fijan ancho y radio; no
>   fijan estas propiedades, así que no las pisan. Misma idea que
>   `CV2.dialogosConAtras()`: se arregla una vez, sirve para siempre y para los
>   formularios que se escriban mañana. **No hubo que tocar las once páginas.**
>
> ## Foto de cada persona
>
> · **De Gmail no se puede.** No existe forma de obtener la foto de una cuenta de Google
>   a partir del mail: Google la entrega solo cuando la persona inicia sesión **con
>   Google**, y acá se entra con mail y contraseña. Queda anotado para no volver a
>   evaluarlo.
> · **La sube cada uno**, por el camino único de imágenes del sistema
>   (`CV2.elegirYSubirImagen` → Cloudinary con URL de entrega liviana). Se guarda en
>   **`usuarios/{uid}.fotoUrl`**.
> · **Decisión del administrador**: cada uno cambia la suya; el admin, la de cualquiera.
> · `nucleo.js`: `CV2.inicialesDe`, **`CV2.avatarHTML(persona)`** (devuelve el `<img>` o
>   las iniciales, del mismo tamaño y forma para que ninguna lista salte cuando alguien
>   sube la suya), `CV2.cambiarMiFoto`, `CV2.quitarMiFoto` y `CV2._refrescarAvatar`, que
>   repinta el círculo **sin recargar la página**.
> · La hoja de cuenta gana **"Poner/Cambiar mi foto"** y **"Quitar mi foto"** (este
>   último solo aparece si hay foto). La hoja se cierra antes de abrir la cámara: la
>   cámara necesita la pantalla entera.
> · **Regla**: al `hasOnly` del auto-update se le suman `fotoUrl` y `actualizadoEn`, con
>   tope de 400 caracteres. **El rol y los permisos siguen fuera**: la garantía es el
>   `hasOnly`, no la interfaz.
> · **Límite conocido**: el preset de Cloudinary es sin firmar, así que la URL de la foto
>   es públicamente accesible para quien la tenga. Para una foto de perfil es aceptable;
>   queda dicho.
>
> ## Borrar temas del chat — por persona
>
> · **Mismo criterio que ya usaban los mensajes**: borrar saca el tema de TU lista, no de
>   la de los demás. **Cuando todos lo borraron, el tema se elimina de verdad**, con sus
>   mensajes.
> · **Dónde vive la marca**: en el propio tema, en **`ocultoPara: [uid]`** — y no en el
>   documento de lecturas de cada uno, como sí pasa con los mensajes. La razón es que acá
>   hace falta saber **quién falta**, y eso solo se puede responder si la lista está en
>   un lugar que todos leen.
> · **Quiénes son "todos"**: en un tema directo, los participantes; en uno de equipo,
>   las personas activas de `/usuarios/`. La página ya tiene esa lista cargada.
> · **La confirmación dice la verdad de cada caso**, y por eso se calcula ANTES de
>   escribir: si sos el último, avisa que se elimina definitivamente y no se puede
>   deshacer; si no, que los demás lo siguen viendo.
> · **Un mensaje nuevo REVIVE el tema para todos** (`ocultoPara: []` al escribir). Sin
>   esto, quien lo borró no vería nunca la respuesta — **un mensaje que nadie recibe es
>   peor que una lista con un tema de más**.
> · Botón de borrar en **dos lugares**: en cada fila de la lista (con `stopPropagation`,
>   44px de objetivo táctil) y en la cabecera del hilo abierto.
> · **Firestore no borra subcolecciones en cascada**: primero se vacían los mensajes en
>   lotes de 400, después se borra el tema. El orden no es negociable por DOS razones:
>   los mensajes quedarían huérfanos, y **la regla que permite vaciarlos consulta el
>   tema padre** — si el tema se borra primero, sus mensajes se vuelven imborrables.
> · **Corrección antes de entregar** (apareció al contrastar la página contra la regla):
>   quien borra último **también tiene que marcarse en `ocultoPara` primero**. La regla
>   exige estar en esa lista para borrar, y en un tema directo exige que la lista cubra a
>   todos los participantes. Sin ese paso previo, el borrado final se rechazaba con
>   permission-denied **para todos menos el admin**, que pasa por otra rama de la regla y
>   no lo habría sufrido nunca: el defecto solo aparecía en manos de un colaborador.
> · **`index.html` también filtra `ocultoPara`**: un tema que borraste no puede seguir
>   apareciendo en las novedades del Inicio.
>
> · **Hasta dónde llega la regla, dicho sin adornos**: en un tema **directo** se
>   comprueba entero (no se borra si algún participante no lo escondió; la lista está en
>   el documento). En uno de **equipo**, "todos" son las personas activas de `/usuarios/`
>   y una regla no puede recorrer esa colección: solo se exige pertenecer al tema y
>   haberlo escondido primero. El "ya nadie lo quiere" lo verifica la página. **Es un
>   límite conocido, no un olvido**, y queda anotado en §5 y en §8.
>
> ## Acción
>
> 1. **Publicar `firestore.rules`** (archivo completo, §5.3) — sin esto no anda ni la
>    foto ni el borrado.
> 2. Subir `nucleo.js`, `comunicacion.html`, `index.html`, `design-system.css` y `sw.js`
>    (v55, reemplaza al v54 y al v53 anteriores).
> 3. Cerrar la app del todo y reabrir.
>
> ## Cierre de la tanda — `usuarios.html` y `manual.html`
>
> · **`usuarios.html`**: la foto entra en la fila de cada persona (`CV2.avatarHTML`) y en
>   el formulario, arriba de todo. **Elegir** la sube y **Quitar** la saca; el documento
>   se toca recién al **Guardar**, así cancelar deja a la persona como estaba. Las
>   iniciales de la vista previa siguen al nombre mientras se escribe.
>   · Contrapartida asumida: si se elige una foto y después se cancela, queda una imagen
>     huérfana en Cloudinary. Es barato al lado de perder el formulario.
>
> · **DEFECTO QUE HABRÍA APARECIDO AL PRIMER INTENTO** — `CV2.pedirImagen` armaba su hoja
>   con un `<div>` fijo en `z-index: 10000`. Un elemento fijo **no se dibuja arriba de un
>   `<dialog>` abierto con `showModal`**, por más z-index que tenga: los modales viven en
>   la *top layer* del navegador, que está por encima de todo lo demás. Es decir que la
>   hoja de la cámara quedaba **invisible cada vez que el botón de la foto estaba dentro
>   de un formulario** — que es donde está en casi todas las páginas. Se resolvió
>   convirtiendo la hoja en un `<dialog>`: entra a la misma capa y, de yapa, hereda el
>   botón Atrás porque `showModal` ya está adoptado por `CV2.dialogosConAtras()`.
>   **Esto arregla también los comprobantes de `dinero.html` y las fotos de `cabanas` /
>   `espacios` / `recuerdos`**, que abren el mismo camino desde adentro de un modal.
>
> · **`manual.html`**: capítulos nuevos y correcciones.
>   · *Moverse* — "Tu foto", con la advertencia de que la URL es pública.
>   · *Chat* — "Borrar un tema entero": por persona, qué dice cada cartel, que un mensaje
>     nuevo lo revive, y que —a diferencia de un mensaje— **un tema borrado no se
>     recupera** desde el botón Eliminados.
>   · *Usuarios* — la foto de cada persona.
>   · *Si algo falla* — **"La app queda en blanco y no abre"** (el botón de reparar, con
>     la aclaración de que no se pierde nada del servidor) y **"Entré y me devolvió a la
>     pantalla de ingreso"**, con los tres motivos separados: sin perfil, desactivado y
>     trancado. Eran de la tanda 11.10 y no estaban documentados.
>   · *Si algo falla* — "Un tema del chat desapareció de mi lista" ahora empieza por la
>     causa más probable: lo borraste vos.
>
> · **Sube `sw.js` a v55** (ya contado arriba) — `usuarios.html` y `manual.html` están en
>   el shell.
>
> ## Lista final de archivos de la tanda
>
> `firestore.rules` (publicar PRIMERO) · `nucleo.js` · `comunicacion.html` ·
> `usuarios.html` · `manual.html` · `index.html` · `design-system.css` · `sw.js` (v55).
> Después: cerrar la app del todo y reabrir.

# v5.61 — Lo que la barra de abajo tapaba (T11.11)

> **Registro v5.61 (Tanda 11.11 — design-system.css · comunicacion.html ·
> actividades.html · sw.js → v54 · CONVENCIONES.md → v2.14):**
>
> · **Reporte del administrador**: con la barra de navegación abajo (11.6), en el chat
>   **quedó tapado el botón de agregar una foto**. Y la pregunta que importa: *"quizás
>   otra que aún no identifiqué"*.
>
> · **El defecto**: el compositor de mensajes (`.escribir`) era `position: fixed;
>   bottom: 0`, sin `z-index`. La barra de navegación es fija, también en `bottom: 0`, y
>   va en `z-index: 95`: le pasaba por encima. No tapaba solo la foto — tapaba la fila
>   entera; el botón de la izquierda es el que más se nota.
>
> · **Arreglo general, no parche**: dos variables nuevas en `design-system.css` que
>   dicen cuánto come cada barra —**`--cv-piso`** (la de abajo) y **`--cv-techo`** (la
>   cabecera, +8px cuando está el listón de admin)— y la clase **`.cv-pegado-abajo`**,
>   el molde para cualquier cosa pegada al borde inferior que no sea la barra:
>   `bottom: var(--cv-piso)` y `z-index: 90` (arriba del contenido, debajo de la barra,
>   la tapa y las hojas). En ≥900px la barra se va arriba y **`--cv-piso` pasa a valer
>   0 solo**: lo que use la variable se acomoda sin una línea más.
>   · `body.cv-conbarra` y el toast pasan a usar `--cv-piso` en vez de repetir la cuenta.
>
> · **Los dos parientes que aparecieron al revisar:**
>   1. `.msgs` reservaba **90px fijos** abajo. Con la barra puesta no alcanzaba: el
>      último mensaje del hilo nacía tapado. Ahora es `calc(80px + var(--cv-piso))`.
>   2. `actividades.html` — el banner del cronómetro era `sticky; top: 58px`, un número
>      escrito a mano de cuando la cabecera medía otra cosa. La cabecera hoy mide
>      `--cv-h-cab` (50px) **más la muesca del teléfono**: en un Android con cutout el
>      banner quedaba metido debajo de la cabecera. Ahora `top: var(--cv-techo)`.
>
> · **Lo que queda por revisar**: solo se auditaron las páginas que estaban a mano
>   (chat, actividades, inicio, sesiones, horas, login). **Falta pasar por
>   `dinero.html`, `reservas.html`, `calendario.html`, `clientes.html`, `cabanas.html`,
>   `espacios.html`, `recuerdos.html`, `honorarios.html`, `usuarios.html`, `balance.html`
>   y `manual.html`** buscando `position: fixed` con `bottom`, y `sticky` con un `top`
>   numérico. Es una tanda corta de barrido.
>
> · `sw.js` v53 → **v54** (reemplaza al v53 de la 11.10, que todavía no se había subido).
>
> · **Acción**: subir `design-system.css`, `comunicacion.html`, `actividades.html` y
>   `sw.js`. Cerrar la app del todo y reabrir.

# v5.60 — La app trancada en blanco: el estado local del navegador (T11.10)

> **Registro v5.60 (Tanda 11.10 — nucleo.js · login.html · sw.js → v53):**
>
> ## Lo que pasó
>
> El administrador entró con un usuario del equipo **que ya existía y funcionaba** pero
> que nunca había usado la app. Desde ese momento, en Chrome —navegador y PWA
> instalada— **la aplicación quedaba trancada en blanco**: no rebotaba, no daba error,
> no mostraba nada. Ni siquiera con la cuenta de administrador. En Firefox andaba
> perfecto. **Se solucionó borrando cookies y caché del sitio en Chrome.**
>
> ## Diagnóstico confirmado
>
> Que Firefox anduviera y que borrar los datos del sitio lo arreglara deja una sola
> conclusión posible: **el problema estaba en el estado local del navegador, no en el
> código publicado ni en los datos del servidor**. El deploy era el mismo para los dos
> navegadores.
>
> **La cadena, de punta a punta:**
>
> 1. Para cambiar de usuario hay que cerrar sesión. `CV2.cerrarSesion` hacía
>    `await terminate(db); await clearIndexedDbPersistence(db);` **sin plazo**.
> 2. `clearIndexedDbPersistence` termina en un `deleteDatabase`, y `deleteDatabase`
>    **queda `blocked` mientras otra pestaña o la PWA instalada tenga la base abierta**.
>    En un teléfono con la app instalada eso es lo normal, no la excepción.
> 3. Ese `await` no volvía nunca: la línea siguiente —la que redirige a login— **no se
>    ejecutaba**. Y la base local de Firestore quedaba a medio cerrar.
> 4. A partir de ahí, **toda lectura de Firestore en ese navegador se quedaba
>    esperando**. No fallaba: esperaba.
> 5. Toda página del panel hace `const u = await CV2.verificarAuth()` **arriba de todo**,
>    y `verificarAuth` no tenía reloj de guardia. Su promesa nunca resolvía → el módulo
>    nunca seguía → **la página quedaba en blanco para siempre, sin un solo mensaje**.
>
> ## La lección que importa
>
> **El estado local del navegador es parte del sistema, y hasta hoy era la única parte
> que no se podía ni ver ni arreglar desde un teléfono.** No hubo un error en una
> página: hubo una base local trancada, y el código estaba escrito de manera que esa
> situación se veía como una pantalla muda. Dos reglas nuevas salen de acá (§3.9
> ampliada y §3.15):
>
> · **Nada que se espere con `await` arriba de una página puede quedar sin plazo.** Una
>   promesa que no resuelve no es un error: es una app que no arranca, y no deja rastro.
> · **Borrar la base local es una operación que puede quedar bloqueada.** Nunca en el
>   camino de salida, nunca sin reloj.
>
> ## Diagnóstico descartado (queda anotado a propósito)
>
> La primera hipótesis fue que el usuario no tenía documento en `/usuarios/`. **Era
> falsa**: el perfil existía y estaba activo. Se anota porque el mensaje que mostraba el
> sistema —"Tu usuario está desactivado"— **mandó a buscar el problema del lado
> equivocado**, y esa confusión sí era un defecto real: se corrigió igual (abajo).
>
> ## Cambios entregados
>
> · **`cerrarSesion` no puede trancarse.** La limpieza de la base local corre contra un
>   reloj de 3 segundos y la salida ocurre igual. Salir de la app nunca depende de que
>   una operación de IndexedDB se destrabe.
>
> · **`verificarAuth` con reloj de guardia** (`CV2.ESPERA_PERFIL`, 15 s). Si la lectura
>   del perfil no vuelve, se sale a `login.html?e=trancado` con un texto que explica qué
>   pasó y qué hacer. La falla deja de ser invisible.
>
> · **`CV2.repararApp()` [NUEVO] — la salida de emergencia.** Da de baja los service
>   workers, vacía todas las cachés del shell y borra las bases locales de Firebase
>   (`deleteDatabase` con plazo, justamente porque queda `blocked`). **No toca nada del
>   servidor.** Es lo mismo que borrar los datos del sitio desde la configuración de
>   Chrome, en un botón. Está en **dos** lugares a propósito: en la hoja de cuenta
>   ("Reparar la app") y en **`login.html` ("La app no abre")** — porque cuando el panel
>   no abre, la hoja de cuenta es justamente lo que no se alcanza.
>
> · **`location.replace` en todo el camino de autenticación**, nunca `location.href`.
>   Con `href`, cada rebote index → login deja index en el historial y el botón **Atrás
>   de Android** —el gesto más usado en la PWA— vuelve a entrar a una página que va a
>   rebotar de nuevo. No fue la causa de esta falla, pero es un rebote infinito esperando
>   su turno.
>
> · **Una sola salida, no dos compitiendo.** `onAuthStateChanged` es un oyente
>   permanente y no se cortaba: el `signOut` del propio `verificarAuth` lo despertaba de
>   nuevo con sesión nula y disparaba una segunda navegación encima de la primera. Ahora
>   se corta la escucha y una bandera garantiza una única salida.
>
> · **Los motivos del rebote tienen nombre y texto propio** en `login.html`:
>   `sinperfil` (la cuenta existe pero no está dada de alta) ≠ `inactivo` (está
>   desactivada) ≠ `trancado` (el teléfono, no la cuenta) ≠ `error:<código>`. Antes
>   `?e=error` **no tenía ningún texto asociado**: se caía en una pantalla de login sin
>   una palabra, en contra de nuestra propia §3.9.
>
> · `sw.js` v52 → **v53** (entra el `index.html` de la 11.9 y estos dos archivos).
> · **`index.html` no participó de la falla**: sus cambios son los de la 11.9 (abajo) y
>   quedan tal cual se entregaron.
>
> ## Acción
>
> 1. Subir `nucleo.js`, `login.html`, `sw.js` (v53) e `index.html` (de la 11.9).
> 2. Cerrar la app del todo y reabrir.
> 3. Si algún teléfono queda trancado **antes** de que llegue el deploy: Chrome → ⋮ →
>    Información del sitio → Cookies y datos del sitio → Eliminar. Después del deploy,
>    alcanza con "La app no abre" en la pantalla de ingreso.
> 4. **Al cambiar de usuario en el mismo teléfono, usar siempre "Cerrar sesión"** — no
>    entrar con otra cuenta encima de una sesión abierta.

# v5.59 — INICIO · las recurrentes atrasadas por fin se ven (T11.9)

> **Registro v5.59 (Tanda 11.9 — interno/index.html):**
>
> · **Pedido del administrador**: que en las novedades aparezcan las actividades con
>   recurrencia cuya última realización se pasó del ciclo por **más de una semana**.
>
> · **Lo que apareció al mirarlo — un agujero, no una falta**: el bloque de actividades
>   del Inicio filtraba **solo por `fechaVencimiento`**, y las recurrentes no usan ese
>   campo. Al cerrar el ciclo, `actividades-core.js` escribe
>   `fechaInicio = día de la realización + recurrenciaDias`: **`fechaInicio` ES el día en
>   que vuelve a tocar**. Resultado: la rutina de la casa —las 16 recurrentes, que son el
>   grueso del trabajo— **no aparecía nunca en la portada**, ni atrasada ni al día. No es
>   que faltara el aviso de "hace más de una semana": faltaban todas.
>
> · **Dos bloques nuevos, arriba de todo (mismo `id: 'actividades'`, y el `sort` de JS
>   es estable, así que conservan el orden en que se agregan):**
>   1. **"Atrasadas hace rato"** — las graves, en rojo, ordenadas por días de atraso,
>      con la insignia `+N d` a la derecha. Cada fila dice cuándo tocaba, cada cuánto es
>      y **última vez (quién)**, o "nunca se hizo".
>   2. **"Necesitan atención hoy"** — lo de siempre (únicas vencidas o que vencen hoy)
>      **más** las recurrentes que recién tocan. Las recurrentes se excluyen del filtro
>      por `fechaVencimiento` para que ninguna se cuente dos veces.
>
> · **Qué se considera "grave" — dos caminos, no uno**:
>   `atraso > 7 días` **o** `atraso > un ciclo entero`. El primero es el pedido literal.
>   El segundo existe porque en una tarea de cada dos días, esperar siete es esperar tres
>   ciclos perdidos; y al revés, la definición sola de "un ciclo" dejaría a una tarea
>   anual sin avisar hasta el año siguiente. La constante **`DIAS_ALERTA = 7`** está
>   arriba del bloque, sola y comentada: es el único número a tocar.
>
> · **Ninguna lista se estira sin fin**: `recortar()` corta en 6 (atrasadas) y 8 (hoy) y
>   agrega una fila gris "y N más" que abre la lista completa. En el teléfono, veinte
>   filas de novedades no son novedades (§6.0).
>
> · Sin cambios de reglas, sin cambios de modelo de datos, sin tocar
>   `actividades-core.js` ni `actividades.html`. Un solo archivo.
>
> · **Acción**: subir `interno/index.html` y **subir `sw.js` de v52 a v53** (el Inicio
>   está en el shell: sin el cambio de versión, el teléfono sigue mostrando la copia
>   vieja). Después, cerrar la app del todo y reabrir.

# v5.58 — Cierre de la migración: traer lo último y verificarlo (T11.8)

> **Registro v5.58 (Tanda 11.8 — interno/traer-historial.html ·
> interno/verificar-migracion.html [NUEVO]):**
>
> · **Export nuevo del sistema viejo: 28/07/2026, 22:14** (1251 documentos, 23
>   colecciones). Contra el del 26/07: **80 sesiones** (eran 78) y las mismas 45
>   actividades. Son las dos realizaciones que Esteban cargó en el medio.
>
> · **`traer-historial.html` rehecho** con los datos del 28/07 y tres mejoras:
>   · **Ahora lleva el árbol completo de 45 actividades**, no solo las 16 recurrentes.
>     Antes, las sesiones de las no recurrentes (Desarmado del piso,
>     Descargado/almacenaje, Luz cocina cabaña 2) se omitían si su actividad no estaba
>     ya en el 2.0.
>   · **La puesta al día ya no retrocede.** Antes copiaba `ultimaRealizacion` siempre:
>     sobre una actividad ya hecha en el 2.0 —o sobre un proyecto, que nunca tiene
>     realización— **pisaba con null y borraba trabajo bueno**. Ahora solo escribe si el
>     viejo tiene dato y es más reciente que el del 2.0.
>   · Los títulos con emoji venían con caracteres rotos (`� Desarmado del piso`);
>     regenerados desde el export limpio.
>   · Sigue siendo idempotente: doble red por ID y por huella (actividad + instante de
>     inicio).
>
> · **`verificar-migracion.html` [NUEVO] — herramienta de SOLO LECTURA.** Trae las 80
>   sesiones y las 45 actividades del export embebidas y las busca una por una en el
>   2.0. Dos pasadas: por **ID** (la migración los conserva) y, para las que no
>   aparecen, por **huella**. Informa faltantes, horas que no coinciden, actividades que
>   faltan, y aparte —sin alarmar— las sesiones que existen **solo** en el 2.0, que son
>   el trabajo cargado después de migrar. Tabla de horas por persona comparando los dos
>   sistemas, y un informe en texto para copiar.
>   · Las personas se comparan **por mail**, nunca por uid: son dos proyectos Firebase
>     distintos.
>   · Veredicto arriba de todo: verde = se puede hacer el corte de dominio.
>
> · **Números del export del 28/07 para contrastar**: 80 sesiones · 32,21 h totales ·
>   Esteban 39 sesiones / 11,34 h · CasaVerde 35 / 5,00 h · Mauro 6 / 15,87 h.
>   Estados: 76 finalizadas + 4 pausadas (entran como finalizadas, tienen fin y horas).
>   Tipos: 44 manual · 34 cronómetro · 2 tilde.
>
> · **Orden de uso**: `traer-historial.html` → Calcular el plan → revisar → Escribir →
>   `verificar-migracion.html` → veredicto verde → recién ahí el corte de dominio.
> · Ninguna de las dos está en el menú ni en el shell del service worker: son
>   herramientas de una sola vez, se abren escribiendo la dirección.
> · **Honorarios: siguen sin migrarse.** Los 3 del viejo son reembolsos de gastos, con
>   `gastoId` y sin actividad: son cosa de Dinero, no del motor de actividades.

# v5.57 — El botón Atrás cierra los modales, en TODO el sistema (T11.7)

> **Registro v5.57 (Tanda 11.7 — nucleo.js · sw.js · CONVENCIONES.md → v2.11 ·
> GUIA-SITIO-PUBLICO.md [NUEVO]):**
>
> · **Cierre del pendiente de la 11.6.** En la PWA instalada, el botón Atrás sobre un
>   `<dialog>` abierto **salía de la aplicación** y se perdía el formulario a medio
>   cargar. Faltaba adoptar `CV2.capaAtras()` en cada modal.
>
> · **Se resolvió en `nucleo.js`, no página por página.** `CV2.dialogosConAtras()`
>   envuelve una sola vez `HTMLDialogElement.prototype.showModal` y `.close`, y se llama
>   desde `renderNav()`. Resultado: **los treinta y pico de modales del sistema quedan
>   cubiertos sin tocar una línea de las catorce páginas** — incluidos los que se
>   escriban mañana. `actividades.html`, `reservas.html` y `dinero.html` se revisaron y
>   **no necesitan ningún cambio**.
>   · Cubre también **Escape** y los `<form method="dialog">`, que cierran por dentro sin
>     pasar por `close()`: se escucha el evento `close` para limpiar el historial igual.
>   · `close(valor)` conserva el `returnValue`.
>   · **Contrapartida honesta**: es magia a nivel del navegador. Si algún día un modal se
>     porta raro con Atrás, el sospechoso es este envoltorio, y está todo en un solo
>     lugar. La alternativa —dos líneas repetidas en más de treinta lugares, desde el
>     teléfono— garantizaba olvidos, y el modal olvidado es justo el que expulsa de la app
>     con el formulario lleno.
>
> · **`CV2.capaAtras()` rehecho para soportar capas apiladas.** Antes registraba un
>   listener de `popstate` por capa: con un modal abierto desde otro, **un solo Atrás los
>   cerraba todos juntos**. Ahora hay una pila y un único listener. Y el `history.back()`
>   que hace el cierre manual se marca con `CV2._ignorarPop` para que ese `popstate`
>   —que no es del usuario— no cierre además la capa de abajo.
>
> · **`GUIA-SITIO-PUBLICO.md` [NUEVO]** — guía operativa para cambiar el sitio público:
>   qué se edita desde el panel sin tocar código (textos, WhatsApp, cabañas, espacios,
>   disponibilidad), qué exige subir archivos, las cinco reglas que no se rompen (el
>   `<head>` como contrato con Google, `lang="es"`, ninguna URL indexada en 404, enlaces
>   relativos, una página pública no importa `nucleo.js`), cómo se publica, checklist
>   previo y qué hacer cuando algo sale mal.
>   · **Queda pendiente un capítulo**: el mapa de la portada (qué parte de la pantalla
>     corresponde a cada clave de `config/sitio`). Falta ver `index.html` y
>     `textos-sitio.js`.
>
> · `sw.js` v51 → **v52**.
> · **Acción**: subir `nucleo.js` y `sw.js`, cerrar la app del todo y reabrir. Probar:
>   abrir cualquier formulario y tocar Atrás — tiene que cerrarse el formulario y quedarse
>   en la página.

# v5.56 — NAVEGACIÓN PARA EL TELÉFONO · la barra se va abajo (T11.6)

> **Registro v5.56 (Tanda 11.6 — nucleo.js · design-system.css ·
> interno/img/logo-barra.png [NUEVO] · sw.js · CONVENCIONES.md → v2.9):**
>
> **Dato que cambia el diseño**: el administrador informa que **el uso principal del
> panel es en teléfono Android, con la PWA instalada desde Chrome**. Hasta ahora todo
> se venía diseñando para escritorio/iPad. Queda registrado como **CONVENCIONES §6.0**,
> primera regla de la sección de interfaz: se diseña para el teléfono y se adapta al
> escritorio, nunca al revés.
>
> · **El problema**: 14 ítems sueltos en una fila arriba. En el teléfono se parten en
>   tres renglones, comen pantalla en todas las páginas y **la esquina superior no se
>   alcanza con una mano**.
>
> · **La barra se va abajo.** Cuatro destinos de todos los días —Inicio, Tareas,
>   Calendario, Chat— más **Más**, que abre una hoja desde abajo con el resto agrupado:
>   *Alojamiento* (Reservas, Clientes), *Plata* (Dinero, Cobros, Sesiones, Horas) y
>   *Sitio* (Cabañas, Espacios, Recuerdos). De 14 botones a 5, todos al alcance del pulgar.
>   · `CV2.NAV` gana el campo **`grupo`** (`'directo' | 'alojamiento' | 'plata' |
>     'sitio' | 'cuenta'`) y un `corto` para la etiqueta de la pestaña. Sigue siendo la
>     fuente única: el orden del Inicio y los permisos no cambian.
>   · `CV2.GRUPOS` define los títulos y el orden dentro de la hoja.
>   · Si la página activa está adentro de la hoja, la pestaña **Más** queda marcada.
>
> · **Cabecera mínima de 50px** —logo, título de la página, inicial de la persona— que
>   **se esconde al bajar** y vuelve al subir. Adentro de la app la marca ya la puso el
>   ícono del escritorio del teléfono: el protagonismo es del título, que es lo que
>   orienta. El logo va recortado (sin "APARTAMENTOS RÚSTICOS"), 2:1, en
>   `interno/img/logo-barra.png`, con respaldo a `logo-sitio.png` si la copia todavía
>   no está.
>
> · **Cuatro cosas de PWA instalada que el diseño anterior ignoraba:**
>   · **El botón Atrás de Android cierra la hoja, no la aplicación.** `pushState` al
>     abrir + `popstate` al volver. Sin esto, cerrar algo con Atrás expulsa de la app y
>     se pierde lo que se estaba cargando. Queda como helper reutilizable
>     **`CV2.capaAtras(cerrar)`**: cualquier `<dialog>` del sistema puede adoptarlo sin
>     repetir la lógica.
>   · **`env(safe-area-inset-bottom/top)`**: instalada, la app dibuja debajo de la barra
>     de estado y por encima de la franja de gestos. Sin los respiros, el último botón
>     queda tapado.
>   · **`overscroll-behavior-y: contain`** en `html, body`: tirar hacia abajo ya no
>     recarga la aplicación (se perdía lo no guardado).
>   · **Nada depende de `hover`**; la devolución al tocar es `:active` y se apaga el
>     recuadro gris del sistema (`-webkit-tap-highlight-color`).
>
> · **En ≥900px la misma barra se acomoda arriba** en horizontal y las hojas se vuelven
>   menús anclados. Es un `@media`, **no un segundo diseño**.
>
> · **`design-system.css`**: el bloque `.nav*` viejo se reemplaza entero por el de
>   `cv-*`, escrito con los tokens que ya existían (nada de colores nuevos sueltos).
>   Además, tres arreglos de fondo que ahora son regla (§6.0):
>   · **el toast subió por encima de la barra**: aparecía tapado justo cuando había que
>     leerlo. Ahora `bottom: calc(26px + alto de barra + safe-area)`, y vuelve a 26px en
>     pantalla grande;
>   · **`.btn`, `input`, `select` y `textarea` pasan a `min-height: 44px`** — objetivo
>     táctil real; antes quedaban en ~38px;
>   · **`:active` en los botones**, porque en el teléfono el `:hover` no existe y no
>     había ninguna señal de que el toque hubiera entrado.
> · `CV2.marcarNovedad(id, hay)` [NUEVO]: enciende un puntito rojo en una pestaña. Lo
>   usará el Inicio para los mensajes sin leer.
> · El listón de admin ahora marca `body.cv-admin` y la cabecera le deja 8px, en vez de
>   taparla.
> · **Ninguna página se toca**: todas siguen llamando `CV2.renderNav(activo)` y
>   conservan su `<div id="nav"></div>`. La barra y las hojas son `position: fixed`, así
>   que no importa dónde esté ese div.
> · **`sw.js` v50 → v51**, con `recuerdos.html` y `img/logo-barra.png` sumados al shell
>   (`recuerdos.html` **faltaba** desde que se creó la página).
>   · **Y un arreglo que evita un dolor de cabeza futuro**: el `install` usaba
>     `addAll`, que es todo o nada — si UN archivo de la lista falta o da 404, la
>     instalación entera falla, el service worker nuevo **nunca se activa** y la app
>     sigue servida por el viejo. Parece que el deploy no hizo nada y no hay error a la
>     vista. Ahora precachea de a uno tolerando faltantes; lo que no esté se busca por
>     red igual, que es la estrategia de todos modos.
> · **Acción**: subir `design-system.css`, `nucleo.js`, `interno/img/logo-barra.png` y
>   `sw.js`; después cerrar la app **del todo** y reabrir. Probar **en el teléfono con
>   la app instalada**, no en la ventana angosta del navegador: la barra de gestos y el
>   botón Atrás solo existen ahí.
> · **Pendiente**: migrar los `<dialog>` de las páginas a `CV2.capaAtras()` (hoy el
>   Atrás sobre un formulario abierto sigue sacando de la app) y actualizar el Manual
>   con la navegación nueva.

# v5.55 — RECUERDOS · la clave del QR es la llave (T11.5)

> **Registro v5.55 (Tanda 11.5 — recuerdos.html [raíz] · interno/recuerdos.html ·
> firestore.rules · CONVENCIONES.md → v2.8 · manual.html):**
>
> **Contexto**: el muro de recuerdos se desarrolló **fuera de los chats del proyecto**
> y llegó funcionando pero con un supuesto sin cerrar. Esta tanda lo cierra y lo
> incorpora al documento único.
>
> **Pedido del administrador**: que un recuerdo **solo pueda generarse a partir de una
> clave que llega al sitio por el QR**, y que el sitio la conteste como una apikey.
>
> · **El agujero que había.** Con una sesión anónima alcanzaba para escribir, y una
>   sesión anónima se la abre cualquiera desde la consola del navegador sin haber
>   pisado Canasvieiras. El QR no era un permiso: era una comodidad. El `?c=<cabaña>`
>   además dejaba que el visitante eligiera en qué alojamiento decía haber estado.
>
> · **Colección nueva `/claves_recuerdos/{clave}`**, donde **el ID del documento ES la
>   clave** (`cabanaId, etiqueta, activa, vence, creadaEn, creadaPor`).
>   · QR: **`recuerdos.html?k=<clave>`**. El `?c=` **desaparece**: el alojamiento lo
>     dice la clave y el formulario ya no lo pregunta.
>   · **`get` abierto, `list` cerrado**: se verifica una clave puntual —hay que saberla
>     entera— pero nadie enumera la colección. Eso permite avisar que el código no vale
>     ANTES de que el huésped escriba 600 caracteres, sin regalar la lista de códigos.
>   · La página responde con código visible: `SIN_CLAVE`, `CLAVE_DESCONOCIDA`,
>     `CLAVE_INACTIVA`, `CLAVE_VENCIDA`, `SIN_RED`. Sin clave válida **no hay botón de
>     escribir**; el muro se sigue leyendo normal.
>   · La clave se **borra de la barra de direcciones** y se **recuerda 15 días** en ese
>     navegador (sobrevive al viaje del login con Google por redirección).
>   · **Una clave por QR, revocable de a una**: si se filtra un cartel se da de baja esa
>     clave y se reimprime solo esa. Es la diferencia con el token único del sistema
>     viejo, que obligaba a reimprimir todo.
>   · Claves de 12 caracteres al azar sobre 31 símbolos sin `0/O` ni `1/l/I`, prefijo
>     `cvc-`, generadas con `crypto.getRandomValues`.
>   · **La frontera es la regla**, no la página: el `create` de `/recuerdos/` exige la
>     clave, activa, vigente, y que el `cabanaId` coincida con el de la clave.
>
> · **FUGA ENCONTRADA Y CERRADA.** Un recuerdo publicado lo lee cualquier navegador del
>   mundo y **en Firestore no hay seguridad por campo**: si el documento es legible,
>   TODOS sus campos lo son. Estaban quedando adentro la clave del QR y el **mail del
>   huésped** — el mismo que el formulario promete que "no se publica".
>   · Al moderar, el panel archiva `email`, `clave`, `claveEtiqueta`, `uid` y
>     `proveedor` en **`/recuerdos_contactos/{mismoId}`** (solo `contenido`) y los borra
>     del recuerdo con `deleteField()`.
>   · **La regla lo exige**: rechaza cualquier `update` que deje `clave` o `email`
>     puestos. No depende de que el código se acuerde.
>   · El sistema viejo (v4.31, `libro_visitas`) tenía la misma fuga con su token y
>     nunca se notó porque nadie miró la colección con la API. Queda como regla dura en
>     **CONVENCIONES §5.15**.
>
> · **`/huespedes/{uid}` [NUEVO] — registro de huéspedes** (pedido del administrador,
>   pensando en interacción directa, reservas sin comisión y promociones):
>   quien deja un recuerdo queda anotado, con el uid de Auth como ID.
>   · Con Google el uid es **estable** → la persona se reconoce entre visitas. Anónimo,
>     el uid es **del dispositivo** → vale como contacto, no como identidad.
>   · Campos: `nombre, email, proveedor, cabanaId, clave, claveEtiqueta, idioma,
>     novedades, primeraVez, ultimaVez`. `primeraVez` no se reescribe nunca (la regla lo
>     compara contra el valor guardado).
>   · **`novedades` es un sí explícito y separado**, nunca marcado por defecto: es la
>     única base legítima para mandarle algo (LGPD). El casillero solo aparece si dejó
>     mail.
>   · Cada uno escribe **solo su documento**, y con la clave del QR en la mano: sin eso,
>     cualquiera con sesión anónima llenaría la lista de basura.
>   · **Nada de esto manda mails todavía.** Es la base de datos, que es lo que se pierde
>     para siempre si no se captura desde el día uno. El envío (segmentar, plantillas,
>     baja) es una tanda futura y **no necesita tocar nada de esto**.
>
> · **`interno/recuerdos.html` — tres solapas**: *Recuerdos* (moderación, igual que
>   antes), *Claves y QR* y *Huéspedes*.
>   · Claves: alta (alojamiento + nombre del código + vencimiento opcional), **QR en
>     pantalla generado en el navegador** con `qrcodejs` por CDN —la clave no sale del
>     dispositivo, no la ve ningún servicio de terceros—, imprimir en hoja limpia,
>     copiar la dirección, dar de baja / reactivar / borrar.
>   · **La dirección base del QR es editable y queda guardada** en el navegador. Por
>     defecto `https://casaverdecanas.com.br/recuerdos.html`, la definitiva, aunque se
>     esté probando en `github.io`: **un QR impreso no se corrige.**
>   · Huéspedes: lista con quién acepta novedades, copiar los mails que aceptaron, bajar
>     la lista en CSV (se arma en el propio navegador, no sale a ningún servidor) y dar
>     de baja a quien lo pida.
>   · Esto reemplaza al `qr-recuerdos.html` del sistema viejo, que **no se podía subir
>     al servidor** porque llevaba el token en texto plano. Ahora las claves viven en
>     Firestore detrás de un permiso.
>
> · **Bug de paso**: las dos páginas mostraban `cabanas.nombre` crudo, y en el 2.0 ese
>   campo es `{es, pt, en}` → imprimía `[object Object]`. Resuelto con `nombreCabana()`
>   local en cada una (la página pública no puede importar `nucleo.js`).
>
> · **`firestore.rules` completo**: funciones `claveDeRecuerdo()` y `claveValida()`;
>   bloques nuevos `/claves_recuerdos/`, `/recuerdos_contactos/` y `/huespedes/`;
>   `/recuerdos/` reescrito (create con clave, `hasOnly`, `cabanaId` igual al de la
>   clave, `foto` restringida a nuestro Cloudinary por `matches()`; update que prohíbe
>   `clave` y `email`).
> · **`CONVENCIONES.md` v2.7 → v2.8**: §3.13 (página pública sin `nucleo.js`), §4 con
>   las cuatro colecciones nuevas, §5 puntos 13 a 17 (modelo apikey, "lo que se publica
>   se publica entero", molde de escrituras de afuera, consentimiento del huésped), y
>   trampas nuevas en §8/§9.
>
> · **Acción del administrador, en este orden:**
>   1. Crear `preset-recuerdos` en Cloudinary (carpeta propia, solo imágenes, tope 10 MB).
>   2. Activar **Anónimo** y **Google** en Authentication de `casaverde-20`.
>   3. Publicar `firestore.rules` **completo** y probar los cinco casos del simulador.
>   4. Subir `recuerdos.html` (raíz) e `interno/recuerdos.html`.
>   5. En el panel: crear **una clave por cabaña**, confirmar la dirección base,
>      imprimir los tres QR, pegarlos y **retirar los carteles viejos**.
>   6. Probar el circuito con el teléfono y verificar en la consola que el documento
>      publicado **no** tiene `clave` ni `email`.
> · **Ojo con los QR ya impresos**: los del sistema viejo llevan
>   `?cabana=X&k=cvc-d1ca0f0a`, token que en el 2.0 no existe. Quien los escanee cae en
>   la puerta con `CLAVE_DESCONOCIDA` y ve el muro sin formulario. Cierre digno, pero
>   hay que reemplazar los tres carteles.
> · `sw.js` **no se toca**: ninguna de las dos páginas es shell (`firebase-init.js`,
>   `nucleo.js` y `design-system.css` quedan igual).
> · **Pendiente de esta tanda**: Manual (→ v5.54) como cierre, ya con el capítulo de
>   Recuerdos reescrito (claves, QR y códigos de error).

# v5.54 — Mensajes dirigidos · un solo camino para las imágenes (T11.4)

> **Registro v5.54 (Tanda 11.4 — comunicacion.html · index.html · nucleo.js ·
> actividades.html · dinero.html · cabanas.html · espacios.html ·
> migracion-fotos.html [NUEVO] · firestore.rules · CONVENCIONES.md · sw.js):**
>
> **Pedido del administrador**: (1) que el chat permita mandar mensajes a todos o a
> alguien en particular; (2) que el Inicio deje de mostrar "nuevo" en mensajes ya
> leídos; (3) que la carga de fotos habilite cámara **y** archivos, planteado como
> cambio general del sistema; (4) migrar a Cloudinary las fotos que no estén ahí.
>
> · **El cartel "nuevo" era un desajuste de forma, no de lógica.**
>   `comunicacion.html` escribía las lecturas **planas** (`{comId: Timestamp}`) y
>   `index.html` leía un campo anidado **`vistos` que nunca existió** → recibía siempre
>   `{}` y por lo tanto **todo** aparecía sin leer, para siempre. La lógica de novedad
>   estaba impecable. Queda como regla: comparar camino de escritura contra camino de
>   lectura antes de revisar la lógica (**CONVENCIONES 3.12**).
>   Se agrega además el criterio que faltaba: un tema cuyo último mensaje lo escribí yo
>   no es novedad.
>
> · **Mensajes dirigidos, sin módulo aparte.** Se aprovecha el campo `audiencia` que ya
>   existía (siempre `'equipo'`): ahora `'equipo' | 'directo'` + `participantes [uid]`
>   en el mismo documento. **Privacidad real por regla de Firestore**, no filtrada en la
>   interfaz; los mensajes heredan el alcance del tema padre.
>   · Temas heredados **sin** `audiencia` se tratan como `'equipo'` (`.get(_, 'equipo')`)
>     y el admin los rellena solo al abrir el chat, una vez. Sin día cero.
>   · **Trampa detectada y corregida en la misma tanda**: el `getDocs` sin filtrar de
>     `index.html` sobre `comunicaciones` **habría fallado entero** para los
>     colaboradores bajo la regla nueva (regla 3.3: falla la consulta, no el documento).
>     Al cerrar una colección hay que revisar TODAS las páginas que la consultan.
>   · Cualquier participante puede `update` el tema — es obligatorio, cada mensaje mueve
>     `ultimaActividad`. Que solo creador/admin sumen personas se cumple en la interfaz.
>   · **Borrado por persona y por mensaje** en `comunicaciones_lecturas/{uid}.eliminados`:
>     oculta en la vista de quien borra sin tocar el mensaje del otro, con pestaña de
>     eliminados y restaurar. Cero reglas nuevas en `mensajes`.
>   · Estructura de lecturas pasa a `{ lecturas:{...}, eliminados:{...} }`; el formato
>     viejo se sigue leyendo como respaldo (sin migración).
>   · **Límite asumido**: las fotos de un tema privado **no son privadas** (preset de
>     Cloudinary sin firma → la URL es pública). Documentado en CONVENCIONES §4.
>
> · **Cuatro implementaciones distintas de "subir una foto".** Buscando por qué no
>   andaba la cámara aparecieron cuatro caminos, cada uno con su propia falla:
>   · `dinero.html` — copia propia de Cloudinary, **sin comprimir**, sin cámara.
>   · `cabanas.html` — ídem (las fotos del sitio público se subían enteras).
>   · `espacios.html` — comprimía, pero sin cámara.
>   · `actividades.html` — `capture="environment"`: **solo cámara, imposible elegir un
>     archivo** ya sacado. El espejo exacto del problema.
>   Diagnóstico de fondo: **`accept="image/*"` a secas no garantiza la cámara** (en iPad
>   abre solo archivos) y **`capture` la fuerza y esconde los archivos**. Ningún input
>   solo sirve para las dos cosas → van **dos inputs** y la persona elige.
>   Las cuatro reemplazadas por **`CV2.elegirYSubirImagen()`** (`nucleo.js`):
>   hoja de *Tomar foto / Elegir archivo* + compresión + subida + URL de entrega.
>   `CV2.subirImagen(file)` se conserva con la misma firma → ninguna página se rompe.
>   `api.cloudinary.com` queda en **un único archivo** del sistema (**CONVENCIONES 3.11**).
>
> · **Fotos ya subidas: no se reencodean, se sirven transformadas.** `CV2.urlEntrega()`
>   mete `f_auto,q_auto,w_2000` en la URL de Cloudinary y es **idempotente**. Guardar la
>   URL de entrega hace que el **sitio público reciba WebP/AVIF sin una línea de código**
>   (no importa `nucleo.js`). Más barato y mejor que volver a subir.
>
> · **`migracion-fotos.html` [NUEVO]** — herramienta de mantenimiento (permiso
>   `contenido`), pensada para correrse desde iPad: **Analizar** (no escribe nada, informe
>   con cuántas están bien / solo cambiar URL / hay que traer / con problema) y después
>   **Migrar**. Idempotente y reanudable; relee cada documento y se saltea la foto que
>   cambió desde el análisis en vez de pisarla. Guarda documento por documento.
>   · Mismo origen → baja, comprime con canvas y sube. Otro origen → se la pasa a
>     Cloudinary y **la baja Cloudinary** (evita el CORS del navegador).
>   · **Decisión expresa: las imágenes del shell NO se migran** — `logo-sitio.png`,
>     `logo-pie.png`, `ilustracion-hero.jpg`, `icono-192.png`, `apple-touch-icon.png`.
>     Las precachea el service worker y `manifest.json` las necesita del mismo origen
>     para instalar la PWA. Migrarlas rompería la instalación y la primera carga.
>     Anotado en CONVENCIONES §9.
>   · Se tapa la causa de origen: **"Pegar URL" de `cabanas.html`** guardaba links ajenos
>     sin validar (una foto que desaparece el día que ese servidor cambie). Ahora trae la
>     copia a Cloudinary.
>
> · **`CONVENCIONES.md` v2.6 → v2.7**: reglas **3.11** (toda imagen por `CV2`) y **3.12**
>   (verificar la forma del dato antes que la lógica); §4 reescrito para `comunicaciones`,
>   nuevo bloque `comunicaciones_lecturas/{uid}`, y la convención de URL de entrega en
>   `cabanas.fotos` / `espacios_comunes.fotos`; §8 y §9 con las trampas nuevas.
> · `firestore.rules` completo: alcance por `audiencia`/`participantes` en
>   `comunicaciones` y herencia en `mensajes` vía `comVisible()`.
> · sw shell **v45 → v48** (+ `migracion-fotos.html`).
> · **Acción**: subir `firestore.rules` **primero**, después las siete páginas +
>   `nucleo.js` + `sw.js`, cerrar la app del todo y reabrir. `firebase-init.js` y
>   `actividades-core.js` **no se tocan**.
> · **Pendiente de esta tanda**: correr `migracion-fotos.html` una vez (Analizar →
>   Migrar) y actualizar el Manual (→ v5.53) como cierre.

# v5.53 — Se elimina la conversión a reales de Dinero (T11.3)

> **Registro v5.53 (Tanda 11.3 — dinero.html · balance.html · reservas.html ·
> CONVENCIONES.md · sw.js):**
> · **Observación del administrador**: si cada moneda es independiente, el campo
>   "equivalente en R$" de los formularios **no significa nada**. Correcto: era el
>   último resto del modelo viejo con pivote en reales.
> · **Confirmado además que el balance ya contempla las TRES monedas** (BRL, USD, UYU):
>   agrupa por `m.moneda` dinámicamente, no hay monedas fijas en el código. Los pesos
>   uruguayos entran solos como un sistema más.
> · **Cambios:**
>   · `dinero.html` — **fuera el campo de equivalente** del alta de movimiento. En su
>     lugar, un aviso al elegir moneda: "Se registra en X y se controla aparte de los
>     reales". La plata se guarda como es; `montoBRL` solo se completa si el movimiento
>     fue en reales (compatibilidad con lo ya cargado).
>   · `enBRL()` pasa a ser **honesto**: suma solo lo que ESTÁ en reales, en vez de
>     mezclar equivalentes. Los totales por moneda ya viven en `porMoneda`.
>   · Fuera el "≈" de la línea; el confirm de saldar muestra la moneda real.
>   · **CSV**: se reemplaza la columna `monto_BRL` por `cuenta`, que sí aporta.
>   · `balance.html` — eliminado el `enBRL` que ya no se usaba.
>   · `reservas.html` — se agrega **UYU** a la moneda de la reserva, para que las tres
>     monedas estén disponibles en todo el circuito.
> · **Lo que SÍ se conserva**: el `montoEquiv` de un pago de reserva. No es un pivote —
>   existe solo porque el saldo de una reserva tiene que cerrar en SU moneda, y sin él no
>   se sabría cuánto de la deuda cubrió un pago hecho en otra. La distinción quedó
>   escrita en CONVENCIONES §1.
> · **`CONVENCIONES.md` v2.5 → v2.6**: el principio de multimoneda ahora dice
>   explícitamente que **no hay pivote ni conversión en Dinero**, y aclara la única
>   excepción.
> · sw shell **v45**. Sin cambios de reglas.

# v5.52 — BALANCE POR MONEDA (T11.2) · cierra el multimoneda

> **Registro v5.52 (Tanda 11.2 — balance.html · dinero.html · CONVENCIONES.md · sw.js):**
> · **Se salda el pendiente crítico**: el asistente de Balance ya no es solo en R$.
>   Cada moneda es un sistema aparte, con su propio cero.
> · **Etapa 1 (revisar)**: cada línea se muestra en SU moneda, no convertida.
> · **Etapa 3 (calculado)**: las cuentas se agrupan por **cuenta + moneda** — una cuenta
>   en dólares y otra en reales son dos líneas distintas. La vista se separa por moneda
>   con su encabezado.
> · **Etapa 4 (real)**: un campo por cuenta+moneda, agrupado por moneda.
> · **Diferencias**: una por moneda. Sumar diferencias de monedas distintas no
>   significaría nada, así que se muestran por separado con su explicación
>   (falta plata = gasto no registrado · sobra = entró algo sin cargar).
> · **Etapa 5 (resumen y cierre)**: entró/salió/ajuste **por cada moneda**.
> · **El cierre guarda `totalesPorMoneda[]`** y `cuentas[]` con su `moneda`. Se conserva
>   el bloque `totales` en R$ por compatibilidad con los cierres viejos y la vista de
>   historial.
> · **Las líneas de apertura nacen en la moneda de su cuenta** (`montoBRL` solo si es
>   R$), así cada cuenta arranca su nuevo período con su saldo real en su moneda.
> · **Historial en Dinero**: muestra la moneda de cada cuenta en el detalle
>   sistema → real (ajuste).
> · **`CONVENCIONES.md` v2.4 → v2.5**: `cierres` documentado con `totalesPorMoneda` y
>   `cuentas[].moneda`, y el criterio de que el balance corre por moneda.
> · sw shell **v44**. Sin cambios de reglas.
> · **YA SE PUEDE CERRAR UN BALANCE CON MOVIMIENTOS EN DÓLARES.** Queda levantada la
>   advertencia de v5.48/v5.51.
>
> **Pendientes que quedan (ninguno de desarrollo):**
> 1. Publicar el sitio: cargar el WhatsApp desde el panel y renombrar
>    `index-publico.html` → `index.html` en la RAÍZ (el de novedades va en `interno/`).
> 2. Fase 4 — operación en paralelo con el equipo.

# v5.51 — CONVENCIONES v2.4 (T12.3)

> **Registro v5.51 (Tanda 12.3 — CONVENCIONES.md v2.3 → v2.4):**
> Repaso de todo lo trabajado desde la v2.3. Se documentó:
> · **§1 — principio nuevo: "cada moneda es un sistema aparte".** Reales y dólares nunca
>   se suman entre sí, en ningún total, saldo ni balance. La conversión es una referencia
>   declarada a mano en un momento puntual, jamás el pivote de los cálculos.
> · **§3.9 NUEVO — nada decorativo en el camino crítico de autenticación** (la lección
>   del admin trancado): `verificarAuth` resuelve primero, los adornos van después y
>   aislados. Y el catch de auth **no redirige en silencio**: muestra el error con su
>   código, porque un rebote mudo es imposible de diagnosticar. Renumera 3.9 → 3.10.
> · **§4 `reservas`** — `moneda` + `total`; la reserva vive en su moneda toda su vida;
>   `totalBRL` queda solo por compatibilidad.
> · **§4 `pagos`** — `montoEquiv` + `monedaReserva`; la plata se guarda en la moneda en
>   que entró (la cuenta la define) y el equivalente se pide **en la moneda de la
>   reserva**, no siempre en reales.
> · **§4 `movimientos`** — la moneda del movimiento es la de su cuenta; totales, saldos
>   y pendientes se agrupan por moneda. Y la distinción **`m.cierreId` (balance actual)
>   vs `m.pendiente.cierreId` (viejo)**, que fue el bug de los pendientes eternos.
> · **§4 `usuarios`** — `ultimaVisitaInicio`, el único campo que cada uno puede escribir
>   de su propio documento.
> · **§6.10 NUEVO — el Inicio es una portada de novedades, no un tablero**: orden de
>   `CV2.NAV`, marca de visita después de pintar, estado vacío con sentido.
> · **§8 trampas** — confundir los dos `cierreId`; sumar sin mirar la moneda; y que un
>   movimiento en otra moneda sin `montoBRL` cuenta como CERO en los totales en reales.
> · **§9** — no sumar monedas distintas; no ejecutar nada opcional antes de resolver la
>   autenticación.
> · Sin cambios de código.
>
> **Recordatorio de pendientes abiertos:**
> 1. **T11.2 — el asistente de Balance sigue siendo solo en R$.** Hay que hacerlo por
>    moneda (cada una con sus cuentas, su saldo calculado, su real y su propio cero).
>    Hasta entonces, **no cerrar un balance si hay movimientos en dólares**.
> 2. Publicar el sitio: cargar el WhatsApp desde el panel y renombrar
>    `index-publico.html` → `index.html` en la RAÍZ (el `index.html` de novedades va en
>    `interno/`).
> 3. Fase 4 — operación en paralelo con el equipo.

# v5.50 — FIX · pendientes que sobrevivían al balance y sin detalle (T12.2)

> **Registro v5.50 (Tanda 12.2 — dinero.html · sw.js):**
> · **Reporte del administrador**: el panel "Pendientes por persona" mostraba montos que
>   no se actualizaban con el balance, sin forma de ver el detalle, ni para admin ni para
>   colaborador. Tres problemas distintos, uno de ellos un bug real.
> · **BUG — los pendientes sobrevivían al balance.** `pendientesVivos` descartaba por
>   `m.pendiente.cierreId` (campo del modelo VIEJO de balance), pero el asistente nuevo
>   sella los movimientos con **`m.cierreId`** en la raíz. Resultado: un pendiente
>   cerrado por un balance seguía apareciendo para siempre. **Arreglo**: se descarta
>   también por `m.cierreId`.
> · **BUG de multimoneda (heredado de T11.1)**: los pendientes sumaban montos de
>   distintas monedas en un solo total. Ahora se agrupan por **clase + persona +
>   moneda**, y cada fila muestra su moneda. Deber dólares no es deber reales.
> · **Faltaba el detalle**: la tarjeta mostraba un total sin forma de saber de dónde
>   salía. Ahora **cada fila es tocable** y abre el detalle con los movimientos que lo
>   componen (fecha, concepto, cuenta, monto). Con permiso `finanzas` se puede **saldar
>   uno por uno o todos juntos** desde ahí.
> · **Aclaración de alcance** (no era un bug, pero confundía): los pendientes se calculan
>   sobre TODO lo vivo, mientras la lista de abajo respeta el filtro de período. Es
>   correcto —una deuda no desaparece porque filtres por mes— pero ahora el título lo
>   dice: "todo lo vivo, sin importar el filtro de arriba".
> · sw shell **v43**. Sin cambios de reglas.
> · **Nota sobre los pendientes visibles hoy** (Esteban R$27,50 y Mauro R$15): son los
>   dos reembolsos que trajo la migración desde `honorarios` del sistema viejo. Son
>   reales; con el detalle ahora se puede ver de qué son y saldarlos.

# v5.49 — INICIO · portada de novedades por usuario (T12.1)

> **Registro v5.49 (Tanda 12.1 — interno/index.html · firestore.rules · sw.js):**
> · **Pedido del administrador**: el Inicio deja de ser una visualización de chequeo y
>   pasa a ser **la lista de novedades** de cada usuario: últimas modificaciones no
>   vistas, mensajes sin leer, y un resumen de lo importante para esa persona. Si ya vio
>   todo, lo último de cada sección habilitada, **en el mismo orden del menú**, y al
>   tocar se entra a la página.
> · **`interno/index.html` reescrito de cero.** Junta, respetando permisos:
>   1. **Actividades** — lo vencido o que vence hoy (incluye limpiezas y controles).
>   2. **Reservas** (permiso `reservas`) — presupuestos sin confirmar, quién llega hoy y
>      quién se va hoy.
>   3. **Chat** — conversaciones con actividad posterior a tu última lectura
>      (`comunicaciones_lecturas/{uid}`), que es el mismo mecanismo que ya usaba el chat.
>   4. **Tu cronómetro** si quedó andando, con hace cuánto arrancó.
>   5. **Cobros** — cuánto te deben; con `finanzas`, también lo que el equipo espera.
>   6. **Dinero** (permiso `finanzas`) — pendientes por reponer y por cobrar.
> · **El orden lo manda `CV2.NAV`**: la portada se lee igual que el menú, como pidió el
>   administrador. Cada bloque tiene su "ver todo →".
> · **Qué es "nuevo"**: se guarda `usuarios/{uid}.ultimaVisitaInicio` y se marca con el
>   chip NUEVO lo posterior a esa marca. **La marca se escribe DESPUÉS de pintar**, para
>   que lo que se acaba de mostrar como nuevo no desaparezca en la misma visita.
> · **Regla nueva y acotada**: cada usuario puede actualizar **solo el campo
>   `ultimaVisitaInicio`** de su propio documento (`diff().affectedKeys().hasOnly(...)`),
>   sin poder tocar su rol ni sus permisos. Mismo patrón que ya se usó antes.
>   Si la regla no está publicada, la página **funciona igual**: todo se sigue viendo
>   como nuevo (el error se loguea, no rompe).
> · **Estado vacío con sentido**: si no hay nada pendiente, dice "Todo al día" en vez de
>   una lista vacía.
> · Todo con `getDocs` (una foto al entrar), sin `onSnapshot` — regla 3.2.
> · sw shell **v42**.
> · **Acción**: subir `interno/index.html` + `sw.js`, republicar `firestore.rules`
>   COMPLETO y reabrir la app.

# v5.48 — MULTIMONEDA · la reserva vive en su moneda (T11.1)

> **Registro v5.48 (Tanda 11.1 — reservas.html · dinero.html · sw.js):**
> · **Cambio estructural pedido por el administrador**: buena parte de las reservas de
>   Uruguay y Argentina se tramitan en **dólares**, y ese dinero entra en cuentas fuera
>   de Brasil. El real deja de ser el pivote único.
> · **La reserva declara su moneda al nacer (`moneda`: BRL o USD) y vive ahí toda su
>   vida**: total, señas, saldos y "pagada / falta tanto" se muestran y calculan en esa
>   moneda. Campo nuevo `total` (con `moneda`); se conserva `totalBRL` por
>   compatibilidad con las reservas viejas, que se asumen en R$.
> · **Los pagos se guardan en la moneda en que ENTRÓ la plata** (la cuenta define la
>   moneda). Si el pago viene en una moneda distinta a la de la reserva, se pide el
>   **equivalente en la moneda de la reserva** — no siempre en reales:
>   · Reserva en U$D + pago en R$ → se pide el equivalente en U$D.
>   · Reserva en R$ + pago en U$D → se pide el equivalente en R$.
>   Campos: `monto`, `moneda`, **`montoEquiv`**, `monedaReserva`. El saldo de la reserva
>   suma los `aporte(p, monedaReserva)`.
> · **El movimiento que el pago crea en Dinero va en su moneda real**, sin conversión
>   forzada a reales. `montoBRL` se completa solo cuando el ingreso fue en R$.
> · **Dinero separa por moneda** (era imprescindible: si no, los ingresos en dólares
>   habrían contado como CERO y los totales mentirían):
>   · `totalizar` devuelve además **`porMoneda[]`**. Reales y dólares **nunca se suman
>     entre sí**.
>   · Los KPIs muestran R$ arriba y, si hay otras monedas, **una fila propia por cada
>     una** debajo.
>   · El saldo por cuenta agrupa por **cuenta + moneda**: cada cuenta muestra su saldo
>     en su moneda, sin mezclar.
> · **Supuestos tomados (confirmar si no van)**: limpiezas y honorarios siguen **siempre
>   en R$** (trabajo local); las cuentas que ya existen se consideran **en reales**.
> · sw shell **v41**. Sin cambios de reglas.
> · **PENDIENTE — T11.2**: el **asistente de Balance sigue siendo solo en R$**. Hay que
>   hacerlo por moneda: cada una con sus cuentas, su saldo calculado, su real y su propio
>   cero. Hasta entonces, NO cerrar un balance si hay movimientos en dólares.
> · Pendiente menor: `CONVENCIONES.md` (§4 reservas/pagos/movimientos) hay que
>   actualizarlo con el modelo multimoneda cuando cierre T11.2.

# v5.47 — FIX URGENTE · la app se trancaba al entrar el admin (T10.1)

> **Registro v5.47 (Tanda 10.1 — nucleo.js · sw.js):**
> · **Síntoma**: la app quedaba trancada al loguearse `casaverdecanas@gmail.com` (admin).
>   Solo con esa cuenta.
> · **CAUSA ESTRUCTURAL**: en `verificarAuth`, `_listonAdmin()` —el listón amarillo/negro
>   que marca la sesión admin— era **lo único que corría distinto para el admin**, y
>   estaba **dentro del try, ANTES de `resolver()`**. Si fallaba por cualquier motivo,
>   caía al catch → `signOut` → login → volvés a entrar → mismo error: **bucle infinito**
>   que se ve como la app congelada. Un adorno podía impedir el ingreso.
> · **Arreglos (dos, ambos de fondo):**
>   1. **`resolver()` va primero.** Nada decorativo corre antes de dejar entrar. El
>      listón queda después y con su propio try/catch: si falla, se loguea un warning y
>      la sesión sigue.
>   2. **El catch ya no redirige en silencio.** Si el perfil no carga, se muestra en
>      pantalla el mensaje con el código de error y un botón para volver al login. Un
>      bucle mudo es imposible de diagnosticar; ahora el error se ve y se puede reportar.
>   · Además, `_listonAdmin` verifica que exista `document.body` y **no apila listones**
>     si `onAuthStateChanged` dispara más de una vez (usa un id fijo).
> · **Principio que queda establecido**: nada opcional, decorativo o secundario puede
>   ejecutarse en el camino crítico de autenticación. Primero se entra; los adornos
>   después y aislados.
> · sw shell **v40**. Sin cambios de reglas.
> · **Acción inmediata**: subir `nucleo.js` + `sw.js` y reabrir la app por completo.
>   Mientras tanto, se puede trabajar con el usuario Mauro (tiene todos los permisos).

# v5.46 — CONVENCIONES al día (T9.4)

> **Registro v5.46 (Tanda 9.4 — CONVENCIONES.md v2.2 → v2.3):**
> · Revisión de qué había quedado sin documentar. **Faltaba todo el ciclo de limpieza**,
>   que es la pieza más compleja del sistema y la que más caro sale reconstruir de
>   memoria. Agregado:
>   · **`chequeos/{chequeo-<reservaId>}`** — la colección no estaba documentada. Se
>     describe como "el acta" (la actividad de faltantes es el pendiente accionable; el
>     chequeo es la prueba), con el criterio de que **la línea de base del check-out es
>     la ENTRADA cargada por quien preparó**, no el inventario de referencia.
>   · **El árbol del ciclo con sus IDs deterministas** (`limp-` → `checkout-` →
>     `falta-`), y la diferencia clave: `limp-` se materializa POR FECHA (7 días antes,
>     al abrir Reservas, porque no hay servidor) mientras **`checkout-` nace de una
>     ACCIÓN** ("limpieza terminada"). Ese matiz es el que costó dos tandas encontrar.
>   · Campos de actividades del ciclo: `fase`, `controlEntradaHecho`, `faltantesData`
>     (denormalizado a propósito), `gastoMovimientoId`.
>   · Qué pasa al anular según lo que ya se hizo.
> · **Criterio hotelero documentado en §4 (reservas y disponibilidad) y como trampa en
>   §8**: la ocupación es **`[checkIn, checkOut)`** — el día de salida la cabaña ya está
>   libre. Contarlo como ocupado bloquea noches vendibles. Salió a la luz al hacer el
>   calendario público (T9.3) y vale para todo el sistema, no solo para el sitio.
> · Sin cambios de código. Solo `CONVENCIONES.md`.

# v5.45 — SITIO · calendario de disponibilidad con selección de fechas (T9.3)

> **Registro v5.45 (Tanda 9.3 — index-publico.html · sw.js):**
> · **Pedido del administrador**: que el visitante vea en un calendario los días libres
>   de la cabaña y elija el período con dos toques (entrada y salida).
> · **Se reemplazan los dos campos de fecha por un calendario mensual** navegable:
>   · Las noches ocupadas se muestran tachadas en rojo y **no se pueden tocar**.
>   · **Primer toque = entrada · segundo toque = salida.** Un tercer toque empieza de
>     nuevo; tocar el mismo día lo deselecciona; tocar una fecha anterior mueve la
>     entrada. El rango elegido queda pintado.
>   · Si entre las dos fechas hay noches ocupadas, **no deja cerrar el rango** y avisa
>     que elija otro período (en vez de aceptar y decir "ocupado" después).
>   · No se puede retroceder más allá del mes actual ni elegir días pasados.
>   · Cambiar de cabaña limpia la selección: otra cabaña tiene otra ocupación.
> · **Criterio hotelero explícito en el código**: la reserva ocupa las noches desde
>   `desde` hasta `hasta` **sin incluir la última** — el día de salida la cabaña ya queda
>   libre para quien entra. Sin eso, el calendario mostraría ocupado un día que sí se
>   puede vender.
> · Nombres de mes y días de semana en los tres idiomas; el calendario se repinta al
>   cambiar de idioma.
> · El mensaje de WhatsApp sigue armándose igual, ahora con las fechas del calendario.
> · sw shell **v39**. Solo cambia `index-publico.html`.
> · **Acción**: subir index-publico.html + sw. (Sin cambios de reglas.)

# v5.44 — EL MANUAL (T10) · cierre del sistema

> **Registro v5.44 (Tanda 10 — manual.html · sw.js):**
> · **`manual.html` reescrito completo**, para el equipo (Florencia y Esteban), en
>   voseo. Es el cierre acordado: el manual se escribe AL FINAL, cuando el sistema está
>   terminado (convención de T3.2).
> · **Anclas que coinciden con los ids de `CV2.NAV`**: el signo de pregunta del menú
>   enlaza a `./manual.html#<seccion>` y cae en el capítulo correcto. Al llegar por
>   ancla, el capítulo se resalta un segundo para que se note dónde quedó la página.
> · **14 capítulos**: entrar · actividades · **limpiezas** (el circuito completo paso a
>   paso) · reservas · calendario · clientes · chat · sesiones · horas · cobros ·
>   **dinero** (incluye el balance de 5 pasos) · sitio · usuarios · **si algo falla**.
> · **Criterio de redacción**: explica el POR QUÉ de las reglas que podrían parecer
>   arbitrarias, no solo el cómo. Ejemplos: por qué no se puede cerrar una limpieza sin
>   el control de inventario, por qué un ingreso "por cobrar" no suma, por qué la
>   diferencia del balance no es un error sino el gasto no registrado, y por qué el
>   aviso de horas manuales no es control.
> · El capítulo "Si algo falla" traduce los problemas reales que aparecieron durante el
>   desarrollo a lenguaje de usuario (cerrar y reabrir la app, el código del cartel rojo,
>   los bloqueos de cierre de limpieza/checkout).
> · sw shell **v38**. `manual.html` ya estaba en el shell.
> · **Acción**: subir manual.html + sw, reabrir la app y probar el signo de pregunta
>   desde distintas páginas.
>
> **ESTADO DEL PROYECTO — el sistema está completo.**
> Construido: actividades y sesiones · honorarios · reservas con pagos · ciclo de
> limpieza con inventario y faltantes · Dinero completo (registro único, cuentas,
> pendientes, balance con cero) · permisos por usuario · migración del sistema viejo ·
> sitio público con disponibilidad y contacto · manual.
>
> **Lo único que queda es del administrador, no de desarrollo:**
> 1. Cargar el WhatsApp desde el panel (Sitio → Textos y contacto).
> 2. Revisar `index-publico.html` y renombrarlo a `index.html` en la raíz para publicar.
> 3. **Fase 4 — operación en paralelo**: el equipo usando el 2.0 con datos reales y el
>    sistema viejo como respaldo. A partir de acá el trabajo cambia de naturaleza: se usa,
>    aparecen roces, se ajusta lo que moleste. Ya no se construye de cero.

# v5.43 — SITIO · Cabañas pasa a ser el editor de todo el contenido público (T9.2)

> **Registro v5.43 (Tanda 9.2 — cabanas.html · index-publico.html · firestore.rules ·
> nucleo.js · CONVENCIONES.md · sw.js):**
> · **Decisión del administrador**: la sección Cabañas del panel deja de ser solo
>   cabañas y pasa a ser **el editor de todo el contenido público del sitio**. Se
>   renombra a **"Sitio"** en el menú y encabeza con accesos a Espacios y a los textos.
> · **`config/sitio` — el único lugar del contenido público**:
>   `{ whatsapp, textos: { pt|es|en: { titulo, bajada, c1, c2, c3, tCabanas, tComunes,
>   tConsulta, pie } } }`. Editable desde el modal "Textos y contacto" con selector de
>   idioma (lo tipeado se conserva al cambiar de idioma). Lo que queda vacío no se
>   guarda: el sitio cae en su texto por defecto.
> · **El número de WhatsApp deja de estar en el código**: se carga desde el panel. Se
>   normaliza a solo dígitos y se valida largo mínimo. Si no hay número cargado, el
>   botón del sitio no lleva a ningún lado (en vez de a un número inválido).
> · **`index-publico.html`** lee `config/sitio` al arrancar. Prioridad de textos:
>   **lo editado en el panel → el diccionario por defecto → la clave**. Así el sitio
>   funciona aunque el documento no exista todavía.
> · **Regla nueva**: `config/sitio` con **lectura pública** (el sitio no tiene login),
>   escritura de `contenido`. Va en su propio bloque, aparte del general de `config`
>   que exige sesión — y el general sigue excluyendo `integraciones` a mano.
> · **`CONVENCIONES.md` v2.1 → v2.2**: documentados `disponibilidad` (espejo público sin
>   datos personales) y `config/sitio`.
> · sw shell **v37**.
> · **Acción**: subir cabanas.html + nucleo.js + index-publico.html + sw, republicar
>   `firestore.rules` COMPLETO, y **cargar el WhatsApp desde el panel** (Sitio → Textos
>   y contacto) antes de publicar.
> · **Queda**: publicar el sitio (renombrar index-publico.html → index.html en la raíz
>   tras revisarlo) y **el Manual**, que es lo último.

# v5.42 — SITIO PÚBLICO · espacios, portada y disponibilidad (T9.1)

> **Registro v5.42 (Tanda 9.1 — espacios.html [NUEVO] · index-publico.html [NUEVO] ·
> reservas-core.js · firestore.rules · nucleo.js · sw.js):**
>
> **1 · `espacios.html`** — editor de espacios comunes (permiso `contenido`). Nombre en
>   es/pt/en, fotos con `CV2.subirImagen`, orden de aparición. **El slug ES el id** del
>   documento (regla 3.5) y no se puede cambiar al editar. Entra al menú como "Espacios".
>
> **2 · `disponibilidad` — espejo público de ocupación.** Decisión estructural: el sitio
>   NO puede leer `/reservas/` (tiene nombres, teléfonos y montos). Se crea una colección
>   con **solo `{cabanaId, desde, hasta}`**, mantenida desde `reservas-core.js`
>   (`espejarDisponibilidad`): se escribe al confirmar, se borra al anular o al dejar de
>   estar confirmada. Regla: **lectura pública**, escritura de `reservas`. El espejo
>   nunca hace fracasar la reserva si falla (try/catch con warn).
>
> **3 · `index-publico.html`** — el sitio, sin sesión. **Va en la RAÍZ del repo como
>   `index.html`** (reemplaza el redirect actual al panel; el panel sigue en `/interno/`).
>   Se entrega con otro nombre para que el administrador lo revise antes de publicarlo.
>   · Cabañas con **slider de fotos**, descripción, capacidad base–máx, amenities y
>     precio por noche; áreas comunes en grilla; portada y pie.
>   · **Consulta de disponibilidad**: elegís espacio y fechas y dice libre/ocupado
>     cruzando contra `disponibilidad` (solape de rangos con strings ISO).
>   · **Pedido por WhatsApp**: arma el mensaje con espacio, fechas, noches y personas.
>     Cero backend y cero escritura pública — decisión tomada para no exponer la base a
>     spam. Si más adelante se quiere registrar la solicitud, se suma después.
>   · **Trilingüe pt/es/en** con selector; arranca por el idioma del navegador (pt por
>     defecto). Los textos del sitio están en un diccionario `T` al principio del script;
>     los nombres y descripciones salen de los campos multilingües de la base.
>   · Importa `./interno/firebase-init.js` (no toca gstatic: regla 3.1 respetada).
>
> · **⚠ ACCIÓN OBLIGATORIA DEL ADMINISTRADOR**: en `index-publico.html`, editar la
>   constante **`WHATSAPP`** (arriba del script) con el número real, con código de país y
>   sin signos (hoy tiene un placeholder `5548000000000`). Sin eso el botón no sirve.
> · sw shell **v36** (+ espacios.html).
> · **Acción**: subir espacios.html + nucleo.js + reservas-core.js + sw, republicar
>   `firestore.rules` COMPLETO (trae la regla de `disponibilidad`), y revisar
>   index-publico.html antes de renombrarlo a `index.html` en la raíz.
> · **Pendiente para completar el sitio**: las reservas ya confirmadas ANTES de esta
>   tanda no tienen su espejo en `disponibilidad` (se crea al confirmar). Se llenan solas
>   al tocar cualquier reserva, o se puede hacer una pasada abriendo Reservas (que llama
>   a `materializarPendientes`). Verificar que la ocupación se vea en el sitio.

# v5.41 — Cabos sueltos: capacidad, gasto desde faltante, reglamento (T8.4)

> **Registro v5.41 (Tanda 8.4 — cabanas.html · actividades.html · CONVENCIONES.md · sw.js):**
> · **`capacidad` de cabañas, desajuste resuelto.** El editor esperaba un número suelto
>   mientras la migración cargó `{base, max}`: editar una cabaña migrada mostraba mal y
>   podía pisar el objeto. Ahora el formulario tiene **dos campos (base y máxima)**,
>   `normalizarCap()` acepta los dos formatos (número viejo → base=max) y se guarda
>   siempre como `{base, max}`. La lista muestra "base–máx".
> · **Botón "gasto desde faltante"** (📗 en el detalle de la actividad de faltantes):
>   pide el monto de reponer/reparar y crea la salida en Dinero con ID determinista
>   `gasto-<actividadId>` (no duplica), categoría Mantenimiento, vinculada
>   `refTipo:'faltante'`. La cuenta se completa después en Dinero. Es **opcional**, no
>   automático: no todo faltante se repone comprando. La actividad queda marcada con
>   `gastoMovimientoId` y muestra el chip "→ Dinero". Requiere permiso `dinero`.
> · **`CONVENCIONES.md` v2.0 → v2.1**:
>   · **§5.11 NUEVO — las tres trampas del motor de reglas** que costaron sesiones de
>     diagnóstico, con su patrón común: *funciona para el admin y falla para el
>     colaborador*, porque `esAdmin()` corta antes de evaluar lo que rompe.
>     (1) `resource` es null en documentos inexistentes → toda regla de lectura empieza
>     con `resource == null`. (2) `array-contains` en la consulta obliga a `in` en la
>     regla. (3) No agregar `is list` sobre el campo que ya filtra `array-contains`.
>   · **§8 trampas**: se agrega que una sola rama caída de un `or()` tumba la consulta
>     ENTERA (el usuario deja de ver todo, no solo lo problemático).
>   · **§4 `movimientos`**: documentados `cuenta` (etiqueta libre sin catálogo), el sello
>     `editadoPor/editadoEn`, `cierreId` y `esApertura`.
>   · **§4 `cierres`**: modelo nuevo del balance (cuentas con calculado/real/ajuste), el
>     criterio de que el ajuste ES el gasto no registrado y no un error, y cómo funciona
>     el cero.
> · sw shell **v34**. Sin cambios de reglas.
> · **Acción**: subir cabanas.html + actividades.html + sw + CONVENCIONES.md, reabrir.
>
> **ESTADO GENERAL — lo que queda:**
> 1. **Probar el ciclo de limpieza completo** (a cargo del administrador): control de
>    entrada → "limpieza terminada" → aparece el check-out colgado → control de salida
>    con faltante → nace el faltante → botón de gasto.
> 2. **Fase 4 — operación en paralelo**: el 2.0 en manos de Florencia y Esteban con
>    datos reales, el viejo como respaldo.
> 3. **El Manual**, al final de todo, como acordamos.

# v5.40 — FIX · colaborador no podía crear limpiezas ni el ingreso del cobro (T8.3)

> **Registro v5.40 (Tanda 8.3 — firestore.rules):**
> · **Síntoma**: al confirmar una reserva desde un usuario con permiso `reservas` pero
>   NO admin, toast de permisos y la limpieza no se creaba. Con el admin funcionaba.
> · **CAUSA RAÍZ — `resource` es null en documentos inexistentes.** El upsert de
>   limpiezas hace `getDoc('limp-<id>')` ANTES de crearla. Sobre un documento que no
>   existe, `resource` es null y cualquier `resource.data.x` **hace fallar la regla
>   entera** con `permission-denied`. El admin nunca lo sufría porque `esAdmin()` corta
>   antes de tocar `resource`. Es la hermana del bug de `competencias is list` (v5.31):
>   la regla estaba lógicamente bien pero era inevaluable en un caso.
>   · **Arreglo**: primera rama `resource == null` en la lectura de `actividades`, y
>     guarda `resource != null` dentro de `esMio()` (que se usa en varias colecciones).
> · **SEGUNDO PROBLEMA, del puente de pagos (v5.38)**: `movimientos` permitía crear solo
>   con `dinero` o `finanzas`. Quien tiene únicamente `reservas` registraba el cobro pero
>   el ingreso automático en Dinero se rechazaba. **Arreglo**: `allow create` también con
>   `tiene('reservas')`. Leer y editar siguen siendo de `finanzas`/`dinero`: el
>   colaborador de reservas puede generar el ingreso, no husmear el libro.
> · También se blindó la lectura de `movimientos` con `resource != null`.
> · **Sin cambios de código ni de sw**: es solo `firestore.rules`.
> · **LECCIÓN para CONVENCIONES §5 (agregar a trampas)**: en toda regla de lectura que
>   inspeccione `resource.data`, contemplar el documento inexistente. Un `getDoc` de algo
>   que aún no existe es una operación legítima y frecuente (todo upsert lo hace); si la
>   regla no la contempla, falla para todos menos el admin.
> · **Acción**: republicar `firestore.rules` COMPLETO (nunca por fragmentos) y reintentar
>   la prueba: crear/confirmar una reserva con el usuario colaborador. Debería aparecer
>   "🧹 Limpieza creada…" y el cobro debería verse como ingreso en Dinero.

# v5.39 — DINERO · Tanda B: asistente de Balance y cero del sistema (T8.2)

> **Registro v5.39 (Tanda 8.2 — balance.html [NUEVO] · dinero.html · sw.js):**
> · **`balance.html`** — asistente por etapas que REEMPLAZA el "Hacer balance" simple
>   de la Fase 3 (el modal con snapshot). El botón de Dinero ahora navega a esta página.
>   Permiso: `finanzas`.
> · **Las 5 etapas** (diseño del administrador):
>   1. **Revisar los movimientos** línea por línea, con tilde por línea y "tildar todas".
>      Avisa si se sigue con líneas sin revisar.
>   2. **Saldar los cobros pendientes**: cada honorario se paga eligiendo **de qué cuenta
>      sale**; genera la salida en Dinero (vinculada `refTipo:'honorario'`) y marca el
>      honorario pagado. Lo que no se paga queda pendiente para el próximo balance.
>   3. **Saldo calculado por cuenta**, derivado de las líneas del período.
>   4. **Saldo real por cuenta**: el admin escribe cuánto hay de verdad. Se muestra la
>      diferencia por cuenta y el total.
>   5. **Cerrar**: resumen + nota, y confirmación.
> · **El CERO del sistema** (lo que hace el cierre):
>   · Crea `cierres/{id}` con totales, **`cuentas[]` = {cuenta, calculado, real, ajuste}**,
>     `cobrosSaldados[]` y la nota.
>   · **Sella** cada movimiento del período con `cierreId` → sale de la vista de Dinero
>     y pasa al histórico de ese balance.
>   · Crea una **línea de apertura por cuenta** (categoría `Balance`, `esApertura:true`)
>     con el **saldo REAL**. Desde ahí arrancan los próximos registros: cada cuenta
>     queda igualada a la realidad.
> · **El bruto no registrado NO se guarda** (decisión del administrador): se lee sumando
>   los `ajuste` de las `cuentas[]` de cada cierre. La diferencia calculado-vs-real ES el
>   gasto no registrado (dato personal, fuera del negocio) — no es un error a corregir.
> · **Dinero adaptado**: `filtrados()` y el saldo por cuenta **excluyen lo sellado**
>   (`cierreId`), así la vista muestra siempre desde el último cero. El historial
>   ("Balances") muestra por cierre los totales, los cobros saldados y el detalle
>   **sistema → real (ajuste)** por cuenta; la exportación es **por `cierreId`**, no por
>   rango de fechas. Se eliminó el modal de balance viejo y su código muerto.
> · sw shell **v33** (+ `balance.html` en el shell).
> · **Sin reglas nuevas**: `cierres` (create de finanzas, update/delete nunca) y
>   `movimientos` ya estaban cubiertos.
> · **Nota de diseño**: el balance usa `getDocs` (una foto), no `onSnapshot` — un balance
>   se hace sobre datos quietos, no sobre una lista que se mueve mientras se revisa.
> · **Acción**: subir balance.html + dinero.html + sw, reabrir la app.
> · **FASE DINERO COMPLETA**: registro único línea a línea con cuenta y sello de edición
>   (T8.1) · puente pagos de reserva → Dinero (T8.1b) · asistente de balance con cero
>   (T8.2). Queda el **Manual**, al final de todo el sistema.

# v5.38 — DINERO · Puente pagos de reserva → Dinero (T8.1b)

> **Registro v5.38 (Tanda 8.1b — reservas.html · sw.js):**
> · **CORRECCIÓN DE ALCANCE**: la Tanda A (v5.37) construyó el puente
>   Cobros(honorarios)→Dinero, pero el que el administrador necesitaba ver funcionando
>   era **Pagos de reserva→Dinero**. Se confundieron los dos puentes. Este registro
>   entrega el que faltaba.
> · **Todo cobro de reserva genera un ingreso en Dinero**, automáticamente al
>   registrar el pago. Campos: `tipo:'entro'`, **categoría FIJA `'Reservas'`**
>   (decisión del administrador: identifica que viene de la página de reservas),
>   `cuenta` = la cuenta de destino elegida en el pago, monto/moneda/montoBRL del pago,
>   detalle con el huésped y el concepto, y **vínculo `refTipo:'pago'` + `refId`**.
> · **Borrar un pago borra su ingreso vinculado** (busca por `refId`): si no, Dinero
>   mostraría plata sin cobro que la respalde. Aviso explícito en el confirm.
> · **Disparo de limpieza más transparente**: al confirmar o crear una reserva
>   confirmada, ahora SIEMPRE se avisa el resultado — "🧹 Limpieza creada", o "aparecerá
>   una semana antes del <fecha>" si el check-in está fuera de la ventana de 7 días, o
>   el error concreto si falla. Antes el fallo era mudo (`console.warn`), que fue lo que
>   hizo perder tiempo diagnosticando. También se corrigió el toast, que mostraba la
>   fecha de check-OUT cuando la limpieza se programa por check-IN.
> · sw shell **v32**.
> · **Sobre el bug reportado**: la limpieza que se veía en Actividades era de una prueba
>   anterior. Con los avisos nuevos, la próxima prueba dirá exactamente qué pasa (creada,
>   fuera de ventana, o error con código) en vez de fallar en silencio.
> · **Sigue pendiente T8.2 — asistente de Balance por etapas** (diseño acordado en
>   v5.37): revisar línea a línea → saldar cobros → saldo calculado por cuenta →
>   contrastar con lo real → línea de ajuste "balance" por cuenta → CERO del sistema +
>   histórico. Más el historial accesible en Dinero y Cobros.
> · **Acción**: subir reservas.html + sw, reabrir la app. Probar: registrar una seña →
>   debe aparecer como ingreso en Dinero con categoría Reservas y su cuenta.

# v5.37 — DINERO · Tanda A: cuenta, sello de edición, puente Cobros (T8.1)

> **Registro v5.37 (Tanda 8.1 — dinero.html · honorarios.html · sw.js):**
> · **Campo `cuenta` en cada movimiento del negocio.** Select dinámico (mismas cuentas
>   ya usadas + "➕ agregar nueva…"), guardado como texto. Las cuentas son etiquetas
>   puras SIN catálogo (CONVENCIONES): existen si hay líneas que las nombran. Opción
>   "(sin definir)" válida. Oculto en el libro personal.
> · **Sello de edición**: al editar un movimiento existente se graban `editadoPor`,
>   `editadoNombre`, `editadoEn`, visibles en la línea ("editado por X · fecha"). No
>   aparece en los recién creados.
> · **La línea muestra la cuenta** (🏦) junto a categoría/persona.
> · **Saldo por cuenta** (tarjeta nueva, solo negocio + finanzas): saldo DERIVADO por
>   cuenta = entradas − salidas en R$, ignorando lo "por cobrar" vivo. Es el anticipo
>   del control que la Tanda B (Balance) va a contrastar con lo real.
> · **Puente Cobros→Dinero con cuenta**: el modal de pago de honorario ahora tiene un
>   select "¿de qué cuenta sale?" (cuentas existentes + nueva). El movimiento de salida
>   nace con esa `cuenta`. El botón "A Dinero" (honorarios ya pagados de antes) crea el
>   movimiento sin cuenta — se completa después editando en Dinero.
> · sw shell **v31**. Sin cambios de reglas (el campo cuenta entra en la regla de
>   movimientos existente).
> · **Falta Tanda B (T8.2) — el asistente de Balance por etapas**, diseño ya acordado:
>   revisar movimientos línea a línea → saldar cobros → calcular saldo por cuenta →
>   contrastar con lo real (pregunta al usuario) → línea de ajuste "balance" por cuenta
>   → ese ajuste es el CERO del sistema (cierra el período al histórico y arranca de
>   nuevo). Historial accesible en Dinero y en Cobros. El "bruto gastado" NO se guarda:
>   se lee sumando las líneas de ajuste de cada balance. El primer balance es el primer
>   cero. La diferencia calculado-vs-real ES el gasto no registrado (dato personal, fuera
>   del negocio). Reemplaza el "Hacer balance" simple de la Fase 3.
> · **Acción**: subir dinero.html + honorarios.html + sw, reabrir la app. Probar: cargar
>   un gasto eligiendo cuenta → verla en la línea y en el saldo por cuenta; pagar un
>   honorario eligiendo cuenta → aparece en Dinero como salida de esa cuenta.

# v5.36 — LIMPIEZAS · El check-out nace al terminar la limpieza (T2.6b)

> **Registro v5.36 (Tanda 2.6b — reservas-core.js · actividades.html · sw.js):**
> · **Corrección de diseño sobre v5.35.** El control de check-out ya NO se materializa
>   por fecha. Nace de una ACCIÓN: cuando se termina la limpieza de entrada
>   ("limpieza terminada"), se crea `checkout-<reservaId>` como **hijo** de la limpieza.
> · **Por qué**: el test del administrador mostró que atar el checkout a una ventana de
>   fecha no cubría "edité la reserva y quiero verlo ya", y además el checkout aparecía
>   de la nada. Con el modelo nuevo, el checkout existe solo si hubo una limpieza real,
>   queda agrupado bajo ella, y el sistema no deja cerrar/borrar la limpieza sin resolver
>   el checkout (padre no se borra con hijos).
> · **Flujo final del ciclo**:
>   1. `limp-<reservaId>` (entrada) se materializa 1 semana antes del check-in (rojo un
>      día antes). Lleva tarifa → honorarios.
>   2. "Limpieza terminada" exige el control de inventario de entrada hecho, registra
>      cronómetros (Core.tildar) y **crea `checkout-<reservaId>` hijo**, prioridad rojo.
>   3. El checkout abre el control de inventario de salida. OK → cierra; con faltante →
>      crea `falta-<reservaId>` hijo y queda abierto hasta resolverlo.
> · **Core simplificado**: `sincronizarLimpiezas` y `materializarPendientes` solo miran
>   el CHECK-IN. Se quitó toda la materialización de checkout por fecha. La anulación
>   solo borra la limpieza de entrada si no se hizo; si el checkout ya existe, no se toca
>   (alguien estuvo en la cabaña, el control de salida va igual).
> · sw shell **v30**. `reservas.html` y `limpiar-ramas.html` de v5.35 siguen válidos.
> · **Acción**: subir reservas-core.js + actividades.html + sw, reabrir la app. (Si no
>   corriste aún `limpiar-ramas.html` de v5.35, hacelo: borra las ramas fantasma.)
> · **Prueba sugerida**: reserva con check-in próximo → aparece la limpieza de entrada →
>   hacé el control de inventario (📦) → "limpieza terminada" → debe aparecer el
>   check-out colgado debajo → abrilo (botón salida) → sin faltantes cierra; con
>   faltantes queda abierto con el faltante colgado.

# v5.35 — LIMPIEZAS · Ciclo de vida por reserva (T2.6)

> **Registro v5.35 (Tanda 2.6 — reservas-core.js · actividades.html · reservas.html ·
> limpiar-ramas.html · sw.js):**
> · **Rediseño del ciclo de limpieza, cerrado con el administrador.** Se abandona el
>   modelo de "una limpieza con chequeo entrada+salida adentro". Ahora hay **DOS
>   actividades independientes por reserva**, ambas bajo `proj-limpiezas` (MODELO B, un
>   solo nivel — se eliminan las ramas por cabaña de la migración):
>   · **`limp-<reservaId>`** — LIMPIEZA de entrada. Se hace ANTES del check-in
>     (preparar). Lleva la tarifa de la cabaña → genera honorarios. Fase 'entrada'.
>   · **`checkout-<reservaId>`** — CONTROL de salida. Se hace en el check-out. Sin
>     tarifa. Fase 'salida'.
> · **Materialización anticipada, sin servidor**: `RCore.materializarPendientes` corre al
>   abrir Reservas y crea las actividades cuya fecha (check-in o check-out) cae dentro de
>   los próximos **7 días**. `fechaInicio = un día antes` → el semáforo se pone rojo un
>   día antes de la fecha. Idempotente (IDs deterministas). Reemplaza el disparo
>   "al confirmar", que no servía para reservas lejanas.
> · **Reglas de cierre**:
>   · Limpieza de entrada: "Limpieza terminada" (tildar) EXIGE el control de inventario
>     de entrada hecho (`controlEntradaHecho`); el cronómetro es opcional.
>   · Control de salida: al registrar la salida, si todo OK → cierra; si hay
>     faltantes/daños → crea `falta-<reservaId>` **colgado de la actividad de checkout**
>     y ésta queda ABIERTA hasta resolver el faltante (el sistema no deja borrar un padre
>     con hijos, así que el faltante fuerza la resolución).
> · **El chequeo se parte por fase**: cada actividad abre SOLO su control (entrada o
>   salida). Comparten el acta `chequeos/chequeo-<reservaId>`: entrada escribe 'entrada',
>   salida lee esa entrada como línea de base y escribe 'salida'.
> · **`limpiar-ramas.html`** (admin, un solo uso): borra las ramas muertas de la
>   migración `limpiezas-cab-1/2/3` y `faltantes-cab-1/2/3` (y sus hijos). Eran las que
>   generaban "Faltantes o daños" fantasma sin reserva de origen.
> · sw shell **v29**.
> · **Bug de fondo aclarado**: el diagnóstico probó que el core escribía bien; el
>   problema real era arquitectónico (dos modelos de árbol en conflicto + faltantes
>   fantasma de la migración), no un fallo de escritura. Resuelto de raíz con el rediseño.
> · **Orden de acciones del administrador**: subir los 4 archivos + sw → reabrir la app →
>   correr `limpiar-ramas.html` UNA vez (borra lo viejo) → abrir Reservas (materializa lo
>   nuevo) → verificar en Actividades que las limpiezas cuelgan directo de Limpiezas.
> · **DINERO/BALANCE sigue en espera** (diseño ya acordado, ver más abajo): Tanda A
>   (cuenta + sello de edición + puente Cobros→Dinero) y Tanda B (asistente de Balance
>   por etapas con cero del sistema). Se retoma al cerrar limpiezas.
> · Pendiente viejo aún vivo: entrar como Mauro y no como CasaVerde/admin (el UID
>   fpd4sBnZ… de CasaVerde es el admin viejo; conviene revisar por qué quedó como la
>   cuenta de uso).

# v5.34 — FIX · alta de reserva confirmada no creaba la limpieza (T2.5c)

> **Registro v5.34 (Tanda 2.5c — reservas.html · sw.js):**
> · **Síntoma**: al crear una reserva y confirmarla, no aparecía la tarea de limpieza en
>   Actividades, sin error visible.
> · **Causa**: en el guardado de reserva, la rama de EDICIÓN (`editId`) llamaba a
>   `RCore.sincronizarLimpiezas`, pero la rama de ALTA nueva (`addDoc`) NO. Una reserva
>   creada directamente como 'confirmada' se guardaba bien pero nunca disparaba la
>   creación de su limpieza. (Sí funcionaba si primero se creaba como presupuesto y
>   luego se confirmaba, porque ese botón sí llama a la sincronización.)
> · **Arreglo**: tras el `addDoc`, si la reserva nace 'confirmada', se llama a
>   `sincronizarLimpiezas([{...datos, id: nuevaRef.id, estado}], cabanas, u)` con el id
>   que devuelve el addDoc. Mismo camino que confirmar una existente.
> · **Verificado el tipo de dato**: las reservas NUEVAS guardan `checkIn`/`checkOut` como
>   string `YYYY-MM-DD` (del input date), así que la comparación `checkOut >= hoy` del
>   core funciona. (La única reserva migrada tenía `checkOut` como Timestamp, pero era la
>   de prueba de Airbnb y las reservas no se migraron.)
> · **Recordatorio del flujo completo** (ya operativo): confirmar reserva →
>   `sincronizarLimpiezas` asegura `proj-limpiezas` y hace upsert de `limp-<reservaId>`
>   → en Actividades, el botón "Chequeo de inventario" abre entrada/salida trayendo el
>   inventario de la cabaña y, en el check-out, crea la actividad de faltantes.
> · sw shell **v28**. Solo cambia reservas.html.
> · **Acción manual**: subir reservas.html + sw, reabrir la app. (Sin cambios de reglas.)

# v5.33 — RESERVAS · Faltantes como actividad (T2.5b)

> **Registro v5.33 (Tanda 2.5b — actividades.html · firestore.rules · sw.js):**
> · **Cambio de modelo respecto de v5.32 (decisión del administrador)**: el faltante NO
>   es una lista escondida en la cabaña — es una **actividad real** dentro del proyecto
>   de faltantes. Así aparece en el semáforo, admite iniciar una reparación en paralelo,
>   y se cierra como cualquier tarea. Encaja en el sistema en vez de ser un apéndice.
> · **El check-out con novedades crea/actualiza UNA actividad** `falta-<reservaId>`
>   (ID determinista, regla 3.5 → no duplica), colgada de **`faltantes-cab-N`** (la
>   sub-rama "Faltantes o daños" que la migración dejó dentro de cada cabaña del
>   proyecto Limpiezas — NO hay proyecto Faltantes suelto).
> · **Una actividad por check-out (por reserva)**, no una por ítem. Título
>   "Faltantes · <cabaña> · salida <fecha>"; el detalle lista faltantes y daños + la
>   reserva de origen. Prioridad 'rojo'. Se cierra cuando se repuso/reparó todo.
> · **Denormalización**: huésped, checkIn y checkOut se leen de la reserva al momento
>   del check-out y se guardan en la actividad (`faltantesData`), tolerante a que la
>   reserva no exista (Airbnb sin doc propio). La actividad no depende de la reserva.
> · **REVERTIDO de v5.32**: se elimina el campo `cabanas.faltantesAbiertos` y la regla
>   especial de `cabanas` con `diff().affectedKeys().hasOnly(...)`. `cabanas` vuelve a
>   la regla simple (lectura pública, escritura 'contenido'). El faltante-actividad se
>   crea con la regla normal de `actividades` (create para cualquiera activo) — quien
>   limpia ya puede crear actividades, así que no hace falta permiso nuevo.
> · El `chequeos/chequeo-<reservaId>` sigue guardando el registro completo de
>   entrada/salida (la actividad es el "pendiente accionable"; el chequeo es el "acta").
> · sw shell **v27**. `cabanas.html` y `CV2.subirImagen` (v5.32) no cambian.
> · **Sigue pendiente (no bloquea)**: botón opcional "crear gasto en Dinero" desde un
>   faltante/daño; y el desajuste de `capacidad` en `cabanas.html` (número vs {base,max}
>   migrado). El semáforo del faltante ya funciona por ser actividad prioridad rojo.
> · **Acción manual**: subir actividades.html + sw, republicar firestore.rules completo,
>   reabrir la app.

# v5.32 — RESERVAS · Chequeo de inventario por reserva (T2.5)

> **Registro v5.32 (Tanda 2.5 — nucleo.js · cabanas.html · actividades.html ·
> firestore.rules · sw.js):**
> · **Modelo cerrado con el administrador**: el inventario vive en la CABAÑA
>   (`cabanas.inventarioBase`), pasa de lista de nombres a **lista de {item, cantidad}**
>   (cantidad de referencia, "con cuánto debería quedar la cabaña"). Totalmente editable
>   desde Cabañas: qué ítems y cuánto de cada uno.
> · **Flujo de dos momentos, por reserva** (doc `chequeos/chequeo-<reservaId>`):
>   · **Entrada (check-in)**: precarga las cantidades de referencia de la cabaña; quien
>     limpia CONFIRMA o CORRIGE lo que realmente deja (los platos/sábanas/ollas varían;
>     los ventiladores no). Al confirmar, esa cantidad **fija la línea de base**.
>   · **Salida (check-out)**: compara contra la ENTRADA (no contra la referencia). Lo
>     que bajó → **faltante** de esa reserva. Además, **daños**: entradas libres con
>     descripción + foto opcional de la cámara. Se pueden agregar varios.
> · **La preparación del check-in NO genera faltantes** (reponer es trabajo normal). El
>   único que reporta faltantes/daños es el check-out — atribuibles a esa reserva.
> · **Los faltantes y daños se acumulan en la CABAÑA** (`cabanas.faltantesAbiertos[]`),
>   cada uno con `{tipo, item/desc, foto?, reservaId, fecha, resuelto:false}`. Así la
>   cabaña arrastra sus problemas con su reserva de origen, sin importar qué reserva
>   venga después.
> · **`CV2.subirImagen(file)` en nucleo.js** (NUEVO, reutilizable): comprime con canvas
>   a 2000px lado mayor / JPEG 0.85 (el mismo recurso que funcionaba en el sistema
>   viejo) y sube a Cloudinary `dnwfu8ffn` / `preset-comprobantes`. Lo usan los daños y
>   queda disponible para comprobantes. La foto de daño usa `capture="environment"`
>   (cámara trasera del teléfono).
> · **UI**: el botón "Chequeo de inventario" aparece en el detalle de una actividad SOLO
>   si tiene `reservaId` y `cabanaId` (o sea, es una limpieza de reserva). Modal con
>   pestañas Entrada/Salida; la salida se bloquea hasta confirmar la entrada.
> · **Reglas nuevas/ajustadas**:
>   · `chequeos/{id}` — lee/crea/actualiza el equipo activo (quien limpia); borra admin.
>   · `cabanas` — se agrega un `update` que permite al equipo activo tocar
>     **solo** `faltantesAbiertos` (+ `actualizadoEn`) vía `diff().affectedKeys()
>     .hasOnly(...)`, sin darle el permiso `contenido`. La escritura general sigue
>     siendo de `contenido`.
> · **`cabanas.html`**: editor de inventario con cantidad por ítem; `normalizarInventario`
>   acepta el formato viejo (strings migrados → cantidad 0 para completar) y el nuevo.
> · sw shell **v26**.
> · **A DECIDIR con el administrador (quedó pendiente, no bloquea)**:
>   1. El chequeo se abre a demanda con el botón; NO nace automáticamente con la
>      limpieza. Si se prefiere que exista desde que se crea la limpieza, se engancha en
>      `reservas-core.js`. Hoy no hace falta y evita documentos vacíos.
>   2. Los `faltantesAbiertos` todavía no se MUESTRAN en ningún lado ni cuentan para el
>      semáforo rojo (la memoria del sistema los menciona como aviso). Falta la vista que
>      los liste por cabaña y el botón "resuelto" (¿quién puede resolver?), y el botón
>      opcional "crear gasto en Dinero" a partir de un faltante/daño.
>   3. `capacidad` en `cabanas.html` (`crearBase` y editor) quedó en formato viejo
>      (número) mientras la migración cargó `{base,max}`: revisar antes de editar una
>      cabaña migrada.
> · Estas tres son la continuación natural (T2.5b): mostrar y resolver faltantes.

# v5.31 — FIX · actividades: regla 'competencias is list' (T7.3d)

> **Registro v5.31 (Tanda 7.3d — firestore.rules):**
> · **Diagnóstico DEFINITIVO con `diagnostico-actividades.html`** (herramienta que corre
>   cada rama del or() por separado con la sesión del colaborador y muestra el error en
>   pantalla, sin consola del navegador). Resultado con la sesión de Florencia:
>   · Rama 1 (equipo): ✓ 35 docs · Rama 2 (personal): ✓ · Rama 4 (asignados+creadoPor): ✓
>   · **Rama 3 (asignados + competencias array-contains): ✗ permission-denied**
>   · Consulta completa: ✗ (una rama caída tumba el or() entero).
> · **Causa raíz** (no era índice ni datos ni perfil — todo eso ya estaba verificado):
>   la regla de esa rama incluía **`competencias is list`** además del
>   `uid in competencias`. La consulta usa `array-contains`, que ya garantiza que el
>   campo es un array con ese uid; sumar la verificación de tipo `is list` hace la rama
>   **indemostrable** para el motor y Firestore rechaza la consulta ENTERA con
>   `permission-denied`. El admin nunca lo vio (su consulta es `query(col)` sin ramas).
> · **Arreglo**: se quita `competencias is list` de la rama. Cambio de una línea en
>   `firestore.rules`. No se toca código, ni datos, ni índices.
> · **Índice**: el compuesto `alcance / creadoPor / competencias` que se creó en el
>   proceso (T7.3c) queda: la consulta or() lo necesita igualmente. Estado Habilitado.
> · **Lección para CONVENCIONES §3.3 / §5**: en una regla que espeja una consulta con
>   `array-contains`, NO agregar `is list` sobre ese mismo campo — la consulta ya lo
>   garantiza y la verificación extra rompe la demostrabilidad. Anotar como trampa.
> · **Correcciones de datos que quedaron PENDIENTES** (no afectan la visibilidad de las
>   de equipo, pero conviene resolver): las actividades migradas tienen `creadoPor` con
>   **UIDs viejos/fantasma** (p. ej. `fpd4sBnZ...`, `5OvJPVWk...`) que no corresponden a
>   ningún usuario actual. Impacto: "quién creó esto" no resuelve nombre, y las ramas
>   creadoPor de proyectos asignados no matchean. Pendiente: herramienta que traduzca
>   los UIDs viejos de `creadoPor`/`competencias` a los actuales (mapa de la migración).
> · **Acción del administrador**: republicar `firestore.rules` completo. Probar con
>   Florencia/Esteban: deberían ver las 35 de equipo de inmediato.

# v5.30 — FIX · reparar actividades migradas (T7.3c)

> **Registro v5.30 (Tanda 7.3c — reparar-actividades.html):**
> · **Síntoma afinado con datos del administrador**: cada colaborador ve SOLO las
>   actividades que crea él; las migradas (creadas por admin) no las ve ninguno, y el
>   cartel rojo `permission-denied` sigue. Funciona la rama `creadoPor == uid` y fallan
>   las otras tres.
> · **Causa**: las actividades migradas no tienen en la BASE los campos que la consulta
>   del colaborador compara (`alcance`, `creadoPor`, `competencias`) en la forma exacta
>   que el motor exige. Una sola actividad sin `alcance` válido (o con `competencias`
>   que no es lista) hace que Firestore rechace la CONSULTA ENTERA — por eso el
>   colaborador no ve nada migrado. El admin no lo sufre: su consulta es `query(col)`
>   sin ramas. El export mostraba los campos correctos, pero lo que quedó en la base
>   difiere — de ahí la herramienta de diagnóstico en vez de un fix a ciegas.
> · **`reparar-actividades.html`** (2.0, `interno/`, fuera de menú, admin). Lee todas
>   las actividades, detecta las que les falta `alcance` (→ `equipo`), `competencias`
>   (→ `[]`) o `creadoPor` (→ CasaVerde), y completa SOLO esos campos con merge, sin
>   tocar título/estado/historial. Es diagnóstico y reparación en una.
> · Sin cambios de reglas ni de código de páginas. Las reglas de v5.29 son correctas;
>   el problema era de datos.
> · **Refuerza CONVENCIONES §3.3**: no alcanza con que la regla y la consulta coincidan
>   en operadores; los DATOS tienen que tener los campos que ambas comparan. Un campo
>   ausente en un solo documento tumba la consulta de todos los colaboradores.
> · **Acción del administrador**: correr la herramienta como CasaVerde, revisar el
>   diagnóstico (¿son las 45? ¿qué campo falta?) y reparar. Después probar con un
>   colaborador.

# v5.29 — FIX · actividades invisibles para colaboradores (T7.3b)

> **Registro v5.29 (Tanda 7.3b — firestore.rules):**
> · **Síntoma**: los usuarios no-admin no veían NINGUNA actividad; toast
>   «No se pudieron cargar las actividades (permission-denied)». El admin sí veía
>   (pasa por `esAdmin()`), lo que apuntaba a un desajuste consulta↔regla.
> · **Causa**: `Core.consultaActividades` pide los proyectos asignados con
>   `where('competencias','array-contains', uid)`, pero la regla de `actividades` que
>   entregó v5.28 comprobaba `uid in resource.data.competencias`. **`array-contains` y
>   `in` no son equivalentes para el motor de reglas**: no puede probar que la consulta
>   cumple la regla, y rechaza la query ENTERA (no documento por documento). Por eso el
>   colaborador no veía nada, aunque hubiera actividades de `alcance:'equipo'` para él.
> · **Arreglo**: la regla de `read` de `actividades` se reescribió para **espejar
>   exactamente las 4 ramas del core**, cada una fijando su `alcance` y usando `in`
>   sobre la misma lista `competencias`. Es cambio de reglas solamente; el core estaba
>   bien y no se toca.
> · **Verificado contra el export migrado**: 30 `equipo`, 10 `asignados` (todas con
>   `competencias` como lista), 5 `personal`, 0 sin `alcance`. La regla nueva cubre los
>   tres alcances.
> · **Refuerza CONVENCIONES §3.3 y §5.1**: la regla no solo tiene que "permitir lo
>   mismo" que la consulta, tiene que hacerlo con **los mismos operadores**. Un
>   `array-contains` en la query obliga a `in` sobre esa lista en la regla.
> · Sin cambios de código ni de sw. **Acción manual única**: republicar
>   `firestore.rules` completo desde la consola de Firebase.

# v5.28 — PERMISOS · Tanda 3: reglas por permiso y Dinero recortado (T7.3)

> **Registro v5.28 (Tanda 7.3 — firestore.rules · dinero.html · sw.js · CONVENCIONES.md):**
> · **`firestore.rules` ahora lee permisos, no solo el rol.** Nueva función `tiene(p)`:
>   verdadero para el admin siempre, y para el resto si `permisos[p] == true`. Usa
>   `.get('permisos', {}).get(p, false)` para no romperse con perfiles sin el campo.
>   · `movimientos` — lee `finanzas` entero; con solo `dinero`, únicamente los propios
>     (`creadoPor == uid`). Crea `dinero` o `finanzas`. Update/delete de `finanzas` y
>     nunca si está sellado.
>   · `honorarios` — update de `finanzas` (pagar) Y de `horas` (recálculo de ciclos).
>   · `cierres` — create de `finanzas`.
>   · `cabanas` / `espacios_comunes` — escritura de `contenido`.
>   · `reservas` / `clientes` — CRUD de `reservas`. `pagos` — crear/editar `reservas`,
>     borrar `finanzas`.
>   · `config/integraciones` — la lee `reservas` (sync Airbnb), la escribe el admin.
> · **`dinero.html` — vista recortada para `dinero` sin `finanzas`:**
>   · La suscripción al negocio pide `where('creadoPor','==',uid)` — la regla no permite
>     una lectura amplia, así que hay que consultar de entrada solo lo propio (regla 3.3).
>   · Se ocultan KPIs, botón de balance, historial de cierres, exportación y el panel de
>     pendientes del equipo. Editar/borrar en el negocio pasa a `finanzas` (antes admin).
>   · `creadoPor` ya se sellaba en toda alta: es lo que hace visible el gasto a su autor.
> · **`CONVENCIONES.md` v1.0 → v2.0** (corregido y al día):
>   · `sesiones.tipo`: **`'cronometro'`** (v1.0 decía `'crono'`, mal).
>   · `usuarios.permisos`: los 5 permisos definitivos, no `{dinero?, cabanas?}`.
>   · Se agrega `espacios_comunes` al modelo (faltaba desde la Fase 0).
>   · §5 reescrita para el modelo admin único + permisos, con la lección de que **las
>     reglas se suman** y se editan siempre completas.
> · sw shell **v25**.
>
> **ESTADO: la Fase 7 (permisos) está completa.** Ya se puede, con seguridad real:
>   1. En `usuarios.html`, darle a Mauro los permisos `reservas`, `finanzas`,
>      `contenido` y `horas`, y a Florencia lo que corresponda; a Esteban, lo suyo.
>   2. **Recién entonces** bajar a Mauro de `admin` a `colaborador`. CasaVerde queda
>      como único admin (mantenimiento y emergencias).
>   · Hacerlo en ese orden: si se baja el rol antes de cargar los permisos, se pierde
>     el acceso a las acciones fuertes.
> · **Acción manual**: republicar `firestore.rules` completo (desde la consola de
>   Firebase; no depende de la app), subir los archivos y reabrir la app.
> · **Nota de alcance pendiente** (heredada de v5.27): con `horas` se ven las sesiones
>   de los proyectos privados de Mauro/Florencia (horas y nombres, no los títulos).
>   Decidir antes de dar `horas` a alguien fuera de esos dos.
> · Próximo posible: T2.5 (chequeos de inventario por reserva) o Fase 4 (operación en
>   paralelo). El **Manual** queda para el final de todo el sistema.

# v5.27 — PERMISOS · Tanda 2: conversión y horas manuales (T7.2 + T7.4)

> **Registro v5.27 (Tanda 7.2 — nucleo.js · cabanas.html · reservas.html ·
> honorarios.html · gestion-sesiones.html · sw.js):**
> · **Los `esAdmin()` pasan a permisos** en las páginas convertidas:
>   · `cabanas.html` — entrada de la página → **`contenido`**.
>   · `reservas.html` — confirmar, finalizar, anular, registrar pago y editar →
>     **`reservas`**; **borrar un pago → `finanzas`** (borrar plata no es tarea de
>     reservas); el aviso "primero cargá las cabañas" → `contenido`.
>   · `honorarios.html` — pagar, editar, "A Dinero" y la vista del equipo →
>     **`finanzas`**.
>   · `gestion-sesiones.html` — filtro por persona, editar/borrar sesiones ajenas y
>     recálculo de ciclos → **`horas`**.
> · **CAMBIO DE CRITERIO EN LA NAVEGACIÓN — el Gestor de Sesiones vuelve a ser de
>   todos.** En la tanda anterior había quedado detrás del permiso `horas`, y eso
>   chocaba de frente con el pedido de que un colaborador pueda cargar horas a mano:
>   la página es el único lugar donde se cargan. Ahora `sesiones` es `permiso: null` y
>   **el permiso `horas` gobierna lo que se ve adentro**: sin él, cada uno registra y
>   edita lo suyo; con él, se ve y se edita a todo el equipo. `horas-stats.html`
>   (análisis) sigue detrás de `horas`.
>
> **T7.4 — CARGA MANUAL DE HORAS CON AVISO (implementado):**
> · Cuando alguien **sin** permiso `horas` registra tiempo a mano, se publica un
>   mensaje en el Chat: quién, cuánto, en qué actividad, qué día y la nota.
> · Se reutiliza la infraestructura de comunicación en vez de inventar un sistema de
>   notificaciones: **un solo hilo con ID fijo `comunicaciones/horas-manuales`**
>   (regla 3.5) que crece con cada registro, en lugar de un tema nuevo por cada uno.
>   `setDoc merge` lo crea la primera vez y actualiza el encabezado; el mensaje va a la
>   subcolección `mensajes` con el mismo formato que usa `comunicacion.html`.
> · **El aviso nunca hace fracasar el registro**: si falla, se loguea y las horas quedan
>   igual. El tiempo trabajado no se pierde por un problema de mensajería.
> · Quien tiene `horas` no se avisa a sí mismo.
> · sw shell **v24**.
>
> **PENDIENTE — T7.3, la última pieza (y la que habilita bajar a Mauro a colaborador):**
> 1. **`dinero.html`**: con solo `dinero` se ven **únicamente los movimientos propios**
>    y se ocultan KPIs, balance, pendientes del equipo y exportación. Con `finanzas`,
>    todo. Va junto con las reglas porque una consulta sin permiso falla entera.
> 2. **`firestore.rules` leyendo permisos**, no solo el rol:
>    · `/movimientos/` — lectura para admin o `finanzas`; con solo `dinero`, únicamente
>      los propios (`creadoPor == uid`, que hay que empezar a escribir en cada alta).
>    · `/honorarios/` — `update` también para `finanzas` (hoy solo admin: sin esto,
>      pagar un honorario falla).
>    · `/honorarios/` — `update` para `horas` (el recálculo de ciclos del gestor).
>    · `/cabanas/` y `/espacios_comunes/` — escritura para `contenido`.
>    · `/reservas/`, `/pagos/`, `/clientes/` — `delete` para `reservas`.
> 3. **Recién después**: bajar a Mauro a colaborador con `reservas`, `finanzas`,
>    `contenido` y `horas`. Hasta entonces **tiene que seguir siendo admin**.
>
> · **Nota de alcance a revisar**: con `horas`, una persona ve las sesiones de TODO el
>   equipo, incluidas las de los proyectos privados de Mauro y Florencia (los títulos
>   de esas actividades no se resuelven, pero las horas y los nombres sí se ven). Hoy
>   no molesta porque `horas` lo tendrían ellos dos; conviene decidirlo antes de darle
>   ese permiso a alguien más.

# v5.26 — PERMISOS · Tanda 1: modelo y editor (T7.1)

> **Registro v5.26 (Tanda 7.1 — nucleo.js · usuarios.html · sw.js):**
> · **Decisión del administrador: UNA sola cuenta admin.** `CasaVerde` es el
>   superusuario — mantenimiento, acceso sin restricciones a los datos de todas las
>   personas, a la información financiera completa y a modificar cualquier registro.
>   Todos los demás (Mauro incluido) trabajan con **permisos explícitos**.
> · **Catálogo de permisos — FUENTE ÚNICA en `nucleo.js` (`CV2.PERMISOS`)**. Agregar
>   uno nuevo se hace ahí y aparece solo en el editor y en la navegación:
>   · **`reservas`** — reservas, presupuestos y clientes.
>   · **`dinero`** — registrar gastos y ver **solo los propios**, sin balances ni
>     totales del negocio.
>   · **`finanzas`** — ver todo el dinero, hacer balance y exportar (incluye `dinero`).
>   · **`contenido`** — editar cabañas y espacios comunes.
>   · **`horas`** — gestor de sesiones y análisis de horas de todo el equipo.
> · **Mínimo sin permisos**: Inicio, Actividades, Calendario, Chat y los Cobros propios.
>   Crear actividades lo puede todo el equipo: no lleva permiso.
> · **`finanzas` nació de una tensión señalada por Claude**: si el balance viviera solo
>   en CasaVerde, el administrador entraría con la cuenta de mantenimiento todas las
>   semanas y esa cuenta dejaría de ser de mantenimiento. Con `finanzas`, Mauro y
>   Florencia operan con su propio usuario y CasaVerde queda para emergencias.
> · **`nucleo.js`**: `CV2.puede(permiso)` · **`CV2.puedeAlguno([...])`** (nuevo) ·
>   **`CV2.verItem(it)`** (nuevo) · cada entrada de `CV2.NAV` declara ahora su
>   `permiso` (`null` = para todos · string · array = alguno de esos ·
>   `soloAdmin:true` = únicamente CasaVerde). Muere la lista `SIEMPRE`.
> · **`usuarios.html`**: editor de permisos con casilla y explicación por permiso,
>   chips por usuario en la lista, y aviso negro cuando el rol es admin (no se le
>   tildan permisos: puede todo por definición; se guardan vacíos para no dejar dos
>   verdades sobre lo mismo).
> · Los permisos del sistema viejo (array de 31 nombres de páginas inexistentes) **no
>   se migraron**: se definen de cero sobre estas 5 casillas.
> · sw shell **v23**.
>
> **PENDIENTE CRÍTICO — el orden importa (T7.2 y T7.3):**
> Hoy las páginas no preguntan por permisos: preguntan por `CV2.esAdmin()`. Mientras
> eso siga así, bajar a Mauro a colaborador lo dejaría **sin poder pagar honorarios,
> hacer balance, editar movimientos, borrar reservas ni sincronizar Airbnb**.
> · **T7.2** — convertir los `esAdmin()` de dinero.html, honorarios.html, reservas.html
>   y cabanas.html en `CV2.puede('finanzas' | 'reservas' | 'contenido')`. En Dinero,
>   además: con solo `dinero` se ven **únicamente los movimientos propios** y se ocultan
>   KPIs, balance y pendientes del equipo.
> · **T7.3** — reglas de Firestore leyendo permisos y no solo el rol (`movimientos`
>   legible por admin o por quien lo registró, etc.). **Recién ahí** se baja a Mauro
>   a colaborador.
> · Hacerlo en otro orden deja al administrador bloqueado en su propio sistema.
>
> · **Pedido nuevo del administrador (T7.4)**: **carga manual de horas** por parte de
>   un colaborador, que **llegue como mensaje** a quien tenga el permiso `horas`.
>   Requiere `gestion-sesiones.html` y `comunicacion.html` para no inventar el formato
>   de los mensajes.
> · **Cerrado**: las 35 sesiones a nombre de CasaVerde **quedan como están** (decisión
>   del administrador).

# v5.25 — MIGRACIÓN COMPLETADA · reglas de Firestore completas (T6.2)

> **Registro v5.25 (Tanda 6.2 — firestore.rules):**
> · **MIGRACIÓN TERMINADA.** 131 documentos cargados en `casaverde-20`: 3 cabañas ·
>   6 espacios comunes · 1 cliente · 47 actividades · 70 sesiones · 1 honorario ·
>   2 movimientos de reembolso · 1 config. El sistema viejo pasa a ser **solo archivo**.
> · **Emparejamiento de personas (quedó así)**: el admin viejo
>   `casaverdecanas@gmail.com` → **CasaVerde** (dueño de 35 sesiones) ·
>   `maurogasta@gmail.com` → **Mauro** (`masotromauro@gmail.com` en el 2.0) ·
>   Florencia y Esteban, directo. Los emails cambiaron entre sistemas, por eso la
>   sugerencia automática no alcanzó y hubo que confirmarlos a mano.
> · **`firestore.rules` COMPLETO** (reemplaza al parcial de la Fase 0). Cubre las 14
>   colecciones + la subcolección `mensajes` + el libro personal. Deny por defecto,
>   sin catch-all.
>
> **LECCIÓN DURA — las reglas se SUMAN.** Basta con que un bloque permita para que el
> acceso quede abierto; y si se reemplaza el archivo entero por unos pocos bloques,
> todo lo demás queda denegado. Publicar solo dos bloques dejó el sitio inaccesible
> (ni la app ni la web: sin lectura de `/usuarios/` no se puede ni arrancar la sesión).
> **Recuperación**: la consola de Firebase no depende de la app — se republica desde
> ahí y vuelve en un minuto. **Regla de trabajo desde ahora: las reglas se editan
> SIEMPRE sobre el archivo completo, nunca por fragmentos.**
>
> · **Fuga cerrada gracias a lo mismo**: `config/integraciones` (clave de Google)
>   quedaba cubierta también por el bloque general de `config`, de modo que cualquier
>   usuario activo podía leerla. El bloque general ahora **excluye `integraciones`
>   explícitamente**.
> · **Huecos que la migración destapó y quedaron resueltos:**
>   · `espacios_comunes` **no tenía regla** ni figuraba en CONVENCIONES §4 — se nos
>     pasó en la Fase 0. Ya está, y con lectura pública.
>   · `/sesiones/` solo permitía crear las propias (`uid == auth.uid`): correcto para
>     el uso diario, imposible para migrar. Ahora **el admin puede crear en nombre de
>     otro** — no como bloque temporal (un bloque que hay que acordarse de borrar es un
>     bug esperando), sino permanente, porque el gestor de sesiones lo necesita igual.
> · **Lectura pública** en `cabanas` y `espacios_comunes`: son la fuente del sitio
>   público de la Fase 4 y no contienen nada privado.
> · **`/usuarios/{uid}` se lee con solo estar logueado**, no con `activo()`: si se
>   exigiera estar activo, la comprobación se mordería la cola (para saber si estás
>   activo hay que leer tu propio perfil) y nadie podría entrar.
> · Próximo: **permisos por usuario** en `usuarios.html` — último punto pendiente antes
>   de la operación en paralelo.

# v5.24 — MIGRACIÓN · Paso 2: el cargador (T6.1)

> **Registro v5.24 (Tanda 6.1 — cargar-datos.html, en el 2.0):**
> · **Radiografía leída y export analizado**: 1241 documentos en el viejo, de los cuales
>   **migran ~140**. La base estaba más sana de lo esperado: **0 actividades huérfanas**
>   y **0 sesiones apuntando a actividades inexistentes**.
> · **DECISIONES CERRADAS por el administrador:**
>   1. Cabañas **1 = Vista al Bosque · 2 = Loft · 3 = Familiar** → IDs `c1/c2/c3`.
>   2. Los **5 proyectos de obra** (Santa fe, Desarmado Yurta, Dgo Aramburú, Terraza
>      dormitorios, General flores) **migran** como `alcance:'asignados'` con
>      `competencias:[Mauro, Florencia]`. Esteban no los ve.
>   3. De `clientes` solo **Nati** (el otro registro era el propio administrador).
>   4. El **inventario de 15 ítems** de la cabaña 1 se **replica a las tres**.
>   5. `informes_airbnb` y `disponibilidad` **quedan afuera**.
> · **HALLAZGO CRÍTICO — los UIDs de Auth cambian.** `casaverde-20` es un proyecto
>   nuevo: los identificadores de Auth NO son los del viejo. Sin traducirlos, las 70
>   sesiones y los cobros nacerían huérfanos. Por eso el cargador tiene un **paso de
>   emparejamiento de personas** (sugerencia automática por email, confirmación manual)
>   que se aplica a `sesiones.uid`, `honorarios.uid`, `actividades.creadoPor` y
>   `actividades.competencias`.
> · **Correcciones de datos que aplica la carga:**
>   · `capacidadBase:2` / `capacidadMaxima:4` (idénticos y falsos en las tres cabañas)
>     se **descartan**; manda el objeto `capacidad {base, max}`.
>   · Los pares espejo `airbnb_url`/`airbnbUrl`, `caracteristicas`/`features`,
>     `notaEspecial`/`specialNote` eran **copias exactas** → se conserva un solo nombre.
>   · `recurrencia` → **`recurrenciaDias`** · `actividadNombre` → **`actividadTitulo`**.
>   · Las **4 sesiones "pausadas"** (estado que ya no existe) entran como `finalizada`
>     conservando sus horas — salda el pendiente histórico A10.1.
>   · Se **crea la rama de limpieza de la cabaña 2** (`limpiezas-cab-2` +
>     `faltantes-cab-2`), que faltaba en el viejo: las tres quedan parejas.
>   · **Colores de proyecto**: las 9 raíces salen sin color en el viejo; la carga les
>     asigna uno de una paleta para que la cascada tenga de dónde heredar (salda A10.2).
>   · Los **2 reembolsos** de `honorarios` entran a `/movimientos/` como salida con
>     `pendiente:'reponer'` — en el 2.0 un reembolso no es un honorario.
> · **Idempotente por diseño (regla 3.5)**: escribe con `setDoc merge` usando los IDs
>   viejos como IDs nuevos. Correrlo dos veces **pisa, nunca duplica**.
> · **DISCREPANCIA DETECTADA — corregir CONVENCIONES.md**: el documento dice
>   `sesiones.tipo ('crono'|'manual'|'tilde')` pero `actividades-core.js` escribe
>   **`'cronometro'`**. Manda el código (es lo que ya hay en la base). Actualizar §4 del
>   reglamento.
> · **A VERIFICAR contra `cabanas.html` del 2.0**: la forma exacta de `capacidad`
>   (se carga como objeto `{base, max}`) y de `fotos` (se carga como lista de URLs,
>   descartando `titulo`/`descripcion` de cada foto). Si la página espera otra cosa,
>   son dos líneas del cargador.
> · **Descartado explícitamente**: reservas (el único documento era de prueba,
>   `creadoPor:'sistema-test'`), presupuestos (vacía), pagos (67, todos con
>   `reservaId:null`, nacidos de extractos), gastos (416), movimientos bancarios (476),
>   historial_tareas (62), cuentas, categorías, destinos, resumenes, comunicaciones (6
>   de prueba), el manual viejo (155 KB) y **el token de GitHub** (no va al proyecto nuevo).
> · **T6.1 queda saldado**: no hay "corte de reservas a definir" — no hay reservas que
>   migrar.
> · Próximo: correr la carga, verificar en pantalla, y después **permisos por usuario**
>   en `usuarios.html` (el schema del 2.0 espera `permisos` como **objeto**
>   `{dinero:true, …}`, mientras el viejo tenía un **array** de nombres de páginas que ya
>   no existen: no se migran, se redefinen de cero sobre las secciones del 2.0).

# v5.23 — MIGRACIÓN · Paso 1: radiografía y exportación del sistema viejo (T6.0)

> **Registro v5.23 (Tanda 6.0 — exportar-todo.html, en el SERVIDOR VIEJO):**
> · Decisión del admin: el **Manual queda para el final**, cuando todo el sistema esté
>   terminado. Se adelanta la **migración de datos**, y después los **permisos por
>   usuario**.
> · **exportar-todo.html** (nueva, sistema VIEJO, `interno/`, fuera del menú, admin).
>   **Solo lectura**: no escribe ni borra nada. Firebase 8.10.1 + `CVC.verificarAuth`,
>   estilo viejo (sin backticks, sin `?.`, sin `??`, sin arrow functions, sin
>   where+orderBy compuesto) — validado con `node --check`.
> · **Criterio establecido (importante):** la migración se hace en DOS PASOS, no en uno.
>   Un volcado completo de la base tiene decenas de miles de documentos y **no se puede
>   revisar en el chat** — revisarlo a ciegas es justamente lo que produce los errores
>   de coherencia que se quieren evitar. Por eso:
>   1. **Radiografía** — por colección: cantidad, **inventario de campos con tipo y
>      porcentaje de documentos que lo tienen**, rango de fechas y 3 documentos de
>      ejemplo. Sale como informe de texto para pegar en la conversación.
>   2. **Exportación completa** — JSON por colección o todo en un archivo, con
>      `{__tipo:'timestamp', iso}` y `{__tipo:'referencia', path}` para no perder
>      tipos. Es el archivo histórico definitivo Y la fuente del archivo de carga.
> · **Dos modos de radiografía**: por *muestra* (hasta 300 docs por colección — rápida y
>   barata) y *completa* (conteos exactos, muchas lecturas de Firestore). El campo con
>   porcentaje < 100% se marca en ámbar: **ahí están los campos opcionales, agregados a
>   mitad de camino o abandonados** — que es exactamente lo que hay que decidir al migrar.
> · Cubre 34 colecciones conocidas + sondeo de la **subcolección vieja
>   `actividades/{id}/sesiones`** + detección de los **libros personales
>   `mov_personal_{uid}`** (probando por cada usuario, ya que las colecciones no se
>   pueden enumerar desde el cliente). Lo que no exista se informa como vacío y no rompe.
> · **Próximo paso — a cargo del admin**: correr la radiografía por muestra, copiar el
>   informe y pegarlo en la conversación. Con eso se decide colección por colección qué
>   migra, qué se descarta y cómo se mapea cada campo al schema del 2.0. Recién después
>   se escribe el archivo de carga.
> · Pendiente inmediato después de la migración: **permisos por usuario** en
>   `usuarios.html` del 2.0 (qué secciones ve cada uno; `CV2.puede()` y la lista SIEMPRE
>   de `nucleo.js` ya están preparados para eso).

# v5.22 — REFUNDACIÓN · FASE 3 completa: honorario → Dinero (T3.3b)

> **Registro v5.22 (Tanda 3.3b — honorarios.html · dinero.html · sw.js):**
> · **El puente honorarios → Dinero.** "Pagar" ya no es un `confirm()`: abre un modal
>   con el monto, la **fecha del pago** (editable, no siempre se paga el día que se
>   registra) y el tilde **"Registrar la salida en Dinero"**, marcado por defecto.
> · El movimiento nace en `/movimientos/` con `tipo:'salio'`, categoría **Honorarios**,
>   `uid`/`nombre` = **quien cobra**, detalle "Honorario — <concepto>", `pendiente:null`
>   y **vínculo `refTipo:'honorario'` + `refId`**.
> · **Idempotencia por vínculo**: el honorario guarda `movimientoId`. Si ya lo tiene, el
>   tilde aparece deshabilitado y no se crea nada. **Tocar dos veces no duplica plata**
>   — el mismo criterio que hizo confiable el cierre de ciclos.
> · Campos nuevos en `honorarios`: `movimientoId|null`, `pagadoFecha` (la fecha real del
>   pago, además del `pagadoEn` del servidor).
> · **Botón "A Dinero"** en los honorarios ya pagados **sin** `movimientoId`: resuelve
>   los que se pagaron antes de existir este puente, sin migración ni script.
> · Chip **"→ en Dinero"** en la lista de Cobros: de un vistazo se ve cuáles ya tienen
>   su salida registrada.
> · **Del lado de Dinero**: chip **"honorario"** en los movimientos de origen; al
>   borrar uno, aviso explícito y **el vínculo se suelta** (`honorarios.movimientoId
>   = null`) para que Cobros lo pueda volver a registrar. Nada queda apuntando al vacío.
> · sw shell **v22**. Sin archivos nuevos.
> · **Sin reglas nuevas**: usa `/movimientos/` y `/honorarios/`, ya cubiertas.
> · **FASE 3 (Dinero) COMPLETA**: movimientos + pendientes derivados (T3.1) · balance,
>   cierres y exportación (T3.2) · libro personal (T3.3a) · puente honorarios (T3.3b).
> · Próximo: **Manual de la Fase 3** (Dinero, balances, libro personal, cobros), como
>   cierre de tanda según la convención acordada. Después: decidir si va T2.5 (chequeos
>   de inventario por reserva) o se arranca la Fase 4 (operación en paralelo).

# v5.21 — REFUNDACIÓN · FASE 3: Libro personal (T3.3a)

> **Registro v5.21 (Tanda 3.3a — dinero.html · sw.js):**
> · **Libro personal**, resuelto como **pestañas dentro de la misma página Dinero**
>   (decisión del admin): *Negocio* / *Mi libro personal*. Es la misma herramienta;
>   el aislamiento lo dan las reglas, no la URL — así no volvemos a tener dos páginas
>   que hacen lo mismo (lección B2 del diagnóstico).
> · **Ruta: subcolección `/usuarios/{uid}/movimientos_personales/{id}`.** A propósito:
>   la ruta ya aísla el libro, la regla es una línea y NO hace falta `where()` ni
>   índices compuestos. Mismo modelo de movimiento que el negocio.
> · **Alcance del libro personal**: movimientos, categorías y exportación. **Sin
>   pendientes y sin balance** — esa maquinaria existe para repartir entre personas y
>   en un libro de uno solo no significa nada. En la pestaña personal desaparecen el
>   panel de pendientes, el botón Hacer balance, el botón Balances, el selector
>   "Quién" y el tilde de pendiente.
> · **Categorías personales: nacen del uso.** No hay catálogo que mantener — se derivan
>   de los propios movimientos, sobre una base (Casa, Comida, Salud, Transporte,
>   Ingresos, Otros). Las del negocio siguen en `config/dinero.categorias`.
> · En el libro personal el **dueño edita y borra lo suyo** aunque no sea admin.
> · La suscripción se rehace al cambiar de pestaña (se desuscribe la anterior y se
>   descarta la respuesta que llega tarde, para que no se mezclen los dos libros).
> · Exportación CSV también en el personal (archivo `personal-movimientos-…csv`).
> · sw shell **v21**. Sin archivos nuevos.
> · **ACCIÓN ADMIN — regla de Firestore** (ver A7bis):
>   `match /usuarios/{uid}/movimientos_personales/{id} { allow read, write: if
>   request.auth.uid == uid; }` — **solo el dueño, ni siquiera el admin**. Es un cambio
>   respecto del diseño viejo de S2 (que daba lectura al admin): un libro que el admin
>   puede leer no es personal para Florencia ni para Esteban. Si el admin prefiere lo
>   contrario, se cambia esa única línea.
> · **PENDIENTE de esta tanda (T3.3b)**: honorario pagado → movimiento de salida con un
>   toque. Falta que el admin suba `honorarios.html`. Criterio ya acordado: tilde
>   "Registrar la salida en Dinero" marcado por defecto al marcar pagado; el movimiento
>   nace con categoría Honorarios, quién = el que cobra, y **vínculo `refTipo:'honorario'`
>   + `refId`** para que tocar dos veces no duplique.
> · Después de T3.3b: el **Manual**, como cierre de la Fase 3.

# v5.20 — REFUNDACIÓN · FASE 3: Balance y exportación (T3.2)

> **Registro v5.20 (Tanda 3.2 — dinero.html · sw.js):**
> · **"Hacer balance"** (admin): modal con período (Desde sugerido = día siguiente al
>   `hasta` del último cierre; Hasta = hoy), resumen derivado del período y **lista de
>   pendientes vivos agrupados por persona+clase con tilde**. Lo tildado se salda; lo
>   destildado **arrastra** al próximo balance. Al confirmar: doc nuevo en **/cierres/**
>   y sellado de cada movimiento saldado (`pendiente.saldado:true` +
>   `pendiente.cierreId`).
> · **Snapshot inmutable /cierres/{id}**: `{fecha, desde, hasta, cerradoPor,
>   cerradoNombre, totales:{entroBRL, salioBRL, resultadoBRL, porCobrarBRL,
>   movimientos, porCategoria[]}, pendientesSaldados[], pendientesArrastrados[],
>   reparticion:{modo:'manual', nota}, creadoEn}`. Cada elemento de pendientes:
>   `{uid, nombre, clase, totalBRL, movIds[]}`.
> · **Repartición: modo 'manual' por ahora** — nota libre en el snapshot. El motor
>   parametrizable (config/reparticion: tiempos, propiedad, inversiones, costo de
>   funcionamiento, deudas) queda como tanda futura, cuando el admin defina las cuotas.
>   El campo `reparticion.modo` existe desde ya para no cambiar el schema después.
> · **Sellado = inmutable**: un movimiento con `pendiente.cierreId` no se edita, no se
>   borra y no se vuelve a saldar. Chip 🔒 "en balance" en la lista; los botones de
>   admin desaparecen para ese movimiento.
> · **Balances** (historial): modal con todos los cierres (último primero), sus totales,
>   cuántos pendientes saldó y arrastró, la nota de repartición y botón **Exportar este
>   período**.
> · **Exportación a planilla (CSV)**: botón Exportar baja el período/filtros a la vista;
>   columnas fecha, tipo, monto, moneda, monto_BRL, categoria, quien, detalle,
>   pendiente, saldado, balance_id, comprobante. UTF-8 con BOM (acentos correctos en
>   Numbers/Excel), orden cronológico. Sin librerías externas: Blob + descarga directa,
>   funciona desde iPad.
> · **CORRECCIÓN DE COHERENCIA (T3.1)**: los KPIs sumaban TODOS los movimientos, pero
>   el diseño acordado dice que un ingreso **"por cobrar" no es ingreso hasta cobrarse**.
>   Ahora se excluye de Entró/Resultado y aparece en un KPI aparte **"Por cobrar (no
>   cuenta todavía)"**, visible solo si hay. Mismo criterio en el resumen del balance y
>   en los totales del snapshot. Un gasto "a reponer" sigue contando como gasto real
>   desde el día uno (no cambió).
> · sw shell **v20**. Sin archivos nuevos: toda la tanda vive en dinero.html.
> · **ACCIÓN ADMIN — regla de Firestore para `/cierres/`** (ver A7bis): sin ella el
>   botón falla al guardar. Lectura: usuario activo. Create: admin. **Update/delete:
>   nadie** (el snapshot es inmutable por regla, no solo por convención).
> · Próximo: **T3.3** — honorario pagado → movimiento de salida con un toque + libro
>   personal separado (colección aparte, mismo modelo, cero cruce con el negocio).
>   Después, el **Manual** como cierre de la Fase 3.

> **Registro v5.19 (Tanda 3.1 — dinero.html):**
> · Sync Airbnb VERIFICADA por el admin (API key funcionando).
> · **dinero.html** nueva: el modelo SIMPLE como ÚNICO sistema financiero, en UNA
>   página. Colección /movimientos/: fecha, tipo entro/salio, monto+moneda BRL/USD/UYU
>   (+montoBRL equivalente, mismo criterio que pagos), categoría dinámica (config/
>   dinero.categorias con ➕ inline; defaults Alquileres/Compras/Mantenimiento/
>   Servicios/Honorarios/Otros), quién (uid+nombre del equipo), detalle, FOTO de
>   comprobante (Cloudinary), y flag pendiente {clase reponer|cobrar, uid, saldado,
>   cierreId}.
> · **Pendientes por persona SIEMPRE DERIVADOS** (panel arriba): "reponerle a X" /
>   "por cobrar (X)", tilde ✓ salda (admin). KPIs entró/salió/resultado en R$ por
>   período (mes/3m/año/todo) + filtros tipo/categoría. Edición/borrado admin.
> · Nav "Dinero" (admin por ahora; colaboradores pueden leer por reglas — habilitar en
>   nav vía permisos cuando haga falta, p.ej. Esteban) · manual sección Dinero ·
>   sw shell v19.
> · T2.5 (chequeos de inventario por reserva) DIFERIDA a pedido de ritmo — se agrega
>   como tanda suelta cuando el admin quiera.
> · Próximo: T3.2 — "Hacer balance" (snapshot inmutable en /cierres/ + arrastre de
>   pendientes) + exportación a planilla · T3.3 — honorario pagado → movimiento con un
>   toque + libro personal separado.

> **Registro v5.18 (Tanda 2.4):**
> · **clientes.html** nueva: ficha (nombre, teléfono→link WhatsApp wa.me, email, país,
>   notas), búsqueda, historial de reservas del cliente, borrado solo sin reservas.
>   En el alta de reserva: selector de cliente con ➕ Nuevo (ficha mínima por prompt,
>   sin salir del formulario) o ✎ solo nombre sin ficha; la reserva guarda clienteId +
>   clienteNombre denormalizado.
> · **Sync Airbnb** (RCore.sincronizarAirbnb): lee Google Calendar v3 por cabaña
>   (cabanas.calendarId) con key en config/integraciones.googleApiKey (si falta, el
>   botón la pide y la guarda — admin only por reglas). Eventos → reservas origen
>   'airbnb' con googleEventId: nuevas confirmadas (+limpieza automática), fechas
>   cambiadas actualizadas (+historial), eventos futuros desaparecidos → ANULADA
>   (+limpieza borrada). Ignora bloqueos "Not available". Ventana: desde -30 días.
>   Botón ↔ Airbnb en Reservas (admin). SALDA el pendiente histórico del viejo:
>   las canceladas ahora se detectan por desaparición del evento.
> · Nav "Clientes" (todos) · manual (Clientes + Sync Airbnb) · sw shell v18.
> · ACCIÓN ADMIN: pegar la Google API Key del viejo (config/integraciones) la primera
>   vez que toque el botón Airbnb; verificar que cada calendario de Google sea público
>   y que cada ficha de cabaña tenga su Calendar ID.
> · FASE 2 funcionalmente completa salvo T2.5 (chequeos de inventario por reserva) —
>   a decidir si va ahora o tras la Fase 3 (Dinero).

> **Registro v5.17 (Tanda 2.3b — especificaciones del admin sobre pagos y reservas):**
> · **Pagos en BRL/USD/UYU**: campo moneda en el modal; si no es BRL se carga el
>   **equivalente en R$ al cambio del día** (campo NUEVO pagos.montoBRL) — el saldo de
>   la reserva cierra SIEMPRE en reales sin depender de cotizaciones automáticas
>   (criterio: el flujo define los saldos). La lista muestra monto original + ≈R$.
> · **Categoría por recepción** (pagos.categoria) y **cuenta de destino**
>   (pagos.cuentaDestino): listas mantenibles en config/dinero
>   (categoriasRecepcion[], cuentasDestino[]) con ALTA INLINE al registrar (opción
>   ➕ Agregar nueva → prompt → arrayUnion + queda seleccionada). Defaults de
>   categorías: Alquiler, Seña, Extra.
> · **Horarios de reserva**: reservas.horaEntrada/horaSalida (defaults 14:00/10:00) en
>   formulario, tarjeta y calendario (entradas/salidas con hora).
> · Schema (se suma a CONVENCIONES): pagos.{moneda BRL|USD|UYU, montoBRL, categoria,
>   cuentaDestino} · reservas.{horaEntrada, horaSalida} · config/dinero.{
>   categoriasRecepcion[], cuentasDestino[]}.
> · manual actualizado · sw shell v17. Próximo: T2.4 sync Airbnb.

> **Registro v5.16 (Tanda 2.3 + logo reforzado):**
> · **reservas-core.js** nuevo: RCore.sincronizarLimpiezas — proyecto raíz determinista
>   'proj-limpiezas' + actividades 'limp-<reservaId>' idempotentes. Confirmada con
>   salida hoy/futura → upsert (título/fecha/monto gestionados por merge parcial;
>   hecho/sesiones NUNCA se pisan); anulada → borra si no está hecha. El MONTO sale de
>   tarifas.limpieza de la ficha de la cabaña → honorarios por reparto normal.
> · **reservas.html**: confirmar crea la limpieza al instante (toast), anular la
>   cancela, editar fechas/cabaña la realinea.
> · **calendario.html** nuevo: vista mensual (lunes primero) con barras por cabaña y
>   marca de día de entrada, leyenda, día seleccionable con entradas/salidas (+chip
>   limpieza)/en casa, navegación de meses, botón 🧹 admin que sincroniza TODAS las
>   limpiezas de una pasada.
> · **Logo**: variantes de lectura reforzada — logo-reforzado (trazo engrosado, crema
>   plena) y logo-contorno (halo verde selva, legible sobre fotos y fondos claros),
>   ambas también en 480px. Se suman a los activos de la guía estética.
> · Nav "Calendario" (todos) · manual sección Calendario y limpiezas · sw shell v16.
> · Próximo: T2.4 — sync Airbnb (Google Calendar por cabaña) → T2.5 chequeos de
>   inventario por reserva. Luego Fase 3 (Dinero).

> **Registro v5.15 (Tanda 2.2b — extractor + importador de cabañas):**
> · **extractor-cv2.html** (se sube a /interno/ del SITIO VIEJO, escrito con las reglas
>   del viejo: ES5, Firebase 8, sin backticks/arrows; usa el utils.js viejo ya
>   presente): SOLO LECTURA — exporta cabanas + contenido + config (excluyendo
>   integraciones/github/tokens) y descarga export-casaverde-viejo.json. Requiere
>   sesión iniciada en el panel viejo.
> · **importar-viejo.html** (en el 2.0, solo admin, herramienta temporal — se borra
>   tras el corte): carga el JSON, INTERPRETA el schema viejo con tolerancia (campos
>   por nombres alternativos + COSECHA recursiva de URLs de fotos en todo el doc),
>   muestra previa con miniaturas y mapeo old→c1/c2/c3 por selector, e importa con
>   setDoc merge IDEMPOTENTE. Las fotos conservan sus URLs de Cloudinary (mismo cloud
>   dnwfu8ffn): cero resubidas.
> · Bootstrap de cabañas movido a cabanas.html (orden natural: primero cabañas,
>   después reservas). Aclarado: cabanas.html es el EDITOR interno; el índice público
>   del 2.0 se construye en Fase 4 leyendo estos datos.
> · La página importar-viejo NO va al shell del sw (temporal, por URL directa).

> **Registro v5.14 (Tanda 2.2):**
> · **Pagos de reservas** en reservas.html: colección plana /pagos/ con campo NUEVO de
>   schema **concepto: 'sena'|'saldo'|'otro'** (se suma a CONVENCIONES §2.5) + método
>   pix/efectivo/transferencia/airbnb/otro. Botón 💰 (admin) con sugerencia de seña si
>   es el primer pago; la tarjeta muestra pagado/saldo SIEMPRE DERIVADOS y el chip
>   "señada" en presupuestos; lista de pagos en el detalle con borrado admin; cada pago
>   se asienta en el historial de la reserva.
> · **cabanas.html** nueva (SOLO ADMIN): ficha completa por cabaña — nombre y
>   descripción es/pt/en (fallback al es), capacidad, orden, tarifas noche+limpieza,
>   amenities, calendarId de Google (para la sync Airbnb de la próxima tanda) y FOTOS
>   con subida directa a Cloudinary (cloud dnwfu8ffn, preset preset-comprobantes, POST
>   sin firma) o URL pegada. Es la fuente del sitio público de la Fase 4.
> · nucleo.js: "Cabañas" en NAV (admin) · manual: secciones Cabañas + pagos en Reservas
>   · sw shell v15.
> · Nota: /clientes/ como colección queda para una tanda próxima (hoy clienteNombre
>   directo en la reserva). Próximo: T2.3 — calendario + generación automática de
>   limpiezas (ids deterministas limp-<reservaId>) → T2.4 sync Airbnb.

> **Registro v5.13 (Tanda 2.1 — Reservas · Tanda 2.1b — fix de lecturas):**
> · **reservas.html** nueva (T2.1): ciclo presupuesto→confirmada→finalizada/anulada en
>   UNA colección; tarjetas con color por cabaña, 🏠 En casa, noches y total; acciones
>   admin (confirmar/finalizar/anular/editar) con HISTORIAL de cambios (fecha+autor);
>   aviso de SUPERPOSICIÓN al confirmar sobre otra confirmada de la misma cabaña;
>   filtros Vigentes/estados. Bootstrap: si /cabanas/ está vacía, el admin crea las 3
>   base (c1 Vista al Bosque, c2 Familiar Premium, c3 Loft) de un toque. "Reservas" en
>   NAV; sección en el manual.
> · **FIX estructural de lecturas no-admin (T2.1b)**: la consulta or() de actividades
>   tenía una rama no DEMOSTRABLE contra las reglas (creadoPor sin fijar alcance) → el
>   servidor la rechazaba entera. Síntomas: toast rojo permanente en Actividades para
>   colaboradores (con datos servidos por la caché compartida) y Gestor sin proyectos.
>   Solución: **Core.consultaActividades(u, esAdmin)** — ÚNICO lugar, 4 ramas todas
>   demostrables (equipo · personal+propia · asignados+incluido · asignados+propia) —
>   usada por actividades, gestor y horas-stats. LECCIÓN registrada: toda rama de un
>   or() para no-admin debe implicar por sí sola la regla de lectura.
> · **Privacidad de caché en dispositivos compartidos**: cerrar sesión ahora ejecuta
>   terminate + clearIndexedDbPersistence — la caché local (una por navegador) no
>   queda disponible para el próximo usuario del aparato.
> · sw shell v13. Próximo: T2.2 — clientes + pagos de reservas.

> **Registro v5.12 (Tanda 1.5 — Manual 2.0, cierre de Fase 1):**
> · **manual.html** nueva: el manual VIVE EN EL CÓDIGO (decisión de simplificación: el
>   deploy es un push, no hace falta el circuito Firestore config/manual + config/ayuda
>   + cargador del sistema viejo — esos docs de config quedan SIN USO en el 2.0).
>   Secciones ancladas por página: actividades, cronómetro, cobros, sesiones, horas,
>   chat, usuarios, la app. Redactado en voseo describiendo el comportamiento real.
> · **Ayuda contextual**: botón ? en la barra (nucleo.js) → manual.html#<página-activa>,
>   con scroll suave al ancla.
> · sw shell v11.
>
> **FASE 1 CERRADA.** Módulos operativos y probados por el admin: Actividades (árbol,
> colores en cascada, semáforo de rutina, tachadas), Cronómetro Play/Stop multiusuario
> con banner prioritario, Cobros proporcionales con recálculo gobernado por el Gestor,
> Gestor de Sesiones (cascada proyecto→actividad), Análisis de horas, Chat, Usuarios,
> Manual. PWA instalable con caché offline. Pendientes diferidos a fases siguientes:
> notificaciones (WhatsApp/badges, con funciones Netlify reapuntadas) e importador del
> árbol del sitio viejo (tanda opcional a pedido).
>
> **Comienza FASE 2 — RESERVAS**: T2.1 reservas.html (alta, estados presupuesto→
> confirmada→finalizada, ciclo de vida) → T2.2 clientes+pagos → T2.3 calendario +
> generación automática de limpiezas → T2.4 sync Airbnb → T2.5 integración con
> actividades/horas/cobros.

> **Registro v5.11 (Tanda 1.4d — recálculo de honorarios, espec. del admin):**
> · **Principio incorporado**: el Gestor de Sesiones es la fuente que GOBIERNA cobros y
>   estadísticas. Editar o borrar sesiones (admin) dispara Core.recalcularCiclos:
>   los honorarios de cada ciclo de la actividad se rehacen con el reparto proporcional
>   sobre las horas que quedaron, CONSERVANDO el pozo del ciclo (suma de sus
>   honorarios). Los honorarios recalculados llevan nota 'Recalculado por edición de
>   sesiones'.
> · **Regla de seguridad**: un ciclo con algún honorario PAGADO no se toca (el dinero
>   ya salió) — el toast avisa "ajustá el cobro a mano en Cobros". Sin horas restantes
>   en el ciclo: el pozo va a quien cerró el ciclo.
> · **actividades.html**: las horas del detalle se piden SIEMPRE frescas al servidor al
>   abrirlo (se eliminó el caché por sesión de página que ocultaba las ediciones).
> · Las estadísticas (horas-stats) ya reflejaban en vivo por onSnapshot de sesiones.
> · sw shell v10.

> **Registro v5.10 (Tanda 1.4c — regla de cierre multiusuario, espec. del admin):**
> · **TERMINADA frena todos los relojes**: al cerrar el ciclo de una actividad
>   (Stop-terminada o tilde), el core frena TODOS los cronómetros en curso de esa
>   actividad — de cualquier usuario — registrando sus horas (marca
>   cerradoPorCierreDeActividad + cerradoPorNombre) e incluyéndolas en el reparto de
>   ESE ciclo. Si el Stop fue "todavía no", los demás relojes siguen corriendo y su
>   tiempo queda para cuando la actividad se finalice.
> · **Guarda anti doble cierre**: Stop sobre una sesión ya frenada remotamente lanza
>   error 'sin-sesion' con mensaje claro y NO vuelve a cerrar el ciclo (evita
>   honorarios duplicados).
> · **UI resiliente**: actividades.html detecta el cierre remoto (verificación con
>   freno de 15s disparada por cambios de actividades y al volver a la pestaña) y
>   limpia el banner con aviso "tus horas quedaron registradas".
> · **firestore.rules**: sesiones update pasa a isActive() (el equipo frena relojes
>   ajenos SOLO en el acto de cierre — el core es el único camino); delete sigue
>   dueño/admin. REPUBLICAR REGLAS en la consola.
> · sw shell v9.

> **Registro v5.9 (Tanda 1.4b — usuarios.html):**
> · **usuarios.html** nueva (SOLO ADMIN; redirige a inicio si no): listado con rol y
>   estado, editar nombre/rol, activar/desactivar (corta acceso sin borrar historial;
>   protecciones: no auto-desactivarse ni auto-quitarse admin).
> · **Alta con dos modos**: (a) "Cuenta nueva" crea la cuenta de Auth DESDE el panel
>   usando app secundaria descartable (crearCuentaAuth en firebase-init.js:
>   initializeApp con nombre 'alta-usuarios' + createUserWithEmailAndPassword + signOut
>   de la secundaria) — la sesión del admin NO se pierde; (b) "Ya existe en Auth"
>   vincula por UID las cuentas creadas en consola (caso Flor/Esteban/masotromauro).
>   Si el email ya existe, el error guía al modo UID.
> · nucleo.js: "Usuarios" en NAV — primer ítem filtrado por permiso (solo lo ve admin).
> · sw shell v8.
> · Con esto el admin carga al equipo sin tocar la consola. Sigue pendiente T1.5
>   (Manual 2.0 + cierre de Fase 1).

> **Registro v5.8 (Tanda 1.4 + cascada en Gestor):**
> · **gestion-sesiones.html**: el registro manual ahora es EN CASCADA — primero se elige
>   el proyecto y el segundo select muestra solo su subárbol (incluida la raíz "el
>   proyecto en sí"), tabulado. Pedido del admin para cuando el sistema se llene.
> · **comunicacion.html (Chat)** nueva: temas de equipo con último mensaje, autor y
>   badge "nuevo" (comunicaciones_lecturas por usuario); hilo estilo mensajería con
>   burbujas propias/ajenas, envío con Enter, marca de lectura automática; nuevo tema
>   con primer mensaje. Única subcolección del sistema: comunicaciones/{id}/mensajes.
> · PENDIENTE registrado: notificaciones push/WhatsApp (Netlify functions reapuntadas
>   al proyecto casaverde-20 + badges en la navegación) — tanda propia dentro de F1/F2.
> · nucleo.js: "Chat" en NAV · sw shell v7.
> · Próxima tanda: T1.5 — Manual 2.0 + ayuda contextual + cierre de Fase 1 (requiere
>   los perfiles de Flor/Esteban/masotromauro cargados para la prueba de equipo).

> **Registro v5.7 (Tanda 1.3 + ajuste de Cobros):**
> · **honorarios.html**: edición SOLO ADMIN por registro (botón discreto edit_note →
>   modal monto + comentario; la nota se muestra en cursiva 💬 bajo el concepto). El rol
>   que comenta es el administrador — sin cambios de reglas (update ya era solo admin).
> · **gestion-sesiones.html** nueva: registro completo agrupado proyecto → actividad →
>   sesiones con colores de proyecto; filtros por persona (admin) y por proyecto o
>   subcategoría (árbol tabulado); alta manual (actividad de cualquier nivel + fecha +
>   hora inicio/fin con cálculo automático, tipo 'manual'); editar/eliminar propia o
>   admin. Colaborador ve SOLO sus sesiones (query where uid).
> · **horas-stats.html** nueva: períodos (7/30/90/365/todo), KPIs, torta SVG por
>   proyecto con los colores del proyecto, tabla por persona, filtros por usuario
>   (admin) y proyecto/subcategoría. Colaborador ve solo lo suyo.
> · nucleo.js: NAV completa de horas (Sesiones, Horas, Cobros) · sw shell v6.
> · Próxima tanda: T1.4 — comunicacion.html + notificaciones. Luego T1.5 (manual 2.0 +
>   perfiles del equipo) cierra la Fase 1. Importador del árbol viejo: disponible como
>   tanda opcional cuando el admin quiera.

> **Registro v5.6 (Tanda 1.2b):**
> · **Banner prioritario de cronómetro** en actividades.html: si hay un reloj corriendo
>   es LO PRIMERO que se ve al entrar (sticky arriba del árbol, se pinta apenas se
>   restaura la sesión activa, antes de que lleguen los datos): actividad, reloj vivo
>   grande y botón STOP directo. Cubre el caso "cerré el navegador / se reinició el
>   teléfono con el reloj corriendo". Pendiente F1: moverlo a nucleo para que aparezca
>   en TODAS las páginas del panel.
> · **honorarios.html (Cobros)** nueva: colaborador ve SUS honorarios (query where uid);
>   admin ve todo agrupado por persona con pendiente por cabeza y botón Pagar
>   (estado 'pagado' + pagadoEn — solo admin por reglas). KPIs pendiente/pagado.
>   En Fase 3 el botón Pagar además generará el movimiento de salida en Dinero.
> · Nota al admin: los honorarios existían en la colección desde T1.2 — se crean SOLO al
>   cerrar el ciclo de una actividad con monto > 0; lo que faltaba era la vista.
> · nucleo.js: "Cobros" en NAV (siempre visible) · sw shell v5.
> · Próxima tanda: T1.3 — Gestor de Sesiones + Análisis de horas.

> **Registro v5.5 (Tanda 1.2 — El core):**
> · **actividades-core.js 2.0** (módulo ES, export Core): sesionActiva, iniciar (Play,
>   bloquea doble cronómetro), finalizar (Stop registra SIEMPRE; terminada decide cierre
>   de ciclo), tildar (sesión 0h tipo tilde + cierre), _cerrarCiclo (honorarios
>   proporcionales por ciclo con corte fin>ultimoCierreEn; recurrente reprograma, única
>   tacha), horasDeActividad (AGREGACIÓN sum('horas') del servidor — sin bajar docs).
> · **actividades.html reescrito**: cronómetro integrado (Play verde / Stop rojo, chip
>   vivo con reloj, restauración tras recarga vía sesionActiva), "Realizada" ahora llama
>   a Core.tildar (deja registro), horas acumuladas en el detalle al abrirlo, botones
>   compactos solo-ícono con tooltip, textos del detalle sin duplicar fechas.
> · **Bug de carga resuelto** (quedaba "Cargando…" hasta tocar una pestaña): condición de
>   carrera — la caché persistente entrega el primer snapshot antes de que el módulo
>   termine de evaluarse y el render pisaba consts en TDZ. **REGLA NUEVA DEL 2.0**: en
>   toda página, las suscripciones onSnapshot se registran AL FINAL del módulo, después
>   de todas las definiciones y cargas iniciales.
> · sw.js shell v4 (suma actividades-core.js).
> · Directiva del admin: avanzar rápido, refinar detalles después; evaluar importar
>   datos ya cargados del sitio viejo (árbol de actividades) — herramienta de
>   exportación anticipada como tanda opcional.
> · Próxima tanda: T1.3 — Gestor de Sesiones + Análisis de horas (con agregaciones).

> **Registro v5.4 (Tanda 1.1b — Ciclo de vida y asignados):** especificación del
> administrador incorporada al árbol:
> · **Recurrentes (rutina)**: al marcarse Realizadas se reprograman (fechaInicio + ciclo)
>   y quedan grises "Vuelve el <fecha>"; al llegar su fecha se rehabilitan y recorren la
>   secuencia del semáforo dentro del ciclo: verde "Toca hacerla" (≤25% del ciclo),
>   amarillo "Atrasada Xd" (≤ciclo), rojo "Muy atrasada" (>ciclo).
> · **Únicas**: al terminarse quedan TACHADAS a la vista (hecho:true) y solo un
>   administrador puede eliminarlas (o restaurarlas). No cuentan en el filtro Hoy.
> · **Alcance 'asignados'** agregado al formulario con selector de personas del equipo
>   (checkboxes → competencias[]); chip 👥N en la fila. El selector se alimenta de
>   /usuarios/ activos — hasta cargar los perfiles de Flor/Esteban/masotromauro solo
>   se ve al admin.
> · El botón "Realizada" es provisional: en T1.2 pasa a llamar al core (deja sesión de
>   0h tipo tilde y dispara honorarios proporcionales). sw.js shell v3.

> **Registro v5.3 (Tanda 1.1 — Árbol de actividades):**
> · **Repo definitivo del 2.0: `casaverdecanas`** (el repo casaverde-2-0 quedó
>   descartado tras problemas del pipeline de Pages; se recreó de cero y funcionó).
>   URL: casaverdecanas-blip.github.io/casaverdecanas/ · Deploy vía workflow
>   .github/workflows/deploy-pages.yml (Source = GitHub Actions) + index raíz que
>   redirige al panel. **Prueba de humo 6/6 en verde** (sesión, rol, lectura,
>   agregación, caché persistente, service worker).
> · **actividades.html 2.0 entregado**: árbol con onSnapshot en vivo (admin: colección
>   completa; colaborador: consulta or() equipo/propias/asignadas — primera consulta
>   OR del proyecto), colores en cascada (color de raíz + pastelDe, paleta de
>   respaldo alfabética), CRUD con <dialog> nativo (proyecto con selector de color,
>   actividad con padre tabulado, alcance, prioridad, recurrencia, monto, fechas,
>   compra+proveedor), semáforo T1.1 (urgente/vencida/próxima/al día/programada),
>   destacadas ★ persistidas en estado_usuario (arrayUnion/Remove), filtros
>   Todas/Hoy/Destacadas, borrado bloqueado si hay sub-ítems.
> · nucleo.js: Actividades en CV2.NAV (visible siempre, como Inicio) · sw.js shell v2.
> · Pendiente consola: crear perfiles de Flor, Esteban y masotromauro en /usuarios/
>   (rol 'colaborador') — necesario recién en T1.5.
> · Próxima tanda: T1.2 — cronómetro Play/Stop + tildes + honorarios proporcionales
>   (actividades-core 2.0 como módulo ES) + temporada en el semáforo.

> **Registro v5.2 (Tandas 0.2 y 0.3 — Entorno y esqueleto):** Proyecto Firebase
> **casaverde-20** creado (Firestore en southamerica-east1, reglas 2.0 publicadas, Auth
> email activo). Usuarios de Auth: casaverdecanas@gmail.com (admin,
> uid fpd4sBnZGhNMgPTuhLpNkuczkfm1), florenciadetp (uid IO7HeLHU0qWYofuAjfGXGiADN5w2),
> estebanzapata96 (uid XOUweF3rkaUX34glFSvctY9KSWv2), masotromauro
> (uid QzzluhLJRtM1FqoKU0jYkfICjZF3) — los tres últimos rol 'colaborador' en /usuarios/.
> **Esqueleto entregado** (carpeta interno/): firebase-init.js (SDK 12.16.0 modular vía
> CDN, punto único, persistentLocalCache multi-pestaña), nucleo.js (namespace CV2:
> verificarAuth, permisos, nav, esc/fmt/pastelDe, toasts, registrarSW), design-system.css
> 2.0, login.html, index.html (prueba de humo: sesión, rol, lectura, agregación, caché,
> SW), manifest.json + sw.js (PWA instalable, shell cache-first v1) + íconos.
> Reglas del esqueleto: gstatic SOLO en firebase-init.js · subir VERSION de sw.js al
> tocar el shell · nav crece por fase en CV2.NAV.
> Próxima tanda: T1.1 — actividades.html (árbol).
## Documento único y fuente de verdad del proyecto

Última actualización: Julio 2026

> **Registro v5.1 (Tanda 0.1 — Fundación documental):** decisiones C7 CERRADAS (ver
> abajo). Nace **CasaVerde 2.0**: rearmado completo en paralelo, corte de DNS al final
> (plan operativo en Plan_CasaVerde_2_0.md; stack en Anexo_tecnico_stack_v5_0.md).
> Entregados los documentos fundacionales del 2.0: **CONVENCIONES.md** (schema definitivo
> de 12 colecciones + config, convenciones de campos, fechas, dinero e IDs) y
> **firestore.rules 2.0** (deny por defecto, sin catch-all, colección por colección) —
> escritos ANTES de la primera línea de código, como manda C5/Fase 0.
> Próxima tanda: T0.2 — checklist de creación del proyecto Firebase `casaverde-20`,
> repo `casaverde-2-0` y hosting, guiado desde iPad.
Este documento CONSOLIDA y REEMPLAZA a: Máster_briefing_2 (v4.41), Master_briefing_v4_40, v4.43, v4.44 y v4.45. Los anteriores quedan archivados como referencia histórica — ante cualquier contradicción, vale este.

**Rumbo estratégico decidido por el administrador (Julio 2026):** el sistema actual se
mantiene operativo y congelado en features. El trabajo se orienta al **rearmado completo
del sitio desde cero, con base de datos nueva**, destilando la máxima claridad de todo lo
explorado para construir un sistema limpio e integrado. Los datos existentes se migran
**al final**, cuando el sistema nuevo esté probado.

---
---

> # ⚠ LO QUE SIGUE ESTÁ OBSOLETO — NO SEGUIR SUS INSTRUCCIONES
>
> Las tres "PARTES" que vienen a continuación son el documento de referencia con el
> que arrancó la refundación, y **hoy dicen lo contrario de la realidad**:
>
> - La **Parte A** se titula *"el sistema actual, en producción"* y describe el
>   sistema **1.0**: `utils.js`/`CVC`, el repositorio `Casaverde`, el proyecto Firebase
>   `casaverdecanas-199`. **Nada de eso existe.** Sus dieciocho "reglas críticas
>   vigentes" —prohibido `?.` y `??`, un solo `window.CVC`, conversión ES6→ES5 a
>   mano— son del sistema apagado: **seguirlas hoy produce código equivocado.** El
>   reglamento que vale es el **Libro 1**.
> - La **Parte C** se titula *"diseño de la refundación"* y avisa "no implementar":
>   ya está construida y en uso desde hace meses.
> - La **Parte B** —el diagnóstico de qué salió mal y por qué— **sigue siendo válida
>   y vale la pena leerla**: es el criterio con el que se decide qué simplificar.
>
> Se conserva porque es historia y explica de dónde viene todo. **Pero para trabajar,
> el Libro 1 manda.**

# PARTE A — EL SISTEMA ACTUAL (fotografía v4.45, en producción) · OBSOLETA

## A1. Descripción del proyecto

Sistema web de gestión administrativa para el complejo **Casa Verde Canas** en
Canasvieiras, Florianópolis, Brasil.

Tres unidades:
- Loft en Canasvieiras
- Apartamento Familiar Premium
- Cabaña Vista al Bosque (Frente)

Equipo:
- **Mauro** — administrador principal y único decisor de producto. CPF activo, no residente Brasil.
- **Flor** — co-administradora. CPF activo, no residente Brasil.
- **Colaboradores** (rol user) — acceso reducido: sus actividades, sus horas y sus cobros.
- **Esteban** — custodia y desembolsa fondos desde su propia cuenta (actor externo al panel).

Idioma de trabajo: español rioplatense (voseo) en toda interfaz y documentación.
Dispositivos: iPad Pro (Safari) + Android — **sin desktop ni terminal**; condiciona todas
las decisiones técnicas. Todo el código debe poder desplegarse desde el móvil.

## A2. Arquitectura actual

```
/                          Sitio público (index.html, cabana.html) — multilingüe
/interno/                  Panel administrativo (requiere auth)
  utils.js                 Núcleo compartido: Firebase, Auth, nav, permisos,
                           badges, ayuda, notificaciones, cotizaciones
  design-system.css        Tokens y componentes
  actividades.html         Página de inicio de todos los roles (desde v4.38)
  [módulos...]             Ver inventario completo en A8

GitHub push → GitHub Actions → deploy (~2 min)
Firebase Firestore         Base de datos 100% — sin RTDB (una excepción legacy, ver A9)
Firebase Auth              Autenticación
Cloudinary                 Comprobantes e imágenes (cloud dnwfu8ffn, preset preset-comprobantes)
Netlify functions          claude-proxy.js (Gemini para lectura de facturas) ·
                           notify-whatsapp.js (CallMeBot) · EmailJS server-side
Dominio                    casaverdecanas.com.br · Firebase: casaverdecanas-199
Repo                       github.com/casaverdecanas-blip/Casaverde (branch main)
```

Documentos de config en Firestore (nunca claves en el código):
`config/integraciones` (Google API Key), `config/github` (token), `config/manual`,
`config/ayuda` (células planas "celulas.{id}"), `config/conciliacion`,
`config/tipos_cambio` (fiscal, lo fija la contadora), `config/cotizaciones` (mercado),
`config/temporada`, `config/recuerdos`, `config/fiscal_registros`,
`config/tokens_contador`, `config/notificaciones`, `config/compras_proveedores`.

## A3. Reglas críticas de implementación (VIGENTES — aplican también al sistema nuevo)

1. **Sin template literals, optional chaining ni nullish coalescing** — backtick, `?.` y `??` rompen Safari/iOS viejo silenciosamente. Concatenación `+`, `(obj && obj.prop)`, `(x != null ? x : def)`.
2. **Sin orderBy + where compuesto** — requiere índice. Patrón: `.get()` con igualdades simples, filtrar y ordenar en JS.
3. **100% Firestore** — cualquier `firebase.database()` es error arquitectural.
4. **Claves en Firestore, nunca en código** — GitHub escanea el repo. Las API keys de cliente Firebase son identificadores públicos por diseño; se protegen solo las de terceros.
5. **`window.CVC` único** — dos bloques `window.CVC = {}` hacen que el segundo pise al primero y todo se cuelga.
6. **Funciones globales con `window.fn =`** — las funciones dentro de async IIFE no son globales en Safari.
7. **Firebase Storage no disponible** (plan Spark) — alternativa: Cloudinary.
8. **`event` como global no funciona en Safari** — pasarlo siempre como parámetro.
9. **`position:absolute` dentro de overflow/transform se recorta en iOS** — usar `position:fixed` + `getBoundingClientRect()`.
10. **No recargar la lista al accionar una tarjeta** — actualizar solo la card afectada en el DOM.
11. **Firefox + Firebase 8.x** — `db.settings({ experimentalForceLongPolling: true, merge: true })` en utils.js apenas se crea `db`.
12. **Células de ayuda como campos planos** `"celulas.{id}"` — no mapa anidado; el parser itera Object.keys buscando el prefijo.
13. **Material Icons en el `<head>`** de cada HTML, justo antes de design-system.css.
14. **Archivos completos listos para subir** — nunca diffs ni ediciones parciales.
15. **Validación con `node --check`** de todo JS antes de entregar.
16. **Estados derivados nunca se persisten** — se calculan en render.
17. **IDs deterministas para upserts idempotentes** (ej. `limp-<reservaId>`).
18. **Conversión ES6→ES5 siempre manual**, instancia por instancia — las regex automáticas generan JS inválido.

## A4. Navegación actual

```
Actividades | Calendario | Comunicación
Reservas ▾     → Reservas / Presupuestos / Clientes
Finanzas ▾     → Ingresos reservas / Gastos y retiros / Honorarios / — /
                 Cuentas / Movimientos / BTG·Conciliación / Categorías / — /
                 Panel Financiero / Informes Airbnb
Operaciones ▾  → Temporada / Análisis de horas / Gestor de Sesiones
Fiscal ▾       → Panel fiscal / Acceso contador
Config. ▾      → Contenido del sitio / Moderar recuerdos / Usuarios / — / Manual
```

`NAV_ADMIN_ITEMS` en utils.js. El colaborador ve solo lo habilitado en su checklist de
permisos (usuarios.html) más Actividades, Comunicación, Mis cobros y Manual. Badges en el
menú: rojo = urgente (actividades en rojo, reservas sin confirmar, honorarios >14 días),
azul = novedades (mensajes sin leer). El Dashboard fue retirado en v4.38; actividades.html
es la entrada de todos los roles. Sesión admin se distingue con listón diagonal
amarillo/negro inyectado por `verificarAuth()`.

## A5. Sistema de sesiones v5.2 (el corazón operativo actual)

**Principio: solo Play y Stop. No hay pausa.** Cada sesión es un bloque cerrado de
trabajo. Fuente única de tiempo: colección raíz `/sesiones/`. Fuente única de dinero a
cobrar: `/honorarios/`.

/sesiones/{id}: actividadId, actividadNombre, uid, nombre, inicio, fin (null = corriendo),
horas, estado ('en_curso' | 'finalizada'), tipo ('cronometro' | 'manual' | 'tilde'),
notas, _migradoDe.

Flujo:
- **▶ Play** crea sesión en_curso y marca la actividad (estado, sesionActualId). Un solo cronómetro por usuario.
- **⏹ Stop** cierra la sesión con horas. En recurrentes pregunta "¿quedó terminada?": Sí → cierra ciclo; No → actividad pendiente, tiempo registrado igual.
- **✔ Tildar** deja sesión de 0 horas tipo 'tilde' y cierra el ciclo.
- **Registro manual** (gestion-sesiones.html): sesiones finalizadas tipo 'manual'.

**Honorarios proporcionales:** al cerrar el ciclo de una actividad con `monto > 0`, el
monto se reparte entre quienes tienen sesiones finalizadas con `fin` posterior al
`ultimoCierreEn` de la actividad, en proporción a sus horas — un doc de /honorarios/ por
persona. Sin horas en el ciclo (tilde puro): todo a quien cierra. La actividad guarda
`ultimoCierreEn` para delimitar ciclos. Sesiones en curso al momento del cierre entran al
ciclo siguiente.

**Todas las actividades marcan reloj** — tronco, ramas y hojas. Excepciones: renglones
estructurales del chequeo de inventario (categoria-chequeo, item-chequeo).

**Colores de proyecto:** el campo `color` del doc raíz (se define editando el proyecto)
cae en cascada como fondo pastel (`pastelDe()`: mezcla 86% blanco) de toda la línea en
actividades.html, gestion-sesiones.html y horas-stats.html. Paleta de respaldo por orden
alfabético para proyectos sin color.

## A6. Schema de colecciones VIGENTE

Colección | Estado | Campos clave
--- | --- | ---
sesiones | ✅ fuente única tiempo | ver A5
honorarios | ✅ fuente única cobros | uid, nombre, tareaId, concepto, horas, monto, estado, cicloCerradoEn, cerradoPor
actividades | ✅ | nombre/titulo, detalle, tipo, parentId, raizId, tipoRaiz, alcance, competencias[], creadoPor, estado, prioridad, hecho, sesionActualId, recurrencia, monto, color (raíz), ultimoCierreEn, ultimaRealizacion*
actividades_usuario | ✅ | vistos{}, destacados[], ultimaVistaCompras (estado por usuario)
reservas | ✅ | nombre, caba, checkIn/Out, adultos, ninos, estado, origen, totalBRL, pagadoBRL, google_id
presupuestos, clientes, pagos | ✅ | (ver módulos)
cabanas | ✅ | nombre {es,pt,en} — SIEMPRE resolver nombre.es con fallbacks, nunca renderizar el objeto crudo. tarifas, inventarioActual, checklistInventario, google_calendar_id
gastos, retiros, transferencias, cuentas, movimientos, categorias, destinos, proyecciones | ✅ (aparato financiero viejo) | circuitos fiscal/personal/mixto, país BR/UY, conciliación
comunicaciones (+/mensajes), comunicaciones_lecturas | ✅ |
config/*, cotizaciones_historial, libro_visitas, informes_airbnb | ✅ |
mov_negocio, categorias_mov, gastos_fijos, mov_personal_*, cierres | ✅ (módulo SIMPLE, paralelo, fuera de nav) |
historial_tareas | 🗑️ ABANDONADA (no se lee ni escribe; exportar y borrar) |
historial (83), resumenes (8) | ⚠️ a revisar |
tareas, pendientes, agenda | 🗑️ vacías — borrar |

## A7. Reglas de Firestore vigentes

Las publicadas en la tanda v4.44/v4.45 (archivo firestore.rules del repo). Puntos clave:
- `/actividades/` update incluye `alcance == 'equipo'` (fix del error de permisos del cronómetro).
- `/honorarios/` create: `isActive()` — quien cierra un ciclo crea los honorarios de todos los del reparto. Read propio o admin; update/delete admin.
- `/sesiones/` (colección raíz): read propio/admin, create con uid propio, update/delete propio/admin.
- `mov_personal_*`: cada libro personal accesible solo por su dueño o admin.
- **Deuda conocida:** el catch-all `match /{col}/{docId}` da lectura de casi todo a cualquier autenticado, anulando en la práctica las restricciones de lectura finas. Aceptado por equipo chico; el sistema nuevo NO debe repetirlo (ver C2).

## A7bis. Reglas del 2.0 que la Fase 3 agrega (firestore.rules de `casaverde-20`)

Se suman a las ya escritas en la Fase 0. Criterio: deny por defecto, sin catch-all.

```
match /movimientos/{id} {
  allow read:   if activo();
  allow create: if activo();
  allow update, delete: if esAdmin()
                && !(resource.data.pendiente != null
                     && resource.data.pendiente.cierreId != null);
}

match /cierres/{id} {
  allow read:   if activo();
  allow create: if esAdmin();
  allow update, delete: if false;   // el balance es una foto: no se retoca
}

match /usuarios/{uid}/movimientos_personales/{id} {
  allow read, write: if request.auth.uid == uid;   // solo el dueño. El admin tampoco.
}
```

> El bloqueo del movimiento sellado está también en la interfaz, pero la **regla es la
> que lo garantiza**: si un balance ya lo contó, nadie lo cambia por atrás. Mismo
> criterio que hizo confiable el cierre de ciclos de honorarios.

## A8. Inventario de archivos (regla: actualizar en cada tanda que cree/borre/cambie función)

Raíz: index.html, cabana.html (sitio público) · CNAME · firestore.rules · netlify.toml · robots.txt · sitemap.xml · img/
.github/workflows: deploy.yml · claude-edit.yml/.js
netlify/functions: claude-proxy.js · notify-whatsapp.js

interno/ — núcleo: utils.js · design-system.css · login.html · index.html (router) · manual-sistema.html · notificaciones.html
Operación: **actividades.html** · **actividades-core.js (v5.2)** · **gestion-sesiones.html** · **horas-stats.html** · calendario.html · temporada.html · comunicacion.html · diagnostico-sesiones.html (herramienta de migración)
Reservas: reservas.html · presupuestos.html · clientes.html · informes-airbnb.html
Finanzas: gastos-mantenimiento.html · gastos.html · pagos.html · honorarios.html · transferencias.html · cuentas.html · movimientos.html · herramientas-btg.html · categorias.html · destinos.html · cotizaciones.html · panel-financiero.html · analisis-gastos.html · clasificacion-masiva.html · clasificacion-auto.html · auditoria.html · proyeccion-anual.html · simple.html (módulo SIMPLE, solo URL directa)
Fiscal: fiscal.html · fiscal-contador.html · acceso-contador.html
Contenido: contenido-sitio.html
Admin: usuarios.html · limpieza-datos.html · moderacion-recuerdos.html · admin.html (⚠ legacy RTDB)
En lista de borrado: tareas*.html, pendientes.html, agenda.html, migracion-*.html, limpieza-stats.html, dashboard.html

## A9. RETIRADO / OBSOLETO (no volver a implementar, no citar como vigente)

- **Pausa del cronómetro** (actPausar/actReanudar, estado 'pausada') — eliminada en v4.44.
- **historial_tareas como registro de tiempo** — reemplazada por /sesiones/.
- **Subcolecciones actividades/{id}/sesiones y collectionGroup('sesiones')** — reemplazadas por la colección raíz.
- **Denormalización de sesiones para collectionGroup** (§16AH del briefing v4.41) — solución a un problema que ya no existe. Todo ese apartado queda anulado.
- **Reglas Firestore v4.41** (§16AI del briefing v4.41) — reemplazadas.
- **limpieza-stats.html** — reemplazada por horas-stats.html.
- **Dashboard, tareas.html, tareas-admin.html, tareas-iniciar.html, pendientes.html, agenda.html** — retirados.
- **admin.html con RTDB** — excepción legacy; no contaminar módulos Firestore.

## A10. Pendientes del sistema actual (solo mantenimiento, features congeladas)

1. Correr migración de las 4 sesiones pausadas (diagnostico-sesiones.html) si no se hizo.
2. Definir color de cada proyecto (editar proyecto → selector).
3. Exportar historial_tareas como archivo y borrar la colección; borrar tareas/pendientes/agenda.
4. Backfill del link de Material Icons en páginas viejas (solo si se editan por otra razón).
5. Botón de sync Airbnb: queda como está hasta la refundación.

---
---

# PARTE B — DIAGNÓSTICO: lo que aprendimos explotando el sistema

Esta sección es el destilado honesto de tres años de iteración. Es la materia prima del
diseño nuevo: el sistema limpio existe para conservar lo de la primera lista y hacer
imposible lo de la segunda.

## B1. Lo que funcionó y se conserva como principio

1. **Una sola fuente de verdad por dominio.** Cada vez que hubo dos lugares para el mismo dato (el tiempo llegó a vivir en TRES colecciones) hubo totales duplicados, confusión y semanas de migración. La consolidación en /sesiones/ + /honorarios/ es el modelo a seguir.
2. **El flujo define los saldos; los extractos verifican.** Los extractos bancarios son recibos, nunca se suman a los balances.
3. **Estados derivados nunca persistidos** — todo se calcula en render. Cero bugs de "saldo desincronizado" donde se aplicó.
4. **Filtrado y orden en JS** con lecturas simples — cero dependencia de índices compuestos, cero sorpresas.
5. **Árbol de actividades con anidado libre** + recurrencia + temporada — el modelo mental correcto para la operación real del complejo.
6. **Play/Stop sin pausa** — dos gestos, cero ambigüedad de interpretación en los datos.
7. **Honorarios proporcionales al cierre de ciclo** — el dinero sigue al trabajo automáticamente.
8. **Manual por células → ayuda contextual** — documentación viva sin redeploy.
9. **Decisión primero, código después** — el flujo de trabajo de tandas con briefing/manual versionados.
10. **IDs deterministas** para todo lo generado desde reservas (limp-<reservaId>) — idempotencia gratis.
11. **Color por proyecto en cascada** — separación visual instantánea de la información.
12. **Checklist de permisos por colaborador** en vez de roles rígidos.

## B2. Lo que generó la complejidad que hoy pagamos

1. **El aparato financiero creció por acumulación, no por diseño**: cuentas + movimientos + transferencias + categorías + destinos + conciliación BTG + clasificación masiva + clasificación automática + auditoría + panel financiero + análisis de gastos + proyección anual + circuitos fiscal/personal/mixto. Más de 12 páginas para responder preguntas que el administrador resume en: ¿entró o salió?, ¿cuánto?, ¿quién?, ¿quedó algo pendiente? El módulo SIMPLE (mov_negocio) nació justamente como reacción y ya validó el modelo chico.
2. **Múltiples fuentes de verdad históricas** para el tiempo (historial_tareas + subcolecciones + /sesiones/) — el costo de migrar fue mayor que el de haber diseñado una sola.
3. **Deriva de schema**: nombre vs titulo en actividades; cabana como número o string; nombre de cabaña como string u objeto multilingüe. Cada lectura necesita fallbacks defensivos.
4. **Reglas de Firestore parchadas por capas**: el catch-all permisivo conviviendo con reglas finas que en la práctica no restringen nada. Dos versiones de reglas circulando en documentos distintos.
5. **Páginas zombis**: dashboard, tareas*, pendientes, agenda, limpieza-stats, migracion-* — retiradas de la navegación pero vivas en el repo y en la cabeza de los documentos.
6. **Documentación bifurcada**: briefings paralelos (v4.41 "a integrar" + línea v4.4x) que llegaron a contradecirse — la razón de este documento.
7. **Soluciones a problemas autoinfligidos**: la denormalización de sesiones existió solo porque el dato estaba en subcolecciones; al mover el dato, el problema desapareció. Señal: cuando la solución es más rara que el problema, el modelo de datos está mal.
8. **admin.html en RTDB** — una excepción arquitectural que hay que recordar para siempre.

## B3. Criterio de simplificación (la vara para TODO el diseño nuevo)

> Ante cada estructura: ¿un colaborador nuevo la entiende en una frase? ¿El dato vive en
> un solo lugar? ¿El estado se puede derivar en vez de guardar? ¿La página existe porque
> responde una pregunta real del negocio, o porque acumulamos una herramienta? Si alguna
> respuesta es no: se simplifica antes de construir.

---
---

# PARTE C — EL SISTEMA NUEVO (diseño de la refundación)

## C1. Estrategia general

- **Desde cero, con base de datos nueva.** Nada de arrastrar colecciones: el sistema nuevo nace con su schema limpio y sus reglas limpias. El viejo sigue operando hasta el corte.
- **Migración AL FINAL**: primero se construye y se prueba el sistema nuevo en paralelo; recién cuando está validado se migran los datos vivos (ver C6). Una única exportación completa del sistema viejo queda como archivo histórico.
- **Mismo stack, mismas restricciones** (A3): vanilla HTML/JS/CSS, Firestore + Auth 8.10.1, GitHub Pages/Hosting, Cloudinary, Netlify functions, deploy desde móvil. La refundación es de MODELO y ESTRUCTURA, no de tecnología.
- **El sitio público no se toca** en esta refundación (index.html, cabana.html, muro de recuerdos siguen como están, apuntando a las colecciones públicas nuevas al momento del corte).

## C2. Principios de arquitectura del sistema nuevo

1. Una colección por concepto de negocio; una sola fuente de verdad por dominio; sin subcolecciones salvo mensajes de comunicación.
2. Sin estados derivados persistidos; todo saldo/total se calcula en render.
3. Reglas de Firestore **sin catch-all permisivo**: cada colección con su regla explícita; lo no declarado, denegado.
4. Schema con nombres únicos y definitivos (se termina nombre-vs-titulo): documento de convenciones antes de la primera línea de código.
5. Denormalización mínima y solo de nombres para mostrar (nombre de actividad en la sesión, nombre de persona en el honorario).
6. Todas las páginas comparten utils nuevo (CVC2 o equivalente) con la MISMA disciplina: window.CVC único, helpers compartidos (pastelDe/colorProy incluidos).
7. Cada página responde una pregunta del negocio; si dos páginas responden la misma, sobra una.

## C3. Modelo de datos propuesto (borrador para discusión — NO implementar sin cerrar C7)

**Núcleo operativo** (ya validado por el sistema actual, se rediseña limpio):

- `usuarios` — perfil, rol, permisos (checklist), activo.
- `cabanas` — contenido multilingüe {es,pt,en}, tarifas, inventario base, calendar_id.
- `reservas` — la reserva con su ciclo de vida completo (presupuesto → confirmada → finalizada), pagos embebidos como array o colección `pagos` plana (a decidir en C7). Origen directo/Airbnb.
- `clientes` — datos de contacto e historial por referencia.
- `actividades` — árbol (parentId), recurrencia, monto, color en raíz, ultimoCierreEn. Chequeos de inventario como hoy.
- `sesiones` — idéntico modelo v5.2 (ya es el diseño limpio).
- `honorarios` — idéntico modelo v4.44 (ya es el diseño limpio).
- `comunicaciones` (+ subcolección mensajes) — como hoy.
- `config/*` — solo los documentos que el sistema nuevo use de verdad.

**Finanzas — el modelo SIMPLE ya acordado, ahora como ÚNICO sistema financiero:**

- `movimientos` — una sola colección: fecha, tipo (entró/salió), monto, moneda, categoría dinámica, quién, detalle, comprobante opcional, y flag `pendiente` opcional ("por reponer a X" = gasto real inmediato con reposición pendiente; "por cobrar" = no es ingreso hasta cobrarse).
- Saldos pendientes por persona: **siempre derivados, nunca guardados**.
- Botón **"Hacer balance"** → snapshot inmutable en `cierres`, salda pendientes (lo no saldado arrastra). **IMPLEMENTADO en T3.2** — schema del snapshot y regla de inmutabilidad en el Registro v5.20 y en A7bis. La repartición entre personas queda en `modo:'manual'` (nota libre) hasta que se definan las cuotas.
- **Exportación periódica a planilla** como historial permanente; los extractos bancarios NUNCA entran a la app — la conciliación ocurre en la planilla.
- Finanzas personales de Mauro: colección separada con el mismo modelo, cero cruce con el negocio.
- `honorarios` pagados generan su movimiento de salida (integración honorarios ↔ movimientos: un botón, no un módulo).
- **Se eliminan como módulos**: cuentas, movimientos bancarios, transferencias, conciliación BTG, clasificación masiva/auto, panel financiero, análisis de gastos, proyección anual, destinos, circuitos fiscal/personal/mixto. Lo fiscal se resuelve con la categoría del movimiento + la exportación a planilla para la contadora (alcance exacto a cerrar en C7).

## C4. Mapa de páginas del sistema nuevo (borrador)

```
Actividades (inicio)  ·  Calendario  ·  Comunicación
Reservas ▾   → Reservas / Presupuestos / Clientes
Dinero       → movimientos + pendientes + balance (UNA página; evolución de simple.html)
Horas ▾      → Gestor de Sesiones / Análisis de horas
Config ▾     → Contenido del sitio / Recuerdos / Usuarios / Temporada / Manual
```

De ~40 páginas internas a ~15. Cada una hereda lo ya diseñado y probado (sesiones v5.2,
colores en cascada, badges, ayuda contextual).

## C5. Fases de la refundación

- **Fase 0 — Fundación documental**: cerrar decisiones C7 · documento de convenciones de schema · reglas de Firestore completas escritas ANTES del código · esqueleto (utils nuevo, login, design-system, nav).
- **Fase 1 — Núcleo operativo**: actividades + sesiones + honorarios (portar el diseño v5.2, que ya es el limpio) + comunicación.
- **Fase 2 — Reservas**: reservas/presupuestos/clientes/calendario + generación automática de limpiezas y chequeos + sync Airbnb bien resuelto (el pendiente histórico se salda acá).
- **Fase 3 — Dinero**: la página única de movimientos con pendientes, balance/cierres y exportación.
- **Fase 4 — Operación en paralelo**: el equipo usa el nuevo con datos reales de prueba; el viejo sigue siendo el oficial. Ajustes.
- **Fase 5 — Migración y corte** (ver C6). El viejo queda en solo-lectura un tiempo y luego se archiva.

Cada fase = tandas normales con este briefing como documento vivo (v5.1, v5.2...).

## C6. Migración (al final, y mínima)

1. **Exportación total del sistema viejo** a archivos (una sola vez) = archivo histórico permanente. Nada más se "arrastra por las dudas".
2. **Migran solo datos vivos**: usuarios · cabañas y contenido · reservas futuras/activas (+ recientes a definir) · clientes · árbol de actividades vigente (podado) · sesiones y honorarios (histórico de horas completo: es liviano y valioso) · saldos pendientes de personas como movimientos iniciales tipo `pendiente`.
3. **NO migran**: historial_tareas, movimientos bancarios, transferencias, conciliaciones, clasificaciones, auditorías, proyecciones — todo eso queda en la exportación histórica y en las planillas.
4. Scripts de migración = páginas-herramienta tipo diagnostico-sesiones.html (probado que funciona bien desde iPad).

## C7. DECISIONES — CERRADAS en Julio 2026 (Tanda 0.1)

**Resolución del administrador ("Ok" a los supuestos S1-S8 del plan):**
C7.0 stack = Opción A (vanilla moderno sin build; Vite en CI queda como optimización
opcional de Fase 4-5) · C7.1 = proyecto Firebase NUEVO `casaverde-20` + repo nuevo
`casaverde-2-0` · C7.2 = pagos como colección plana · C7.3 = fiscal se resuelve con
categorías + exportación a planilla (sin páginas de cálculo) · C7.4 = confirmada la
lista de módulos sin sucesor · C7.5 = corte de reservas a definir en T6.1 (default:
futuras + año corriente) · C7.6 = remateTaller no se toca. El sitio público se incluye
en el 2.0 (el corte de DNS muda todo el dominio).

Texto original de las decisiones (referencia histórica):

1. **¿Proyecto Firebase nuevo o mismo proyecto con colecciones nuevas?** Nuevo = aislamiento total y reglas limpias desde cero (recomendado); mismo = sin re-crear usuarios de Auth. Definir también si el repo es nuevo o carpeta /v2/.
2. **Pagos de reservas**: ¿embebidos en la reserva o colección plana? (embebidos simplifica; plana facilita listados de caja).
3. **Alcance fiscal del sistema nuevo**: ¿basta categoría + exportación para la contadora, o algún cálculo (IRPF) sobrevive como página?
4. **Qué módulos actuales NO tienen sucesor** (confirmar lista C3): BTG, clasificaciones, auditoría, proyección, destinos, transferencias, informes Airbnb como página propia.
5. **Corte de reservas históricas a migrar** (¿solo futuras? ¿último año?).
6. **remateTaller** queda totalmente aparte (proyecto independiente) — confirmar que la refundación no lo toca.

---

## Convención de versionado desde aquí

- Este documento es **v5.0** y es el único briefing. Se versiona v5.1, v5.2... por tanda.
- El Manual del sistema ACTUAL sigue en su línea (v4.44) solo para correcciones; el sistema nuevo tendrá manual propio desde la Fase 1.
- Regla intacta: cada tanda actualiza archivo(s) fuente + este briefing, y mantiene el inventario A8 al día.
- **Nueva convención (instrucción del administrador, T3.2):** el **Manual va al final**.
  El briefing se actualiza junto con el código, tanda por tanda; el Manual se escribe
  una vez entregados todos los archivos de código de la tanda (o del bloque de tandas),
  para no documentar algo que todavía se está moviendo.


---
---

# LIBRO 3 · GUÍA DEL SITIO PÚBLICO

---

### v1.5 · julio 2026

> **Qué es este documento.** Describe **cómo es el sitio público hoy**. La historia de
> cómo llegó a serlo vive en el Master Briefing; las reglas del panel, en CONVENCIONES.
> Cada vez que se toca un archivo del sitio, se actualiza acá.
>
> Se armó juntando los aportes de tres conversaciones (identidad visual · muro de
> recuerdos y dominio · portada y textos) más la lectura directa de los archivos. **Los
> estados se corrigieron a la fecha**: varios aportes daban por pendientes cosas que ya
> están hechas.
>
> **No quedan huecos**: el despliegue, la analítica, el inventario de archivos, las
> claves de traducción y el chequeo de secretos se verificaron leyendo el repositorio.
> Lo que queda no es información faltante: es **deuda a resolver**, y está en §12.
>
> **Dónde vive este documento** (desde la tanda 11.17): en el repositorio, en
> `interno/GUIA-SITIO-PUBLICO.md`, al lado de `CONVENCIONES.md` y del briefing. Se
> actualiza en la misma tanda que el archivo del sitio que se toca. **Ojo: Pages lo sirve
> en texto plano a cualquiera** que sepa la dirección, así que no lleva claves ni datos
> personales.

---

## 1 · Qué es y qué no es

- **Qué es**: la cara pública de Casa Verde Canas en `https://casaverdecanas.com.br`.
  Muestra los alojamientos, las áreas comunes, la disponibilidad y el muro de recuerdos.
  El contacto sale **por WhatsApp**: no hay formulario de reserva ni backend.
- **Qué no es**: no es el panel. Una página pública **nunca importa `nucleo.js`** —
  `nucleo` arranca `verificarAuth` y manda al login a quien no tenga perfil en
  `usuarios`, que es todo visitante del sitio. Solo se importan
  `./interno/firebase-init.js` y `./interno/textos-sitio.js`.
- **Quién lo ve**: cualquiera, sin sesión. La única escritura desde afuera es el
  recuerdo, y va con la clave del QR.

---

## 2 · Los archivos

### Del sitio

| Ruta | Qué hace |
|---|---|
| `/index.html` | La portada: hero, espacios, áreas comunes, calendario y pie |
| `/recuerdos.html` | Muro público + formulario del QR. **Ojo: hay otro archivo con el mismo nombre en `/interno/`**, que es la pantalla de moderación. Son distintos |
| `/404.html` | Página de error. Lleva `noindex` |
| `/robots.txt` | Permite todo menos `/interno/`, y declara el sitemap |
| `/sitemap.xml` | Las dos URLs públicas |
| `/CNAME` | Contiene `casaverdecanas.com.br`. **Es lo que le dice a GitHub Pages cuál es el dominio propio** |
| `/README.md` | Prácticamente vacío: 16 bytes, solo el nombre del repo |
| `/.nojekyll` | Un byte. Le dice a GitHub Pages que **no procese el sitio con Jekyll** y lo sirva tal cual. Sin él, Jekyll ignora carpetas y archivos que empiezan con `_` |

### Compartidos con el panel

| Ruta | Por qué el sitio la usa |
|---|---|
| `/interno/firebase-init.js` | La conexión a Firestore. El sitio la reutiliza en vez de tener la suya |
| `/interno/textos-sitio.js` | Diccionario pt · es · en. **Fuente única**: el sitio lo muestra y el panel lo usa como texto de fondo de cada campo |
| `/interno/icono-192.png` · `icono-512.png` · `apple-touch-icon.png` | El favicon del sitio apunta acá a propósito, para no tener dos copias del mismo ícono que se desincronicen |

### Imágenes — atención, no están donde el HTML las busca

**La carpeta `/img/` NO existe.** Las tres imágenes viven en la **raíz**:

| Ruta real | Tamaño | Qué es |
|---|---|---|
| `/ilustracion-hero.jpg` | 226 KB | La ilustración de marca (venía de un PNG de ~1 MB) |
| `/logo-sitio.png` | 101 KB | Logo de la barra. Con halo verde detrás del trazo, para leerse sobre el crema |
| `/logo-pie.png` | 61 KB | Logo del pie. Letras crema, para el verde selva oscuro del footer |

**Desde la tanda 11.16, el HTML pide la raíz primero y `./img/` como respaldo** — al
revés de como estaba. Antes cada visita disparaba un 404 por imagen antes de mostrar
nada, y el respaldo, pensado como red de seguridad, era el camino normal.

> ### La lección que dejó esto
> **Un `onerror` solo salva a `<img>`.** `<link>` y `<meta>` no lo tienen, y tampoco lo
> tiene el JSON-LD. Mientras las tres imágenes se recuperaban solas, en silencio estaban
> roto sin respaldo posible:
> - **el favicon** (`<link rel="icon">` → `./img/logo-sitio.png`): el sitio no tenía
>   ícono en la pestaña;
> - **`og:image` y `twitter:image`** → `img/og-preview.jpg`, un archivo **que nunca se
>   subió**: cada enlace compartido por WhatsApp salía sin imagen, siendo WhatsApp el
>   canal de contacto principal;
> - **la `image` del JSON-LD**: Google no podía bajar la foto de la ficha del alojamiento.
>
> **Que las imágenes se vieran ocultó que las rutas estaban mal.** Un respaldo que
> funciona demasiado bien esconde el problema que estaba tapando.

Las tres apuntan ahora a la raíz. **`og:image` y `twitter:image` usan
`ilustracion-hero.jpg`**, y ya **no declaran `width` ni `height`**: declarar medidas que
no son las reales es peor que no declararlas. Si algún día se hace una pieza dedicada de
1200×630, se cambia en esas dos etiquetas.

**En `/interno/img/`** hay solo `logo-barra.png` (28 KB) y un `texto.txt` de un byte, que
existe para que la carpeta exista.

**Archivos huérfanos dentro de `/interno/`**: `ilutracion-hero.jpg` —con el nombre mal
escrito, le falta la "s"— y `icono-alternativo-512.png`, una variante de ícono que se
generó como opción y no se usó. Ninguno de los dos lo referencia nada.

**No existen**: `cabana.html` (no hay página por cabaña), `index-publico.html` (bien: se
renombró), `qr-recuerdos.html` (bien: el del sistema viejo llevaba el token en texto
plano) ni `interno/dashboard.html`.

---

## 3 · Las colecciones que lee

| Colección | Qué muestra | Lectura |
|---|---|---|
| `config/sitio` | Textos editados + número de WhatsApp | pública |
| `cabanas` | Nombre, descripción, fotos, capacidad, precio | pública |
| `espacios_comunes` | Áreas comunes | pública |
| `disponibilidad` | Días ocupados del calendario. **Espejo sin datos de huéspedes**: `/reservas/` tiene nombres, teléfonos y montos y sigue cerrada | pública |
| `recuerdos` | Solo los `publicado` | pública **filtrada**: la consulta debe traer `where estado == 'publicado'`, o Firestore rechaza la consulta entera |
| `claves_recuerdos` | La llave del QR | `get` abierto, `list` cerrado (§5.1) |
| `huespedes` | Contacto de quien deja un recuerdo | cada uno escribe el suyo, con clave válida |

Los nombres de cabañas y espacios son **multilingües** (`{es, pt, en}`): se resuelve
`nombre.es` con respaldos. Si en algún lado aparece `[object Object]`, es esto.

---

## 4 · El mapa de la portada

### 4.1 · Las tres fuentes de cada texto

Gana la primera que tenga algo:

1. **`config/sitio` → campo `textos`** — lo editado desde el panel.
2. **`interno/textos-sitio.js`** — el diccionario por defecto, en los tres idiomas.
3. **El nombre de la clave** — el último respaldo. Si llegás acá, algo está mal.

En código: `TEXTOS[lang][k] || T[lang][k] || T.pt[k] || k`.

> **La regla.** Toda clave usada con `data-t="…"` o `t('…')` **tiene que existir en
> `textos-sitio.js` en los tres idiomas**. Si falta, no hay error ni aviso: el sitio
> escribe el nombre de la clave en la pantalla. Le pasó al pie, que mostró la palabra
> suelta **"recuerdos"** en vez de la frase, en los tres idiomas, hasta la tanda 11.16.

### 4.2 · Las nueve claves editables desde el panel

Panel → **Cabañas → Textos y contacto**. En el orden en que aparecen, de arriba abajo:

| # | Clave | Dónde se ve | Ejemplo (es) |
|---|---|---|---|
| 1 | `titulo` | Título grande de la portada | *A tres cuadras del mar, rodeado de verde* |
| 2 | `bajada` | Párrafo bajo el título | *Cabañas y departamentos en Canasvieiras…* |
| 3 | `c1` | Primera medallita (ícono pileta) | *Piscina* |
| 4 | `c2` | Segunda medallita (ícono parrilla) | *Parrilla* |
| 5 | `c3` | Tercera medallita (ícono sombrilla) | *3 cuadras del mar* |
| 6 | `tCabanas` | Título de la sección de alojamientos | *Nuestros espacios* |
| 7 | `tComunes` | Título de áreas comunes | *Áreas comunes* |
| 8 | `tConsulta` | Título de la sección del calendario | *Consultar disponibilidad* |
| 9 | `pie` | Frase del pie, sobre los enlaces | *Reservas y consultas por WhatsApp.* |

Las medallitas tienen **el ícono fijo**: se cambia el texto, no el dibujo.

### 4.3 · El otro campo de `config/sitio`: `whatsapp`

No es un texto: es **el número al que llega todo**. Se carga en la misma pantalla y se
limpia solo (se le quitan espacios, guiones y el `+`). Va con código de país sin `+`:
para Brasil, `55` + DDD + número.

**Si está vacío, el botón "Pedir presupuesto por WhatsApp" no lleva a ningún lado.** Es
el único campo que, faltando, rompe una función en vez de mostrar algo feo.

### 4.4 · Lo que NO se edita desde el panel

Vive en `interno/textos-sitio.js` y se cambia ahí, en los tres idiomas:

- **Cabecera**: `consultar`.
- **Espacios**: `cargando`, `pers`, `desde`, `noite` (la línea *desde R$ 250 la noche*).
- **Formulario y calendario**: `lCabana`, `lPax`, `lOcupado`, `lElegido`, `elegir`,
  `elegirIn`, `elegirOut`, `libre`, `chocan`, `noches`, `hasta`, `pedir`.
- **Pie**: `recuerdos` (enlace al muro) y `panel` (acceso del equipo).

> **Auditado (julio 2026):** no falta ninguna clave, y **los tres idiomas definen
> exactamente el mismo conjunto** — que es la comprobación que importa, porque una clave
> presente en español y ausente en portugués solo se nota al cambiar de idioma.
>
> **Tres claves traducidas que no usa nadie**: `lIn`, `lOut` y `ocupado`. Sobraron cuando
> el formulario de fechas se volvió calendario. No molestan; se anotan para que nadie las
> busque en la pantalla.

### 4.5 · El idioma

Arranca en el del teléfono del visitante; si no es pt, es o en, cae en **es**. Los
botones PT · ES · EN lo cambian al instante, sin recargar. **No se recuerda entre
visitas.**

**Un texto cargado desde el panel pisa a los tres idiomas por igual.** Si escribís el
título en español, la versión en inglés también lo va a decir en español. Es a propósito
—lo editado manda— pero hay que saberlo antes de editar.

---

## 5 · El muro de recuerdos

### 5.1 · La clave del QR es el permiso, no la sesión

Una sesión anónima se abre desde la consola del navegador en diez segundos, sin haber
pisado Canasvieiras. Por eso el permiso es **la clave que viaja en el QR**.

- Colección `claves_recuerdos/{clave}` donde **el ID del documento ES la clave**. No hay
  campo `token` adentro: así la regla la resuelve con un `exists()` de una línea.
- **`get` abierto y `list` cerrado.** Hay que saber la clave entera —la trae el QR— para
  consultarla, pero nadie puede enumerar la lista. Permite avisarle al huésped que su
  código no sirve *antes* de que escriba 600 caracteres, sin regalar los códigos.
- Claves de 12 caracteres al azar sobre 31 símbolos, sin `0/O` ni `1/l/I`, prefijo
  `cvc-`. **Nunca una clave "con sentido"** tipo `cabana-2`.
- **Una clave por QR, revocable de a una.** Si se filtra el cartel de una cabaña, se da
  de baja esa clave y se reimprime solo ese cartel.

### 5.2 · El alojamiento lo dice la clave, no el visitante

El formulario ni lo pregunta: la regla compara el `cabanaId` del documento contra el de
la clave. **No se puede mentir sobre algo que no se escribe.**

### 5.3 · Al moderar se vacía el documento de lo privado

En Firestore **no hay seguridad por campo**: si un documento es legible, todos sus campos
lo son, incluidos los que la pantalla no muestra. Un recuerdo publicado lo lee cualquier
navegador del mundo, y estaban quedando adentro la clave y **el mail del huésped** — el
mismo que el formulario promete que no se publica.

Al publicar u ocultar, el panel archiva `email`, `clave`, `claveEtiqueta`, `uid` y
`proveedor` en `recuerdos_contactos/<mismoId>` (solo `contenido`) y los borra del
recuerdo. **La regla rechaza cualquier `update` que los deje puestos**: no depende de que
el código se acuerde.

### 5.4 · El registro de huéspedes

`huespedes/<uid>`, con el uid de Auth como ID. Con Google el uid es estable y la persona
se reconoce entre visitas; anónimo, el uid es **del dispositivo**: vale como contacto, no
como identidad.

`novedades` es un **sí explícito**, en un casillero que viene desmarcado y solo aparece si
dejó mail. Es la única base legítima para escribirle después (LGPD).

### 5.5b · El aviso cuando llega un recuerdo

Un recuerdo nuevo queda **pendiente de moderación**: si nadie se entera, puede pasar
días sin publicarse. Desde julio de 2026 el aviso sale **desde la propia página
pública**, apenas se guarda el recuerdo: WhatsApp al número del negocio y correo al
administrador.

**Con qué**: la función `notify-whatsapp` que ya existe y ya está probada (sin
destinatario cae en `CALLMEBOT_PHONE`), y EmailJS con la **clave pública**, igual que
`CV2.enviarMail`. **Cero variables nuevas, cero despliegues.**

**Nada de esto puede hacer fracasar el recuerdo.** Se llama sin `await`, después de que
el documento ya está guardado, y cada envío se traga su propio error. Si el aviso no
sale, el recuerdo igual queda esperando en el panel.

> **Antes había una función de Netlify para esto, `notify-recuerdo`, y estaba muerta
> dos veces**: le faltaban tres variables de entorno (`ADMIN_EMAIL`,
> `EMAILJS_PRIVATE_KEY`, `RECUERDOS_TOKEN`) **y esta página nunca la llamó**. Además
> su `RECUERDOS_TOKEN` era un secreto único, el modelo anterior a las
> `claves_recuerdos` por QR. Se retiró del repositorio. La copia que quedó desplegada
> en Netlify es inerte —sin esa variable devuelve 403 y no manda nada— y desaparece
> en el próximo despliegue que se haga por cualquier motivo.

### 5.5 · El resto del circuito

1. Lee `?k=<clave>` de la dirección; si no viene, la que el navegador recuerde (15 días).
2. Verifica que exista, esté activa y no haya vencido.
3. **Borra `?k=` de la barra de direcciones** con `history.replaceState`.
4. Pinta el muro (los publicados), que se lee sin sesión.
5. Con clave válida, muestra el botón de escribir. Sin ella, un cartel con el motivo.
6. Al enviar: sesión (Google o anónima) → foto opcional a Cloudinary → documento en
   `recuerdos` con `estado: 'pendiente'` → registro en `huespedes/<uid>`.

**Nada se publica solo.** Alguien con permiso `contenido` lo aprueba desde el panel; desde
la tanda 11.15 el Inicio avisa cuando hay pendientes.

**La foto** va con el preset **`preset-recuerdos`**, propio del muro y separado del de
comprobantes: **un preset por superficie**, para poder apagar el del muro si hay abuso sin
tocar comprobantes ni fotos de cabañas.

**La sesión anónima** se pide si no hay ninguna **o si la que hay no es anónima** — sin
esa segunda condición, un recuerdo escrito en un navegador con otra sesión del proyecto
quedaba firmado con ese uid y no con el del huésped.

### 5.6 · El QR se genera en el navegador

Con `qrcodejs` por CDN, dentro del panel: **la clave no sale del dispositivo**, ningún
servicio de terceros la ve.

La dirección base del QR es editable y queda guardada en el navegador, con
`https://casaverdecanas.com.br/recuerdos.html` por defecto aunque se esté probando en
`github.io`. **Un QR impreso no se corrige.**

> ⚠ **Los QR del sistema viejo están muertos.** Llevan `?cabana=X&k=…` con un token que
> no existe en el 2.0: quien los escanee ve el muro y el cartel `CLAVE_DESCONOCIDA`.
> **Hay tres carteles impresos para reemplazar.**

---

## 6 · El `<head>` de la portada — el contrato con Google

No es decoración: es la posición ganada en buscadores. Lo que hay hoy:

- `<title>`: *Casa Verde Canas | Alquiler Cabañas Canasvieiras Florianópolis*
- `description` de ~250 caracteres, con playa, piscina, estacionamiento y WiFi
- `canonical` → `https://casaverdecanas.com.br/`
- `robots: index, follow`
- `keywords` en español y portugués
- **Geo**: `geo.region BR-SC`, `geo.placename`, `geo.position -27.4278;-48.4658`, `ICBM`
- **Open Graph**: `type`, `site_name`, `url`, `title`, `description`,
  `image` → `https://casaverdecanas.com.br/img/og-preview.jpg` (1200×630),
  `locale es_AR` + alternate `pt_BR`
- **Twitter**: `summary_large_image`, título y descripción

**Datos estructurados.** La portada lleva un `application/ld+json` de tipo
**`LodgingBusiness`** con nombre, url, imagen, descripción, teléfono, dirección,
coordenadas, `amenityFeature` y `sameAs` (Instagram y Facebook). Es lo que le permite a
Google mostrar la ficha del alojamiento, y es tan parte del contrato como las meta
etiquetas.

**`recuerdos.html`** tiene su propio `<head>` con título, descripción y canonical
propios. **`404.html`** lleva `noindex` y ningún dato estructurado, que es lo correcto.

**`lang="es"` en el `<html>`** — y el script pone el idioma real al arrancar. Si se cambia
a otro, Googlebot navega en inglés, el detector cae en portugués y lo indexado está en
español.

---

## 7 · Dominio, despliegue y buscadores

- **Dominio**: `casaverdecanas.com.br`, registrado en Locaweb (vence 16/03/2027, DNS
  `ns1`/`ns2.locaweb.com.br`). El archivo `/CNAME` del repositorio lo declara del lado de
  GitHub.
- **IP de GitHub Pages para dominio pelado**: `185.199.108.153`, `.109.153`, `.110.153`,
  `.111.153`.
- **Repositorio**: `casaverdecanas` bajo `casaverdecanas-blip`.
- **`robots.txt`**: permite todo, **prohíbe `/interno/`** (si no, Google indexa el panel)
  y declara el sitemap.
- **`sitemap.xml`**: dos URLs, la portada y el muro, con `lastmod` fijo. **Se actualiza a
  mano**: hoy dice `2026-07-26` y no se mueve solo.
- **`404.html`**: lleva `noindex`, correcto. Su botón usa `href="/"`, que **con el dominio
  propio es correcto**; la regla de "siempre enlaces relativos" (§8) nació cuando el sitio
  vivía en `github.io/casaverdecanas/` y ahí `/` apuntaba a la raíz de la organización.

### 7.1 · Cómo se publica — verificado

**No hay `.github/workflows/`. No hay ningún workflow, ni `package.json`, ni paso de
build.** El sitio se publica con **GitHub Pages directamente desde la raíz de la rama
`main`**: se sube el archivo y se publica tal cual, en un minuto o dos. El entorno
`github-pages` acumula más de 120 despliegues, todos con el mensaje *"Add files via
upload"* — es decir, subidos desde el navegador.

Consecuencias prácticas, todas buenas:

- **Nada puede borrar el `CNAME`**: no hay artefacto que se arme, se publica el
  repositorio como está.
- **No hace falta saber nada de Actions** para subir un cambio.
- **`.nojekyll` es imprescindible** y ya está: sin él, Jekyll procesaría el sitio.
- **Lo que se sube, se publica.** No hay revisión ni etapa intermedia: un archivo roto
  queda en vivo. De ahí el checklist de §10.

Si un cambio no se ve, **no es el despliegue**: es el service worker sirviendo la copia
guardada. Subir `VERSION` en `interno/sw.js` y cerrar la app del todo.

### 7.2 · Analítica — verificado

**No hay ninguna.** Ni Google Analytics, ni Tag Manager, ni Plausible, ni Umami, ni
Hotjar, ni Clarity, ni píxel de Facebook. El sitio no mide nada: no se sabe cuánta gente
entra, de dónde viene ni qué mira. Es una decisión pendiente, no un olvido documentado.

### 7.3 · Los redireccionamientos del 404

`404.html` no es solo un cartel: su script tiene un **mapa de URLs viejas** (`/index.html`,
`/admin.html`, `/interno/index.html`) que manda a la dirección nueva. Es el mecanismo que
cumple la regla de §8.3 —ninguna URL indexada termina en 404— para las direcciones que
quedaron dando vueltas en Google y en enlaces ajenos. **Si se renombra una página, se
agrega su entrada a ese mapa.**

### 7.4 · Dominios externos que carga el sitio

| Dominio | Qué trae |
|---|---|
| `www.gstatic.com` | El SDK de Firebase 12.16.0 (app, firestore, auth) |
| `fonts.googleapis.com` | Fraunces, Figtree y Material Icons |
| `api.cloudinary.com` | La subida de fotos (solo desde el muro y el panel) |
| `cdnjs.cloudflare.com` | `qrcodejs`, solo en el panel |
| `wa.me` · `instagram.com` · `facebook.com` | Enlaces salientes, no scripts |

Son cinco orígenes de terceros. Si alguno cae, el sitio se degrada: sin `gstatic` no hay
cabañas ni calendario; sin `fonts.googleapis` cambian las tipografías pero se lee igual.

---

## 8 · Las reglas que no se rompen

1. **Una página pública no importa `nucleo.js`.**
2. **`lang="es"`** en el `<html>`.
3. **Ninguna URL indexada puede terminar en 404.** Si una página se renombra, **se agrega
   su entrada al mapa de `404.html`** (§7.3): hay enlaces en Google, en Airbnb y en QR
   impresos que no se corrigen.
4. **Enlaces relativos entre páginas del sitio** (`./index.html`, no `/index.html`).
5. **Toda clave usada existe en `textos-sitio.js` en los tres idiomas** (§4.1).
6. **`/interno/` en `Disallow` del `robots.txt`.**
7. **El `<head>` de la portada** (§6).
8. **`firestore.rules` se edita completo, nunca por fragmentos**: las reglas se **suman**,
   y publicar un pedazo puede abrir de más sin que se note.
9. **La clave y el mail nunca quedan en un recuerdo publicado** (§5.3).
10. **Un dominio no puede estar en dos repositorios a la vez**, ni verificado en una
    cuenta que no es la que lo usa.
11. **`casaverdecanas.com.br` en los dominios autorizados de Firebase Auth**, o el login
    con Google del muro deja de funcionar.
12. **Los `id` del HTML de la portada** (`qCabana`, `calGrid`, `btnWa`, `waTop`,
    `estado`…): el script los busca por id y, si no los encuentra, **falla en silencio**.
13. **Los nombres de los íconos en `/interno/`**: los referencia el `manifest.json` del
    panel, no solo el favicon del sitio.
14. **Las rutas de `<link>`, `<meta>` y JSON-LD tienen que ser las REALES.** No tienen
    respaldo: un `onerror` solo existe en `<img>`. Favicon, `og:image` y la `image` del
    JSON-LD se verifican a mano, porque cuando están mal **no se nota**.
15. **`.nojekyll` en la raíz.** Un archivo de un byte del que depende que GitHub Pages
    sirva el sitio tal cual. Borrarlo por parecer basura rompe cosas de formas raras.

---

## 9 · Identidad visual

- **La paleta sale de la ilustración**, no al revés: menta de la casa, crema del cielo,
  terracota del techo, verdes de la selva, muestreados del propio dibujo.
- **La flor roja (`#be402c`) se reserva solo para error/ocupado.** Si apareciera en más
  lugares, dejaría de leerse como alarma.
- **El fondo es "papel" (`#faf4e6`)**, no la crema pura del dibujo (`#f4e8cb`): esa
  última es correcta para bandas y fotos, pero cansa en lectura larga.
- **El logo caligráfico es exclusivo**: ningún título imita la letra manuscrita. Títulos
  en Fraunces (serif), texto en Figtree (sans).
- **El ícono de la app recorta el renglón "APARTAMENTOS RÚSTICOS"**: a 48 px sería una
  mancha ilegible.
- **Documento rector**: `Guia_estetica_v2.md` (la v1 quedó obsoleta; descartar copias).

---

## 10 · Checklist antes de dar por publicado un cambio

1. Mirarlo **en el teléfono**, no en la ventana angosta del navegador.
2. Probarlo **en incógnito**. Es la única forma de ver lo que ve quien llega por primera
   vez: el muro de recuerdos "andaba" durante semanas y no funcionaba para ningún
   huésped, porque la línea que fallaba estaba detrás de un `if (!auth.currentUser)`.
3. Cambiar los tres idiomas con los botones PT · ES · EN.
4. Si algo muestra una palabra suelta en minúscula, es una clave sin traducción (§4.1).
5. Si se agregó o renombró una página, actualizar **`sitemap.xml`**.

---

## 11 · Cuando algo sale mal

| Síntoma | Causa |
|---|---|
| El botón de WhatsApp no lleva a nada | `config/sitio.whatsapp` vacío |
| Aparece el nombre de una clave en vez de una frase | Falta esa clave en `textos-sitio.js` |
| El muro no deja escribir a nadie nuevo | Proveedor **Anónimo** deshabilitado en Firebase Auth |
| "No se pudo subir la foto" | Preset de Cloudinary inexistente o no *unsigned* |
| El calendario no muestra ocupación | `disponibilidad` vacía o sin sincronizar |
| `[object Object]` donde va el nombre de una cabaña | `nombre` es `{es, pt, en}`: hay que resolver `nombre.es` |
| El logo aparece como texto | Las imágenes no están subidas al repositorio |
| Enlaces internos que dan 404 | `href="/"` estando en `github.io/casaverdecanas/` |
| `auth/unauthorized-domain` al entrar con Google | Falta el dominio en Authorized domains |
| El navegador avisa que el sitio no es seguro, recién mudado | GitHub está emitiendo el certificado. Hasta una hora |
| Un cambio subido no aparece | El service worker sirve la versión cacheada. Subir `VERSION` en `sw.js` y cerrar la app del todo |
| Fechas o vencimientos raros | **Reloj del dispositivo corrido**: las fechas de tareas y el vencimiento de claves se calculan con la hora del teléfono |

**Códigos que el muro le muestra al huésped**, por diseño:
`SIN_CLAVE` (entró sin escanear) · `CLAVE_DESCONOCIDA` (enlace cortado o cartel viejo) ·
`CLAVE_INACTIVA` (dada de baja) · `CLAVE_VENCIDA` · `SIN_RED`.

---

## 12 · Deuda conocida

1. **Los tres QR impresos del sistema viejo hay que reemplazarlos** (§5.6).
2. **`recuerdos_contactos` no se limpia sola.** Guarda mails indefinidamente; si alguien
   pide que lo borren, hay que borrar el documento a mano. Es LGPD, no una molestia
   técnica.
3. **El registro de huéspedes no tiene salida.** Se pueden copiar los mails y bajar un
   CSV; no hay envío, ni segmentación, ni baja automática.
4. **Privacidad de fotos, limitada por diseño.** Los presets sin firma de Cloudinary hacen
   que toda URL de imagen sea públicamente accesible: una foto de un recuerdo pendiente o
   borrado sigue siendo alcanzable con el enlace.
5. **El `sitemap.xml` se actualiza a mano** y hoy tiene una sola fecha para todo. Sus dos
   URLs sí corresponden a archivos que existen.
6. **`README.md` está prácticamente vacío.** Es el primer archivo que ve cualquiera que
   abra el repositorio; valdría al menos las reglas de §8.
7. **No hay una imagen dedicada para compartir.** Se usa la ilustración de marca, que
   funciona; una pieza de 1200×630 con el nombre y la propuesta se vería mejor en
   WhatsApp. Mejora, no falla.
8. **El muro de recuerdos está solo en español.** `recuerdos.html` público no usa `data-t`
   ni `t()`: los textos están fijos. El resto del sitio es trilingüe. Un huésped brasileño
   escanea el QR y se encuentra todo en español, justo cuando se le pide que escriba.
9. **El sitio no mide nada** (§7.2). Decisión pendiente.
10. **Dos archivos huérfanos en `/interno/`**: `ilutracion-hero.jpg` (con el nombre mal
    escrito) e `icono-alternativo-512.png`. **Borrado pendiente en la tanda 11.17.** No
    los referencia nada y no están en el `SHELL` de `sw.js`, así que salen sin tocar el
    service worker; si alguna vez un archivo a borrar SÍ está en el `SHELL`, se saca del
    `SHELL` y se sube la `VERSION` en la misma tanda (CONVENCIONES §7.9).
11. **No hay `.gitignore`** (§7bis: anotarlo, no urgente).
12. **Datos de contenido a corregir en el panel** (no es del sitio): una capacidad cargada
    como "1–1 personas" y las tres cabañas mostrando el mismo "desde R$ 250".
13. **La documentación quedó pública al entrar al repositorio** (tanda 11.17). Los tres
    `.md` de `interno/` se leen sin sesión, en texto plano. No hay claves de terceros
    —eso se verificó—, pero el briefing sí contiene **mails y `uid` del equipo**. Decidir
    si se depuran o si se acepta: son datos personales publicados, no un agujero de
    seguridad.
