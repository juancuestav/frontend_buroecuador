import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class FacturacionPlan extends EntidadAuditable {
  identificacion: string | null
  cliente: string | null
  pagado: boolean
  fecha_pago: string
  proximo_pago: string
  acciones: string | null

  constructor() {
    super()
    this.identificacion = null
    this.cliente = null
    this.pagado = false
    this.fecha_pago = ''
    this.proximo_pago = ''
    this.acciones = null
  }
}
