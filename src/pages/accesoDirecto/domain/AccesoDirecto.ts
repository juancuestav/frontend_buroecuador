import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AccesoDirecto extends EntidadAuditable {
  titulo: string | null = null
  link: string | null = null
  descripcion: string | null = ''
  imagen: string | null = null
  nueva_pestana: boolean = false

  constructor() {
    super()
  }
}
