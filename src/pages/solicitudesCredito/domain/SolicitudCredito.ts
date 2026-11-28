import { RevisionCredito } from 'pages/revisionCreditos/domain/RevisionCredito'

export type EstadoSolicitud =
  | 'BORRADOR'
  | 'ENVIADO'
  | 'INGRESADO'
  | 'EN_REVISION'
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
  /** Se resalta (pagaré firmado) */
  destacado: boolean
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
  /** edicion: otro asesor (con permiso) modificó un paso sin enviar */
  tipo: 'comentario' | 'estado' | 'documento' | 'edicion'
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
  /** "Pertenece a": nombre escrito en "Otro" o el del asesor con cuenta */
  asesor: string | null
  asesor_id: number | null
  pertenece_a_nombre: string | null
  registrado_por: string | null
  registrado_por_id: number | null
  /** Quien la ve es responsable (no otro asesor con permiso para editarla) */
  es_propia: boolean
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
  /** Día del mes en que se pagan las cuotas (3 a 28) */
  dia_pago: number | null
  /** Comisión en porcentaje (paso Cliente) */
  comision: number | null
  actividad_descripcion: string | null
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

  otras_solicitudes: SolicitudExistente[]
  economicos: DatosEconomicos
  parametros: ParametrosSolicitud
  revision: RevisionCredito
  documentos: DocumentoSolicitud[]
  seguimiento: Seguimiento[]
  permisos: {
    editar: boolean
    enviar: boolean
    gestionar: boolean
    comentar: boolean
    /** Sin enviar: el administrador solo puede pasarla a "No procede" */
    no_procede: boolean
  }
}

/** Otra solicitud de la misma cédula (de cualquier asesor) */
export interface SolicitudExistente {
  id: number
  banco: Banco | null
  banco_nombre: string | null
  estado: EstadoSolicitud
  estado_texto: string
  asesor: string | null
  created_at: string | null
  /** Impide otra solicitud en ese banco (todas menos Negado y No procede) */
  bloquea: boolean
}

/** Datos del paso Cliente */
export interface DatosCliente {
  monto_solicitado: number | null
  plazo_meses: number | null
  dia_pago: number | null
  comision: number | null
  asesor_id?: number | null
  pertenece_a_nombre?: string | null
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
  solicitudes_existentes: SolicitudExistente[]
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
