// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — textos-sitio.js
//  Textos por defecto del SITIO PÚBLICO, en los tres idiomas.
//
//  FUENTE ÚNICA. Lo importan TRES lados:
//   · index.html de la raíz (la portada).
//   · la-casa_html de la raíz (el acuerdo de convivencia) — desde T11.45.
//   · interno/cabanas.html (el panel) — los muestra como texto de fondo
//     de cada campo, así se ve qué dice el sitio HOY antes de editarlo.
//
//  Antes vivían dentro del sitio público y el panel no los conocía: por eso
//  el editor abría con todos los campos en blanco aunque el sitio mostrara
//  texto, y no había forma de saber de dónde se partía (T11.4).
//
//  Prioridad al mostrar en el sitio: config/sitio → este archivo → la clave.
//
//  Las claves que el FORMULARIO de cabanas.html deja editar son solo nueve
//  (ver EDITABLES abajo). El EDITOR VISUAL (interno/editar.html) edita
//  cualquier cosa que lleve data-t, así que todas las claves 'casa.*' se
//  escriben desde ahí, encima del sitio. Son dos caminos distintos y no hay
//  que confundirlos: sumar una clave acá NO la agrega al formulario.
//
//  ⚠⚠ LAS CLAVES NO PUEDEN LLEVAR PUNTO. NUNCA. ⚠⚠
//  El editor guarda con updateDoc y el camino 'textos.es.LACLAVE'. Firestore
//  lee CADA punto de ese camino como un nivel de anidamiento. Una clave
//  llamada 'casa.r.ruido.t' se guardaría como
//      textos → es → casa → r → ruido → t
//  mientras el sitio lee la clave LITERAL TEXTOS.es['casa.r.ruido.t'], que no
//  existe. Resultado: el texto se guarda bien, no da ningún error, y el sitio
//  sigue mostrando el del diccionario para siempre. Es de los fallos peores
//  que hay — se escribe, se guarda, dice "✓ Sitio actualizado" y no pasa nada.
//  Por eso las claves de la página 'La casa' se separan con GUIÓN BAJO:
//  'casa_r_ruido_t', no 'casa.r.ruido.t'. editar.html tiene además una
//  defensa que se niega a guardar una clave con punto y lo dice (T11.46).
//
//  ⚠ TODA clave que el sitio use con data-t o t() TIENE que existir acá, en
//  los tres idiomas. Si falta, t() cae hasta su último respaldo y escribe
//  EL NOMBRE DE LA CLAVE en la pantalla: el pie del sitio mostró la palabra
//  suelta "recuerdos" en vez de la frase durante todo el tiempo que faltó
//  'recuerdos' en esta tabla (T11.16). El fallo no da error en ningún lado
//  — se ve, y solo si alguien mira.
//
//  ── SOBRE LAS LISTAS (T11.45) ──────────────────────────────────
//  Las listas de la página 'La casa' NO son arrays: cada renglón es su
//  propia clave ('casa_lp_1', 'casa_lp_2'…). Es a propósito. Un array en
//  config/sitio habría obligado a inventar un mecanismo de edición nuevo,
//  a codificarlo para Firestore y a que el traductor lo tratara como caso
//  especial. Con una clave por renglón, el editor visual y el traductor
//  que ya existen los toman sin una línea de código nueva.
//  El precio: la CANTIDAD de renglones vive en el HTML. Para agregar uno
//  hay que tocar la página. Para un reglamento, que cambia una vez por
//  año, es el precio correcto.
//
//  ── SOBRE LO QUE VARÍA POR APARTAMENTO ─────────────────────────
//  El aire acondicionado, la capacidad y el acceso (escalera o planta baja)
//  NO están acá y no pueden estarlo: son distintos en cada apartamento y
//  escribirlos en la página general dejaría mal descritos a dos de tres.
//  Van en 'cabanas/{id}.amenities', que el index ya pinta bajo cada ficha.
//  La clave 'casa_varia_p' es la que manda a mirar ahí.
// ═══════════════════════════════════════════════════════════════

export const T = {

  /* ─────────────────────────── PORTUGUÊS ─────────────────────── */
  pt: {
    consultar:'Consultar', titulo:'A três quadras do mar, cercado de verde',
    bajada:'Cabanas e apartamentos em Canasvieiras, Florianópolis. Piscina, churrasqueira e espaço para toda a família.',
    c1:'Piscina', c2:'Churrasqueira', c3:'3 quadras do mar',
    tCabanas:'Nossos espaços', tComunes:'Áreas comuns', tConsulta:'Consultar disponibilidade',
    lCabana:'Espaço', lIn:'Entrada', lOut:'Saída', lPax:'Pessoas',
    elegir:'Escolha o espaço e as datas.', pedir:'Pedir orçamento pelo WhatsApp',
    cargando:'Carregando…', pie:'Reservas e consultas pelo WhatsApp.', panel:'Acesso da equipe',
    libre:'Disponível nessas datas', ocupado:'Ocupado nessas datas',
    lOcupado:'Ocupado', lElegido:'Suas datas', elegirIn:'Escolha o dia de entrada',
    recuerdos:'Lembranças dos nossos hóspedes',
    elegirOut:'Agora o dia de saída', chocan:'Há dias ocupados no meio. Escolha outro período.',
    noches:'noites', hasta:'até', pers:'pessoas', desde:'a partir de', noite:'a noite',

    // ── Resumo na portada ──
    'casa_res_t':'Como funciona a casa',
    'casa_res_p':'Horários, o que tem e o nosso acordo de convivência.',
    'casa_res_c1':'Entrada 14h · saída 10h',
    'casa_res_c2':'Silêncio da meia-noite às 8h',
    'casa_res_c3':'Não se fuma dentro',
    'casa_res_c4':'Sem animais de estimação',
    'casa_res_link':'Ver tudo antes de chegar',

    // ── Página "Como funciona a casa" ──
    'casa_volver':'Voltar ao início',
    'casa_titulo':'Como funciona a casa',
    'casa_bajada':'O que convém saber antes de chegar: o que tem, como nos organizamos e em que horários esperamos você.',

    'casa_prop_t':'A propriedade',
    'casa_prop_p1':'No terreno há vários apartamentos. Três são alugados por temporada; os outros têm inquilinos permanentes. Nós também moramos aqui.',
    'casa_prop_p2':'Cada apartamento tem a sua privacidade. Os espaços externos são compartilhados por todos, então sempre há movimento de gente.',
    'casa_prop_p3':'Estamos a três quadras da praia de Canasvieiras, num terreno arborizado.',

    'casa_comunes_t':'Os espaços compartilhados',
    'casa_comunes_p1':'Lá fora estão a piscina, a churrasqueira, o terraço coberto com redes, a sala com TV, os jogos de mesa, a lavanderia e o estacionamento fechado. São de uso compartilhado e estão aí para serem usados.',

    'casa_hay_t':'O que tem',
    'casa_g_propiedad':'Na propriedade, para todos',
    'casa_lp_1':'Piscina',
    'casa_lp_2':'Churrasqueira',
    'casa_lp_3':'Terraço coberto com redes',
    'casa_lp_4':'Mesa ao ar livre',
    'casa_lp_5':'Chuveiro externo',
    'casa_lp_6':'Máquina de lavar, sem custo',
    'casa_lp_7':'Varal',
    'casa_lp_8':'Estacionamento fechado, sem custo',
    'casa_lp_9':'Wi-Fi',
    'casa_lp_10':'TV e jogos de mesa na sala comum',
    'casa_lp_11':'Caiaque',

    'casa_g_depto':'Em cada apartamento',
    'casa_ld_1':'Cozinha equipada: geladeira, forno, torradeira, panelas, frigideiras, óleo, sal e pimenta',
    'casa_ld_2':'Pratos, copos, xícaras e talheres',
    'casa_ld_3':'Roupa de cama',
    'casa_ld_4':'Armário e cabides',
    'casa_ld_5':'Água quente',
    'casa_ld_6':'Ventiladores',

    'casa_varia_t':'O que muda de um apartamento para outro',
    'casa_varia_p':'Não são todos iguais. O ar-condicionado, a capacidade e se o acesso é por escada ou no nível do chão estão na ficha de cada um.',

    'casa_nohay_t':'O que não tem',
    'casa_nohay_1':'Secadora de roupa. Há máquina de lavar e varal.',

    'casa_hor_t':'Horários',
    'casa_hor_kin':'Entrada',
    'casa_hor_in':'a partir das 14h',
    'casa_hor_kout':'Saída',
    'casa_hor_out':'até as 10h',
    'casa_hor_nota':'Se precisar de outro horário, escreva para nós: quando o apartamento está livre, quase sempre dá.',

    'casa_recibe_t':'Quem recebe você',
    'casa_recibe_p1':'Na temporada estamos nós. Fora da temporada quem recebe é o Esteban, coanfitrião da casa.',

    'casa_reglas_t':'Nosso acordo de convivência',
    'casa_reglas_bajada':'Somos várias famílias dividindo o mesmo terreno, algumas o ano inteiro. Estas são as coisas que pedimos, com o motivo de cada uma.',

    'casa_r_pax_t':'A capacidade de cada apartamento está na sua ficha',
    'casa_r_pax_p':'Está definida pelo tamanho real do espaço. Se forem mais pessoas, escreva antes: às vezes dá para acomodar em outro apartamento.',
    'casa_r_puerta_t':'Porta externa trancada',
    'casa_r_puerta_p':'É uma propriedade aberta e moram famílias aqui o ano inteiro.',
    'casa_r_visitas_t':'Só pessoas hospedadas',
    'casa_r_visitas_p':'Se quiser receber alguém, consulte antes.',
    'casa_r_ruido_t':'Silêncio da meia-noite às 8h',
    'casa_r_ruido_p':'Há gente dormindo a poucos metros, e alguns trabalham no dia seguinte.',
    'casa_r_fiestas_t':'Sem festas nem eventos',
    'casa_r_fiestas_p':'O terreno é pequeno: uma festa num apartamento se escuta em todos.',
    'casa_r_fumar_t':'Não se fuma dentro',
    'casa_r_fumar_p':'O cheiro fica nas cortinas e nos colchões, e sobra para quem vem depois. Lá fora, sem problema.',
    'casa_r_ducha_t':'Chuveiro externo antes da piscina e ao voltar da praia',
    'casa_r_ducha_p':'O protetor solar estraga a água da piscina e a areia entope o encanamento.',
    'casa_r_mascotas_t':'Sem animais de estimação',
    'casa_r_mascotas_p':'Com vários apartamentos dividindo pátio e piscina não temos como garantir que sirva para todos.',
    'casa_r_luces_t':'Luzes e ventiladores desligados ao sair',
    'casa_r_luces_p':'Na temporada a conta dispara.',
    'casa_r_fotos_t':'Fotografia ou vídeo comercial, só com autorização',
    'casa_r_fotos_p':'Uso pessoal, o quanto quiser.',

    'casa_camaras_t':'Câmeras',
    'casa_camaras_p':'Há câmeras em dois lugares: o portão da rua e o estacionamento. Não há câmeras dentro dos apartamentos, nem na piscina, nem no terraço.',

    'casa_largas_t':'Estadias longas',
    'casa_largas_p':'Recebemos estadias de 28 dias ou mais. Escreva para nós e montamos um preço.',

    'casa_dudas_t':'Alguma dúvida?',
    'casa_dudas_p':'Escreva pelo WhatsApp. Preferimos mil vezes resolver antes da sua chegada do que depois.',
    'casa_version':'Vigente desde agosto de 2026.'
  },

  /* ─────────────────────────── ESPAÑOL ───────────────────────── */
  es: {
    consultar:'Consultar', titulo:'A tres cuadras del mar, rodeado de verde',
    bajada:'Cabañas y departamentos en Canasvieiras, Florianópolis. Piscina, parrilla y lugar para toda la familia.',
    c1:'Piscina', c2:'Parrilla', c3:'3 cuadras del mar',
    tCabanas:'Nuestros espacios', tComunes:'Áreas comunes', tConsulta:'Consultar disponibilidad',
    lCabana:'Espacio', lIn:'Entrada', lOut:'Salida', lPax:'Personas',
    elegir:'Elegí el espacio y las fechas.', pedir:'Pedir presupuesto por WhatsApp',
    cargando:'Cargando…', pie:'Reservas y consultas por WhatsApp.', panel:'Acceso del equipo',
    libre:'Disponible en esas fechas', ocupado:'Ocupado en esas fechas',
    lOcupado:'Ocupado', lElegido:'Tus fechas', elegirIn:'Elegí el día de entrada',
    recuerdos:'Recuerdos de nuestros huéspedes',
    elegirOut:'Ahora el día de salida', chocan:'Hay días ocupados en el medio. Elegí otro período.',
    noches:'noches', hasta:'hasta', pers:'personas', desde:'desde', noite:'la noche',

    // ── Resumen en la portada ──
    'casa_res_t':'Cómo funciona la casa',
    'casa_res_p':'Horarios, qué hay y nuestro acuerdo de convivencia.',
    'casa_res_c1':'Entrada 14:00 · salida 10:00',
    'casa_res_c2':'Silencio de 0:00 a 8:00',
    'casa_res_c3':'No se fuma adentro',
    'casa_res_c4':'Sin mascotas',
    'casa_res_link':'Ver todo antes de llegar',

    // ── Página "Cómo funciona la casa" ──
    'casa_volver':'Volver al inicio',
    'casa_titulo':'Cómo funciona la casa',
    'casa_bajada':'Lo que conviene saber antes de llegar: qué hay, cómo nos organizamos y en qué horarios te esperamos.',

    'casa_prop_t':'La propiedad',
    'casa_prop_p1':'En el predio hay varios apartamentos. Tres se alquilan por temporada; los otros tienen inquilinos permanentes. Nosotros también vivimos acá.',
    'casa_prop_p2':'Cada apartamento tiene su privacidad. Los espacios de afuera son compartidos entre todos, así que siempre hay movimiento de gente.',
    'casa_prop_p3':'Estamos a tres cuadras de la playa de Canasvieiras, en un predio arbolado.',

    'casa_comunes_t':'Los espacios compartidos',
    'casa_comunes_p1':'Afuera están la piscina, el asador, la terraza techada con hamacas, el living con TV, los juegos de mesa, el lavadero y el estacionamiento cerrado. Son de uso compartido y están para usarlos.',

    'casa_hay_t':'Qué hay',
    'casa_g_propiedad':'En la propiedad, para todos',
    'casa_lp_1':'Piscina',
    'casa_lp_2':'Asador',
    'casa_lp_3':'Terraza techada con hamacas',
    'casa_lp_4':'Comedor al aire libre',
    'casa_lp_5':'Ducha exterior',
    'casa_lp_6':'Lavarropas sin cargo',
    'casa_lp_7':'Tendedero',
    'casa_lp_8':'Estacionamiento cerrado, sin cargo',
    'casa_lp_9':'Wi-Fi',
    'casa_lp_10':'Televisión y juegos de mesa en el living común',
    'casa_lp_11':'Kayak',

    'casa_g_depto':'En cada apartamento',
    'casa_ld_1':'Cocina equipada: heladera, horno, tostadora, ollas, sartenes, aceite, sal y pimienta',
    'casa_ld_2':'Platos, vasos, tazas y cubiertos',
    'casa_ld_3':'Ropa de cama',
    'casa_ld_4':'Placard y perchas',
    'casa_ld_5':'Agua caliente',
    'casa_ld_6':'Ventiladores',

    'casa_varia_t':'Lo que cambia de un apartamento a otro',
    'casa_varia_p':'No todos son iguales. El aire acondicionado, la capacidad y si el acceso es por escalera o a nivel del suelo están en la ficha de cada uno.',

    'casa_nohay_t':'Lo que no hay',
    'casa_nohay_1':'Secadora de ropa. Hay lavarropas y tendedero.',

    'casa_hor_t':'Horarios',
    'casa_hor_kin':'Llegada',
    'casa_hor_in':'desde las 14:00',
    'casa_hor_kout':'Salida',
    'casa_hor_out':'hasta las 10:00',
    'casa_hor_nota':'Si necesitás otro horario, escribinos: cuando el apartamento está libre, casi siempre se puede.',

    'casa_recibe_t':'Quién te recibe',
    'casa_recibe_p1':'En temporada estamos nosotros. Fuera de temporada te recibe Esteban, coanfitrión de la casa.',

    'casa_reglas_t':'Nuestro acuerdo de convivencia',
    'casa_reglas_bajada':'Somos varias familias compartiendo un mismo predio, algunas todo el año. Estas son las cosas que pedimos, con el motivo de cada una.',

    'casa_r_pax_t':'La capacidad de cada apartamento está en su ficha',
    'casa_r_pax_p':'Está fijada por el tamaño real del espacio. Si son más personas, escribinos antes: a veces se puede acomodar en otro apartamento.',
    'casa_r_puerta_t':'Puerta exterior cerrada con llave',
    'casa_r_puerta_p':'Es una propiedad abierta y viven familias acá todo el año.',
    'casa_r_visitas_t':'Solo personas alojadas',
    'casa_r_visitas_p':'Si querés recibir a alguien, consultanos antes.',
    'casa_r_ruido_t':'Silencio entre las 0:00 y las 8:00',
    'casa_r_ruido_p':'Hay gente durmiendo a pocos metros, y algunos trabajan al día siguiente.',
    'casa_r_fiestas_t':'Sin fiestas ni eventos',
    'casa_r_fiestas_p':'El predio es chico: una fiesta en un apartamento se escucha en todos.',
    'casa_r_fumar_t':'No se fuma adentro',
    'casa_r_fumar_p':'El olor queda en cortinas y colchones, y lo hereda el que viene después. Afuera, sin problema.',
    'casa_r_ducha_t':'Ducha exterior antes de la piscina y al volver de la playa',
    'casa_r_ducha_p':'El protector solar arruina el agua de la piscina y la arena tapa las cañerías.',
    'casa_r_mascotas_t':'Sin mascotas',
    'casa_r_mascotas_p':'Con varios apartamentos compartiendo patio y piscina no podemos garantizar que le venga bien a todos.',
    'casa_r_luces_t':'Luces y ventiladores apagados al salir',
    'casa_r_luces_p':'En temporada la cuenta se dispara.',
    'casa_r_fotos_t':'Fotografía o video comercial, solo con permiso',
    'casa_r_fotos_p':'Uso personal, todo el que quieras.',

    'casa_camaras_t':'Cámaras',
    'casa_camaras_p':'Hay cámaras en dos lugares: el portón que da a la calle y el estacionamiento. No hay cámaras dentro de los apartamentos, ni en la piscina, ni en la terraza.',

    'casa_largas_t':'Estadías largas',
    'casa_largas_p':'Recibimos estadías de 28 días o más. Escribinos y armamos un precio.',

    'casa_dudas_t':'¿Alguna duda?',
    'casa_dudas_p':'Escribinos por WhatsApp. Preferimos mil veces resolver algo antes de que llegues que después.',
    'casa_version':'Vigente desde agosto de 2026.'
  },

  /* ─────────────────────────── ENGLISH ───────────────────────── */
  en: {
    consultar:'Enquire', titulo:'Three blocks from the sea, surrounded by green',
    bajada:'Cabins and apartments in Canasvieiras, Florianópolis. Pool, barbecue and room for the whole family.',
    c1:'Pool', c2:'Barbecue', c3:'3 blocks from the sea',
    tCabanas:'Our places', tComunes:'Common areas', tConsulta:'Check availability',
    lCabana:'Place', lIn:'Check-in', lOut:'Check-out', lPax:'Guests',
    elegir:'Choose a place and your dates.', pedir:'Ask for a quote on WhatsApp',
    cargando:'Loading…', pie:'Bookings and enquiries via WhatsApp.', panel:'Team access',
    libre:'Available on those dates', ocupado:'Not available on those dates',
    lOcupado:'Taken', lElegido:'Your dates', elegirIn:'Pick your arrival day',
    recuerdos:'Memories from our guests',
    elegirOut:'Now the departure day', chocan:'There are booked days in between. Pick another period.',
    noches:'nights', hasta:'to', pers:'guests', desde:'from', noite:'per night',

    // ── Summary on the front page ──
    'casa_res_t':'How the house works',
    'casa_res_p':'Times, what you will find, and our living-together agreement.',
    'casa_res_c1':'Check-in 2pm · check-out 10am',
    'casa_res_c2':'Quiet hours midnight to 8am',
    'casa_res_c3':'No smoking indoors',
    'casa_res_c4':'No pets',
    'casa_res_link':'Read it all before you arrive',

    // ── "How the house works" page ──
    'casa_volver':'Back to home',
    'casa_titulo':'How the house works',
    'casa_bajada':'What is worth knowing before you arrive: what there is, how we organise ourselves, and the times we expect you.',

    'casa_prop_t':'The property',
    'casa_prop_p1':'There are several apartments on the grounds. Three are rented by the season; the others have permanent tenants. We live here too.',
    'casa_prop_p2':'Each apartment has its own privacy. The outdoor areas are shared by everyone, so there are always people about.',
    'casa_prop_p3':'We are three blocks from Canasvieiras beach, on wooded grounds.',

    'casa_comunes_t':'The shared areas',
    'casa_comunes_p1':'Outside there is the pool, the barbecue, the covered terrace with hammocks, the lounge with a TV, board games, the laundry and the gated parking. They are shared, and they are there to be used.',

    'casa_hay_t':'What you will find',
    'casa_g_propiedad':'On the property, for everyone',
    'casa_lp_1':'Pool',
    'casa_lp_2':'Barbecue',
    'casa_lp_3':'Covered terrace with hammocks',
    'casa_lp_4':'Outdoor dining table',
    'casa_lp_5':'Outdoor shower',
    'casa_lp_6':'Washing machine, free',
    'casa_lp_7':'Clothesline',
    'casa_lp_8':'Gated parking, free',
    'casa_lp_9':'Wi-Fi',
    'casa_lp_10':'TV and board games in the shared lounge',
    'casa_lp_11':'Kayak',

    'casa_g_depto':'In every apartment',
    'casa_ld_1':'Equipped kitchen: fridge, oven, toaster, pots, pans, oil, salt and pepper',
    'casa_ld_2':'Plates, glasses, cups and cutlery',
    'casa_ld_3':'Bed linen',
    'casa_ld_4':'Wardrobe and hangers',
    'casa_ld_5':'Hot water',
    'casa_ld_6':'Fans',

    'casa_varia_t':'What differs from one apartment to another',
    'casa_varia_p':'They are not all the same. Air conditioning, capacity, and whether access is by stairs or at ground level are listed on each apartment.',

    'casa_nohay_t':'What there is not',
    'casa_nohay_1':'No tumble dryer. There is a washing machine and a clothesline.',

    'casa_hor_t':'Times',
    'casa_hor_kin':'Check-in',
    'casa_hor_in':'from 2pm',
    'casa_hor_kout':'Check-out',
    'casa_hor_out':'by 10am',
    'casa_hor_nota':'If you need a different time, write to us: when the apartment is free, it is almost always possible.',

    'casa_recibe_t':'Who welcomes you',
    'casa_recibe_p1':'In high season it is us. Off season Esteban welcomes you; he is co-host of the house.',

    'casa_reglas_t':'Our living-together agreement',
    'casa_reglas_bajada':'We are several families sharing the same grounds, some of them all year round. These are the things we ask for, each with its reason.',

    'casa_r_pax_t':'Each apartment lists its own capacity',
    'casa_r_pax_p':'It is set by the real size of the space. If you are more people, write to us first: sometimes another apartment can take you.',
    'casa_r_puerta_t':'Keep the outer door locked',
    'casa_r_puerta_p':'The property is open to the street and families live here all year.',
    'casa_r_visitas_t':'Registered guests only',
    'casa_r_visitas_p':'If you would like to have someone over, ask us first.',
    'casa_r_ruido_t':'Quiet between midnight and 8am',
    'casa_r_ruido_p':'People are sleeping a few metres away, and some of them work the next day.',
    'casa_r_fiestas_t':'No parties or events',
    'casa_r_fiestas_p':'The grounds are small: a party in one apartment is heard in all of them.',
    'casa_r_fumar_t':'No smoking indoors',
    'casa_r_fumar_p':'The smell stays in the curtains and mattresses, and the next guest inherits it. Outdoors is fine.',
    'casa_r_ducha_t':'Outdoor shower before the pool and after the beach',
    'casa_r_ducha_p':'Sunscreen ruins the pool water and sand blocks the drains.',
    'casa_r_mascotas_t':'No pets',
    'casa_r_mascotas_p':'With several apartments sharing a yard and a pool, we cannot promise it suits everyone.',
    'casa_r_luces_t':'Lights and fans off when you go out',
    'casa_r_luces_p':'In high season the bill climbs fast.',
    'casa_r_fotos_t':'Commercial photo or video by arrangement only',
    'casa_r_fotos_p':'Personal use, as much as you like.',

    'casa_camaras_t':'Cameras',
    'casa_camaras_p':'There are cameras in two places: the street gate and the parking area. There are no cameras inside the apartments, nor at the pool, nor on the terrace.',

    'casa_largas_t':'Long stays',
    'casa_largas_p':'We take stays of 28 nights or more. Write to us and we will work out a price.',

    'casa_dudas_t':'Any questions?',
    'casa_dudas_p':'Write to us on WhatsApp. We would far rather sort something out before you arrive than after.',
    'casa_version':'In force since August 2026.'
  }
};

// Las nueve claves editables desde el FORMULARIO de cabanas.html, en el orden
// en que aparecen en la portada de arriba hacia abajo.
// Ojo: esto NO limita al editor visual, que edita cualquier data-t.
export const EDITABLES = [
  'titulo', 'bajada', 'c1', 'c2', 'c3',
  'tCabanas', 'tComunes', 'tConsulta', 'pie'
];
