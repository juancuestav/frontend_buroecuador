import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Provincia } from '../domain/Provincia'
import { endpoints } from 'config/api'

export class ProvinciaController extends TransaccionSimpleController<Provincia> {
  constructor() {
    super(endpoints.provincias)
  }
}
