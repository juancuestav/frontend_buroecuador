import { EstadoSolicitud } from './SolicitudCredito'

export type Periodo = 'hoy' | 'semana' | 'mes' | 'total'

export interface ConteoEstados {
  total: number
  por_estado: Record<EstadoSolicitud, number>
}

/** Respuesta de GET solicitudes-credito/resumen */
export interface ResumenSolicitudes {
  estados: { estado: EstadoSolicitud; etiqueta: string }[]
  periodos: Record<Periodo, ConteoEstados>
  por_banco: {
    banco: string
    nombre: string
    total: number
    aprobadas: number
    negadas: number
    tasa_aprobacion: number | null
  }[]
  por_asesor:
    | {
        asesor_id: number
        asesor: string | null
        total: number
        por_estado: Record<EstadoSolicitud, number>
        monto_solicitado: number
        monto_aprobado: number
      }[]
    | null
  montos: { solicitado: number; aprobado: number }
  tiempo_promedio_dias: number | null
  serie_mes: { fecha: string; ingresadas: number; aprobadas: number }[]
}
