# GUÍA DEL SITIO PÚBLICO — Casa Verde Canas
### v1.4 · julio 2026

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

### 5.5b · ⚠ El aviso de recuerdo nuevo NO está llegando

`netlify/functions/notify-recuerdo.js` necesita tres variables de entorno —
`ADMIN_EMAIL`, `EMAILJS_PRIVATE_KEY` y `RECUERDOS_TOKEN` — y **ninguna de las tres
existe en Netlify** (verificado el 30 de julio de 2026). La función corta en la
primera línea, al validar el token.

**Consecuencia: cuando un huésped deja un recuerdo, no llega ningún aviso.** El
recuerdo se guarda bien y espera moderación; lo que falta es que alguien se entere.

Y hay un problema de fondo además del de las variables: `RECUERDOS_TOKEN` es un
**único secreto compartido**, del modelo viejo. Las reglas del 2.0 usan la colección
`claves_recuerdos`, con una clave distinta por QR. Aunque se cargaran las variables,
el modelo no coincidiría.

**Pendiente:** decidir si se arregla o se retira. Va en su propia tanda. Mientras
tanto, los recuerdos pendientes se ven entrando a `recuerdos.html` del panel.

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
