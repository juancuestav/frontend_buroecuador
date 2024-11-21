import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Popup extends EntidadAuditable {
  id: number | null
  titulo: string | null
  imagen: string | null
  url_destino: string | null
  nueva_pestana: boolean

  constructor() {
    super()
    this.id = null
    this.titulo = null
    this.imagen = null
    this.url_destino = null
    this.nueva_pestana = false
  }
}
