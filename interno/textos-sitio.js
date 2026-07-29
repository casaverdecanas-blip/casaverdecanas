// ═══════════════════════════════════════════════════════════════
//  CASAVERDE 2.0 — textos-sitio.js
//  Textos por defecto del SITIO PÚBLICO, en los tres idiomas.
//
//  FUENTE ÚNICA. Lo importan DOS lados:
//   · index.html de la raíz (el sitio) — los muestra cuando config/sitio
//     no tiene nada cargado para esa clave.
//   · interno/cabanas.html (el panel) — los muestra como texto de fondo
//     de cada campo, así se ve qué dice el sitio HOY antes de editarlo.
//
//  Antes vivían dentro del sitio público y el panel no los conocía: por eso
//  el editor abría con todos los campos en blanco aunque el sitio mostrara
//  texto, y no había forma de saber de dónde se partía (T11.4).
//
//  Prioridad al mostrar en el sitio: config/sitio → este archivo → la clave.
//
//  Las claves que el panel deja editar son solo estas nueve:
//    titulo · bajada · c1 · c2 · c3 · tCabanas · tComunes · tConsulta · pie
//  El resto son etiquetas de la interfaz del sitio y NO se editan desde el
//  panel: si se cambian, se cambian acá.
//
//  ⚠ TODA clave que el sitio use con data-t o t() TIENE que existir acá, en
//  los tres idiomas. Si falta, t() cae hasta su último respaldo y escribe
//  EL NOMBRE DE LA CLAVE en la pantalla: el pie del sitio mostró la palabra
//  suelta "recuerdos" en vez de la frase durante todo el tiempo que faltó
//  'recuerdos' en esta tabla (T11.16). El fallo no da error en ningún lado
//  — se ve, y solo si alguien mira.
// ═══════════════════════════════════════════════════════════════

export const T = {
  pt: { consultar:'Consultar', titulo:'A três quadras do mar, cercado de verde',
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
    noches:'noites', hasta:'até', pers:'pessoas', desde:'a partir de', noite:'a noite' },
  es: { consultar:'Consultar', titulo:'A tres cuadras del mar, rodeado de verde',
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
    noches:'noches', hasta:'hasta', pers:'personas', desde:'desde', noite:'la noche' },
  en: { consultar:'Enquire', titulo:'Three blocks from the sea, surrounded by green',
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
    noches:'nights', hasta:'to', pers:'guests', desde:'from', noite:'per night' }
};
// Las nueve claves editables desde el panel, en el orden en que aparecen
// en el sitio de arriba hacia abajo.
export const EDITABLES = [
  'titulo', 'bajada', 'c1', 'c2', 'c3',
  'tCabanas', 'tComunes', 'tConsulta', 'pie'
];
