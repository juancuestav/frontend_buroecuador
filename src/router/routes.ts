import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'verificar-cuenta',
        name: 'verifica_cuenta',
        component: () =>
          import('pages/verificaCuenta/view/VerificaCuentaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'aprobar-verificar-cuenta',
        name: 'aprobar_verificar_cuenta',
        component: () =>
          import(
            'pages/aprobarVerificarCuenta/view/AprobarVerificarCuentaPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: 'ofertas-disponibles',
        name: 'ofertas_disponibles',
        component: () =>
          import('pages/ofertasDisponibles/view/OfertasDisponiblesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '',
        name: 'tablero',
        component: () => import('pages/tablero/view/TableroPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/formulario-contacto',
        name: 'formulario_contacto',
        component: () =>
          import('pages/notificaciones/view/NotificacionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/crear-reporte',
        name: 'reportes',
        component: () =>
          import('pages/reportes/crearReporte/view/CrearReportePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/consultar-reporte',
        name: 'consultar_reportes',
        component: () =>
          import(
            'pages/reportes/consultarReporte/view/ConsultarReportePage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/reporte-credito',
        name: 'reporte_credito',
        component: () =>
          import('pages/reporteCredito/view/ReporteCreditoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/mis-reportes',
        name: 'mis_reportes',
        component: () =>
          import('pages/reportes/misReportes/view/MiReportePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/servicios',
        name: 'servicios',
        component: () => import('pages/servicios/view/ServicioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/categorias',
        name: 'categorias',
        component: () =>
          import('pages/servicios/modules/categorias/view/CategoriaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/usuarios',
        name: 'usuarios',
        component: () => import('pages/usuarios/view/UsuarioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/solicitudes-mejoramiento',
        name: 'solicitud_mejoramiento',
        component: () =>
          import(
            'pages/solicitudesMejoramiento/view/SolicitudMejoramientoPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/pedidos',
        name: 'pedidos',
        component: () => import('pages/pedidos/view/PedidoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/mejoramiento',
        name: 'mejoramiento',
        component: () => import('pages/mejoramiento/view/MejoramientoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/activar-app',
        name: 'activar_app',
        component: () => import('pages/activarApp/view/ActivarAppPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/adquirir-servicios',
        name: 'adquirir_servicio',
        component: () =>
          import('pages/adquirirServicios/view/AdquirirServicioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/chat-en-linea',
        name: 'chat_linea',
        component: () => import('pages/chatLinea/view/ChatLineaPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/notificaciones-generales',
        name: 'notificaciones_generales',
        component: () =>
          import(
            'pages/notificacionesGenerales/view/NotificacionGeneralPage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/notificar-clientes',
        name: 'notificar_clientes',
        component: () =>
          import(
            'pages/notificacionesClientes/view/NotificacionClientePage.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/facturacion-planes',
        name: 'facturacion_planes',
        component: () =>
          import('pages/facturacionPlanes/view/FacturacionPlanesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/email-marketing',
        name: 'email_marketing',
        component: () => import('pages/emailMarketing/view/MarketingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/popup',
        name: 'popup',
        component: () => import('pages/popup/view/PopupPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/configuraciones-generales',
        name: 'configuraciones_generales',
        component: () =>
          import('pages/configuraciones/view/ConfiguracionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/score-crediticio',
        name: 'score_crediticio',
        component: () =>
          import('pages/scoreCrediticio/view/ScoreCrediticioPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/archivos-reportes',
        name: 'archivos_reportes',
        component: () =>
          import('pages/archivosReportes/view/ArchivoReportePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/accesos-directos',
        name: 'accesos_directos',
        component: () =>
          import('pages/accesoDirecto/view/AccesoDirectoPage.vue'),
        meta: { requiresAuth: true },
      },
      /******************
       * Administracion
       ******************/
      {
        path: '/roles',
        name: 'roles',
        component: () => import('sistema/roles/view/RolPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/permisos',
        name: 'permisos',
        component: () => import('sistema/permisos/view/PermisoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/permisos-roles',
        name: 'permisos_roles',
        component: () =>
          import('sistema/permisos/modules/permisoRol/view/PermisoRolPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/permisos-usuarios',
        name: 'permisos_usuarios',
        component: () =>
          import(
            'sistema/permisos/modules/permisosUsuarios/view/PermisosUsuarioPage.vue'
          ),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () =>
          import('pages/sistema/authentication/login/view/LoginPage.vue'),
      },
      {
        path: 'codigo-verificacion',
        name: 'codigo_verificacion',
        component: () => import('pages/CodigoVerificacion.vue'),
        //meta: { requiresAuth: true },
      },
      {
        path: '/register',
        name: 'register',
        component: () =>
          import('pages/sistema/authentication/register/view/RegisterPage.vue'),
      },
      {
        path: 'index.html',
        name: 'index',
        component: () =>
          import('pages/sistema/authentication/login/view/LoginPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
