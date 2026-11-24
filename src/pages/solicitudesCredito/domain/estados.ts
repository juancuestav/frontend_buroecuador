import { EstadoSolicitud } from './SolicitudCredito'

/** Texto y color de cada estado (mismos colores en tabla, chips y dashboard) */
export const ESTADOS: Record<
  EstadoSolicitud,
  { texto: string; color: string; icono: string }
> = {
  BORRADOR: { texto: 'Borrador', color: '#78909c', icono: 'bi-pencil' },
  LISTO_PARA_ENVIAR: { texto: 'Listo para enviar', color: '#8e24aa', icono: 'bi-send' },
  ENVIADO: { texto: 'Enviado', color: '#1e88e5', icono: 'bi-send-check' },
  INGRESADO: { texto: 'Ingresado', color: '#00897b', icono: 'bi-bank' },
  EN_REVISION: { texto: 'En revisión', color: '#fb8c00', icono: 'bi-hourglass-split' },
  EN_APELACION: { texto: 'En apelación', color: '#f4511e', icono: 'bi-arrow-repeat' },
  APROBADO: { texto: 'Aprobado', color: '#43a047', icono: 'bi-check-circle' },
  NEGADO: { texto: 'Negado', color: '#e53935', icono: 'bi-x-circle' },
  NO_PROCEDE: { texto: 'No procede', color: '#6d4c41', icono: 'bi-slash-circle' },
}

/** Estados que puede asignar el administrador ("Listo para enviar" = devolver al asesor) */
export const ESTADOS_ADMINISTRADOR: EstadoSolicitud[] = [
  'LISTO_PARA_ENVIAR',
  'ENVIADO',
  'INGRESADO',
  'EN_REVISION',
  'EN_APELACION',
  'APROBADO',
  'NEGADO',
  'NO_PROCEDE',
]

/** Cambios de estado que exigen comentario */
export const ESTADOS_CON_COMENTARIO: EstadoSolicitud[] = [
  'LISTO_PARA_ENVIAR',
  'NEGADO',
  'NO_PROCEDE',
  'EN_APELACION',
]

export function estiloEstado(estado: string | null | undefined) {
  const color = ESTADOS[estado as EstadoSolicitud]?.color ?? '#78909c'
  return {
    color,
    backgroundColor: color + '1f',
    border: `1px solid ${color}55`,
  }
}
