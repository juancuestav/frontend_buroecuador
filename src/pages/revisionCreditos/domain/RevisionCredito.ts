// Respuesta de GET/POST api/revision-creditos (RevisionCreditoResource del backend)

export type EstadoRevision = 'detenida' | 'pendiente_equifax' | 'finalizada'
export type PasoRevision = 'ed' | 'laboral'
export type ClaveValidacion = 'ed' | 'iess' | 'ruc' | 'n'
export type EstadoValidacion =
  | 'cumple'
  | 'no_cumple'
  | 'autorizada'
  | 'no_evaluada'

export interface Validacion {
  clave: ClaveValidacion
  titulo: string
  estado: EstadoValidacion
  cumple: boolean
  detalle: string | null
}

export interface Autorizacion {
  paso: PasoRevision
  usuario: string | null
  fecha: string | null
}

export interface ClienteRevision {
  cedula: string
  nombres: string | null
  fecha_nacimiento: string | null
  edad: number | null
  estado_civil: string | null
  es_casado: boolean
  conyuge: { nombres: string | null; cedula: string | null } | null
}

export interface AfiliacionIess {
  empresa: string | null
  ruc_empleador: string | null
  cargo: string | null
  sueldo: number | null
  fecha_ingreso: string | null
  fecha_salida: string | null
  vigente: boolean
  anios: number | null
  cumple_antiguedad: boolean
}

export interface RucCliente {
  numero: string | null
  razon_social: string | null
  estado: string
  vigente: boolean
  fecha_inicio_actividades: string | null
  fecha_reinicio_actividades: string | null
  fecha_base: string | null
  actividad: string | null
  anios: number | null
  cumple_antiguedad: boolean
}

export interface RucEquifax {
  numero: string | null
  estado: string | null
  clase: string | null
  actividad: string | null
  codigo_ciiu: string | null
  fecha_inicio_actividades: string | null
  fecha_suspension_definitiva: string | null
  anios: number | null
}

export interface OperacionActiva {
  sistema: 'SB' | 'SEPS' | 'SICOM'
  institucion: string | null
  tipo_credito: string | null
  monto_original: number | null
  saldo: number | null
  por_vencer: number | null
  vencido: number
  ndi: number
  demanda_judicial: number
  cartera_castigada: number
  cuota_mensual: number | null
  // TITULAR, CODEUDOR o GARANTE (tipo_riesgo de Equifax)
  tipo_deudor: string | null
  fecha_apertura: string | null
  fecha_corte: string | null
  fecha_vencimiento: string | null
  dias_morosidad: number | null
  estado: string
}

export interface OperacionReciente {
  institucion: string | null
  tipo_credito: string | null
  estado: string | null
  valor: number | null
  titular: string | null
  codeudor: string | null
  garante: string | null
  fecha_concesion: string
  fecha_vencimiento: string | null
}

export interface DatosEquifax {
  transaction_id: string | null
  score: {
    valor: number | null
    minimo: number
    maximo: number
    tasa_malos: number | null
  }
  score_sobreendeudamiento: {
    valor: number | null
    segmentacion: string | null
    rango: string | null
    probabilidad: number | null
  }
  cuota_mensual: number
  deuda_total: number
  operaciones_activas: OperacionActiva[]
  ultimas_operaciones_12m: OperacionReciente[]
  consultas_buro: {
    total: number
    entidades: { institucion: string | null; consultas: number }[]
  }
  vencimientos: {
    vencido_actual: number
    operaciones_impagas: number
    monto_impago: number
    demanda_judicial: number
    cartera_castigada: number
    fecha_corte: string | null
    por_antiguedad: { rango: string; valor: number }[]
    meses_con_mora_12m: number
  }
}

export interface RevisionCredito {
  id: number
  identificacion: string
  estado: EstadoRevision
  paso_detenido: PasoRevision | null
  califica: boolean
  analisis: string | null
  validaciones: Validacion[]
  autorizaciones: Autorizacion[]
  // Asesor que hizo la consulta
  asesor: string | null
  asesor_id: number | null
  // Asesor al que pertenece ("Pertenece a")
  pertenece_a: string | null
  pertenece_a_id: number | null
  created_at: string
  cliente: ClienteRevision
  relacion_laboral: {
    consultada: boolean
    iess: AfiliacionIess[]
    ruc: RucCliente | null
    // RUC según Equifax (informativo, solo si ya se consultó en el paso 4)
    ruc_equifax: RucEquifax | null
  }
  equifax: DatosEquifax | null
  equifax_consultado_at: string | null
  puede_continuar: boolean
}

export const NOMBRE_PASO: Record<PasoRevision, string> = {
  ed: 'Edad',
  laboral: 'Relación laboral (IESS / RUC)',
}

// Campo de solo lectura (etiqueta + valor) de las secciones de la revisión
export interface CampoLectura {
  etiqueta: string
  valor: string | number | null | undefined
  clase?: string
  resaltar?: boolean
}

// Reporte PDF generado con la respuesta de Equifax de la revisión
export type TipoReporte = 'normal' | 'gold' | 'premium' | 'empresa'

export interface ReporteDisponible {
  tipo_reporte: TipoReporte
  reporte_id: number
  generado_at: string
  vence_at: string
}

export interface EstadoGeneracionReporte {
  generacion_id: string
  estado: 'en_proceso' | 'completado' | 'error' | 'sin_respuesta'
  reporte_id: number | null
  tipo_reporte: TipoReporte
  reutilizado: boolean
  mensaje: string | null
}
