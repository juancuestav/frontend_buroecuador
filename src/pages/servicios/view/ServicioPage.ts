// Dependencias
import { configuracionColumnasServicios } from '../domain/configuracionColumnasServicios'
import { required } from '@vuelidate/validators'
import { estadosProducto, tiposServicios } from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CategoriaController } from '../modules/categorias/infraestructure/CategoriaController'
import { ServicioController } from '../infraestructure/ServicioController'
import { Servicio } from '../domain/Servicio'

export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialEditor },
  setup() {
    const mixin = new ContenedorSimpleMixin(Servicio, new ServicioController())

    const {
      entidad: servicio,
      disabled,
      listadosAuxiliares,
      accion,
    } = mixin.useReferencias()

    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    // Reglas de validacion
    const reglas = {
      nombre: { required },
      estado: { required },
      precio_unitario: { required },
      url_destino: { required },
    }

    const v$ = useVuelidate(reglas, servicio)
    setValidador(v$.value)

    cargarVista(async () => {
      await obtenerListados({
        categorias: new CategoriaController(),
        estadosProducto: estadosProducto,
      })
    })

    return {
      mixin,
      servicio,
      accion,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasServicios,
      listadosAuxiliares,
      isPwd: ref(true),
      tiposServicios,
    }
  },
})
