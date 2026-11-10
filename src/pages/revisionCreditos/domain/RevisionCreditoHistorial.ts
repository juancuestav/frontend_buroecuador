import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

/**
 * Fila del historial de revisiones (RevisionCreditoListadoResource del
 * backend). Solo trae lo necesario para el listado: el detalle se consulta
 * con GET revision-creditos/{id}.
 */
export class RevisionCreditoHistorial extends EntidadAuditable {
  id: number | null
  created_at: string | null
  identificacion: string | null
  nombres: string | null
  resultado: string | null
  score: number | null
  equifax: string | null
  asesor: string | null

  constructor() {
    super()
    this.id = null
    this.created_at = null
    this.identificacion = null
    this.nombres = null
    this.resultado = null
    this.score = null
    this.equifax = null
    this.asesor = null
  }
}
