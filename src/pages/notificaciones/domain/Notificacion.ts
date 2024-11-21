import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Notificacion extends EntidadAuditable {
  tiempo: string | null
  cliente: string | null
  correo: string | null
  acciones: string | null

  constructor() {
    super()
    this.tiempo = null
    this.cliente = null
    this.correo = null
    this.acciones = null
  }
}
