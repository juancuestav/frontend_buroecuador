import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoIdentificacion extends EntidadAuditable {
  descripcion: string | null

  constructor() {
    super()
    this.descripcion = null
  }
}
