import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Iess } from '../domain/Iess'

export class IessController extends TransaccionSimpleController<Iess> {
  constructor() {
    super(endpoints.iess)
  }
}
