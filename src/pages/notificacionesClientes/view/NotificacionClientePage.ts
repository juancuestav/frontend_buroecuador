// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { configuracionColumnas } from '../domain/configuracionColumnas'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, ref } from 'vue'
import { endpoints } from 'config/api'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

export default defineComponent({
  props: ['notificaciones'],
  components: {
    EssentialTable,
  },
  setup() {
    const listado: any = ref([])
    const mensaje = ref()
    const nuevoMensaje = ref(false)
    const axios = AxiosHttpRepository.getInstance()
    const notificaciones = useNotificaciones()

    async function obtenerListado() {
      const ruta = axios.getEndpoint(endpoints.notificaciones_cliente)
      const response: any = await axios.get(ruta)

      const results = response.data.results

      listado.value = [...results]
    }

    async function enviar() {
      const ruta = axios.getEndpoint(endpoints.notificaciones_cliente)

      try {
        const response: any = await axios.post(ruta, { mensaje: mensaje.value })
        notificaciones.notificarCorrecto(response.data.mensaje)
        /* listado.value = [
          ...listado.value,
          {
            fecha: new Date().toLocaleDateString(),
            mensaje: mensaje.value,
          },
        ] */
        listado.value.push(response.data.modelo)
        mensaje.value = null
      } catch (e: any) {
        notificaciones.notificarError('No se pudo enviar mensaje')
      }
    }

    async function eliminar({ entidad, posicion }) {
      const ruta =
        axios.getEndpoint(endpoints.notificaciones_cliente) + '/' + entidad.id

      try {
        const response: any = await axios.delete(ruta)
        notificaciones.notificarCorrecto(response.data.mensaje)
        listado.value.splice(posicion, 1)
        // listado.value = [...listado.value]
      } catch (error: any) {
        notificaciones.notificarError(error.response.data.mensaje)
      }
    }

    obtenerListado()

    return {
      listado,
      obtenerListado,
      mensaje,
      nuevoMensaje,
      configuracionColumnas,
      eliminar,
      enviar,
    }
  },
})
