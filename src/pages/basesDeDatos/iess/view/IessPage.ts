import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { IessController } from '../infraestructure/IessController'
import { defineComponent, ref } from 'vue'
import { Iess } from '../domain/Iess'

export default defineComponent({
  setup() {
    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Iess, new IessController())
    const { entidad: iess, listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()
    const { onListado } = mixin.useHooks()

    // listar({ paginate: true, 'f_params[limit]': 30 }, false)
    onListado(() => iess.hydrate(listado.value[0]))

    return {
      mixin,
      iess,
      listado,
      listar,
      busqueda: ref(),
    }
  },
})
