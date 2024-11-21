import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoIdentificacion } from '../domain/TipoIdentificacion'
import { endpoints } from 'config/api'

export class TipoIdentificacionController extends TransaccionSimpleController<TipoIdentificacion> {
  constructor() {
    super(endpoints.tipos_identificaciones)
  }
}
