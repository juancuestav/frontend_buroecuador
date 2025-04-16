import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from './authentication'
import { Ref, computed } from 'vue'

const store = useAuthenticationStore()
const esCliente = computed(() => store.hasRole('CLIENTE'))
const esAdministrador = computed(() => store.hasRole('ADMINISTRADOR'))
const esEmpleado = computed(() => store.hasRole('EMPLEADO'))
const appActivada = computed(() => (esCliente.value ? store.planPagado : true))

// State
export const menuBuroCreditoEcuador: Ref<MenuOption[]> = computed(() => [
  {
    header: 'Menu',
    can: true, //store.can('acceder.tablero'),
  },
  {
    title: 'Tablero',
    icon: 'bi-layers-fill',
    link: '/',
    can: store.can('acceder.tablero'),
  },
  {
    title: 'Accesos directos',
    icon: 'bi-box-arrow-up-right',
    link: 'accesos-directos',
    can: store.can('acceder.accesos_directos'),
  },
  {
    title: 'Dashboard Precalifica',
    icon: 'bi-pie-chart',
    link: 'dashboard-precalifica',
    can: store.can('acceder.dashboard_precalifica'),
  },
  {
    title: 'Precalifica',
    icon: 'bi-person-lines-fill',
    can: store.can('acceder.modulo_bases_de_datos') && appActivada.value,
    children: [
      {
        title: 'Reporte precalifica BRC',
        icon: 'bi-database',
        link: 'busqueda-general',
        can: store.can('acceder.busqueda_general'),
      },
      {
        title: 'Registro civil',
        icon: 'bi-database',
        link: 'registro-civil',
        can: store.can('acceder.registro_civil'),
      },
      {
        title: 'Buró de crédito',
        icon: 'bi-database',
        link: 'banco',
        can: store.can('acceder.banco'),
      },
      {
        title: 'Iess',
        icon: 'bi-database',
        link: 'iess',
        can: store.can('acceder.iess'),
      },
      {
        title: 'SRI',
        icon: 'bi-database',
        link: 'sri',
        can: store.can('acceder.sri'),
      },
      {
        title: 'Ant',
        icon: 'bi-database',
        link: 'ant',
        can: store.can('acceder.ant'),
      },
    ],
  },
  {
    title: 'Formulario de contacto',
    icon: 'bi-bell',
    link: 'formulario-contacto',
    can: store.can('acceder.formulario_contacto'),
  },
  {
    title: 'Facturación de planes',
    icon: 'bi-receipt',
    link: 'facturacion-planes',
    can: store.can('acceder.facturacion_planes'),
  },
  {
    title: 'Solicitudes de mejoramiento',
    icon: 'bi-graph-up-arrow',
    link: 'solicitudes-mejoramiento',
    can: store.can('acceder.solicitud_mejoramiento'),
  },
  {
    title: 'Pedidos de servicios',
    icon: 'bi-clipboard-fill',
    link: 'pedidos',
    can: store.can('acceder.pedidos'),
  },
  {
    title: 'Reportes',
    icon: 'bi-journal-bookmark',
    link: 'notificaciones',
    can: store.can('acceder.reportes'),
    children: [
      {
        title: 'Crear reporte',
        icon: 'bi-dash-circle-dotted',
        link: 'crear-reporte',
      },
      {
        title: 'Consultar reportes',
        icon: 'bi-dash-circle-dotted',
        link: 'consultar-reporte',
      },
    ],
  },
  {
    title: 'Activar app',
    icon: 'bi-toggle-on',
    link: 'activar-app',
    can: store.can('acceder.activar_app') && !appActivada.value,
  },
  {
    title: 'Mi puntuación',
    icon: 'bi-person-check',
    link: 'puntuacion-cliente',
    can: store.can('acceder.puntuacion_cliente'), // && !appActivada,
  },
  {
    title: esCliente.value ? 'Mi Buró' : 'Compartir archivos a clientes',
    icon: 'bi-archive',
    link: 'archivos-reportes',
    can: store.can('acceder.archivos_reportes') && appActivada.value,
  },
  {
    title: 'Score crediticio',
    icon: 'bi-journal-arrow-up',
    link: 'score-crediticio',
    can: store.can('acceder.score_crediticio') && !appActivada.value,
  },
  {
    title: 'Adquirir servicio',
    icon: 'bi-person-workspace',
    link: 'adquirir-servicios',
    can: store.can('acceder.adquirir_servicio') && !appActivada.value,
  },
  {
    title: 'Solicitar mejoramiento',
    icon: 'bi-graph-up-arrow',
    link: 'mejoramiento',
    can: store.can('acceder.mejoramiento'),
  },
  {
    title: 'Reporte de crédito',
    icon: 'bi-star',
    link: 'reporte-credito',
    can: store.can('acceder.reporte_credito') && !appActivada.value,
  },
  {
    title: 'Mis reportes',
    icon: 'bi-clipboard',
    link: 'mis-reportes',
    can: store.can('acceder.mis_reportes') && !appActivada.value,
  },
  {
    title: 'Chat en línea',
    icon: 'bi-whatsapp',
    link: 'chat-en-linea',
    can: store.can('acceder.chat_linea'),
  },
  {
    title: 'Novedades',
    icon: 'bi-envelope-check',
    link: 'notificaciones-generales',
    can: store.can('acceder.notificaciones_generales'),
  },
  {
    title: 'Solicitud de crédito',
    icon: 'bi-box-arrow-up-right',
    link: 'https://burodecredito.ec/solicitud-credito',
    target: '_blank',
    can: true,
  },
  {
    title: 'Políticas de privacidad',
    icon: 'bi-box-arrow-up-right',
    link: 'https://burodecredito.ec/politicas-privacidad',
    target: '_blank',
    can: true,
  },
  {
    header: 'Módulos de administración',
    can: esAdministrador.value || esEmpleado.value,
  },
  {
    title: 'Nuestros servicios',
    icon: 'bi-person-workspace',
    link: 'servicios',
    can: store.can('acceder.servicios'),
  },
  {
    title: 'Categorías de planes y servicios',
    icon: 'bi-collection',
    link: 'categorias',
    can: store.can('acceder.categorias'),
  },
  {
    title: 'Usuarios',
    icon: 'bi-person-fill',
    link: 'usuarios',
    can: store.can('acceder.usuarios'),
  },
  {
    title: 'Notificar a clientes',
    icon: 'bi-envelope-plus',
    link: 'notificar-clientes',
    can: store.can('acceder.notificar_clientes'),
  },
  {
    title: 'Email marketing',
    icon: 'bi-table	',
    link: 'email-marketing',
    can: store.can('acceder.email_marketing'),
  },
  {
    title: 'Publicidad popup',
    icon: 'bi-badge-ad',
    link: 'popup',
    can: store.can('acceder.popup'),
  },
])
