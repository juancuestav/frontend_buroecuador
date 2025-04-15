import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { DashboardPrecalifica } from '../domain/DashboardPrecalifica'

export class DashboardPrecalificaController extends TransaccionSimpleController<DashboardPrecalifica> {
  constructor() {
    super(endpoints.dashboard_precalifica)
  }
}
