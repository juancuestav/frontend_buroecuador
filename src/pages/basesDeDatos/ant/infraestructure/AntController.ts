import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Ant } from '../domain/Ant'

export class AntController extends TransaccionSimpleController<Ant> {
  constructor() {
    super(endpoints.ant)
  }
}
