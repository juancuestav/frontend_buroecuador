import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CompraReporte } from '../domain/CompraReporte'
import { endpoints } from 'config/api'

export class CompraReporteController extends TransaccionSimpleController<CompraReporte> {
  constructor() {
    super(endpoints.compras)
  }
}
