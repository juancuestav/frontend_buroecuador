import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from './authentication'
import { Ref, computed } from 'vue'

const store = useAuthenticationStore()
const esCliente = computed(() => store.hasRole('CLIENTE'))
const appActivada = esCliente.value ? store.planPagado : true

// State
export const menuBuroCreditoEcuador: Ref<MenuOption[]> = computed(() => [
  {
    header: 'Menu',
    can: store.can('acceder.tablero'),
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
    header: 'Modulos',
    can: true,
  },
  {
    title: 'Activar app',
    icon: 'bi-toggle-on',
    link: 'activar-app',
    can: store.can('acceder.activar_app') && !appActivada,
  },
  {
    title: 'Mi puntuación',
    icon: 'bi-person-check',
    link: 'puntuacion-cliente',
    can: store.can('acceder.puntuacion_cliente'),// && !appActivada,
  },
  {
    title: esCliente.value ? 'Mi Buró' : 'Compartir archivos a clientes',
    icon: 'bi-archive',
    link: 'archivos-reportes',
    can: store.can('acceder.archivos_reportes') && appActivada,
  },
  {
    title: 'Planes y servicios',
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
    title: 'Score crediticio',
    icon: 'bi-journal-arrow-up',
    link: 'score-crediticio',
    can: store.can('acceder.score_crediticio') && !appActivada,
  },
  {
    title: 'Adquirir servicio',
    icon: 'bi-person-workspace',
    link: 'adquirir-servicios',
    can: store.can('acceder.adquirir_servicio') && !appActivada,
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
    can: store.can('acceder.reporte_credito') && !appActivada,
  },
  {
    title: 'Mis reportes',
    icon: 'bi-clipboard',
    link: 'mis-reportes',
    can: store.can('acceder.mis_reportes') && !appActivada,
  },
  {
    title: 'Chat en línea',
    icon: 'bi-whatsapp',
    link: 'chat-en-linea',
    can: store.can('acceder.chat_linea'),
  },
  {
    title: 'Notificar a clientes',
    icon: 'bi-envelope-plus',
    link: 'notificar-clientes',
    can: store.can('acceder.notificar_clientes'),
  },
  {
    title: 'Novedades',
    icon: 'bi-envelope-check',
    link: 'notificaciones-generales',
    can: store.can('acceder.notificaciones_generales'),
  },
  {
    title: 'Solicitud de crédito',
    icon: 'bi-check-circle',
    link: 'https://bit.ly/SOLIBRC',
    target: '_blank',
    can: true,
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
