// Dependencias
import { configuracionColumnasEmailMarketing } from '../domain/configuracionColumnasEmailMarketing'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'

export default defineComponent({
  components: {
    EssentialTable,
  },
  setup() {
    const listado: any = ref([])
    const axios = AxiosHttpRepository.getInstance()

    async function obtenerListado() {
      const ruta = axios.getEndpoint(endpoints.email_marketing)
      const response: any = await axios.get(ruta)

      const results = response.data.results

      listado.value = [...results]
    }

    obtenerListado()

    return {
      listado,
      configuracionColumnasEmailMarketing,
    }
  },
})
