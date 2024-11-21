import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { AprobarVerificarCuenta } from '../domain/AprobarVerificarCuenta'
import { endpoints } from 'config/api'

export class AprobarVerificarCuentaController extends TransaccionSimpleController<AprobarVerificarCuenta> {
  constructor() {
    super(endpoints.verificar_cuenta)
  }
}
