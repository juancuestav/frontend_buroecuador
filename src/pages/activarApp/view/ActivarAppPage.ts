// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, ref } from 'vue'
import { endpoints } from 'config/api'

import CalloutComponent from 'components/CalloutComponent.vue'
import PlanetScoreAnimation from 'pages/puntuacionCliente/PlanetScoreAnimation.vue'
import { tiposServicios } from 'config/utils'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { UserProfile } from 'pages/userProfile/domain/UserProfile'
import { UserProfileController } from 'pages/userProfile/infraestructure/UserProfileController'

export default defineComponent({
  components: { CalloutComponent, PlanetScoreAnimation },
  setup() {
    /********
     * Store
     ********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      UserProfile,
      new UserProfileController()
    )
    const { entidad: userProfile } = mixin.useReferencias()
    const { consultar } = mixin.useComportamiento()

    /************
     * Variables
     ************/
    const fechaProximaFacturacion = ref()
    const pagado = ref(false)
    const tipoServicio = ref()
    const usuario = authenticationStore.user

    const planesClientes = ref()
    const planesEmpresas = ref()

    /************
     * Funciones
     ************/
    function abrirWhatsapp() {
      const phone = configuracionGeneralStore.configuracion?.whatsapp ?? ''
      const message =
        configuracionGeneralStore.configuracion?.mensaje_whatsapp ?? ''

      let url: string

      if (window.innerWidth < 768) {
        url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`
      }

      window.open(url, '_blank')
    }

    async function obtenerData() {
      const axios = AxiosHttpRepository.getInstance()
      const response: any = await axios.get(
        axios.getEndpoint(endpoints.activar_app)
      )
      planesClientes.value = response.data.planesClientes
      planesEmpresas.value = response.data.planesEmpresas
      fechaProximaFacturacion.value = response.data.fecha_proximo_pago
      pagado.value = response.data.pagado
    }

    /*******
     * Init
     *******/
    obtenerData()

    if (usuario?.user_profile_id) {
      userProfile.id = usuario.user_profile_id
      consultar(userProfile)
    }

    return {
      fechaProximaFacturacion,
      planesClientes,
      planesEmpresas,
      pagado,
      usuario,
      userProfile,
      abrirWhatsapp,
      tipoServicio,
      tiposServicios,
    }
  },
})
