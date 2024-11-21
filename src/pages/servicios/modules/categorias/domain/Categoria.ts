import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Categoria extends EntidadAuditable {
  nombre: string | null
  orden: number | null

  constructor() {
    super()
    this.nombre = null
    this.orden = null
  }
}
