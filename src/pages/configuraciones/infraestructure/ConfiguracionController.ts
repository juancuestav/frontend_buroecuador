import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Configuracion } from '../domain/Configuracion'

export class ConfiguracionController extends TransaccionSimpleController<Configuracion> {
  constructor() {
    super(endpoints.configuraciones_generales)
  }
}
