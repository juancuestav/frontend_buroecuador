import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Mejoramiento extends EntidadAuditable {
  cliente: string | null
  identificacion_cliente: string | null
  celular: string | null
  estado: string | null
  observacion: string | null
  maximo_subir: string | null
  deudas_vencidas: string | null
  puntaje_actual: string | null
  puntaje_subir: string | null
  fecha: string | null

  constructor() {
    super()
    this.cliente = null
    this.identificacion_cliente = null
    this.celular = null
    this.estado = null
    this.observacion = null
    this.maximo_subir = null
    this.deudas_vencidas = null
    this.puntaje_actual = null
    this.puntaje_subir = null
    this.fecha = null
  }
}
