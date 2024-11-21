import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Categoria } from '../domain/Categoria'

export class CategoriaController extends TransaccionSimpleController<Categoria> {
  constructor() {
    super(endpoints.categorias)
  }
}
