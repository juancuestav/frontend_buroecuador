import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class ActivarAppController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.usuarios)
  }
}
