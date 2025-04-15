import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Banco } from '../domain/Banco'

export class BancoController extends TransaccionSimpleController<Banco> {
  constructor() {
    super(endpoints.banco)
  }
}
