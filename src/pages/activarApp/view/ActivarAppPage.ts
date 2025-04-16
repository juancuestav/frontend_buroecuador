// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { defineComponent, ref } from 'vue'
import { endpoints } from 'config/api'

import CalloutComponent from 'components/CalloutComponent.vue'
import { tiposServicios } from 'config/utils'

export default defineComponent({
  components: { CalloutComponent },
  setup() {
    /********
     * Store
     ********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()

    /************
     * Variables
     ************/
    let fechaProximaFacturacion
    let pagado
    const tipoServicio = ref()

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
      fechaProximaFacturacion = response.data.fecha_proximo_pago
      pagado = response.data.pagado
    }

    /*******
     * Init
     *******/
    obtenerData()

    return {
      fechaProximaFacturacion,
      planesClientes,
      planesEmpresas,
      pagado,
      abrirWhatsapp,
      tipoServicio,
      tiposServicios,
    }
  },
})
