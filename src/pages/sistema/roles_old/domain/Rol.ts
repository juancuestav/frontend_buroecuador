import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Rol extends EntidadAuditable {
  label: string | null
  value: string | null

  constructor() {
    super()
    this.label = null
    this.value = null
  }
}
