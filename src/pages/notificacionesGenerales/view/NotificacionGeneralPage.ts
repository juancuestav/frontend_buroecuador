// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { defineComponent, ref } from 'vue'
import { endpoints } from 'config/api'

export default defineComponent({
  setup() {
    const listado: any = ref([])
    const mensaje = ref()
    const nuevoMensaje = ref(false)
    const axios = AxiosHttpRepository.getInstance()

    async function obtenerListado() {
      const ruta = axios.getEndpoint(endpoints.notificaciones_cliente)
      const response: any = await axios.get(ruta)

      const results = response.data.results

      listado.value = [...results]
    }

    obtenerListado()

    return {
      listado,
      obtenerListado,
      mensaje,
      nuevoMensaje,
    }
  },
})
