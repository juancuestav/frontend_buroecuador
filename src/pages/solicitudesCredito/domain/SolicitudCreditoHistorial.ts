import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

/**
 * Fila del historial de solicitudes (SolicitudCreditoListadoResource del
 * backend). El detalle se consulta con GET solicitudes-credito/{id}.
 */
export class SolicitudCreditoHistorial extends EntidadAuditable {
  id: number | null
  created_at: string | null
  identificacion: string | null
  nombres: string | null
  asesor: string | null
  banco_nombre: string | null
  monto_solicitado: number | null
  monto_texto: string | null
  plazo_meses: number | null
  plazo_texto: string | null
  score: number | null
  estado: string | null
  estado_texto: string | null
  observacion: string | null

  constructor() {
    super()
    this.id = null
    this.created_at = null
    this.identificacion = null
    this.nombres = null
    this.asesor = null
    this.banco_nombre = null
    this.monto_solicitado = null
    this.monto_texto = null
    this.plazo_meses = null
    this.plazo_texto = null
    this.score = null
    this.estado = null
    this.estado_texto = null
    this.observacion = null
  }
}
