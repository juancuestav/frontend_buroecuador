// Dependencias
import { configuracionColumnasFacturacion } from '../domain/configuracionColumnasFacturacion'
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { findIndexById } from 'shared/utils'
import { endpoints } from 'config/api'
import { TabOption } from 'components/tables/domain/TabOption'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: {
    EssentialTableTabs,
  },
  setup() {
    /*************
     * Variables
     *************/
    const listado: any = ref([])
    const { notificarCorrecto } = useNotificaciones()

    const axios = AxiosHttpRepository.getInstance()
    const cargando = new StatusEssentialLoading()

    /*************
     * Funciones
     *************/
    async function pagar(id: number, indice: number) {
      const { addToDate } = date
      const fechaActual = date.formatDate(Date.now(), 'YYYY-MM-DD')
      const proximoPago = addToDate(new Date(), {
        months: 1,
      })

      const ruta = axios.getEndpoint(endpoints.facturacion_planes) + '/' + id
      try {
        const response: any = await axios.put(ruta, {})
        listado.value[indice].pagado = true
        listado.value[indice].fecha_pago = fechaActual
        listado.value[indice].proximo_pago = date.formatDate(
          proximoPago,
          'YYYY-MM-DD'
        )

        listado.value = [...listado.value]
        notificarCorrecto(response.data.mensaje)
      } catch (e) {}
    }

    async function noPagar(id: number, indice: number) {
      const ruta = axios.getEndpoint(endpoints.facturacion_planes) + '/' + id
      try {
        const response: any = await axios.delete(ruta)
        listado.value[indice].pagado = false
        listado.value = [...listado.value]
        notificarCorrecto(response.data.mensaje)
      } catch (e) {}
    }

    const pagado: CustomActionTable = {
      titulo: 'Marcar como pagado',
      icono: 'bi-check',
      color: 'positive',
      visible: ({ entidad }) => !entidad.pagado,
      accion: ({ entidad }) => {
        cargando.activar()
        const index = findIndexById(listado.value, entidad.id)
        pagar(entidad.id, index)
        cargando.desactivar()
      },
    }

    const noPagado: CustomActionTable = {
      titulo: 'Marcar como no pagado',
      icono: 'bi-x',
      visible: ({ entidad }) => entidad.pagado,
      color: 'negative',
      accion: ({ entidad }) => {
        cargando.activar()
        const index = findIndexById(listado.value, entidad.id)
        noPagar(entidad.id, index)
        cargando.desactivar()
      },
    }

    async function obtenerListado(params?) {
      cargando.activar()
      const ruta = axios.getEndpoint(endpoints.facturacion_planes, {
        pagado: params,
      })
      const response: any = await axios.get(ruta)
      listado.value = [...response.data.results]
      cargando.desactivar()
    }

    obtenerListado('true')

    const tabOptions: TabOption[] = [
      // { label: 'Todo', value: '' },
      { label: 'Pagados', value: 'true' },
      { label: 'No pagados', value: 'false' },
    ]

    return {
      listado,
      configuracionColumnasFacturacion,
      pagado,
      noPagado,
      tabOptions,
      obtenerListado,
    }
  },
})
