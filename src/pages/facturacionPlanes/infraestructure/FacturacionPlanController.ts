import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FacturacionPlan } from '../domain/FacturacionPlan'
import { endpoints } from 'config/api'

export class FacturacionPlanController extends TransaccionSimpleController<FacturacionPlan> {
  constructor() {
    super(endpoints.facturacion_planes)
  }
}
