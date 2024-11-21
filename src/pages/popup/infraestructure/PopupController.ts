import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class PopupController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.popup)
  }
}
