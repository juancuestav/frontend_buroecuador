// Dependencias
import { configuracionColumnasFacturacion } from '../domain/configuracionColumnasFacturacion'
import { defineComponent } from 'vue'
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
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FacturacionPlan } from '../domain/FacturacionPlan'
import { FacturacionPlanController } from '../infraestructure/FacturacionPlanController'

export default defineComponent({
  components: {
    EssentialTableTabs,
  },
  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      FacturacionPlan,
      new FacturacionPlanController()
    )

    const {
      entidad: facturacionPlan,
      listado,
      filtros,
    } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    /*************
     * Variables
     *************/
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

    const tabOptions: TabOption[] = [
      { label: 'Pagados', value: 1 },
      { label: 'No pagados', value: 0 },
    ]

    async function filtrarFacturacion(tabSeleccionado: string) {
      await listar({ pagado: tabSeleccionado, paginate: true }, false)

      filtros.fields = { pagado: tabSeleccionado }
      // tabActualTarea = tabSeleccionado
    }

    /*******
     * Init
     *******/
    listar({ pagado: 1, paginate: true })

    return {
      mixin,
      facturacionPlan,
      listado,
      configuracionColumnasFacturacion,
      pagado,
      noPagado,
      tabOptions,
      filtrarFacturacion,
    }
  },
})
