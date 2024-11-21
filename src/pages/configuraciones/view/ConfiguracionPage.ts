// Dependencias
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { estados } from 'config/utils'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ConfiguracionController } from '../infraestructure/ConfiguracionController'
import { Configuracion } from '../domain/Configuracion'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Configuracion,
      new ConfiguracionController()
    )

    const { entidad: configuracion, listado } = mixin.useReferencias()
    const { listar, guardar, setValidador } = mixin.useComportamiento()
    const { onListado, onGuardado } = mixin.useHooks()

    /****************
     * Validaciones
     ****************/
    const reglas = {
      ruc: { required },
      representante: { required },
      razon_social: { required },
      tipo_contribuyente: { required },
      nombre_empresa: { required },
      nombre_comercial: { required },
      moneda: { required },
    }

    const v$ = useVuelidate(reglas, configuracion)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onListado(() => configuracion.hydrate(listado.value[0]))
    onGuardado(() => location.reload())

    /********
     * Init
     ********/
    listar()

    return {
      v$,
      configuracion,
      guardar,
      estados,
    }
  },
})
