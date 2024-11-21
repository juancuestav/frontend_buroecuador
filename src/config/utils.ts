// Tipos
export type TipoSeleccion = 'none' | 'single' | 'multiple'

export const rolesSistema = {
  cliente: 'CLIENTE',
  empleado: 'EMPLEADO',
  administrador: 'ADMINISTRADOR',
}

export const acciones = {
  nuevo: 'NUEVO',
  eliminar: 'ELIMINAR',
  consultar: 'CONSULTAR',
  editar: 'EDITAR',
}

export const accionesTabla = {
  name: 'acciones',
  field: 'acciones',
  label: 'Acciones',
  align: 'center',
  //style: 'width: 1000px'
}

export const ESTADOS_PRODUCTO = { BORRADOR: 'BORRADOR', ACTIVO: 'ACTIVO' }

export const estadosProducto = [
  { id: 'BORRADOR', nombre: 'Borrador' },
  { id: 'ACTIVO', nombre: 'Activo' },
]

export const estados = ['ACTIVO', 'NO ACTIVO']

export const estadosPago = ['PAGADO', 'PAGO PENDIENTE', 'ANULADO']

export const estadosMejoramiento = [
  'PENDIENTE',
  'EN PROCESO',
  'APROBADO',
  'NEGADO',
]

export const estadosSI_NO = ['SI', 'NO']

export const puntuaciones = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '1000',
]

export const tiposReportes = ['GOLD', 'STANDAR', 'NORMAL']
export const tiposContribuyente = ['PERSONA NATURAL', 'PERSONA JURÍDICA']
