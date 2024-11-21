import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ArchivoReporte } from '../domain/ArchivoReporte'
import { endpoints } from 'config/api'

export class ArchivoReporteController extends TransaccionSimpleController<ArchivoReporte> {
  constructor() {
    super(endpoints.archivos_reportes)
  }
}
