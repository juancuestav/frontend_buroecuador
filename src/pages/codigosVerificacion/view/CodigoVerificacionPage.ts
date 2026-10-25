// Dependencias
import { required, requiredIf, minLength, maxLength } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { acciones } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasCodigosVerificacion } from '../domain/configuracionColumnasCodigosVerificacion'
import { CodigoVerificacionController } from '../infraestructure/CodigoVerificacionController'
import { CodigoVerificacion } from '../domain/CodigoVerificacion'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { endpoints } from 'config/api'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      CodigoVerificacion,
      new CodigoVerificacionController()
    )
    const { entidad: codigo, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    const { notificarCorrecto, notificarError } = useNotificaciones()

    const esNuevo = computed(() => accion.value === acciones.nuevo)

    // Reglas de validacion: al editar, el código solo se envía si se quiere cambiar
    const reglas = {
      descripcion: { required },
      codigo: {
        required: requiredIf(() => esNuevo.value),
        minLength: minLength(4),
        maxLength: maxLength(20),
      },
    }

    const v$ = useVuelidate(reglas, codigo)
    setValidador(v$.value)

    const mostrarCodigo = ref(false)

    /****************************************
     * Solicitar código al generar reportes
     ****************************************/
    const axios = AxiosHttpRepository.getInstance()
    const rutaEstado = axios.getEndpoint(endpoints.codigos_verificacion_estado)
    const requiereCodigo = ref(true)
    const cargandoEstado = ref(false)

    async function obtenerEstado() {
      try {
        const response: any = await axios.get(rutaEstado)
        requiereCodigo.value = response.data.requiere_codigo_verificacion
      } catch (error: any) {
        notificarError('No se pudo consultar si se solicita el código.')
      }
    }

    async function cambiarEstado(valor: boolean) {
      cargandoEstado.value = true
      try {
        const response: any = await axios.put(rutaEstado, {
          requiere_codigo_verificacion: valor,
        })
        requiereCodigo.value = response.data.requiere_codigo_verificacion
        notificarCorrecto(response.data.mensaje)
      } catch (error: any) {
        requiereCodigo.value = !valor
        notificarError('No se pudo actualizar la configuración.')
      } finally {
        cargandoEstado.value = false
      }
    }

    onMounted(obtenerEstado)

    return {
      mixin,
      codigo,
      v$,
      disabled,
      esNuevo,
      mostrarCodigo,
      requiereCodigo,
      cargandoEstado,
      cambiarEstado,
      configuracionColumnasCodigosVerificacion,
    }
  },
})
