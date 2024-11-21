import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Permiso } from 'pages/sistema/permisos/domain/Permiso'
import { endpoints } from 'config/api'

export class PermisosUsuarioController extends TransaccionSimpleController<Permiso> {
  constructor() {
    super(endpoints.permisos_roles_usuario)
  }
}
