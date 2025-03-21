import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AntController } from '../infraestructure/AntController'
import { defineComponent, ref } from 'vue'
import { Ant } from '../domain/Ant'

export default defineComponent({
  setup() {
    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Ant, new AntController())
    const { entidad: ant, listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()
    const { onListado } = mixin.useHooks()

    onListado(() => ant.hydrate(listado.value[0]))

    return {
      mixin,
      ant,
      listado,
      listar,
      busqueda: ref(),
    }
  },
})
