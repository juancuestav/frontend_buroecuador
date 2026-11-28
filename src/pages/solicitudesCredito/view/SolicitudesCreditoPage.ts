// Dependencias
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { endpoints } from 'config/api'
import { useAuthenticationStore } from 'stores/authentication'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import FlujoSolicitud from './components/FlujoSolicitud.vue'
import DetalleSolicitud from './components/DetalleSolicitud.vue'
import DashboardSolicitudes from './components/DashboardSolicitudes.vue'
import DialogoParametros from './components/DialogoParametros.vue'
import PestanasConteo, { OpcionPestana } from 'components/filtros/PestanasConteo.vue'

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
    PestanasConteo,
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
    let dashboardDesactualizado = false
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
      dashboardDesactualizado = true
    }


    // "Consultar" en el historial abre la solicitud
    onConsultado((modelo: SolicitudCredito) => {
      solicitud.value = modelo
      modoNuevo.value = false
      claveFlujo.value++
    })

    // El listado trae la cantidad de cada pestaña (con los demás filtros aplicados)
    const conteos = ref<Record<string, number>>({})
    onListado((respuesta) => {
      historialDesactualizado = false
      if (respuesta?.conteos) conteos.value = respuesta.conteos
    })

    // El dashboard se carga al abrir su pestaña por primera vez; después solo
    // se recarga si hubo cambios. Igual el historial (listado diferido).
    watch(tabs, (tab) => {
      if (tab === 'dashboard') {
        if (dashboardDesactualizado) dashboard.value?.cargar()
        dashboardDesactualizado = false
        return
      }
      if (tab !== 'listado') return
      if (!historialAbierto) {
        historialAbierto = true
        return
      }
      if (historialDesactualizado) listar({ ...filtros.fields, paginate: 1 })
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
      dashboardDesactualizado = true
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

    /** Pestañas sobre la tabla: grupos de estados (backend SolicitudCredito::GRUPOS) */
    const grupo = ref('todos')
    const pestanas = computed<OpcionPestana[]>(() =>
      [
        { valor: 'todos', etiqueta: 'Todos', color: '#4f52b3', icono: 'bi-list-ul' },
        { valor: 'en_tramite', etiqueta: 'En trámite', color: ESTADOS.ENVIADO.color, icono: 'bi-hourglass-split' },
        { valor: 'pendiente', etiqueta: 'Pendiente', color: ESTADOS.BORRADOR.color, icono: ESTADOS.BORRADOR.icono },
        { valor: 'aprobados', etiqueta: 'Aprobados', color: ESTADOS.APROBADO.color, icono: ESTADOS.APROBADO.icono },
        { valor: 'negados', etiqueta: 'Negados', color: ESTADOS.NEGADO.color, icono: ESTADOS.NEGADO.icono },
        { valor: 'no_procede', etiqueta: 'No procede', color: ESTADOS.NO_PROCEDE.color, icono: ESTADOS.NO_PROCEDE.icono },
      ].map((p) => ({ ...p, total: conteos.value[p.valor] ?? null }))
    )

    function cambiarGrupo(valor: string) {
      grupo.value = valor
      filtrar(async () => {
        await listar({ ...filtros.fields, paginate: 1 })
      })
    }

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
        grupo: grupo.value === 'todos' ? undefined : grupo.value,
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
      grupo.value = 'todos'
      filtroEstado.value = filtro.estado
      filtroBanco.value = null
      filtroAsesor.value = null
      filtroDesde.value = filtro.desde
      filtroHasta.value = null
      // Primera apertura del historial: TabLayout lo carga con estos filtros
      const cargar = historialAbierto ? () => listar({ ...filtros.fields, paginate: 1 }) : async () => undefined
      filtrar(async () => {
        await cargar()
      })
      tabs.value = 'listado'
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
      verEnHistorial,
      grupo,
      pestanas,
      cambiarGrupo,
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
