// Dependencias
import { configuracionColumnasRegistroCivil } from '../domain/configuracionColumnasRegistroCivil'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTablePagination from 'components/tables/view/EssentialTablePagination.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RegistroCivilController } from '../infraestructure/RegistroCivilController'
import { RegistroCivil } from '../domain/RegistroCivil'

export default defineComponent({
  components: {
    EssentialTablePagination,
  },
  setup() {
    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      RegistroCivil,
      new RegistroCivilController()
    )
    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    listar({ paginate: true, 'f_params[limit]': 30 }, false)

    return {
      mixin,
      listado,
      configuracionColumnasRegistroCivil,
      listar,
      busqueda: ref(),
    }
  },
})
