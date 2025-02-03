import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Canton } from '../domain/Provincia'
import { endpoints } from 'config/api'

export class CantonController extends TransaccionSimpleController<Canton> {
  constructor() {
    super(endpoints.ciudades)
  }
}
