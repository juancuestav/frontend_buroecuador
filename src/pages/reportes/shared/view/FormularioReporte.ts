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
import { configuracionColumnasUsuario } from '../domain/configuracionColumnasUsuario'
import { configuracionColumnasSeguros } from '../domain/configuracionColumnasSeguros'
import { configuracionColumnasUsuarios } from 'pages/usuarios/domain/configuracionColumnasUsuarios'
import { defineComponent, ref, onMounted, computed, Ref } from 'vue'
import { tiposReportes, tiposContribuyente } from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import { OperacionCredito } from '../domain/OperacionCredito'
import { Actividad } from '../domain/Actividad'
import { Establecimiento } from '../domain/Establecimiento'
import { ItemHistorialCrediticio } from '../domain/ItemHistorialCrediticio'

import { ItemConsultasCliente } from '../domain/ItemConsultasCliente'
import { ItemMorosidad } from '../domain/ItemMorosidad'
import { ItemVencimiento } from '../domain/ItemVencimiento'
import { ItemSaldoPorVencer } from '../domain/ItemSaldoPorVencer'
import { ItemOperacionCancelada } from '../domain/ItemOperacionCancelada'
import { ItemSeguro } from '../domain/ItemSeguro'
import { useReporteStore } from 'stores/reporte'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { useOrquestadorSelectorClientes } from '../../crearReporte/application/OrquestadorSelectorClientes'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'FormularioReporte',
  components: {
    EssentialTable,
    EssentialSelectableTable,
  },
  props: {
    permitirEditar: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useReporteStore()

    const reporte = computed({
      get: () => store.reporte,
      set: (value: any) => store.setReporte(value),
    })
    // Listados
    const actividadesEconomicas: Ref<Actividad[]> = ref([])
    const establecimientos: Ref<Establecimiento[]> = ref([])
    const operacionesCreditoBancarias: Ref<OperacionCredito[]> = ref([])
    const operacionesCreditoComerciales: Ref<OperacionCredito[]> = ref([])
    const historialCrediticio: Ref<ItemHistorialCrediticio[]> = ref([])
    const consultasCliente: Ref<ItemConsultasCliente[]> = ref([])
    const morosidades: Ref<ItemMorosidad[]> = ref([])
    const vencimientos: Ref<ItemVencimiento[]> = ref([])
    const saldosPorVencer: Ref<ItemSaldoPorVencer[]> = ref([])
    const operacionesCanceladas: Ref<ItemOperacionCancelada[]> = ref([])
    const seguros: Ref<ItemSeguro[]> = ref([])

    const acciones = {
      name: 'acciones',
      field: 'acciones',
      label: 'Acciones',
      align: 'left',
    }

    const $q = useQuasar()

    const columnasHistorialCrediticio = computed(() =>
      $q.screen.xs
        ? [acciones, ...configuracionColumnasHistorialCrediticio]
        : configuracionColumnasHistorialCrediticio
    )

    const {
      confirmar,
      notificarCorrecto,
      notificarError,
      notificarAdvertencia,
    } = useNotificaciones()

    // Actividad economica
    const agregarActividad: CustomActionTable = {
      titulo: 'Agregar actividad económica',
      accion: () => {
        const fila = new Actividad()
        actividadesEconomicas.value = [...actividadesEconomicas.value, fila]
      },
    }

    const eliminarActividadEconomica = ({ posicion }) => {
      confirmar('¿Desea continuar?', () =>
        actividadesEconomicas.value.splice(posicion, 1)
      )
    }

    // Establecimientos
    const agregarEstablecimiento: CustomActionTable = {
      titulo: 'Agregar establecimiento',
      accion: () => {
        const fila = new Establecimiento()
        establecimientos.value = [...establecimientos.value, fila]
      },
    }

    const eliminarEstablecimiento = ({ posicion }) => {
      confirmar('¿Desea continuar?', () =>
        establecimientos.value.splice(posicion, 1)
      )
    }

    // OperacionCreditoBancaria
    const agregarOperacionCreditoBancaria: CustomActionTable = {
      titulo: 'Agregar operación de credito bancaria',
      accion: () => {
        const fila = new OperacionCredito()
        operacionesCreditoBancarias.value = [
          ...operacionesCreditoBancarias.value,
          fila,
        ]
      },
    }

    const eliminarOperacionCreditoBancaria = ({ posicion }) => {
      confirmar('¿Desea continuar?', () =>
        operacionesCreditoBancarias.value.splice(posicion, 1)
      )
    }

    // OperacionCreditoComercial
    const agregarOperacionCreditoComercial: CustomActionTable = {
      titulo: 'Agregar operación de credito comercial',
      accion: () => {
        const fila = new OperacionCredito()
        operacionesCreditoComerciales.value = [
          ...operacionesCreditoComerciales.value,
          fila,
        ]
      },
    }

    const eliminarOperacionCreditoComercial = ({ posicion }) => {
      confirmar('¿Desea continuar?', () =>
        operacionesCreditoComerciales.value.splice(posicion, 1)
      )
    }

    // SaldoPorVencer
    const agregarSaldoPorVencer: CustomActionTable = {
      titulo: 'Agregar fila',
      accion: () => {
        const fila = new ItemSaldoPorVencer()
        saldosPorVencer.value = [...saldosPorVencer.value, fila]
      },
    }

    const eliminarSaldoPorVencer = ({ posicion }) => {
      confirmar('¿Desea continuar?', () =>
        saldosPorVencer.value.splice(posicion, 1)
      )
    }

    // OperacionCancelada
    const agregarOperacionCancelada: CustomActionTable = {
      titulo: 'Agregar fila',
      accion: () => {
        const fila = new ItemOperacionCancelada()
        operacionesCanceladas.value = [...operacionesCanceladas.value, fila]
      },
    }

    const eliminarOperacionCancelada = ({ posicion }) => {
      confirmar('¿Desea continuar?', () =>
        operacionesCanceladas.value.splice(posicion, 1)
      )
    }

    // Resumen Vencimiento
    const agregarResumenVencimiento: CustomActionTable = {
      titulo: 'Agregar fila',
      accion: () => {
        const fila = new ItemVencimiento()
        vencimientos.value = [...vencimientos.value, fila]
      },
    }

    const eliminarResumenVencimiento = ({ posicion }) => {
      confirmar('¿Desea continuar?', () =>
        vencimientos.value.splice(posicion, 1)
      )
    }

    // Llenado de listados
    function verificarListados() {
      // establecimientos
      if (!reporte.value.establecimientos.length) {
        establecimientos.value = [
          ...establecimientos.value,
          new Establecimiento(),
        ]
      } else {
        establecimientos.value = reporte.value.establecimientos
      }

      // Operaciones Credito Bancarias
      if (!reporte.value.operacionesCreditoBancarias.length) {
        operacionesCreditoBancarias.value = [
          ...operacionesCreditoBancarias.value,
          new OperacionCredito(),
        ]
      } else {
        operacionesCreditoBancarias.value =
          reporte.value.operacionesCreditoBancarias
      }

      // Operaciones Credito Comerciales
      if (!reporte.value.operacionesCreditoComerciales.length) {
        operacionesCreditoComerciales.value = [
          ...operacionesCreditoComerciales.value,
          new OperacionCredito(),
        ]
      } else {
        operacionesCreditoComerciales.value =
          reporte.value.operacionesCreditoComerciales
      }

      // Listados con valor predeterminado
      actividadesEconomicas.value = reporte.value.actividadesEconomicas
      historialCrediticio.value = reporte.value.historialCrediticio
      consultasCliente.value = reporte.value.consultasCliente
      morosidades.value = reporte.value.morosidades
      vencimientos.value = reporte.value.vencimientos
      saldosPorVencer.value = reporte.value.saldosPorVencer
      operacionesCanceladas.value = reporte.value.operacionesCanceladas
      seguros.value = reporte.value.seguros

      if (reporte.value.usuario) seleccionarUsuario(reporte.value.usuario)
    }

    onMounted(() => {
      setTimeout(() => verificarListados(), 500)
    })

    function generarReporte() {
      reporte.value.actividadesEconomicas = actividadesEconomicas.value
      reporte.value.establecimientos = establecimientos.value
      reporte.value.operacionesCreditoBancarias =
        operacionesCreditoBancarias.value
      reporte.value.operacionesCreditoComerciales =
        operacionesCreditoComerciales.value
      store.mostrarReportePDF()
    }

    function volverConsultar() {
      store.mostrarConsultarReporte()
    }

    async function editar() {
      if (!reporte.value.usuario) {
        notificarAdvertencia('Debe asignar un cliente al reporte editado')
      }

      const axios = AxiosHttpRepository.getInstance()
      const ruta =
        axios.getEndpoint(endpoints.reportes) + '/' + store.idReporteActual

      try {
        const response: any = await axios.put(ruta, {
          reporte: reporte.value,
        })
        notificarCorrecto(response.data.mensaje)
      } catch (e: any) {
        notificarError(e.response.data.mensaje)
      }
    }

    function previsualizar() {
      store.mostrarReportePDFConsultar()
    }

    function limpiar() {
      store.resetReporte()
      limpiarUsuario()
    }

    const {
      refListadoSeleccionable: refListadoSeleccionableUsuario,
      criterioBusqueda: criterioBusquedaUsuario,
      listado: listadoUsuarios,
      listar: listarUsuarios,
      limpiar: limpiarUsuario,
      seleccionar: seleccionarUsuario,
    } = useOrquestadorSelectorClientes(reporte.value, 'usuarios')

    return {
      reporte,
      tiposReportes,
      tiposContribuyente,
      generarReporte,
      volverConsultar,
      limpiar,
      // Configuracion columnas
      configuracionColumnasActividades,
      configuracionColumnasEstablecimientos,
      configuracionColumnasOperacionesCredito,
      configuracionColumnasHistorialCrediticio,
      configuracionColumnasConsultasCliente,
      configuracionColumnasUsuario,
      configuracionColumnasMorosidades,
      configuracionColumnasVencimientos,
      configuracionColumnasSaldosPorVencer,
      configuracionColumnasOperacionesCanceladas,
      configuracionColumnasSeguros,
      // --
      columnasHistorialCrediticio,
      // ContextMenu
      agregarActividad,
      eliminarActividadEconomica,
      agregarEstablecimiento,
      eliminarEstablecimiento,
      agregarOperacionCreditoBancaria,
      eliminarOperacionCreditoBancaria,
      agregarOperacionCreditoComercial,
      eliminarOperacionCreditoComercial,
      agregarSaldoPorVencer,
      eliminarSaldoPorVencer,
      agregarOperacionCancelada,
      eliminarOperacionCancelada,
      agregarResumenVencimiento,
      eliminarResumenVencimiento,
      // Listados
      actividadesEconomicas,
      establecimientos,
      operacionesCreditoBancarias,
      operacionesCreditoComerciales,
      vencimientos,
      saldosPorVencer,
      operacionesCanceladas,
      seguros,
      historialCrediticio,
      consultasCliente,
      morosidades,
      acciones,
      editar,
      previsualizar,
      // orquestador
      refListadoSeleccionableUsuario,
      criterioBusquedaUsuario,
      listadoUsuarios,
      listarUsuarios,
      limpiarUsuario,
      seleccionarUsuario,
      configuracionColumnasUsuarios,
    }
  },
})
