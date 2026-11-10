/* ==========================================================================
   CATÁLOGO DE SISTEMAS GROONS
   --------------------------------------------------------------------------
   Edita SOLO este archivo para agregar, quitar o actualizar sistemas.

   Campos:
     id          -> identificador corto (sin espacios)
     nombre      -> nombre visible
     icono       -> clase de Font Awesome (https://fontawesome.com/icons)
     estado      -> 'disponible' | 'proximamente' | 'desarrollo'
     resumen     -> frase corta (subtítulo)
     descripcion -> qué hace el sistema
     destacados  -> lista corta de puntos clave (opcional)
     plataformas -> cualquiera de: 'android', 'ios', 'web', 'windows'
     enlaces     -> { pagina, android, ios, web, windows } (opcionales)
     lanzamiento -> (OPCIONAL) fecha/hora de lanzamiento para mostrar un
                    contador regresivo. Formato: '2026-12-15T08:00:00-05:00'
                    Si se deja en null no se muestra contador.
   ========================================================================== */
window.SISTEMAS_GROONS = [
    {
        id: 'prestabit',
        nombre: 'PrestaBIT',
        icono: 'fa-solid fa-coins',
        estado: 'disponible',
        resumen: 'Gestión y control de préstamos',
        descripcion:
            'Controla préstamos, cobros, cuotas y balances en tiempo real. Ideal para prestamistas ' +
            'independientes, cooperativas y comercios que cobran en ruta.',
        destacados: [
            'Cálculo de intereses y cuotas al instante',
            'Rutas de cobro y control de caja',
            'Roles para cobradores y administrador',
            'Sincronización en la nube'
        ],
        plataformas: ['android', 'ios', 'web'],
        enlaces: {
            pagina: 'prestabit/',
            android: 'https://play.google.com/store/apps/details?id=app.web.groons.prestabit&hl=es_CO',
            ios: 'https://apps.apple.com/co/app/prestabit/id1671026232',
            web: 'https://prestabiit.web.app/'
        },
        imagen: 'prestabit/assets/img/1.jpeg',
        lanzamiento: null
    },
    {
        id: 'puntoventa',
        nombre: 'Punto de Venta',
        icono: 'fa-solid fa-bag-shopping',
        estado: 'proximamente',
        resumen: 'Ventas, inventario y caja',
        descripcion:
            'Vende con escáner, cobra en efectivo, tarjeta, transferencia o crédito, controla tu inventario ' +
            'con vencimientos y cuadra la caja en segundos. Incluye catálogo web con pedidos por WhatsApp.',
        destacados: [],
        plataformas: ['android', 'ios'],
        enlaces: {
            pagina: 'puntoventa/'
        },
        lanzamiento: null
    },
    {
        id: 'planco',
        nombre: 'Planco',
        icono: 'fa-solid fa-calendar-check',
        estado: 'proximamente',
        resumen: 'Clientes, cobros, agenda y asistencias',
        descripcion:
            'Para gimnasios, barberías, peluquerías, canchas, academias, spas y consultorios: mensualidades, ' +
            'paquetes de sesiones, agenda con reservas web, ingreso con QR y cobros por WhatsApp.',
        destacados: [],
        plataformas: ['android', 'ios'],
        enlaces: {
            pagina: 'planco/'
        },
        lanzamiento: null
    },
    {
        id: 'cobrax',
        nombre: 'CobraX',
        icono: 'fa-solid fa-bolt',
        estado: 'proximamente',
        resumen: 'Cobra préstamos y ventas a crédito',
        descripcion:
            'Diseñado para cobrar préstamos de dinero y ventas a crédito de muebles, electrodomésticos o ' +
            'celulares: cuotas, mora, rutas, cobro sin conexión, recibos, contratos y portal de clientes.',
        destacados: [],
        plataformas: ['android', 'ios'],
        enlaces: {
            pagina: 'cobrax/'
        },
        lanzamiento: null
    }
];
