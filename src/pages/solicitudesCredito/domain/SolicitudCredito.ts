import { RevisionCredito } from 'pages/revisionCreditos/domain/RevisionCredito'

export type EstadoSolicitud =
  | 'BORRADOR'
  | 'LISTO_PARA_ENVIAR'
  | 'ENVIADO'
  | 'INGRESADO'
  | 'EN_REVISION'
  | 'EN_APELACION'
  | 'APROBADO'
  | 'NEGADO'
  | 'NO_PROCEDE'

export type Banco = 'GUAYAQUIL' | 'PICHINCHA'
export type TipoIngreso = 'IESS' | 'RUC' | 'AMBOS'
export type EstadoDocumento = 'pendiente' | 'subido' | 'no_tiene' | 'rechazado'

export interface Contacto {
  celular: string | null
  correo: string | null
  direccion_domicilio: string | null
  direccion_trabajo: string | null
  fuente_celular?: string | null
  fuente_correo?: string | null
  fuente_direccion_domicilio?: string | null
  fuente_direccion_trabajo?: string | null
}

export interface Referencia {
  nombres: string
  direccion: string
  celular: string
  parentesco: string | null
}

export interface DocumentoSolicitud {
  id: number
  clave: string
  nombre: string
  detalle: string | null
  adicional: boolean
  abierto: boolean
  permite_no_tiene: boolean
  estado: EstadoDocumento
  tiene_archivo: boolean
  nombre_archivo: string | null
  tamanio_bytes: number | null
  motivo_rechazo: string | null
  subido_at: string | null
  puede_subir: boolean
}

export interface Seguimiento {
  id: number
  tipo: 'comentario' | 'estado' | 'documento'
  mensaje: string | null
  estado_anterior: EstadoSolicitud | null
  estado_nuevo: EstadoSolicitud | null
  usuario: string | null
  es_administrador: boolean
  created_at: string | null
}

export interface TipoIngresoDisponible {
  tipo: TipoIngreso
  disponible: boolean
  validacion: string | null
}

export interface DatosEconomicos {
  tipos_ingreso: TipoIngresoDisponible[]
  ingreso_iess: number | null
  iess_fecha_corte: string | null
  cuota_buro: number | null
}

export interface ParametrosSolicitud {
  tasa_anual: number
  plazo_maximo: number
  monto_minimo: number | null
  monto_maximo: number | null
  porcentaje_capacidad: number
}

/** Detalle de una solicitud (SolicitudCreditoResource del backend) */
export interface SolicitudCredito {
  id: number
  identificacion: string
  nombres: string | null
  asesor: string | null
  asesor_id: number
  estado: EstadoSolicitud
  estado_texto: string
  paso: number
  banco: Banco | null
  banco_nombre: string | null
  tipo_ingreso: TipoIngreso | null
  contacto: Contacto | null
  referencias: Referencia[]

  revision_credito_id: number
  score: number | null
  equifax_consultado_at: string | null
  equifax_dias: number | null
  equifax_vigente: boolean
  con_autorizacion: boolean
  autorizado_por: string | null

  ingreso_iess_original: number | null
  ingreso_iess: number | null
  ingreso_ruc: number | null
  ingreso_modificado: boolean
  ingresos_totales: number | null
  cuota_buro: number | null
  ingreso_neto: number | null
  capacidad_pago: number | null
  tasa_anual: number | null
  porcentaje_capacidad: number | null
  plazo_meses: number | null
  monto_sugerido: number | null
  monto_solicitado: number | null
  cuota_prestamo: number | null
  nueva_cuota_buro: number | null

  asesor_puede_comentar: boolean
  observacion: string | null
  monto_aprobado: number | null
  plazo_aprobado: number | null
  cuota_aprobada: number | null
  created_at: string | null
  enviado_at: string | null

  economicos: DatosEconomicos
  parametros: ParametrosSolicitud
  revision: RevisionCredito
  documentos: DocumentoSolicitud[]
  seguimiento: Seguimiento[]
  permisos: {
    editar: boolean
    enviar: boolean
    eliminar: boolean
    gestionar: boolean
    comentar: boolean
  }
}

/** Respuesta de POST solicitudes-credito/revisar (paso 1) */
export interface RevisionParaSolicitud {
  revision: RevisionCredito
  reutilizada: boolean
  habilitacion: {
    puede_continuar: boolean
    con_autorizacion: boolean
    autorizado_por: string | null
    motivo: string | null
  }
  solicitudes_activas: { id: number; banco: string | null; estado: string }[]
}

export const BANCOS: { value: Banco; label: string }[] = [
  { value: 'GUAYAQUIL', label: 'Banco Guayaquil' },
  { value: 'PICHINCHA', label: 'Banco Pichincha' },
]

export const PARENTESCOS = [
  'PADRE/MADRE',
  'HIJO/A',
  'HERMANO/A',
  'CÓNYUGE/PAREJA',
  'ABUELO/A',
  'TÍO/A',
  'PRIMO/A',
  'AMIGO/A',
  'COMPAÑERO/A DE TRABAJO',
  'OTRO',
]
