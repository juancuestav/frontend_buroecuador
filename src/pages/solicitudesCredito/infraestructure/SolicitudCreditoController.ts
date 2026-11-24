import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { SolicitudCreditoHistorial } from '../domain/SolicitudCreditoHistorial'
import { endpoints } from 'config/api'

export class SolicitudCreditoController extends TransaccionSimpleController<SolicitudCreditoHistorial> {
  constructor() {
    super(endpoints.solicitudes_credito)
  }
}
