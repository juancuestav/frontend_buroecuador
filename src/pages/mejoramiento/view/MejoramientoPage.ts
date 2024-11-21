// Dependencias
import { defineComponent, ref, reactive } from 'vue'
import { estadosSI_NO, puntuaciones, estadosMejoramiento } from 'config/utils'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

// Componentes
import CardMejoramiento from './CardMejoramiento.vue'

// Logica y controladores
import { endpoints } from 'config/api'
import { Mejoramiento } from '../domain/Mejoramiento'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { gestionarNotificacionError } from 'shared/utils'
import { ApiError } from 'shared/error/domain/ApiError'

export default defineComponent({
  /* props: {
    solicitud: Object,
    cantidadSolicitudesEnviadas: Number,
  }, */
  components: {
    CardMejoramiento,
  },
  setup() {
    const listado: any = ref([])
    const solicitudData = ref()
    const mejoramiento = reactive(new Mejoramiento())
    mejoramiento.fecha = new Date().toLocaleDateString()
    const nuevoMensaje = ref(false)
    const solicitudesEnviadas = ref()

    // Reglas de validacion
    const reglas = {
      puntaje_actual: { required },
      deudas_vencidas: { required },
      puntaje_subir: { required },
    }

    const v$ = useVuelidate(reglas, mejoramiento)

    const notificaciones = useNotificaciones()

    // solicitudesEnviadas.value = props.cantidadSolicitudesEnviadas

    async function listar() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.mejoramiento)

      try {
        const response: any = await axios.get(ruta)
        solicitudData.value = response.data.results
        solicitudesEnviadas.value = response.data.cantidadSolicitudesEnviadas
      } catch (e: any) {}
    }

    listar()

    async function enviar() {
      if (!(await v$.value.$validate())) {
        return notificaciones.notificarAdvertencia('Verifique el formulario')
      }

      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.mejoramiento)

      try {
        const response: any = await axios.post(ruta, mejoramiento)
        notificaciones.notificarCorrecto(response.data.mensaje)
        solicitudData.value = response.data.modelo
        mejoramiento.hydrate(new Mejoramiento())
        mejoramiento.fecha = new Date().toLocaleDateString()
        solicitudesEnviadas.value = solicitudesEnviadas.value + 1
        v$.value.$reset()
      } catch (e: any) {
        gestionarNotificacionError(new ApiError(e), notificaciones)
      }
    }

    return {
      solicitudesEnviadas,
      listado,
      mejoramiento,
      nuevoMensaje,
      enviar,
      solicitudData,
      estadosSI_NO,
      puntuaciones,
      estadosMejoramiento,
      v$,
    }
  },
})
