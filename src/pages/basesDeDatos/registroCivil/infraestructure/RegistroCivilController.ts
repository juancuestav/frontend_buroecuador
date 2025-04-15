import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { RegistroCivil } from '../domain/RegistroCivil'
import { endpoints } from 'config/api'

export class RegistroCivilController extends TransaccionSimpleController<RegistroCivil> {
  constructor() {
    super(endpoints.registro_civil)
  }
}
