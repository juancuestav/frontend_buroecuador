// Dependencias
import { configuracionColumnasNotificaciones } from '../domain/configuracionColumnasNotificaciones'
import { defineComponent } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { NotificacionController } from '../infraestructure/NotificacionController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { TabOption } from 'components/tables/domain/TabOption'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { Notificacion } from '../domain/Notificacion'
import { findIndexById } from 'shared/utils'
import { useChatStore } from 'stores/chat'
import { endpoints } from 'config/api'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: {
    EssentialTableTabs,
  },
  setup() {
    const axios = AxiosHttpRepository.getInstance()

    const mixin = new ContenedorSimpleMixin(
      Notificacion,
      new NotificacionController()
    )
    const { listado } = mixin.useReferencias()
    const { cargarVista } = mixin.useComportamiento()

    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())

    const tabOptions: TabOption[] = [
      { label: 'Nuevos', value: 'nuevos' },
      { label: 'Leídos', value: 'leidos' },
    ]

    async function obtenerListado(params?) {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(
          endpoints.notificaciones_formulario_contacto,
          {
            tipo: params,
          }
        )
        const response: any = await axios.get(ruta)
        listado.value = [...response.data.results]
      })
    }

    obtenerListado('nuevos')

    const store = useChatStore()

    const abrirChat: CustomActionTable = {
      titulo: 'Leer mensaje',
      icono: 'bi-chat-right-dots',
      accion: async ({ entidad }) => {
        const ruta =
          axios.getEndpoint(endpoints.notificaciones_formulario_contacto) + '/' + entidad.id
        const response: any = await axios.get(ruta)

        store.setNotificacion(response.data.modelo)
        store.mostrarChat()
      },
    }

    const marcarLeido: CustomActionTable = {
      titulo: 'Marcar como leído',
      visible: ({ entidad }) => entidad.estado === 'NUEVO',
      icono: 'bi-check',
      color: 'positive',
      accion: ({ entidad }) => {
        const { notificarCorrecto, confirmar } = useNotificaciones()
        confirmar(
          '¿Está seguro de que desea marcar éste mensaje como leído?',
          () =>
            cargarVista(async () => {
              const ruta =
                axios.getEndpoint(endpoints.notificaciones_formulario_contacto) + '/' + entidad.id
              const response: any = await axios.put(ruta, {})
              listado.value.splice(findIndexById(listado.value, entidad.id), 1)
              notificarCorrecto(response.data.mensaje)
            })
        )
      },
    }

    return {
      listado,
      configuracionColumnasNotificaciones,
      abrirChat,
      marcarLeido,
      tabOptions,
      obtenerListado,
    }
  },
})
