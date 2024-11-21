import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Mejoramiento } from '../domain/Mejoramiento'
import { endpoints } from 'config/api'

export class SolicitudMejoramientoController extends TransaccionSimpleController<Mejoramiento> {
  constructor() {
    super(endpoints.solicitudes_mejoramiento)
  }
}
