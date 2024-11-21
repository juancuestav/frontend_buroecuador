import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { VerificaCuenta } from '../domain/VerificaCuenta'
import { endpoints } from 'config/api'

export class VerificaCuentaController extends TransaccionSimpleController<VerificaCuenta> {
  constructor() {
    super(endpoints.verificar_cuenta)
  }
}
