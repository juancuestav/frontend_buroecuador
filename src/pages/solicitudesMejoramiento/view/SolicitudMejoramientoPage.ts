// Dependencias
import { configuracionColumnasMejoramiento } from '../domain/configuracionColumnasMejoramiento'
import { defineComponent, ref } from 'vue'
import { estadosMejoramiento } from 'config/utils'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SolicitudMejoramientoController } from '../infraestructure/SolicitudMejoramientoController'
import { Mejoramiento } from '../domain/Mejoramiento'
import useVuelidate from '@vuelidate/core'
import { TabOption } from 'components/tables/domain/TabOption'

export default defineComponent({
  components: { TabLayoutFilterTabs },
  setup() {
    const tabActual = ref('pendiente')

    const mixin = new ContenedorSimpleMixin(
      Mejoramiento,
      new SolicitudMejoramientoController()
    )

    const { entidad: mejoramiento } = mixin.useReferencias()

    const { setValidador, listar } = mixin.useComportamiento()

    const v$ = useVuelidate({}, mejoramiento)
    setValidador(v$.value)

    const tabOptions: TabOption[] = [
      // { label: 'Todo', value: '' },
      { label: 'Pendiente', value: 'PENDIENTE' },
      { label: 'En proceso', value: 'EN PROCESO' },
      { label: 'Aprobado', value: 'APROBADO' },
      { label: 'Negado', value: 'NEGADO' },
    ]

    function filtrarSolicitudes(tab: string) {
      listar({ estado: tab })
      tabActual.value = tab
    }

    /*******
     * Init
     *******/
    filtrarSolicitudes('pendiente')

    return {
      mixin,
      mejoramiento,
      estadosMejoramiento,
      configuracionColumnas: configuracionColumnasMejoramiento,
      tabOptions,
      filtrarSolicitudes,
      tabActual,
    }
  },
})
