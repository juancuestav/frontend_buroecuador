import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CodigoVerificacion } from '../domain/CodigoVerificacion'
import { endpoints } from 'config/api'

export class CodigoVerificacionController extends TransaccionSimpleController<CodigoVerificacion> {
  constructor() {
    super(endpoints.codigos_verificacion)
  }
}
