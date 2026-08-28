// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — textos-sitio.js
//  Textos por defecto del SITIO PÚBLICO, en los tres idiomas.
//
//  FUENTE ÚNICA. Lo importan TRES lados:
//   · index.html de la raíz (la portada).
//   · la-casa.html de la raíz (el acuerdo de convivencia) — desde T11.45.
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
//  ⚠ TODA clave que el sitio use con data-t o t() TIENE que existir acá, en
//  los tres idiomas. Si falta, t() cae hasta su último respaldo y escribe
//  EL NOMBRE DE LA CLAVE en la pantalla: el pie del sitio mostró la palabra
//  suelta "recuerdos" en vez de la frase durante todo el tiempo que faltó
//  'recuerdos' en esta tabla (T11.16). El fallo no da error en ningún lado
//  — se ve, y solo si alguien mira.
//
//  ── SOBRE LAS LISTAS (T11.45) ──────────────────────────────────
//  Las listas de la página 'La casa' NO son arrays: cada renglón es su
//  propia clave ('casa.lp.1', 'casa.lp.2'…). Es a propósito. Un array en
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
//  La clave 'casa.varia.p' es la que manda a mirar ahí.
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
    'casa.res.t':'Como funciona a casa',
    'casa.res.p':'Horários, o que tem e o nosso acordo de convivência.',
    'casa.res.c1':'Entrada 14h · saída 10h',
    'casa.res.c2':'Silêncio das 23h às 8h',
    'casa.res.c3':'Não se fuma dentro',
    'casa.res.c4':'Sem animais de estimação',
    'casa.res.link':'Ver tudo antes de chegar',

    // ── Página "Como funciona a casa" ──
    'casa.volver':'Voltar ao início',
    'casa.titulo':'Como funciona a casa',
    'casa.bajada':'O que convém saber antes de chegar: o que tem, como nos organizamos e em que horários esperamos você.',

    'casa.prop.t':'A propriedade',
    'casa.prop.p1':'No terreno há vários apartamentos. Três são alugados por temporada; os outros têm inquilinos permanentes. Nós também moramos aqui.',
    'casa.prop.p2':'Cada apartamento tem a sua privacidade. Os espaços externos são compartilhados por todos, então sempre há movimento de gente.',
    'casa.prop.p3':'Estamos a três quadras da praia de Canasvieiras, num terreno arborizado.',

    'casa.comunes.t':'Os espaços compartilhados',
    'casa.comunes.p1':'Lá fora estão a piscina, a churrasqueira, o terraço coberto com redes, a sala com TV, os jogos de mesa, a lavanderia e o estacionamento fechado. São de uso compartilhado e estão aí para serem usados.',

    'casa.hay.t':'O que tem',
    'casa.g.propiedad':'Na propriedade, para todos',
    'casa.lp.1':'Piscina',
    'casa.lp.2':'Churrasqueira',
    'casa.lp.3':'Terraço coberto com redes',
    'casa.lp.4':'Mesa ao ar livre',
    'casa.lp.5':'Chuveiro externo',
    'casa.lp.6':'Máquina de lavar, sem custo',
    'casa.lp.7':'Varal',
    'casa.lp.8':'Estacionamento fechado, sem custo',
    'casa.lp.9':'Wi-Fi',
    'casa.lp.10':'TV e jogos de mesa na sala comum',
    'casa.lp.11':'Caiaque',

    'casa.g.depto':'Em cada apartamento',
    'casa.ld.1':'Cozinha equipada: geladeira, forno, torradeira, panelas, frigideiras, óleo, sal e pimenta',
    'casa.ld.2':'Pratos, copos, xícaras e talheres',
    'casa.ld.3':'Roupa de cama',
    'casa.ld.4':'Armário e cabides',
    'casa.ld.5':'Água quente',
    'casa.ld.6':'Ventiladores',

    'casa.varia.t':'O que muda de um apartamento para outro',
    'casa.varia.p':'Não são todos iguais. O ar-condicionado, a capacidade e se o acesso é por escada ou no nível do chão estão na ficha de cada um.',

    'casa.nohay.t':'O que não tem',
    'casa.nohay.1':'Secadora de roupa. Há máquina de lavar e varal.',

    'casa.hor.t':'Horários',
    'casa.hor.kin':'Entrada',
    'casa.hor.in':'a partir das 14h',
    'casa.hor.kout':'Saída',
    'casa.hor.out':'até as 10h',
    'casa.hor.nota':'Se precisar de outro horário, escreva para nós: quando o apartamento está livre, quase sempre dá.',

    'casa.recibe.t':'Quem recebe você',
    'casa.recibe.p1':'Na temporada estamos nós. Fora da temporada quem recebe é o Esteban, coanfitrião da casa.',

    'casa.reglas.t':'Nosso acordo de convivência',
    'casa.reglas.bajada':'Somos várias famílias dividindo o mesmo terreno, algumas o ano inteiro. Estas são as coisas que pedimos, com o motivo de cada uma.',

    'casa.r.pax.t':'A capacidade de cada apartamento está na sua ficha',
    'casa.r.pax.p':'Está definida pelo tamanho real do espaço. Se forem mais pessoas, escreva antes: às vezes dá para acomodar em outro apartamento.',
    'casa.r.puerta.t':'Porta externa trancada',
    'casa.r.puerta.p':'É uma propriedade aberta e moram famílias aqui o ano inteiro.',
    'casa.r.visitas.t':'Só pessoas hospedadas',
    'casa.r.visitas.p':'Se quiser receber alguém, consulte antes.',
    'casa.r.ruido.t':'Silêncio das 23h às 8h',
    'casa.r.ruido.p':'Há gente dormindo a poucos metros, e alguns trabalham no dia seguinte.',
    'casa.r.fiestas.t':'Sem festas nem eventos',
    'casa.r.fiestas.p':'O terreno é pequeno: uma festa num apartamento se escuta em todos.',
    'casa.r.fumar.t':'Não se fuma dentro',
    'casa.r.fumar.p':'O cheiro fica nas cortinas e nos colchões, e sobra para quem vem depois. Lá fora, sem problema.',
    'casa.r.ducha.t':'Chuveiro externo antes da piscina e ao voltar da praia',
    'casa.r.ducha.p':'O protetor solar estraga a água da piscina e a areia entope o encanamento.',
    'casa.r.mascotas.t':'Sem animais de estimação',
    'casa.r.mascotas.p':'Com vários apartamentos dividindo pátio e piscina não temos como garantir que sirva para todos.',
    'casa.r.luces.t':'Luzes e ventiladores desligados ao sair',
    'casa.r.luces.p':'Na temporada a conta dispara.',
    'casa.r.fotos.t':'Fotografia ou vídeo comercial, só com autorização',
    'casa.r.fotos.p':'Uso pessoal, o quanto quiser.',

    'casa.camaras.t':'Câmeras',
    'casa.camaras.p':'Há câmeras em dois lugares: o portão da rua e o estacionamento. Não há câmeras dentro dos apartamentos, nem na piscina, nem no terraço.',

    'casa.largas.t':'Estadias longas',
    'casa.largas.p':'Recebemos estadias de 28 dias ou mais. Escreva para nós e montamos um preço.',

    'casa.dudas.t':'Alguma dúvida?',
    'casa.dudas.p':'Escreva pelo WhatsApp. Preferimos mil vezes resolver antes da sua chegada do que depois.',
    'casa.version':'Vigente desde agosto de 2026.'
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
    'casa.res.t':'Cómo funciona la casa',
    'casa.res.p':'Horarios, qué hay y nuestro acuerdo de convivencia.',
    'casa.res.c1':'Entrada 14:00 · salida 10:00',
    'casa.res.c2':'Silencio de 23:00 a 8:00',
    'casa.res.c3':'No se fuma adentro',
    'casa.res.c4':'Sin mascotas',
    'casa.res.link':'Ver todo antes de llegar',

    // ── Página "Cómo funciona la casa" ──
    'casa.volver':'Volver al inicio',
    'casa.titulo':'Cómo funciona la casa',
    'casa.bajada':'Lo que conviene saber antes de llegar: qué hay, cómo nos organizamos y en qué horarios te esperamos.',

    'casa.prop.t':'La propiedad',
    'casa.prop.p1':'En el predio hay varios apartamentos. Tres se alquilan por temporada; los otros tienen inquilinos permanentes. Nosotros también vivimos acá.',
    'casa.prop.p2':'Cada apartamento tiene su privacidad. Los espacios de afuera son compartidos entre todos, así que siempre hay movimiento de gente.',
    'casa.prop.p3':'Estamos a tres cuadras de la playa de Canasvieiras, en un predio arbolado.',

    'casa.comunes.t':'Los espacios compartidos',
    'casa.comunes.p1':'Afuera están la piscina, el asador, la terraza techada con hamacas, el living con TV, los juegos de mesa, el lavadero y el estacionamiento cerrado. Son de uso compartido y están para usarlos.',

    'casa.hay.t':'Qué hay',
    'casa.g.propiedad':'En la propiedad, para todos',
    'casa.lp.1':'Piscina',
    'casa.lp.2':'Asador',
    'casa.lp.3':'Terraza techada con hamacas',
    'casa.lp.4':'Comedor al aire libre',
    'casa.lp.5':'Ducha exterior',
    'casa.lp.6':'Lavarropas sin cargo',
    'casa.lp.7':'Tendedero',
    'casa.lp.8':'Estacionamiento cerrado, sin cargo',
    'casa.lp.9':'Wi-Fi',
    'casa.lp.10':'Televisión y juegos de mesa en el living común',
    'casa.lp.11':'Kayak',

    'casa.g.depto':'En cada apartamento',
    'casa.ld.1':'Cocina equipada: heladera, horno, tostadora, ollas, sartenes, aceite, sal y pimienta',
    'casa.ld.2':'Platos, vasos, tazas y cubiertos',
    'casa.ld.3':'Ropa de cama',
    'casa.ld.4':'Placard y perchas',
    'casa.ld.5':'Agua caliente',
    'casa.ld.6':'Ventiladores',

    'casa.varia.t':'Lo que cambia de un apartamento a otro',
    'casa.varia.p':'No todos son iguales. El aire acondicionado, la capacidad y si el acceso es por escalera o a nivel del suelo están en la ficha de cada uno.',

    'casa.nohay.t':'Lo que no hay',
    'casa.nohay.1':'Secadora de ropa. Hay lavarropas y tendedero.',

    'casa.hor.t':'Horarios',
    'casa.hor.kin':'Llegada',
    'casa.hor.in':'desde las 14:00',
    'casa.hor.kout':'Salida',
    'casa.hor.out':'hasta las 10:00',
    'casa.hor.nota':'Si necesitás otro horario, escribinos: cuando el apartamento está libre, casi siempre se puede.',

    'casa.recibe.t':'Quién te recibe',
    'casa.recibe.p1':'En temporada estamos nosotros. Fuera de temporada te recibe Esteban, coanfitrión de la casa.',

    'casa.reglas.t':'Nuestro acuerdo de convivencia',
    'casa.reglas.bajada':'Somos varias familias compartiendo un mismo predio, algunas todo el año. Estas son las cosas que pedimos, con el motivo de cada una.',

    'casa.r.pax.t':'La capacidad de cada apartamento está en su ficha',
    'casa.r.pax.p':'Está fijada por el tamaño real del espacio. Si son más personas, escribinos antes: a veces se puede acomodar en otro apartamento.',
    'casa.r.puerta.t':'Puerta exterior cerrada con llave',
    'casa.r.puerta.p':'Es una propiedad abierta y viven familias acá todo el año.',
    'casa.r.visitas.t':'Solo personas alojadas',
    'casa.r.visitas.p':'Si querés recibir a alguien, consultanos antes.',
    'casa.r.ruido.t':'Silencio entre las 23:00 y las 8:00',
    'casa.r.ruido.p':'Hay gente durmiendo a pocos metros, y algunos trabajan al día siguiente.',
    'casa.r.fiestas.t':'Sin fiestas ni eventos',
    'casa.r.fiestas.p':'El predio es chico: una fiesta en un apartamento se escucha en todos.',
    'casa.r.fumar.t':'No se fuma adentro',
    'casa.r.fumar.p':'El olor queda en cortinas y colchones, y lo hereda el que viene después. Afuera, sin problema.',
    'casa.r.ducha.t':'Ducha exterior antes de la piscina y al volver de la playa',
    'casa.r.ducha.p':'El protector solar arruina el agua de la piscina y la arena tapa las cañerías.',
    'casa.r.mascotas.t':'Sin mascotas',
    'casa.r.mascotas.p':'Con varios apartamentos compartiendo patio y piscina no podemos garantizar que le venga bien a todos.',
    'casa.r.luces.t':'Luces y ventiladores apagados al salir',
    'casa.r.luces.p':'En temporada la cuenta se dispara.',
    'casa.r.fotos.t':'Fotografía o video comercial, solo con permiso',
    'casa.r.fotos.p':'Uso personal, todo el que quieras.',

    'casa.camaras.t':'Cámaras',
    'casa.camaras.p':'Hay cámaras en dos lugares: el portón que da a la calle y el estacionamiento. No hay cámaras dentro de los apartamentos, ni en la piscina, ni en la terraza.',

    'casa.largas.t':'Estadías largas',
    'casa.largas.p':'Recibimos estadías de 28 días o más. Escribinos y armamos un precio.',

    'casa.dudas.t':'¿Alguna duda?',
    'casa.dudas.p':'Escribinos por WhatsApp. Preferimos mil veces resolver algo antes de que llegues que después.',
    'casa.version':'Vigente desde agosto de 2026.'
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
    'casa.res.t':'How the house works',
    'casa.res.p':'Times, what you will find, and our living-together agreement.',
    'casa.res.c1':'Check-in 2pm · check-out 10am',
    'casa.res.c2':'Quiet hours 11pm to 8am',
    'casa.res.c3':'No smoking indoors',
    'casa.res.c4':'No pets',
    'casa.res.link':'Read it all before you arrive',

    // ── "How the house works" page ──
    'casa.volver':'Back to home',
    'casa.titulo':'How the house works',
    'casa.bajada':'What is worth knowing before you arrive: what there is, how we organise ourselves, and the times we expect you.',

    'casa.prop.t':'The property',
    'casa.prop.p1':'There are several apartments on the grounds. Three are rented by the season; the others have permanent tenants. We live here too.',
    'casa.prop.p2':'Each apartment has its own privacy. The outdoor areas are shared by everyone, so there are always people about.',
    'casa.prop.p3':'We are three blocks from Canasvieiras beach, on wooded grounds.',

    'casa.comunes.t':'The shared areas',
    'casa.comunes.p1':'Outside there is the pool, the barbecue, the covered terrace with hammocks, the lounge with a TV, board games, the laundry and the gated parking. They are shared, and they are there to be used.',

    'casa.hay.t':'What you will find',
    'casa.g.propiedad':'On the property, for everyone',
    'casa.lp.1':'Pool',
    'casa.lp.2':'Barbecue',
    'casa.lp.3':'Covered terrace with hammocks',
    'casa.lp.4':'Outdoor dining table',
    'casa.lp.5':'Outdoor shower',
    'casa.lp.6':'Washing machine, free',
    'casa.lp.7':'Clothesline',
    'casa.lp.8':'Gated parking, free',
    'casa.lp.9':'Wi-Fi',
    'casa.lp.10':'TV and board games in the shared lounge',
    'casa.lp.11':'Kayak',

    'casa.g.depto':'In every apartment',
    'casa.ld.1':'Equipped kitchen: fridge, oven, toaster, pots, pans, oil, salt and pepper',
    'casa.ld.2':'Plates, glasses, cups and cutlery',
    'casa.ld.3':'Bed linen',
    'casa.ld.4':'Wardrobe and hangers',
    'casa.ld.5':'Hot water',
    'casa.ld.6':'Fans',

    'casa.varia.t':'What differs from one apartment to another',
    'casa.varia.p':'They are not all the same. Air conditioning, capacity, and whether access is by stairs or at ground level are listed on each apartment.',

    'casa.nohay.t':'What there is not',
    'casa.nohay.1':'No tumble dryer. There is a washing machine and a clothesline.',

    'casa.hor.t':'Times',
    'casa.hor.kin':'Check-in',
    'casa.hor.in':'from 2pm',
    'casa.hor.kout':'Check-out',
    'casa.hor.out':'by 10am',
    'casa.hor.nota':'If you need a different time, write to us: when the apartment is free, it is almost always possible.',

    'casa.recibe.t':'Who welcomes you',
    'casa.recibe.p1':'In high season it is us. Off season Esteban welcomes you; he is co-host of the house.',

    'casa.reglas.t':'Our living-together agreement',
    'casa.reglas.bajada':'We are several families sharing the same grounds, some of them all year round. These are the things we ask for, each with its reason.',

    'casa.r.pax.t':'Each apartment lists its own capacity',
    'casa.r.pax.p':'It is set by the real size of the space. If you are more people, write to us first: sometimes another apartment can take you.',
    'casa.r.puerta.t':'Keep the outer door locked',
    'casa.r.puerta.p':'The property is open to the street and families live here all year.',
    'casa.r.visitas.t':'Registered guests only',
    'casa.r.visitas.p':'If you would like to have someone over, ask us first.',
    'casa.r.ruido.t':'Quiet between 11pm and 8am',
    'casa.r.ruido.p':'People are sleeping a few metres away, and some of them work the next day.',
    'casa.r.fiestas.t':'No parties or events',
    'casa.r.fiestas.p':'The grounds are small: a party in one apartment is heard in all of them.',
    'casa.r.fumar.t':'No smoking indoors',
    'casa.r.fumar.p':'The smell stays in the curtains and mattresses, and the next guest inherits it. Outdoors is fine.',
    'casa.r.ducha.t':'Outdoor shower before the pool and after the beach',
    'casa.r.ducha.p':'Sunscreen ruins the pool water and sand blocks the drains.',
    'casa.r.mascotas.t':'No pets',
    'casa.r.mascotas.p':'With several apartments sharing a yard and a pool, we cannot promise it suits everyone.',
    'casa.r.luces.t':'Lights and fans off when you go out',
    'casa.r.luces.p':'In high season the bill climbs fast.',
    'casa.r.fotos.t':'Commercial photo or video by arrangement only',
    'casa.r.fotos.p':'Personal use, as much as you like.',

    'casa.camaras.t':'Cameras',
    'casa.camaras.p':'There are cameras in two places: the street gate and the parking area. There are no cameras inside the apartments, nor at the pool, nor on the terrace.',

    'casa.largas.t':'Long stays',
    'casa.largas.p':'We take stays of 28 nights or more. Write to us and we will work out a price.',

    'casa.dudas.t':'Any questions?',
    'casa.dudas.p':'Write to us on WhatsApp. We would far rather sort something out before you arrive than after.',
    'casa.version':'In force since August 2026.'
  }
};

// Las nueve claves editables desde el FORMULARIO de cabanas.html, en el orden
// en que aparecen en la portada de arriba hacia abajo.
// Ojo: esto NO limita al editor visual, que edita cualquier data-t.
export const EDITABLES = [
  'titulo', 'bajada', 'c1', 'c2', 'c3',
  'tCabanas', 'tComunes', 'tConsulta', 'pie'
];
