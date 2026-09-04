// ═══════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — service worker
//  Estrategia: shell precacheado (cache-first) · navegación
//  network-first con fallback al shell · el resto pasa directo
//  (los DATOS van por la caché persistente de Firestore, no
//  por acá — regla del anexo técnico).
//  Al cambiar cualquier archivo del shell: subir la VERSION.
// ═══════════════════════════════════════════════════════════

// v103 (04-sep-2026) — EL AVISO DEL DARF SE ADELANTA AL COBRO. Airbnb paga
//       el dia del check-in o el siguiente (dato del administrador), y para
//       un no residente el DARF vence EL MISMO DIA en que la plataforma
//       paga. Avisar cuando el cobro ya esta cargado llega tarde: para
//       entonces el plazo corrio y la mora empezo.
//       Como el sistema ya conoce los check-in de Airbnb, ahora avisa ANTES,
//       sin que nadie cargue nada: un check-in de Airbnb es el anuncio de
//       que va a entrar plata Y de que ese dia vence su impuesto.
//       Tres estados, de mas a menos urgente: el cobro que ya entro y nadie
//       registro (rojo, el plazo ya paso), el que entra hoy o manana, y los
//       DARF de cobros ya cargados que siguen impagos.
//       ⚠ EL PROCURADOR SE CRUZA CON ESTO. Si falta ese tramite y hay un
//       cobro en puerta, el aviso sube a rojo y lo dice con todas las
//       letras: no hay quien emita el DARF. Eran dos datos sueltos en dos
//       pantallas y juntos son la advertencia que sirve.
//       El mismo aviso va en el Inicio y en Impuestos, para que no dependa
//       de pasar por la portada.
// v102 (04-sep-2026) — LOS COBROS DE AIRBNB, RECONCILIADOS (A1). Airbnb paga
//       en bloque y esa transferencia agrupa varias reservas; hasta hoy la
//       plata caia en Dinero como un movimiento suelto, sin vinculo, y las
//       reservas importadas quedaban con total 0. No habia forma de decir
//       cuanto rindio cada una ni sobre que se declara.
//       Nace la coleccion 'liquidaciones': una por transferencia, con la
//       fecha, el bruto, el neto, que reservas cubre y el estado de su DARF.
//       COLECCION PROPIA Y NO UN CAMPO DEL MOVIMIENTO, por una razon
//       concreta: los movimientos se SELLAN al entrar en un balance cerrado
//       (movSellado), y el DARF se paga despues. Guardado ahi habria quedado
//       congelado en 'pendiente' para siempre.
//       SE GUARDAN BRUTO Y NETO LOS DOS. Cual es la base del 15% es el
//       tramite 3, todavia sin confirmar: con los dos numeros, la respuesta
//       del contador no obliga a recargar nada. Mientras siga abierto, la
//       pantalla muestra LOS DOS impuestos en vez de elegir uno por su
//       cuenta.
//       UN movimiento por transferencia, no uno por reserva: el banco
//       muestra un credito, no cinco (§1.3, el flujo define los saldos). Va
//       por el NETO, que es lo que llego a la cuenta.
//       El Inicio avisa de los DARF impagos, los vencidos en rojo y
//       primeros: la mora corre sola desde el dia del cobro.
//       ⚠ LO QUE NO HACE: no reparte el cobro entre las reservas ni les
//       cierra el saldo. Las de Airbnb siguen con total 0 hasta que alguien
//       les cargue el precio, y crear pagos contra un total 0 las mostraria
//       sobrepagadas. Queda el vinculo, que es lo que faltaba.
//       firestore.rules: /liquidaciones/ pide 'finanzas'.
//       design-system.css: '.fila2c' sube al sistema de diseño y se borran
//       las tres copias locales (cabanas, dinero, reservas) — hacia falta
//       una cuarta y §3.16 dice que eso no se arregla pagina por pagina.
// v101 (04-sep-2026) — LOS TRAMITES DEL IMPUESTO DE AIRBNB, ANOTADOS. Nace
//       'fiscal.html' [NUEVO, SHELL] con los cinco tramites que hay que tener
//       resueltos antes de la primera declaracion, cada uno con el motivo
//       escrito: un tramite sin su porque se tilda para sacarselo de encima.
//       El Inicio avisa cuantos faltan mientras quede alguno.
//       ⚠ EL PLAZO NO ES A FIN DE MES. Para un no residente el DARF 9478
//       vence el DIA en que la plataforma paga —normalmente el check-in— y
//       puede haber varios DARF en el mismo mes. Por eso el aviso va al
//       Inicio y no espera a un cierre: un tramite que falta el dia del
//       primer cobro ya llego tarde, y la mora corre sola (1% mensual, tope
//       20%, mas SELIC).
//       ⚠ TENSION A RESOLVER, y es el primer tramite de la lista: el dinero
//       entra con CPF a nombre de Mauro. Recibir con CPF en cuenta brasilena
//       sin haber formalizado la no residencia es justo el caso donde la
//       Receita trata a la persona como RESIDENTE, y entonces el regimen no
//       seria el 15% fijo sino carne-leao progresivo. Hasta que el contador
//       lo confirme, lo que muestra la pantalla es provisorio y lo dice.
//       Los pasos viven en CV2.PASOS_FISCALES (nucleo.js) y no en la
//       pantalla: el Inicio tambien los cuenta, y una copia de las claves
//       alla haria que el dia que se agregue un tramite el aviso contara de
//       menos sin que nada falle a la vista.
//       firestore.rules: /config/fiscal pasa a pedir 'finanzas' y se lo
//       excluye a mano del bloque general /config/{doc} —las reglas se
//       suman, asi que sin esa exclusion cualquiera del equipo lo leeria,
//       igual que ya pasaba con 'integraciones'.
//       NO se guarda el CPF ni ningun documento: el sistema no lo necesita.
// v100 (04-sep-2026) — POR DONDE LLEGA CADA CLIENTE. Campo 'llegoPor' en
//       clientes, con su detalle libre, y un resumen que cuenta clientes Y
//       reservas por origen: un cliente que llego recomendado y volvio tres
//       veces vale mas que tres que vinieron una vez. Se puede filtrar la
//       lista tocando una fila del resumen, y el bucket "sin cargar" dice
//       cuantos faltan completar.
//       ⚠ NO CONFUNDIR con 'reserva.origen'. Aquel dice por que CANAL entro
//       la reserva (directa / airbnb); este dice como nos CONOCIO la persona.
//       Alguien puede llegar por recomendacion de un huesped viejo y reservar
//       directo: son dos hechos distintos. Por eso el campo se llama
//       'llegoPor' y no 'origen'.
//       Sin cambios en firestore.rules: /clientes/ no tiene hasOnly, asi que
//       el campo nuevo entra sin tocar las reglas.
// v99 (04-sep-2026) — LA LIMPIEZA QUE NO SE CREABA NUNCA. Nacia recien siete
//       dias antes del check-in, y como no hay servidor, eso dependia de que
//       alguien abriera la app en esos siete dias. Si nadie entraba, no se
//       creaba; y pasado el check-in ya no se creaba nunca mas, porque la
//       condicion pedia checkIn >= hoy. El huesped llegaba a una cabana que
//       el sistema nunca mando a preparar, sin dejar rastro de la falta.
//       Ahora la limpieza se crea AL CONFIRMAR la reserva, aunque falten
//       meses, y las vistas esconden las que todavia estan lejos
//       (Core.limpiezaLatente, horizonte de 7 dias en actividades-core.js).
//       El dia que aparece es el mismo de antes: lo que cambia es que ahora
//       aparece siempre, no solo si alguien estuvo mirando.
//       Se verifico que adelantar la creacion NO mueve honorarios: el
//       honorario nace al cerrar el ciclo (_cerrarCiclo), no al crear la
//       actividad; el 'monto' de la limpieza es solo un numero guardado.
//       Tres vistas filtran lo latente — index.html (el bloque de limpiezas
//       no tiene tope de filas y va primero), actividades.html (el arbol, que
//       por defecto muestra "Todas") y agenda.html (su arbol lateral). "Mi
//       semana" de la agenda ya recortaba por fecha y no necesito tocarla.
//       Se borra VENTANA_DIAS de reservas-core.js, que quedo sin uso.
// v98 (31-ago-2026) — "1-1 PERSONAS" EN LA VIDRIERA. La capacidad se pintaba
//       tal cual estaba guardada, sin mirar si tenia sentido: la Cabana salia
//       anunciada como "1-1 personas" al lado de una descripcion que decia
//       "para 6 o 7". El dato estaba mal en Firestore, pero el sitio no tenia
//       por que publicarlo. Un dato equivocado en la vidriera es peor que
//       ninguno: el visitante no piensa "esto no esta cargado", piensa que
//       entra una persona y se va.
//       Ahora: sin cargar (0, o el 1-1 que deja un formulario vacio) no se
//       muestra nada; base y maximo distintos dan "6-7 personas"; iguales dan
//       "6 personas" en vez del "6-6" de antes.
//       El 1-1 se descarta aunque sea un numero valido: ningun alojamiento de
//       esta casa recibe a una sola persona como tope, asi que en la practica
//       siempre significa que nadie lo cargo.
//       ⚠ IGUAL HAY QUE CARGAR LAS CAPACIDADES en el panel: 7 la Cabana, 6 el
//       Loft, 4 el Departamento. Esto solo evita publicar el error.
// v97 (30-ago-2026) — LOS PRECIOS SON DE TEMPORADA BAJA, Y HAY QUE DECIRLO.
//       Entrando en temporada alta, el numero publicado sin contexto hace que
//       alguien que mira en diciembre entienda que ese es el precio de enero:
//       la conversacion arranca con una correccion, que es la peor forma de
//       arrancar una reserva. La aclaracion va PEGADA al numero, en la misma
//       tarjeta —una nota al pie no la lee nadie— y se repite una vez mas
//       justo antes del formulario, que es donde la persona esta por elegir
//       fechas de enero mirando un numero de junio.
//       Cada tarjeta suma su boton 'Pedir presupuesto'. NO abre WhatsApp
//       directo a proposito: elige esa cabana en el formulario y baja hasta
//       ahi, para que el mensaje salga con el espacio, las fechas y la
//       cantidad de gente adentro. Sin eso el mensaje sale como "hola, quiero
//       consultar" y hay que hacer tres preguntas antes de poder dar un
//       precio.
//       Claves nuevas: precioRef, precioAviso, pedirPresu (118 por idioma).
//       ⚠ Sin etiquetas HTML en los textos: el sitio pinta con textContent y
//       el editor edita con contenteditable, asi que un <b> se veria literal
//       y se guardaria como texto al editarlo.
// v96 (30-ago-2026) — OPINIONES TAMBIEN EN LA RAIZ, y las claves donde van.
//       'opiniones.html' NUEVO en la RAIZ: la misma lista, en direccion
//       propia, para mandar por WhatsApp a quien pregunta si hay referencias.
//       Mismo criterio que la-casa.html: la portada convence a quien esta
//       mirando, la pagina propia se comparte, se guarda y se cita.
//       ⚠ HAY DOS 'opiniones.html' Y NO ES UN ERROR: el de la raiz es
//       publico (lee y muestra) y el de interno/ es el cargador (escribe).
//       Es el mismo par que ya existe con recuerdos.html.
//       Las cinco claves que en la v95 quedaron en un T_EXTRA dentro del
//       index PASAN a textos-sitio.js, con dos mas ('opi_p', 'opi_volver'):
//       ahora el editor visual las ve y se traducen desde la pantalla.
//       textos-sitio.js esta en el SHELL: por eso sube la VERSION aunque el
//       archivo nuevo viva en la raiz y no entre a la lista.
//       ⚠ FALTA A MANO: sumar /opiniones.html a sitemap.xml (§7.9).
// v95 (30-ago-2026) — LAS OPINIONES DE AIRBNB, A MANO. Airbnb no tiene API
//       publica (solo la da a socios aprobados) y los widgets que se venden
//       raspan la pagina del anuncio: se rompen cuando Airbnb cambia el HTML
//       y meten JavaScript de un tercero en el sitio. Se copian a mano desde
//       'opiniones.html' [NUEVO] y se quedan quietas.
//       DONDE VIVEN: config/sitio, que ya es "el unico lugar del contenido
//       publico" y que el sitio ya bajaba. Cero coleccion nueva, cero regla
//       nueva, cero lectura de mas por visita.
//         opiniones: [ { autor, fecha, idioma, estrellas, texto, orden } ]
//         airbnb:    { c1: { url, nota, resenas }, … }
//       DECISION CORREGIDA sobre la marcha: iban a ir repartidas POR CABAÑA.
//       Al mirar las resenas de verdad, casi ninguna nombra un departamento
//       —hablan de la casa, la piscina, el jardin y de quienes reciben—, asi
//       que repartirlas habria inventado una division que los huespedes no
//       hicieron. Quedan en una seccion propia, justo antes del formulario;
//       cada tarjeta conserva su nota y su enlace, que si son de cada anuncio.
//       El enlace dice "verificar", no "ver el anuncio", va ultimo y en gris,
//       y lleva rel="nofollow": es una prueba, no una segunda vidriera donde
//       comprar, y no hay motivo para regalarle posicion al que nos cobra
//       comision.
//       ⚠ QUEDA ABIERTO: las cinco etiquetas nuevas (opi_t, opi_ver, opi_en,
//       opi_mas, opi_menos) estan en un T_EXTRA dentro del index.html de la
//       RAIZ y no en textos-sitio.js. Mientras esten ahi el editor visual NO
//       las ve y no se traducen desde la pantalla.
// v94 (28-ago-2026) — 'invalid-argument' AL GUARDAR DESPUES DE USAR EL OJO.
//       La lista de ocultos se leia de dentro del iframe (w.CVSITIO.ocultos) y
//       se guardaba tal cual. Ese array lleva el Array.prototype DEL IFRAME,
//       no el de la pagina del editor: para JavaScript es un array igual
//       —Array.isArray dice que si— pero Firestore comprueba el tipo contra
//       SU propio Array, no lo reconoce y rechaza la escritura ENTERA con
//       'invalid-argument', sin decir cual de los campos fue. Resultado: se
//       ocultaba algo, se tocaba Guardar y no se guardaba nada, ni siquiera
//       los textos que no tenian nada que ver.
//       Se copia con Array.from() al cruzar la frontera del marco, y hay un
//       ultimo filtro en guardar() por si el dato entra por otro camino.
//       Los arrays de fotos nunca fallaron porque arrayActual() los construye
//       en el editor desde cero: 'ocultos' era el unico dato que llegaba ya
//       armado desde adentro del iframe.
// v93 (28-ago-2026) — PODER SACAR ALGO DEL SITIO, y el icono del ventilador.
//       'mode_fan' no existe en Material Icons: es de la fuente Symbols, que
//       el sitio no carga, asi que salia un simbolo cualquiera. Cambia a
//       'air'. De paso 'table_restaurant' → 'dining' y 'kayaking' → 'rowing',
//       que estaban en el mismo riesgo.
//       LO DE FONDO: vaciar un texto no lo borra, lo devuelve al diccionario
//       — y eso es correcto, porque quien borra sin querer no deberia dejar
//       un hueco para siempre. Pero entonces no habia forma de sacar del
//       sitio una regla o un renglon que ya no corresponde. Nace la lista
//       config/sitio.ocultos: 'textos' guarda lo que dice, 'ocultos' guarda
//       lo que no se muestra. Son dos intenciones distintas y por eso van en
//       dos campos distintos.
//       En el sitio se esconde el texto Y el contenedor cuyos textos esten
//       TODOS escondidos, para que no quede un renglon vacio con el icono
//       suelto. Editando no desaparece: se ve apagado y tachado, con un
//       boton de ojo en la barra para traerlo de vuelta — sacar algo sin
//       poder deshacerlo no es una funcion, es una trampa.
//       Y mas aire entre el final de un parrafo y el titulo siguiente.
//       ⚠ AGREGAR un parrafo o una regla NUEVA sigue pidiendo tocar el HTML:
//       es la contrapartida de que cada renglon sea su propia clave (v85).
// v92 (28-ago-2026) — NACE cloudinary-listar. No existia: en el repo solo
//       estaban claude-proxy y notify-whatsapp. Se escribe de cero, con el
//       error de fondo evitado: la cuenta esta en modo Dynamic folders, donde
//       la carpeta va en 'asset_folder' y no en 'folder'. Buscar por el campo
//       viejo NO da error, devuelve cero con HTTP 200 — por eso el editor
//       decia "no hay fotos" con las fotos ahi. Ahora se busca por los DOS
//       campos y ademas por las SUBCARPETAS (cabanas/cabana1...), que una
//       busqueda por carpeta exacta no ve. Los comprobantes de Dinero
//       ('gastos') se excluyen en la propia expresion.
//       La funcion devuelve siempre un diagnostico —donde busco, cuantas
//       encontro por carpeta— y el editor lo muestra cuando la respuesta
//       vuelve vacia, que es cuando hace falta.
//       ⚠ VA A NETLIFY, NO AL SHELL: es codigo de servidor. Netlify no esta
//       enganchado a Git, asi que subirla a GitHub no la despliega: hay que
//       desplegarla a mano y cargar las variables de entorno.
// v91 (28-ago-2026) — REVISAR LAS FOTOS. Pantalla nueva 'fotos.html': junta
//       todas las fotos que muestra el sitio público y las mira una por una.
//       Encuentra las servidas por otro sitio (y las trae a Cloudinary, a la
//       carpeta que les toca, de a una y con confirmación), las que no cargan,
//       las que se piden sin la transformación de entrega —bajan en tamaño
//       original, que en 3G se nota— y las repetidas.
//       ⚠ LO QUE NO PUEDE SABER, Y ES A PROPÓSITO: en qué carpeta está
//       guardada cada foto. En modo Dynamic folders la carpeta es un dato
//       aparte del identificador y NO viaja en la URL, así que desde el
//       navegador es imposible. La pantalla lo dice en vez de fingir que
//       verificó: si cloudinary-listar responde, cruza y marca las mal
//       ubicadas; si no, muestra el identificador y la carpeta que
//       corresponde, para acomodarlas a mano.
//       Las correcciones reescriben el array de fotos ENTERO y lo releen del
//       servidor justo antes: Firestore no cambia un elemento por índice, y
//       'fotos.2' crearía un mapa con la clave "2" en vez de tocar el array.
// v90 (28-ago-2026) — LAS FOTOS SE SUBÍAN A LA RAÍZ. CV2.subirImagen nunca
//       mandaba carpeta, así que TODAS las fotos del sistema —las del sitio,
//       las de los alojamientos, los avatares— caían en la raíz de
//       Cloudinary, mezcladas con los comprobantes de Dinero. Por eso el
//       listado del editor no encontraba ninguna: buscaba en 'sitio',
//       'cabanas' y 'espacios', que estaban vacías.
//       Ahora subirImagen acepta una carpeta y la manda en 'asset_folder'
//       (el campo del modo Dynamic folders; 'folder' es del modo clásico y
//       se ignora sin dar error). El editor la deduce del destino: cada
//       alojamiento va a cabanas/cabanaN, las áreas comunes a 'Espacios'
//       —con E mayúscula, como está en Cloudinary— y el resto a 'sitio'.
//       El mapa de carpetas vive en CV2.CLOUDINARY.carpetas, en un solo
//       lugar. ⚠ PENDIENTE: la función cloudinary-listar de Netlify sigue
//       buscando mal y hasta que se corrija el listado seguirá vacío.
// v89 (28-ago-2026) — LA HOJA DE FOTOS NO SE CERRABA Y TRABABA EL GUARDADO.
//       Era un <dialog> nativo y su cierre pasaba por el parche de nucleo.js,
//       que engancha el botón Atrás moviendo el historial. Pero este editor
//       cambia el src de un iframe —al cambiar de página y al recargar el
//       sitio— y cada cambio de src agrega una entrada al historial de la
//       ventana: la pila de capas y el historial real dejan de coincidir, y
//       el history.back() del cierre retrocede una navegación del iframe en
//       lugar de quitar la entrada de la capa. La hoja quedaba abierta
//       tapando la barra de abajo, con el botón Guardar adentro: se podía
//       editar y no se podía guardar.
//       Pasa a ser un panel propio, el mismo patrón de traducir.html: no
//       toca el historial, el fondo también cierra y el área de la ✕ sube a
//       44px. Se agrega además el diagnóstico de Cloudinary en modo Dynamic
//       folders (asset_folder vs folder) al aviso de "no hay fotos".
// v88 (28-ago-2026) — DOS BOTONES MUERTOS EN EL EDITOR. 'Descartar' y
//       'Volver' seguían usando confirm(), que Chrome deja apagar desde
//       "impedir que esta página cree más diálogos". Apagado, confirm()
//       devuelve 'no' sin mostrar nada: Descartar no descartaba y Volver no
//       dejaba volver, los dos en silencio y sin explicar por qué. Pasan a
//       la capa propia del panel, la misma de traducir.html, que además
//       entra en la pila del botón Atrás. Nada más cambia.
// v87 (28-ago-2026) — EL ENLACE A 'la-casa.html' ESTABA ROTO. Al renombrar
//       las claves de punto a guión bajo en la v86, el reemplazo también
//       alcanzó la CADENA 'casa.html' dentro de 'la-casa.html': el guión
//       cuenta como límite de palabra, así que el patrón la tomó por una
//       clave. Los dos enlaces de la portada, el canonical y el og:url
//       quedaron apuntando a '/la-casa_html' — 404. El editor y el traductor
//       no se vieron afectados porque se escribieron después del reemplazo.
//       Lección: un reemplazo masivo por patrón se verifica contra las RUTAS
//       y las URLs del archivo, no solo contra las claves que se querían
//       tocar. Nada más cambia en esta versión.
// v86 (27-ago-2026) — REVISAR Y TRADUCIR, y un defecto de la v85 corregido
//       antes de que se notara. Nace 'traducir.html': saca TODO el español
//       con su contexto —leyendo las dos páginas del sitio en marcos ocultos,
//       no de una tabla a mano— con el pedido de auditoría adentro, y mete de
//       vuelta las correcciones pieza por pieza. Estado por idioma destino:
//       una pieza puede estar al día en portugués y vieja en inglés.
//       ⚠ EL DEFECTO DE LA v85: las claves nuevas se llamaban 'casa.r.ruido.t'
//       y el editor guarda con updateDoc, que lee CADA PUNTO del camino como
//       un nivel de anidamiento. Se habrían guardado en textos→es→casa→r→
//       ruido→t mientras el sitio lee la clave literal: el texto se guarda,
//       dice "✓ Sitio actualizado" y no se muestra nunca. Todas las claves
//       pasan a guión bajo ('casa_r_ruido_t') y editar.html se niega a
//       guardar una clave con punto en vez de fallar callado.
//       Además: el silencio pasa a ser de 0:00 a 8:00, y 'Editar el sitio'
//       entra a la barra (antes solo se llegaba desde Cabañas).
// v85 (27-ago-2026) — NACE LA PÁGINA DEL ACUERDO. El sitio público suma
//       'la-casa.html' en la RAÍZ: horarios, qué hay en la propiedad y el
//       acuerdo de convivencia, en los tres idiomas y editable encima del
//       sitio como la portada. La portada suma su resumen y el enlace.
//       'textos-sitio.js' pasa de 33 a 108 claves por idioma — POR ESO sube
//       la VERSION: ese archivo SÍ está en este SHELL. 'la-casa.html' NO
//       entra al SHELL y no puede: vive en la raíz, fuera del scope de
//       /interno/, igual que index.html de la raíz (ver v80).
//       Y editar.html suma el selector de página: sin él la página nueva
//       quedaba escrita y sin forma de corregirla.
// v84 (19-ago-2026) — LOS AVISOS DE ACTIVIDADES NO EXISTÍAN: se construyen.
//       Dos llaves nuevas en Mis avisos ('te asignaron una actividad' y
//       'actividad nueva del equipo') y el disparo en actividades.html. Más
//       un SIMULACRO que corre el mismo CV2.avisar y dice, persona por
//       persona, a quién le llega y por qué no. 'keepalive' en los dos
//       envíos: el aviso ya no muere si se cambia de página. Y el Inicio deja
//       de mostrar lo eliminado. nucleo.js + avisos.html + actividades.html +
//       index.html.
// v83 (19-ago-2026) — VOLVER ES VOLVER AL MISMO LUGAR. Salir de la Agenda a
//       editar una actividad y cerrar el formulario dejaba a la persona en
//       Actividades. Ahora los dos caminos —editar y crear— devuelven a la
//       Agenda, a la misma vista, la misma semana y el mismo punto de la
//       lista. agenda.html + actividades.html.
// v82 (19-ago-2026) — LA AGENDA SE ARMA SIN SALIR DE LA AGENDA. El árbol de
//       origen deja de venir todo desplegado: las ramas se pliegan y lo
//       plegado se recuerda. Y cada proyecto y cada actividad tienen un + que
//       lleva al formulario de Actividades con el padre ya elegido y vuelve
//       acá al guardar. agenda.html + actividades.html.
// v81 (19-ago-2026) — ELIMINAR YA NO BORRA. Una actividad se elimina con o sin
//       sub-ítems: se marca 'eliminado' y la rama entera desaparece de la
//       vista. Queda en la PAPELERA, que solo ve el administrador, y desde ahí
//       se vuelve a habilitar entera con una escritura o se borra de verdad.
//       actividades.html.
// v80 (18-ago-2026) — EL SITIO SE EDITA ENCIMA DEL SITIO. Nace editar.html:
//       el sitio público real, dentro de un marco, con los textos abiertos
//       para escribir y las fotos cambiables de un toque. Entra al SHELL.
//       El sitio (index.html de la RAÍZ, que NO está en este shell porque
//       vive fuera del scope de /interno/) suma el modo ?edit=1.
// v79 (7-ago-2026) — ⚠ EL DÍA DE HOY se calculaba en UTC: desde las 21:00 de
//       cada noche el sistema entero creía que ya era mañana. nucleo.js,
//       reservas-core.js, actividades.html y el index.html de la RAÍZ.
// v78 — panel de Airbnb: las dos direcciones de cada cabaña en
//       un solo lugar. Las direcciones .ics pasan a config/airbnb.
// v77 — Airbnb se lee por iCal DIRECTO, sin Google Calendar en
//       el medio, y publicamos nuestro propio .ics por cabaña para que Airbnb
//       bloquee las fechas solo. reservas-core.js + reservas.html.
// v76 — el detalle de una actividad pasa a VENTANA EMERGENTE, y
//       una limpieza muestra los datos de SU RESERVA: quién entra, cuántos,
//       a qué hora y qué pidieron. actividades.html.
// v75 — cada compra muestra su ruta entera: proyecto › … › lista.
// v74 — las COMPRAS pasan a servir para algo: la descripción de
//       una actividad-compra es la lista (una cosa por línea), y el filtro
//       🛒 Compras junta todo por lugar. actividades.html.
// v73 — la agenda se arma con CASILLAS y lo que no tiene fecha
//       flota en hoy. Y una revisión de todos los archivos encontró un
//       'getDoc' sin importar en reservas.html: reventaba al abrir un pago.
// v72 — la agenda tiene DOS vistas: Mi semana y el árbol de
//       Actividades. Se arrastra de una a la otra. El botón 📅 sale de
//       actividades.html: agregaba sin fecha y quedaba invisible.
// v71 — la agenda se arma ARRASTRANDO: franjas mañana/tarde,
//       pestañas fijas que son destino, y nota personal por actividad.
// v70 — la agenda pasa a ser SEMANAL, con hora por actividad,
//       tramos de varios días y un botón por persona para elegir qué ver.
//       agenda.html + actividades.html + nucleo.js.
// v69 — nace agenda.html: las actividades de cada uno por
//       CUÁNDO tocan. Entra al SHELL y a la barra de navegación.
// v68 — los modales de inventario de actividades.html tenían
//       'padding: 0' heredado y NINGÚN desplazamiento: con un inventario
//       largo el botón de confirmar quedaba fuera de la pantalla.
// v67 — las limpiezas se ordenan por FECHA dentro de su
//       proyecto y llevan marca propia (🧹 📤 🛒); el enlace del cronómetro
//       andando lleva a SU actividad. actividades.html + index.html.
// v66 — actividades.html: el Stop del cronómetro pregunta
//       siempre si la tarea quedó terminada, y cerrar una limpieza con el
//       reloj abre el control de check-out igual que con el botón ✓.
// v65 — index.html: una línea por ACUERDO, no por cabaña.
// v64 — manual.html: acuerdos, avisos, monedas y el gesto nuevo
//       de Actividades.
// v63 — las cabañas del acuerdo adoptan .cv-nodo:
//       design-system.css + reservas.html.
// v62 — árbol de nodos: design-system.css + actividades.html.
// v61 — el chat dispara los avisos: comunicacion.html.
// v60 — tanda de acuerdos: reservas.html, reservas-core.js, calendario.html,
//       nucleo.js.
// Subir la VERSION no es un trámite: al activarse, el 'activate' borra TODAS
// las cachés que no sean esta, y esa es la única forma segura de que un
// teléfono deje de servir la mezcla de archivos viejos y nuevos.
const VERSION = 'cv2-shell-v103';

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
  './editar.html',
  './traducir.html',
  './fotos.html',
  './espacios.html',
  './calendario.html',
  './agenda.html',
  './clientes.html',
  './dinero.html',
  './balance.html',
  './fiscal.html',
  './reservas-core.js',
  './horas-stats.html',
  './recuerdos.html',
  './opiniones.html',
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
