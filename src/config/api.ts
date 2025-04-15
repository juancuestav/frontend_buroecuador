import { Endpoint } from 'shared/http/domain/Endpoint'

export const apiConfig = {
  URL_BASE: process.env.API_URL,
}

export const endpoints = {
  // autenticacion
  csrf_cookie: new Endpoint('csrf-cookie'),
  login: new Endpoint('public/login'),
  api_user: new Endpoint('api/user', false),
  reset_password: new Endpoint('reset-password', false),
  perfil_usuario: new Endpoint('user/profile-information', false),
  cambiar_contrasena: new Endpoint('user/password', false),
  logout: new Endpoint('logout', false),
  // permisos: new Endpoint('user/permisos'),
  verificar_codigo: new Endpoint('user/verificar-codigo'),
  reenviar_codigo: new Endpoint('user/reenviar-codigo'),
  // acceso a modulos
  tablero: new Endpoint('tablero'),
  usuarios: new Endpoint('usuarios'),
  roles: new Endpoint('roles'),
  servicios: new Endpoint('servicios'),
  tipos_identificaciones: new Endpoint('public/tipos-identificaciones'),
  categorias: new Endpoint('categorias'),
  configuraciones_generales: new Endpoint('public/configuraciones-generales'),
  solicitudes_mejoramiento: new Endpoint('solicitudes-mejoramiento'),
  mejoramiento: new Endpoint('mejoramiento'),
  activar_app: new Endpoint('activar-app'),
  notificaciones_cliente: new Endpoint('notificaciones-cliente'),
  notificaciones: new Endpoint('notificaciones'),
  notificaciones_formulario_contacto: new Endpoint(
    'notificaciones-form-contacto'
  ),
  email_marketing: new Endpoint('marketings'),
  facturacion_planes: new Endpoint('facturacion-planes'),
  reportes: new Endpoint('reportes'),
  pedidos: new Endpoint('pedidos'),
  popup: new Endpoint('popup'),
  // ubicacion
  paises: new Endpoint('paises'),
  provincias: new Endpoint('public/provincias'),
  ciudades: new Endpoint('public/ciudades'),
  // Usuarios
  verificar_cuenta: new Endpoint('verificar-cuenta'),
  archivos_reportes: new Endpoint('archivos-reportes'),
  archivos: new Endpoint('archivos'),
  accesos_directos: new Endpoint('accesos-directos'),
  // Bases de datos
  registro_civil: new Endpoint('registro-civil'),
  iess: new Endpoint('iess'),
  ant: new Endpoint('ant'),
  banco: new Endpoint('banco'),
  sri: new Endpoint('sri'),
  busqueda_general: new Endpoint('busqueda-general'),
  dashboard_precalifica: new Endpoint('dashboard-precalifica'),
  usuarios_dashboard_precalifica: new Endpoint(
    'usuarios-dashboard-precalifica'
  ),
  // Administracion
  permisos: new Endpoint('permisos'),
  permisos_administrar: new Endpoint('permisos_administrar'),
  asignar_permisos: new Endpoint('asignar-permisos'),
  asignar_permisos_individual: new Endpoint('asignar-permisos-usuario'),
  crear_permiso: new Endpoint('crear-permiso'),
  permisos_roles_usuario: new Endpoint('permisos_roles_usuario'),
  user_profiles: new Endpoint('user-profiles'),
}
