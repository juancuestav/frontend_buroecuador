// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { defineComponent, ref } from 'vue'
import { endpoints } from 'config/api'

export default defineComponent({
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
    const verPlanes = ref(false)

    const planes = ref()

    /************
     * Funciones
     ************/
    function abrirWhatsapp() {
      const celular = configuracionGeneralStore.configuracion?.whatsapp ?? ''

      const phone = '593' + celular.substring(1, celular.length)
      let url: string

      if (window.innerWidth < 768) {
        url = `https://api.whatsapp.com/send?phone=${phone}`
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}`
      }

      window.open(url, '_blank')
    }

    async function obtenerData() {
      const axios = AxiosHttpRepository.getInstance()
      const response: any = await axios.get(
        axios.getEndpoint(endpoints.activar_app)
      )
      planes.value = response.data.planes
      fechaProximaFacturacion = response.data.fecha_proximo_pago
      pagado = response.data.pagado
    }

    /*******
     * Init
     *******/
    obtenerData()

    return {
      fechaProximaFacturacion,
      verPlanes,
      planes,
      pagado,
      abrirWhatsapp,
    }
  },
})
