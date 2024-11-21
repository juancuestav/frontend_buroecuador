// Dependencias
import { configuracionColumnasOperacionesCanceladas } from '../domain/configuracionColumnasOperacionesCanceladas'
import { configuracionColumnasHistorialCrediticio } from '../domain/configuracionColumnasHistorialCrediticio'
import { configuracionColumnasOperacionesCredito } from '../domain/configuracionColumnasOperacionesCredito'
import { configuracionColumnasEstablecimientos } from '../domain/configuracionColumnasEstablecimientos'
import { configuracionColumnasConsultasCliente } from '../domain/configuracionColumnasConsultasCliente'
import { configuracionColumnasSaldosPorVencer } from '../domain/configuracionColumnasSaldosPorVencer'
import { configuracionColumnasVencimientos } from '../domain/configuracionColumnasVencimientos'
import { configuracionColumnasActividades } from '../domain/configuracionColumnasActividades'
import { configuracionColumnasMorosidades } from '../domain/configuracionColumnasMorosidades'
import { configuracionColumnasSeguros } from '../domain/configuracionColumnasSeguros'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import TableViewHistorialCrediticio from 'components/tables/view/TableViewHistorialCrediticio.vue'
import TableView from 'components/tables/view/TableView.vue'
import ReportePreview from './ReportePreview.vue' //'pages/reportes/crearReporte/view/ReportePreview.vue'
import Contador from 'components/ContadorComponent.vue'
import html2pdf from 'html2pdf.js'

// Logica y controladores
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { useReporteStore } from 'stores/reporte'
import { endpoints } from 'config/api'

export default defineComponent({
  props: {
    permitirEditar: {
      type: Boolean,
      default: false,
    },
    consultarReporte: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TableView,
    TableViewHistorialCrediticio,
    Contador,
    ReportePreview,
  },
  setup() {
    const store = useReporteStore()
    const reporte = computed(() => store.reporte)
    const actividadesEconomicas: any = ref()
    const establecimientos: any = ref()
    const totalEstablecimientos = computed(() => {
      if (establecimientos.value) {
        return establecimientos.value.length
      }
      return 0
    })

    const fechaActual = new Date().toLocaleDateString()

    function volver() {
      store.mostrarFormulario()
    }

    function mostrarEditarReporte() {
      store.mostrarEditarReporteConsultar()
    }

    function volverMisReportes() {
      store.mostrarFormularioMiReporte()
    }

    const refPDF = ref()
    function imprimir() {
      const contenido = refPDF.value
      html2pdf()
        .set({
          margin: 0,
          filename: 'reporte.pdf',
          image: {
            type: 'jpeg',
            quality: 0.98,
          },
          html2canvas: {
            scale: 3,
            letterRendering: true,
          },
          jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait',
          },
        })
        .from(contenido)
        .save()
        .catch((err) => console.log(err))
    }

    const { notificarCorrecto, notificarError } = useNotificaciones()
    async function guardar() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.reportes)

      try {
        const response: any = await axios.post(ruta, {
          reporte: reporte.value,
        })
        notificarCorrecto(response.data.mensaje)
      } catch (e: any) {
        notificarError(e.response.data.mensaje)
      }
    }

    return {
      refPDF,
      reporte,
      fechaActual,
      guardar,
      totalEstablecimientos,
      volver,
      imprimir,
      mostrarEditarReporte,
      volverMisReportes,
      // tipoGrafico,
      configuracionColumnasActividades,
      configuracionColumnasEstablecimientos,
      configuracionColumnasOperacionesCredito,
      configuracionColumnasHistorialCrediticio,
      configuracionColumnasConsultasCliente,
      configuracionColumnasMorosidades,
      configuracionColumnasVencimientos,
      configuracionColumnasSaldosPorVencer,
      configuracionColumnasOperacionesCanceladas,
      configuracionColumnasSeguros,
      // Listados
      actividadesEconomicas,
      establecimientos,
    }
  },
})
