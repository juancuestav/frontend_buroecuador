// Dependencias
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { endpoints } from 'config/api'
import { useAuthenticationStore } from 'stores/authentication'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import FlujoSolicitud from './components/FlujoSolicitud.vue'
import DetalleSolicitud from './components/DetalleSolicitud.vue'
import DashboardSolicitudes from './components/DashboardSolicitudes.vue'
import DialogoParametros from './components/DialogoParametros.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { EVENTO_SOLICITUD_CREDITO_ACTUALIZADA } from 'src/pusherEvents/SolicitudCreditoPusherEvent'
import { configuracionColumnasSolicitudesCredito } from '../domain/configuracionColumnasSolicitudesCredito'
import { SolicitudCreditoController } from '../infraestructure/SolicitudCreditoController'
import { SolicitudCreditoHistorial } from '../domain/SolicitudCreditoHistorial'
import { BANCOS, EstadoSolicitud, SolicitudCredito } from '../domain/SolicitudCredito'
import { ESTADOS } from '../domain/estados'
import { solicitudesApi } from '../infraestructure/solicitudesApi'

export default defineComponent({
  components: {
    TabLayout,
    FlujoSolicitud,
    DetalleSolicitud,
    DashboardSolicitudes,
    DialogoParametros,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      SolicitudCreditoHistorial,
      new SolicitudCreditoController()
    )
    const { tabs, filtros } = mixin.useReferencias()
    const { listar, consultar } = mixin.useComportamiento()
    const { onConsultado, onListado } = mixin.useHooks()

    const axios = AxiosHttpRepository.getInstance()
    const { notificarAdvertencia } = useNotificaciones()
    const autenticacion = useAuthenticationStore()
    const puedeVerTodas = autenticacion.can('ver.solicitudes_credito_todas')
    const route = useRoute()

    // Solicitud abierta en la pestaña "Solicitud" (null = ninguna o nueva)
    const solicitud = ref<SolicitudCredito | null>(null)
    const modoNuevo = ref(false)
    // Reinicia el flujo al empezar otra solicitud
    const claveFlujo = ref(0)
    const dialogoParametros = ref(false)

    let historialAbierto = false
    let historialDesactualizado = false
    const dashboard = ref<InstanceType<typeof DashboardSolicitudes> | null>(null)

    function nuevaSolicitud() {
      solicitud.value = null
      modoNuevo.value = true
      claveFlujo.value++
      tabs.value = 'formulario'
    }

    function actualizada(modelo: SolicitudCredito) {
      // Recién creada (no había solicitud): el flujo sigue en el mismo componente
      const otra = !!solicitud.value && solicitud.value.id !== modelo.id
      solicitud.value = modelo
      modoNuevo.value = false
      if (otra) claveFlujo.value++
      historialDesactualizado = true
    }

    function eliminada() {
      solicitud.value = null
      modoNuevo.value = false
      historialDesactualizado = true
      tabs.value = 'listado'
    }

    // "Consultar" en el historial abre la solicitud
    onConsultado((modelo: SolicitudCredito) => {
      solicitud.value = modelo
      modoNuevo.value = false
      claveFlujo.value++
    })

    onListado(() => (historialDesactualizado = false))

    watch(tabs, (tab) => {
      if (tab !== 'listado') return
      if (!historialAbierto) {
        historialAbierto = true
        return
      }
      if (historialDesactualizado) {
        listar({ ...filtros.fields, paginate: 1 })
        dashboard.value?.cargar()
      }
    })

    // Enlace de una notificación: /solicitudes-credito?solicitud=ID
    function abrirDesdeRuta() {
      const id = Number(route.query.solicitud)
      if (id) consultar({ id })
    }
    onMounted(abrirDesdeRuta)
    watch(() => route.query.solicitud, abrirDesdeRuta)

    // Novedad en tiempo real de la solicitud abierta: se recarga
    async function alActualizarse(evento: Event) {
      historialDesactualizado = true
      const id = (evento as CustomEvent<{ id: number }>).detail?.id
      if (!id || id !== solicitud.value?.id) return
      try {
        solicitud.value = (await solicitudesApi.obtener(id)).modelo
      } catch {
        // se mantiene la versión mostrada
      }
    }
    onMounted(() => window.addEventListener(EVENTO_SOLICITUD_CREDITO_ACTUALIZADA, alActualizarse))
    onBeforeUnmount(() => window.removeEventListener(EVENTO_SOLICITUD_CREDITO_ACTUALIZADA, alActualizarse))

    /*************
     * Historial
     *************/
    const asesores = ref<{ id: number; nombre: string }[]>([])
    onMounted(async () => {
      if (!puedeVerTodas) return
      try {
        const response: any = await axios.get(axios.getEndpoint(endpoints.revision_creditos_asesores))
        asesores.value = response.data.asesores
      } catch {
        // Sin la lista no se muestra el filtro por asesor
      }
    })

    const filtroEstado = ref<EstadoSolicitud | null>(null)
    const filtroBanco = ref<string | null>(null)
    const filtroAsesor = ref<number | null>(null)
    const filtroDesde = ref<string | null>(null)
    const filtroHasta = ref<string | null>(null)
    const opcionesEstado = (Object.keys(ESTADOS) as EstadoSolicitud[]).map((e) => ({
      value: e,
      label: ESTADOS[e].texto,
    }))

    function filtrar(recargar: () => Promise<void>) {
      if (filtroDesde.value && filtroHasta.value && filtroDesde.value > filtroHasta.value) {
        notificarAdvertencia('La fecha desde no puede ser mayor a la fecha hasta.')
        return
      }
      filtros.fields = {
        ...filtros.fields,
        estado: filtroEstado.value ?? undefined,
        banco: filtroBanco.value ?? undefined,
        asesor_id: filtroAsesor.value ?? undefined,
        fecha_desde: filtroDesde.value ?? undefined,
        fecha_hasta: filtroHasta.value ?? undefined,
      }
      recargar()
    }

    function filtrarFecha(recargar: () => Promise<void>, valor: any) {
      if (!valor || String(valor).length === 10) filtrar(recargar)
    }

    /** Clic en un estado del resumen: filtra el historial por ese estado y periodo */
    function verEnHistorial(filtro: { estado: EstadoSolicitud; desde: string | null }) {
      filtroEstado.value = filtro.estado
      filtroBanco.value = null
      filtroAsesor.value = null
      filtroDesde.value = filtro.desde
      filtroHasta.value = null
      filtrar(async () => {
        await listar({ ...filtros.fields, paginate: 1 })
      })
    }

    return {
      mixin,
      configuracionColumnasSolicitudesCredito,
      solicitud,
      modoNuevo,
      claveFlujo,
      dialogoParametros,
      dashboard,
      nuevaSolicitud,
      actualizada,
      eliminada,
      verEnHistorial,
      puedeVerTodas,
      asesores,
      BANCOS,
      filtroEstado,
      filtroBanco,
      filtroAsesor,
      filtroDesde,
      filtroHasta,
      opcionesEstado,
      filtrar,
      filtrarFecha,
    }
  },
})
