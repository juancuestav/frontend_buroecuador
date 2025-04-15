import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { BusquedaGeneral } from '../domain/BusquedaGeneral'

export class BusquedaGeneralController extends TransaccionSimpleController<BusquedaGeneral> {
  constructor() {
    super(endpoints.busqueda_general)
  }
}
