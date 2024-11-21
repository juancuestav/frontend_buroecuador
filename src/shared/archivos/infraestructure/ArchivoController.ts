import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Archivo } from '../domain/Archivo'

export class ArchivoController extends TransaccionSimpleController<Archivo> {
  constructor() {
    super(endpoints.archivos)
  }
}
