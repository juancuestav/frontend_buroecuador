import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class LineaPedido extends EntidadAuditable {
  precio: number
  pedido: number | null
  servicio: string | number | null

  constructor() {
    super()
    this.precio = 0
    this.pedido = null
    this.servicio = null
  }
}
