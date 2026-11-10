import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { RevisionCreditoHistorial } from '../domain/RevisionCreditoHistorial'
import { endpoints } from 'config/api'

export class RevisionCreditoController extends TransaccionSimpleController<RevisionCreditoHistorial> {
  constructor() {
    super(endpoints.revision_creditos)
  }
}
