// Dependencias
import { configuracionColumnasUsuarios } from 'pages/usuarios/domain/configuracionColumnasUsuarios'
import { configuracionColumnasMiReporte } from '../domain/configuracionColumnasMiReporte'
import { defineComponent, onMounted, reactive, ref } from 'vue'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { useOrquestadorUsuario } from '../application/OrquestadorSelectorUsuario'
import { ItemMiReporte } from '../domain/ItemMiReporte'
import { useNotificaciones } from 'shared/notificaciones'
import { endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useReporteStore } from 'stores/reporte'

export default defineComponent({
  components: { EssentialTable, EssentialSelectableTable },
  setup() {
    const listado: any = ref([])
    const cliente = reactive({ id: null, nombres: null, identificacion: null })

    const axios = AxiosHttpRepository.getInstance()
    const { notificarAdvertencia, notificarCorrecto, confirmar } =
      useNotificaciones()
    const reporteStore = useReporteStore()

    async function obtenerListado() {
      const params = '?usuario=' + cliente.id
      const ruta = axios.getEndpoint(endpoints.reportes) + params
      const response: any = await axios.get(ruta)

      const results = response.data.results

      if (results.length === 0)
        notificarAdvertencia(
          'El usuario seleccionado no tiene reportes asignados'
        )

      const data: any = []
      for (let i = 0; i < results.length; i++) {
        const item = new ItemMiReporte()
        item.id = results[i].id
        item.nombre = 'REPORTE ' + results[i].cliente + '-' + results[i].id
        item.fecha = results[i].fecha
        data.push(item)
      }

      listado.value = [...data]
      reporteStore.setReportesConsultados(data)
    }

    const {
      refListadoSeleccionableUsuario,
      criterioBusquedaUsuario,
      listadoUsuarios,
      listarUsuarios,
      limpiarUsuario,
      seleccionarUsuario,
    } = useOrquestadorUsuario(cliente, 'usuarios')

    async function editarReporte({ entidad }) {
      try {
        const response: any = await axios.get(
          axios.getEndpoint(endpoints.reportes) + '/' + entidad.id
        )
        reporteStore.reporte = JSON.parse(response.data.reporte.reporte)
        reporteStore.mostrarEditarReporteConsultar()
        reporteStore.cliente = cliente
        reporteStore.idReporteActual = entidad.id
      } catch (e: any) {
        console.log('error')
      }
    }

    function eliminarReporte({ entidad, posicion }) {
      confirmar('¿Desea continuar?', async () => {
        try {
          const response: any = await axios.delete(
            axios.getEndpoint(endpoints.reportes) + '/' + entidad.id
          )
          notificarCorrecto(response.data.mensaje)
          listado.value.splice(posicion, 1)
        } catch (e: any) {
          //
        }
      })
    }

    onMounted(() => {
      listado.value = reporteStore.reportesConsultados
      if (reporteStore.cliente) {
        cliente.id = reporteStore.cliente.id
        cliente.nombres = reporteStore.cliente.nombres
        criterioBusquedaUsuario.value = reporteStore.cliente.identificacion
      }
    })

    return {
      configuracionColumnasUsuarios,
      configuracionColumnasMiReporte,
      listado,
      cliente,
      obtenerListado,
      editarReporte,
      eliminarReporte,
      // Orquestador
      refListadoSeleccionableUsuario,
      criterioBusquedaUsuario,
      listadoUsuarios,
      listarUsuarios,
      limpiarUsuario,
      seleccionarUsuario,
    }
  },
})
