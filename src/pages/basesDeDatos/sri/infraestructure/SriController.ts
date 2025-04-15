import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Sri } from '../domain/Sri'

export class SriController extends TransaccionSimpleController<Sri> {
  constructor() {
    super(endpoints.sri)
  }
}
