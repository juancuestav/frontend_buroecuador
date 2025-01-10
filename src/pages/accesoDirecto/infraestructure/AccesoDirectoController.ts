import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { AccesoDirecto } from '../domain/AccesoDirecto'
import { endpoints } from 'config/api'

export class AccesoDirectoController extends TransaccionSimpleController<AccesoDirecto> {
  constructor() {
    super(endpoints.accesos_directos)
  }
}
