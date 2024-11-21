// Dependencias
import { configuracionColumnasMiReporte } from '../../consultarReporte/domain/configuracionColumnasMiReporte'
import { defineComponent, ref, onMounted } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { ItemMiReporte } from 'pages/reportes/consultarReporte/domain/ItemMiReporte'
import { useAuthenticationStore } from 'stores/authentication'
import { useReporteStore } from 'stores/reporte'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const listado: any = ref([])
    const axios = AxiosHttpRepository.getInstance()

    const store = useAuthenticationStore()
    const reporteStore = useReporteStore()

    onMounted(() => {
      obtenerListado()
    })

    async function obtenerListado() {
      const ruta = axios.getEndpoint(endpoints.reportes, {
        usuario: store.user.id,
      })
      const response: any = await axios.get(ruta)

      const results = response.data.results
      const data: any = []
      for (let i = 0; i < results.length; i++) {
        const item = new ItemMiReporte()
        item.id = results[i].id
        item.nombre = 'REPORTE ' + results[i].cliente + '-' + results[i].id
        item.fecha = results[i].fecha
        data.push(item)
      }

      listado.value = [...data]
    }

    async function consultar({ entidad }) {
      try {
        const response: any = await axios.get(
          axios.getEndpoint(endpoints.reportes) + '/' + entidad.id
        )
        reporteStore.reporte = JSON.parse(response.data.reporte.reporte)
        reporteStore.mostrarReportePDFMiReporte()
      } catch (e: any) {
        console.log('error')
      }
    }

    return {
      configuracionColumnasMiReporte,
      listado,
      consultar,
    }
  },
})
