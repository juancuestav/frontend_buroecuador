// Depencias
import {  defineComponent } from 'vue'
import { required } from '@vuelidate/validators'

// Componentes
import CardLayout from 'shared/contenedor/modules/simple/view/CardLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PopupController } from '../infraestructure/PopupController'
import { Popup } from '../domain/Popup'
import useVuelidate from '@vuelidate/core'

export default defineComponent({
  components: { CardLayout, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(Popup, new PopupController())

    const { entidad: publicidad } = mixin.useReferencias()

    const { setValidador } = mixin.useComportamiento()

    // Reglas de validacion
    const reglas = {
      titulo: { required },
      imagen: { required },
    }

    const v$ = useVuelidate(reglas, publicidad)
    setValidador(v$.value)

    function resetearNuevaPestana() {
      publicidad.url_destino ? null : (publicidad.nueva_pestana = false)
    }

    /* const negocioSeleccionado = async (negocio: number) => {
      const axios = AxiosHttpRepository.getInstance()
      try {
        cargarVista(async () => {
          const {data} = await axios.post<any>(
            axios.getEndpoint(endpoints.seleccionar_negocio),
            {negocio}
          )
        })
      } catch (error: any) {
        notificarError(error.response.data.mensaje)
      }
    } */

    return {
      mixin,
      publicidad,
      resetearNuevaPestana,
      v$,
    }
  },
})
