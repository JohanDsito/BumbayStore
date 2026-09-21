import type { Product } from "@/lib/types";

/**
 * Datos de ejemplo con la MISMA forma que tendrá la tabla `productos` de
 * Supabase. Sirven para desarrollar y para que el sitio nunca quede en blanco
 * si Supabase no responde. Se reemplazan por el catálogo real tras la importación.
 */
export const productosSeed: Product[] = [
  {
    id: "1",
    sku: "BT-TAL-2001",
    nombre: 'Taladro percutor inalámbrico 20V 1/2"',
    slug: "taladro-percutor-inalambrico-20v-media-pulgada-bt-tal-2001",
    categoriaSlug: "taladros-inalambricos",
    marca: "Bumbay",
    precioUnitario: 289000,
    precioMayor: 245000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      "Taladro percutor inalámbrico de 20V con motor de alto rendimiento y portabrocas metálico de 13 mm con autoajuste. Incluye dos baterías de litio de 2.0 Ah, cargador rápido de 1 hora y maletín rígido. Su caja de cambios de dos velocidades y los 25 niveles de torque permiten pasar de atornillado fino en madera a perforación con percusión en concreto sin cambiar de herramienta.",
    especificaciones: [
      { label: "Voltaje", valor: "20V máx (18V nominal)" },
      { label: "Portabrocas", valor: "13 mm metálico autoajustable" },
      { label: "Torque máximo", valor: "45 N·m" },
      { label: "Velocidad", valor: "0-450 / 0-1.650 rpm" },
      { label: "Percusión", valor: "24.750 gpm" },
      { label: "Niveles de torque", valor: "25 + 1 modo taladro" },
      { label: "Batería", valor: "2 x litio 2.0 Ah" },
      { label: "Tiempo de carga", valor: "60 minutos" },
      { label: "Peso", valor: "1,6 kg con batería" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Cargue completamente la batería antes del primer uso. Seleccione la velocidad 1 para atornillar y la 2 para perforar. Ajuste el anillo de torque en un número bajo para tornillos pequeños y auméntelo si el embrague patina antes de tiempo. Para concreto, gire el selector al símbolo de martillo y use brocas con punta de widia aplicando presión firme y constante, sin forzar.",
    beneficios: [
      "Dos baterías incluidas: una trabajando y otra cargando, sin tiempos muertos",
      "Batería compatible con el resto de la línea 20V de Bumbay",
      "Luz LED integrada para trabajo en espacios sin iluminación",
      "Maletín rígido para transporte y almacenamiento en obra",
    ],
    faq: [
      {
        pregunta: "¿Sirve para perforar concreto?",
        respuesta:
          "Sí. Tiene función de percusión y perfora concreto hasta 13 mm. Para perforaciones mayores o trabajo continuo en concreto, recomendamos un rotomartillo SDS-Plus.",
      },
      {
        pregunta: "¿La batería sirve para otras herramientas?",
        respuesta:
          "Sí, es compatible con toda la línea inalámbrica de 20V de Bumbay: pulidora, pistola de impacto, linterna y sierra caladora.",
      },
      {
        pregunta: "¿Cuánto dura la batería?",
        respuesta:
          'En atornillado continuo rinde aproximadamente 350 tornillos de 1 1/2" en madera con una carga completa.',
      },
    ],
    destacado: true,
    activo: true,
  },
  {
    id: "2",
    sku: "BT-PUL-4502",
    nombre: 'Pulidora angular inalámbrica 20V 4 1/2"',
    slug: "pulidora-angular-inalambrica-20v-4-media-bt-pul-4502",
    categoriaSlug: "pulidoras",
    marca: "Bumbay",
    precioUnitario: 345000,
    precioMayor: 298000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      'Pulidora angular a batería de 20V para disco de 115 mm (4 1/2"). Motor sin escobillas que entrega mayor autonomía y vida útil que los motores convencionales. Guarda de disco ajustable sin herramienta, interruptor de seguridad contra arranque accidental y freno de disco que detiene el giro en menos de 3 segundos al soltar el gatillo.',
    especificaciones: [
      { label: "Voltaje", valor: "20V máx" },
      { label: "Diámetro de disco", valor: '115 mm (4 1/2")' },
      { label: "Velocidad sin carga", valor: "8.500 rpm" },
      { label: "Rosca del eje", valor: "M14" },
      { label: "Motor", valor: "Sin escobillas (brushless)" },
      { label: "Batería", valor: "1 x litio 4.0 Ah" },
      { label: "Peso", valor: "2,1 kg con batería" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Verifique que el disco corresponda al trabajo: disco de corte para separar material y disco de desbaste para rebajar. Ajuste la guarda de modo que las chispas salgan en dirección contraria al operario. Deje que la herramienta alcance su velocidad máxima antes de tocar el material y no aplique presión lateral sobre discos de corte.",
    beneficios: [
      "Motor sin escobillas: hasta 50% más autonomía por carga",
      "Freno de disco para cambios de accesorio más rápidos y seguros",
      "Sin cable: ideal para trabajo en altura y obra sin acometida eléctrica",
      "Guarda ajustable sin llaves",
    ],
    faq: [
      {
        pregunta: "¿Corta varilla de construcción?",
        respuesta:
          'Sí, corta varilla de hasta 1/2" con disco de corte para metal. Con batería de 4.0 Ah rinde aproximadamente 90 cortes por carga.',
      },
      {
        pregunta: "¿Incluye discos?",
        respuesta:
          "Incluye un disco de desbaste. Los discos de corte se venden por separado y los manejamos por caja a precio mayorista.",
      },
    ],
    destacado: true,
    activo: true,
  },
  {
    id: "3",
    sku: "BT-COM-3010",
    nombre: "Combo inalámbrico 20V 3 herramientas + maletín",
    slug: "combo-inalambrico-20v-3-herramientas-maletin-bt-com-3010",
    categoriaSlug: "combos-inalambricos",
    marca: "Bumbay",
    precioUnitario: 720000,
    precioMayor: 615000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      'Kit profesional de tres herramientas inalámbricas que comparten la plataforma de batería de 20V: taladro percutor de 13 mm, pistola de impacto de 1/2" y pulidora angular de 4 1/2". Incluye dos baterías de litio de 4.0 Ah, cargador rápido doble y maletín rígido con espuma troquelada.',
    especificaciones: [
      { label: "Herramientas", valor: "Taladro percutor + impacto + pulidora" },
      { label: "Plataforma", valor: "Batería única 20V máx" },
      { label: "Baterías", valor: "2 x litio 4.0 Ah" },
      { label: "Cargador", valor: "Doble, carga rápida" },
      { label: "Torque taladro", valor: "45 N·m" },
      { label: "Torque impacto", valor: "350 N·m" },
      { label: "Disco pulidora", valor: '115 mm (4 1/2")' },
      { label: "Maletín", valor: "Rígido con espuma troquelada" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Cargue ambas baterías antes del primer uso y rótelas para prolongar su vida útil. Las tres herramientas usan la misma batería, así que basta con mantener una en el cargador mientras trabaja con la otra. Guarde siempre el kit en el maletín para evitar golpes en las carcasas y pérdida de accesorios.",
    beneficios: [
      "Una sola plataforma de batería para las tres herramientas",
      "Sale más económico que comprar las herramientas por separado",
      "Maletín organizado: nada se pierde en obra",
      "El combo más pedido por ferreterías y contratistas",
    ],
    faq: [
      {
        pregunta: "¿Puedo comprar solo una herramienta del combo?",
        respuesta:
          "Sí, las manejamos por separado. El combo tiene mejor precio si necesita más de una.",
      },
      {
        pregunta: "¿Hay descuento por cantidad?",
        respuesta:
          "Sí. Manejamos precio al mayor desde volumen. Escríbanos por WhatsApp con la cantidad que necesita y le cotizamos.",
      },
    ],
    destacado: true,
    activo: true,
  },
  {
    id: "4",
    sku: "BT-IMP-5004",
    nombre: 'Pistola de impacto inalámbrica 20V 1/2" 350 N·m',
    slug: "pistola-impacto-inalambrica-20v-media-350nm-bt-imp-5004",
    categoriaSlug: "pistolas-de-impacto",
    marca: "Bumbay",
    precioUnitario: 398000,
    precioMayor: 340000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      'Llave de impacto inalámbrica de 20V con encastre cuadrado de 1/2" y 350 N·m de torque de apriete. Mecanismo de impacto de doble martillo, selector de tres velocidades y modo de aflojado progresivo. Pensada para montallantas, mecánica automotriz y montaje de estructura metálica.',
    especificaciones: [
      { label: "Voltaje", valor: "20V máx" },
      { label: "Encastre", valor: '1/2" cuadrado con pin de retención' },
      { label: "Torque de apriete", valor: "350 N·m" },
      { label: "Torque de aflojado", valor: "450 N·m" },
      { label: "Impactos por minuto", valor: "0-3.200 ipm" },
      { label: "Velocidades", valor: "3 + modo aflojado" },
      { label: "Batería", valor: "1 x litio 4.0 Ah" },
      { label: "Peso", valor: "2,4 kg con batería" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Use siempre copas de impacto (negras), nunca copas cromadas de mano: estas últimas pueden fracturarse. Para apretar tuercas de rueda, seleccione la velocidad 2 y termine el apriete con torquímetro al valor que indique el fabricante del vehículo. Para aflojar tornillos oxidados, use el modo de aflojado y aplique penetrante previamente.",
    beneficios: [
      "350 N·m: afloja tuercas de rueda sin compresor ni mangueras",
      "Tres velocidades para no pasarse de apriete en trabajos delicados",
      "Batería compartida con el resto de la línea 20V",
      "Muy solicitada por talleres y montallantas",
    ],
    faq: [
      {
        pregunta: "¿Afloja tuercas de camión?",
        respuesta:
          'En vehículo liviano y camioneta sí, sin problema. Para camión pesado recomendamos el modelo de 3/4" y 1.200 N·m.',
      },
      {
        pregunta: "¿Incluye copas?",
        respuesta:
          "No incluye copas. Manejamos juegos de copas de impacto por separado y con precio al mayor por cantidad.",
      },
    ],
    destacado: false,
    activo: true,
  },
  {
    id: "5",
    sku: "BT-ROT-2600",
    nombre: "Rotomartillo SDS-Plus 800W 26 mm",
    slug: "rotomartillo-sds-plus-800w-26mm-bt-rot-2600",
    categoriaSlug: "rotomartillos",
    marca: "Bumbay",
    precioUnitario: 415000,
    precioMayor: 359000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      "Rotomartillo eléctrico de 800W con mandril SDS-Plus y capacidad de perforación de 26 mm en concreto. Tres modos de operación: rotación, rotopercusión y solo percusión para demolición liviana. Embrague de seguridad que protege al operario si la broca se atasca.",
    especificaciones: [
      { label: "Potencia", valor: "800 W" },
      { label: "Voltaje", valor: "110V / 60 Hz" },
      { label: "Mandril", valor: "SDS-Plus" },
      { label: "Capacidad en concreto", valor: "26 mm" },
      { label: "Energía de impacto", valor: "2,8 J" },
      { label: "Velocidad", valor: "0-1.100 rpm" },
      { label: "Percusión", valor: "0-4.500 gpm" },
      { label: "Modos", valor: "3 (rotación / rotopercusión / cincelado)" },
      { label: "Peso", valor: "3,2 kg" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Limpie y engrase el vástago de la broca antes de insertarla en el mandril SDS. Para perforar concreto, use el modo de rotopercusión y deje que el peso de la herramienta haga el trabajo, sin empujar. Retire la broca periódicamente para evacuar el polvo. El modo de cincelado sirve para retirar enchape o abrir regatas, no para demolición pesada.",
    beneficios: [
      "Mandril SDS-Plus: cambio de broca en segundos y sin llave",
      "Tres modos en una sola herramienta",
      "Embrague de seguridad contra atascamiento",
      "Perfora concreto hasta 26 mm sin esfuerzo del operario",
    ],
    faq: [
      {
        pregunta: "¿Puedo usar brocas normales?",
        respuesta:
          "No directamente: el mandril es SDS-Plus. Puede adaptar brocas de vástago recto con un adaptador SDS a portabrocas, que manejamos por separado.",
      },
      {
        pregunta: "¿Sirve para demoler?",
        respuesta:
          "Solo para demolición liviana: retirar enchape, abrir regatas o picar repello. Para demolición estructural necesita un martillo demoledor.",
      },
    ],
    destacado: true,
    activo: true,
  },
  {
    id: "6",
    sku: "BT-LAS-0301",
    nombre: "Nivel láser autonivelante 3D verde 12 líneas",
    slug: "nivel-laser-autonivelante-3d-verde-12-lineas-bt-las-0301",
    categoriaSlug: "niveles-laser",
    marca: "Bumbay",
    precioUnitario: 465000,
    precioMayor: 398000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      "Nivel láser autonivelante de 12 líneas verdes que proyecta tres planos de 360°: uno horizontal y dos verticales cruzados. El láser verde es hasta cuatro veces más visible que el rojo, lo que permite trabajar con luz ambiente alta. Incluye batería recargable, base magnética giratoria y maletín.",
    especificaciones: [
      { label: "Líneas", valor: "12 líneas (3 planos de 360°)" },
      { label: "Color del láser", valor: "Verde 515 nm" },
      { label: "Precisión", valor: "±3 mm a 10 m" },
      { label: "Alcance", valor: "30 m (60 m con receptor)" },
      { label: "Autonivelación", valor: "±4° con alarma fuera de rango" },
      { label: "Batería", valor: "Litio recargable, 8 h de uso" },
      { label: "Montaje", valor: 'Rosca 1/4" y 5/8"' },
      { label: "Protección", valor: "IP54" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Ubique el equipo sobre una superficie estable y libere el bloqueo de transporte antes de encenderlo. Espere a que las líneas dejen de parpadear: eso indica que terminó de autonivelarse. Si la superficie está más de 4° fuera de nivel, el equipo emite una alarma; en ese caso corrija la base. Bloquee siempre el péndulo antes de guardarlo.",
    beneficios: [
      "Láser verde: visible incluso en obra con buena iluminación",
      "Tres planos de 360°: cubre piso, techo y ambas paredes a la vez",
      "Base magnética giratoria para ajuste fino",
      "Batería recargable, sin gasto recurrente en pilas",
    ],
    faq: [
      {
        pregunta: "¿Sirve para instalar enchape?",
        respuesta:
          "Es su uso más común. Los tres planos de 360° permiten referenciar piso y pared simultáneamente sin mover el equipo.",
      },
      {
        pregunta: "¿Funciona en exteriores?",
        respuesta:
          "Con luz solar directa el alcance útil se reduce bastante. Para exteriores recomendamos usarlo con el receptor láser, que se vende por separado.",
      },
    ],
    destacado: false,
    activo: true,
  },
  {
    id: "7",
    sku: "BT-MAN-1080",
    nombre: "Juego de rachet y copas 108 piezas cromo vanadio",
    slug: "juego-rachet-copas-108-piezas-cromo-vanadio-bt-man-1080",
    categoriaSlug: "herramienta-manual",
    marca: "Bumbay",
    precioUnitario: 268000,
    precioMayor: 219000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      'Juego de 108 piezas en acero cromo vanadio con acabado espejo, presentado en maletín rígido con bandeja organizadora. Incluye rachets de 1/4" y 3/8" de 72 dientes, copas milimétricas y en pulgadas, puntas de atornillar, extensiones y llave de bujía.',
    especificaciones: [
      { label: "Piezas", valor: "108" },
      { label: "Material", valor: "Acero cromo vanadio CR-V" },
      { label: "Encastres", valor: '1/4" y 3/8"' },
      { label: "Dientes del rachet", valor: "72 (arco de 5°)" },
      { label: "Copas métricas", valor: "4 a 19 mm" },
      { label: "Copas en pulgadas", valor: '5/32" a 3/4"' },
      { label: "Estuche", valor: "Rígido con bandeja organizadora" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      'Seleccione siempre la copa que calce justo en la tuerca: una copa holgada redondea las caras. Use la palanca del rachet para cambiar el sentido de giro en lugar de voltear la herramienta. Para tornillos muy apretados, use extensión corta y evite la barra en L, que puede exceder la resistencia del encastre de 1/4".',
    beneficios: [
      "Rachet de 72 dientes: trabaja en espacios con poco recorrido",
      "Acero cromo vanadio con tratamiento térmico",
      "Bandeja organizadora: se ve de inmediato si falta una pieza",
      "Rotación alta en ferretería, producto de venta segura",
    ],
    faq: [
      {
        pregunta: "¿Las copas son de impacto?",
        respuesta:
          "No. Son copas cromadas de uso manual. Para pistola de impacto debe usar copas de impacto, que manejamos aparte.",
      },
      {
        pregunta: "¿Manejan precio por caja?",
        respuesta:
          "Sí, tenemos precio al mayor por cantidad. Escríbanos por WhatsApp y le enviamos la lista.",
      },
    ],
    destacado: false,
    activo: true,
  },
  {
    id: "8",
    sku: "BT-LAM-0450",
    nombre: "Reflector LED recargable 50W con trípode",
    slug: "reflector-led-recargable-50w-tripode-bt-lam-0450",
    categoriaSlug: "lamparas-y-linternas",
    marca: "Bumbay",
    precioUnitario: 185000,
    precioMayor: 152000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      "Reflector LED recargable de 50W con 5.000 lúmenes y trípode telescópico de hasta 1,8 m. Cabezal orientable 180°, tres niveles de intensidad y batería de litio con autonomía de hasta 8 horas en modo bajo. Carcasa de aluminio con protección IP65 para uso en exteriores.",
    especificaciones: [
      { label: "Potencia", valor: "50 W" },
      { label: "Flujo luminoso", valor: "5.000 lúmenes" },
      { label: "Temperatura de color", valor: "6.500 K (luz fría)" },
      { label: "Autonomía", valor: "3 h (alto) / 8 h (bajo)" },
      { label: "Batería", valor: "Litio 8.000 mAh recargable" },
      { label: "Trípode", valor: "Telescópico hasta 1,8 m" },
      { label: "Protección", valor: "IP65" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Cargue completamente antes del primer uso (aproximadamente 5 horas). Extienda las patas del trípode por completo antes de subir la columna para evitar volcamiento. En trabajos prolongados úselo conectado a la red: funciona como reflector fijo mientras carga.",
    beneficios: [
      "Funciona con o sin conexión eléctrica",
      "IP65: resiste lluvia y polvo de obra",
      "Trípode incluido, sin costo adicional",
      "Muy buena rotación en obra civil y talleres",
    ],
    faq: [
      {
        pregunta: "¿Puede quedar conectado permanentemente?",
        respuesta:
          "Sí, tiene protección contra sobrecarga y puede usarse conectado como reflector fijo.",
      },
      {
        pregunta: "¿Ilumina bien un área grande?",
        respuesta:
          "Con 5.000 lúmenes cubre cómodamente un área de trabajo de unos 50 m². Para áreas mayores recomendamos dos unidades.",
      },
    ],
    destacado: false,
    activo: true,
  },
  {
    id: "9",
    sku: "BT-TAL-1201",
    nombre: "Atornillador inalámbrico 12V compacto",
    slug: "atornillador-inalambrico-12v-compacto-bt-tal-1201",
    categoriaSlug: "taladros-inalambricos",
    marca: "Bumbay",
    precioUnitario: 165000,
    precioMayor: 138000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      "Atornillador inalámbrico de 12V, compacto y liviano, ideal para muebles, drywall e instalaciones eléctricas. Portabrocas de 10 mm, 18 niveles de torque y dos velocidades. Incluye dos baterías de 1.5 Ah, cargador y estuche.",
    especificaciones: [
      { label: "Voltaje", valor: "12V máx" },
      { label: "Portabrocas", valor: "10 mm autoajustable" },
      { label: "Torque máximo", valor: "28 N·m" },
      { label: "Velocidad", valor: "0-400 / 0-1.400 rpm" },
      { label: "Niveles de torque", valor: "18 + 1 modo taladro" },
      { label: "Batería", valor: "2 x litio 1.5 Ah" },
      { label: "Peso", valor: "0,95 kg con batería" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Por su tamaño es la herramienta indicada para trabajo prolongado en altura o en espacios reducidos, donde un taladro de 20V cansa el brazo. Ajuste el torque en un valor bajo al armar muebles de aglomerado para no pasar el tornillo.",
    beneficios: [
      "Menos de 1 kg: trabajo prolongado sin fatiga",
      "Entra en espacios donde no cabe un taladro de 20V",
      "Dos baterías incluidas",
      "Precio de entrada atractivo para venta en ferretería",
    ],
    faq: [
      {
        pregunta: "¿Perfora concreto?",
        respuesta:
          "No. Es un atornillador sin percusión, para madera, drywall y metal delgado. Para concreto necesita un taladro percutor.",
      },
    ],
    destacado: false,
    activo: true,
  },
  {
    id: "10",
    sku: "BT-PUL-5003",
    nombre: 'Pulidora angular eléctrica 1200W 5"',
    slug: "pulidora-angular-electrica-1200w-5-pulgadas-bt-pul-5003",
    categoriaSlug: "pulidoras",
    marca: "Bumbay",
    precioUnitario: 218000,
    precioMayor: 179000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      'Pulidora angular eléctrica de 1200W para disco de 125 mm (5"). Mango lateral reposicionable en tres puntos, guarda ajustable sin herramienta y arranque suave que evita el tirón inicial. Bobinado de cobre con protección contra sobrecalentamiento.',
    especificaciones: [
      { label: "Potencia", valor: "1.200 W" },
      { label: "Voltaje", valor: "110V / 60 Hz" },
      { label: "Diámetro de disco", valor: '125 mm (5")' },
      { label: "Velocidad sin carga", valor: "11.000 rpm" },
      { label: "Rosca del eje", valor: "M14" },
      { label: "Bobinado", valor: "Cobre 100%" },
      { label: "Peso", valor: "2,3 kg" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Sujete siempre con ambas manos usando el mango lateral. Verifique que el disco no esté fisurado antes de montarlo y que las rpm del disco superen las de la herramienta. Nunca retire la guarda de protección.",
    beneficios: [
      "1200W: potencia para trabajo continuo en metal y concreto",
      "Bobinado de cobre, mejor disipación y vida útil",
      "Arranque suave, menos desgaste del engranaje",
      "El caballo de batalla del taller, alta rotación",
    ],
    faq: [
      {
        pregunta: '¿Puede usar disco de 4 1/2"?',
        respuesta:
          "Sí, puede usar discos de 115 mm con la misma guarda, pero aproveche mejor la herramienta con discos de 125 mm.",
      },
    ],
    destacado: false,
    activo: true,
  },
  {
    id: "11",
    sku: "BT-COM-2005",
    nombre: "Combo taladro + pulidora inalámbricos 20V",
    slug: "combo-taladro-pulidora-inalambricos-20v-bt-com-2005",
    categoriaSlug: "combos-inalambricos",
    marca: "Bumbay",
    precioUnitario: 545000,
    precioMayor: 468000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      'Combo de dos herramientas inalámbricas de 20V: taladro percutor de 13 mm y pulidora angular de 4 1/2". Comparten batería y cargador. Incluye dos baterías de litio de 4.0 Ah, cargador rápido y maletín rígido.',
    especificaciones: [
      { label: "Herramientas", valor: "Taladro percutor + pulidora" },
      { label: "Plataforma", valor: "Batería única 20V máx" },
      { label: "Baterías", valor: "2 x litio 4.0 Ah" },
      { label: "Torque taladro", valor: "45 N·m" },
      { label: "Disco pulidora", valor: '115 mm (4 1/2")' },
      { label: "Maletín", valor: "Rígido" },
      { label: "Garantía", valor: "12 meses" },
    ],
    modoUso:
      "Rote el uso de ambas baterías para que envejezcan parejo. Nunca guarde las baterías completamente descargadas por períodos largos: cárguelas al menos a la mitad si va a dejar el equipo guardado varias semanas.",
    beneficios: [
      "Las dos herramientas más usadas del taller en un solo kit",
      "Batería compartida, menos inversión en accesorios",
      "Mejor precio que comprándolas por separado",
    ],
    faq: [
      {
        pregunta: "¿Puedo agregar más herramientas después?",
        respuesta:
          "Sí. Toda la línea 20V de Bumbay usa la misma batería, así que puede comprar herramientas sueltas y aprovechar las baterías que ya tiene.",
      },
    ],
    destacado: true,
    activo: true,
  },
  {
    id: "12",
    sku: "BT-MAN-0450",
    nombre: "Juego de destornilladores 45 piezas con puntas magnéticas",
    slug: "juego-destornilladores-45-piezas-puntas-magneticas-bt-man-0450",
    categoriaSlug: "herramienta-manual",
    marca: "Bumbay",
    precioUnitario: 89000,
    precioMayor: 68000,
    imagen: null,
    imagenes: [],
    fichaTecnica:
      "Juego de 45 piezas con mango ergonómico antideslizante, eje magnético intercambiable y puntas en acero S2 de alta dureza. Incluye puntas planas, Phillips, Torx, hexagonales y de precisión, más adaptador para portabrocas.",
    especificaciones: [
      { label: "Piezas", valor: "45" },
      { label: "Material de las puntas", valor: "Acero S2" },
      { label: "Mango", valor: "Ergonómico antideslizante" },
      { label: "Eje", valor: "Magnético intercambiable" },
      { label: "Tipos de punta", valor: "Plana, Phillips, Torx, hex, precisión" },
      { label: "Estuche", valor: "Plástico con organizador" },
      { label: "Garantía", valor: "6 meses" },
    ],
    modoUso:
      "Use siempre la punta del tamaño exacto del tornillo: una punta pequeña barre la cabeza. El eje magnético sostiene el tornillo, lo que facilita el trabajo con una sola mano en espacios difíciles.",
    beneficios: [
      "Acero S2: las puntas no se redondean con el uso normal",
      "Eje magnético: sostiene el tornillo mientras lo posiciona",
      "Incluye puntas de precisión para electrónica",
      "Producto de bajo costo y alta rotación en mostrador",
    ],
    faq: [
      {
        pregunta: "¿Las puntas sirven para taladro?",
        respuesta:
          "Sí, incluye adaptador para portabrocas. Aun así, para atornillado intensivo con taladro recomendamos puntas de impacto.",
      },
    ],
    destacado: false,
    activo: true,
  },
];
