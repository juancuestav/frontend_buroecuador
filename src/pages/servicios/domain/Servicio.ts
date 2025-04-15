import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ESTADOS_PRODUCTO } from 'config/utils'

export class Servicio extends EntidadAuditable {
  nombre: string | null
  descripcion: string | null
  nombre_categoria: string | null = null
  categoria: number | null
  estado: string | null
  precio_unitario: number | null
  gravable: boolean
  iva: number | null
  es_plan: boolean
  imagen: string | null | ArrayBuffer
  url_video: string | null
  url_destino: string | null
  url_paypal: string | null

  tipo_servicio: string | null = 'SERVICIO'

  constructor() {
    super()
    this.nombre = null
    this.descripcion = ''
    this.categoria = null
    this.estado = ESTADOS_PRODUCTO.ACTIVO
    this.precio_unitario = null
    this.gravable = true
    this.iva = null
    this.es_plan = false
    this.imagen = null
    this.url_video = null
    this.url_destino = null
    this.url_paypal = null
  }
}
