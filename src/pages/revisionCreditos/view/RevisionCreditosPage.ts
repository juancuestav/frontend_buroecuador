// Dependencias
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  onMounted,
  ref,
  watch,
} from 'vue'
import { endpoints } from 'config/api'
import { useAuthenticationStore } from 'stores/authentication'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ResultadoValidacion from './components/ResultadoValidacion.vue'
import DatosCliente from './components/DatosCliente.vue'
import RelacionLaboral from './components/RelacionLaboral.vue'
import DialogoRevisionDetenida from './components/DialogoRevisionDetenida.vue'
import GenerarReporte from './components/GenerarReporte.vue'
import DashboardRevisiones from './components/DashboardRevisiones.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { configuracionColumnasRevisionesCredito } from '../domain/configuracionColumnasRevisionesCredito'
import { RevisionCreditoController } from '../infraestructure/RevisionCreditoController'
import { RevisionCreditoHistorial } from '../domain/RevisionCreditoHistorial'
import { RevisionCredito } from '../domain/RevisionCredito'
import { obtenerMensajeError } from '../domain/formato'
import { EstadoResultado } from '../domain/ResumenRevisiones'

export default defineComponent({
  components: {
    TabLayout,
    ResultadoValidacion,
    DatosCliente,
    RelacionLaboral,
    DialogoRevisionDetenida,
    GenerarReporte,
    DashboardRevisiones,
    // ApexCharts (pesado) solo se descarga cuando la revisión llega a Equifax
    DatosCrediticios: defineAsyncComponent(
      () => import('./components/DatosCrediticios.vue')
    ),
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      RevisionCreditoHistorial,
      new RevisionCreditoController()
    )
    const { tabs, filtros } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()
    const { onConsultado, onListado } = mixin.useHooks()

    const axios = AxiosHttpRepository.getInstance()
    const cargando = new StatusEssentialLoading()
    const {
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
      notificarInformacion,
    } = useNotificaciones()

    // Permisos de la pantalla: ver todas las revisiones y elegir "Pertenece a"
    const autenticacion = useAuthenticationStore()
    const puedeVerTodas = autenticacion.can('ver.revision_creditos_todas')
    const puedeAsignarAsesor = autenticacion.can(
      'asignar.asesor_revision_creditos'
    )
    const usuarioActual = {
      id: autenticacion.user?.id as number,
      nombre: autenticacion.nombreUsuario as string,
    }

    // Asesores para "Pertenece a" y el filtro del historial (solo con permiso)
    const asesores = ref<{ id: number; nombre: string }[]>([])
    const asesorId = ref<number>(usuarioActual.id)
    const opcionesPerteneceA = computed(() =>
      puedeAsignarAsesor && asesores.value.length
        ? asesores.value
        : [usuarioActual]
    )

    async function cargarAsesores() {
      if (!puedeVerTodas && !puedeAsignarAsesor) return
      try {
        const response: any = await axios.get(
          axios.getEndpoint(endpoints.revision_creditos_asesores)
        )
        asesores.value = response.data.asesores
      } catch (error) {
        // Sin la lista, "Pertenece a" queda con el usuario actual
      }
    }
    onMounted(cargarAsesores)

    const cedula = ref<string | null>('')
    const forzarEquifax = ref(false)
    const revision = ref<RevisionCredito | null>(null)
    const procesando = ref(false)
    const dialogoDetenida = ref(false)
    const errorContinuar = ref<string | null>(null)

    // TabLayout carga el historial la primera vez que se abre su pestaña
    // (listado-diferido). Después solo se recarga si hubo revisiones nuevas.
    let historialAbierto = false
    let historialDesactualizado = false
    let resumenDesactualizado = false

    watch(dialogoDetenida, (abierto) => {
      if (abierto) errorContinuar.value = null
    })

    /*************
     * Revisión
     *************/
    async function ejecutar(accion: () => Promise<any>) {
      procesando.value = true
      cargando.activar()
      try {
        const response = await accion()
        mostrarResultado(response.data.modelo, response.data.mensaje)
        historialDesactualizado = true
        resumenDesactualizado = true
        return true
      } finally {
        cargando.desactivar()
        procesando.value = false
      }
    }

    async function revisar() {
      if (procesando.value) return
      if (!/^\d{10}$/.test(cedula.value ?? '')) {
        notificarAdvertencia('Ingrese una identificación de 10 dígitos.')
        return
      }

      try {
        await ejecutar(() =>
          axios.post(axios.getEndpoint(endpoints.revision_creditos), {
            identificacion: cedula.value,
            forzar_equifax: forzarEquifax.value,
            asesor_id: asesorId.value,
          })
        )
        forzarEquifax.value = false
      } catch (error: any) {
        notificarError(
          obtenerMensajeError(error, 'No se pudo realizar la revisión.')
        )
      }
    }

    /**
     * Continúa una revisión detenida (solo con permiso; el backend lo indica
     * en puede_continuar) o reintenta la consulta a Equifax.
     */
    async function continuar() {
      if (!revision.value) return
      const id = revision.value.id
      errorContinuar.value = null

      try {
        await ejecutar(() =>
          axios.post(
            axios.getEndpoint({ endpoint: endpoints.revision_creditos, id }) +
              '/continuar',
            { forzar_equifax: forzarEquifax.value }
          )
        )
      } catch (error: any) {
        const mensaje =
          error?.response?.status === 429
            ? 'Demasiados intentos. Espere un minuto antes de volver a intentar.'
            : obtenerMensajeError(error, 'No se pudo continuar la revisión.')
        if (dialogoDetenida.value) errorContinuar.value = mensaje
        else notificarError(mensaje)
      }
    }

    function mostrarResultado(modelo: RevisionCredito, mensaje: string) {
      revision.value = modelo
      dialogoDetenida.value = modelo.estado === 'detenida'

      if (modelo.estado === 'detenida') notificarAdvertencia(mensaje)
      else if (modelo.estado === 'pendiente_equifax') notificarError(mensaje)
      else if (modelo.califica) notificarCorrecto(mensaje)
      else notificarInformacion(mensaje)
    }

    // "Consultar" en el historial abre la revisión guardada (sin consultar de nuevo)
    onConsultado((modelo: RevisionCredito) => {
      revision.value = modelo
      cedula.value = modelo.identificacion
    })

    /*************
     * Historial
     *************/
    onListado(() => (historialDesactualizado = false))

    // El resumen se carga solo al montarse (primera apertura del historial)
    const dashboard = ref<InstanceType<typeof DashboardRevisiones> | null>(null)

    watch(tabs, (tab) => {
      if (tab !== 'listado') return
      if (!historialAbierto) {
        historialAbierto = true
        resumenDesactualizado = false
        return
      }
      if (historialDesactualizado) listar({ ...filtros.fields, paginate: 1 })
      if (resumenDesactualizado) {
        resumenDesactualizado = false
        dashboard.value?.cargar()
      }
    })

    // Asesor que hizo la consulta y asesor al que pertenece
    const filtroAsesor = ref<number | null>(null)
    const filtroPerteneceA = ref<number | null>(null)
    const filtroResultado = ref<string | null>(null)
    const filtroDesde = ref<string | null>(null)
    const filtroHasta = ref<string | null>(null)
    const opcionesResultado = [
      { label: 'Califica', value: 'califica' },
      { label: 'No califica', value: 'no_califica' },
      { label: 'Detenida', value: 'detenida' },
      { label: 'Pendiente Equifax', value: 'pendiente_equifax' },
    ]

    function filtrar(recargar: () => Promise<void>) {
      if (
        filtroDesde.value &&
        filtroHasta.value &&
        filtroDesde.value > filtroHasta.value
      ) {
        notificarAdvertencia(
          'La fecha desde no puede ser mayor a la fecha hasta.'
        )
        return
      }
      filtros.fields = {
        ...filtros.fields,
        resultado: filtroResultado.value ?? undefined,
        usuario_id: filtroAsesor.value ?? undefined,
        pertenece_a_id: filtroPerteneceA.value ?? undefined,
        fecha_desde: filtroDesde.value ?? undefined,
        fecha_hasta: filtroHasta.value ?? undefined,
      }
      recargar()
    }

    // Solo con la fecha completa o vacía: evita una consulta por cada dígito
    function filtrarFecha(recargar: () => Promise<void>, valor: any) {
      if (!valor || String(valor).length === 10) filtrar(recargar)
    }

    /**
     * Clic en una cifra del resumen: aplica los filtros que la reproducen
     * (resultado y desde el inicio del periodo, sin filtros de asesor) para
     * contrastarla con las filas del historial.
     */
    function verEnHistorial(filtro: {
      resultado: EstadoResultado | null
      desde: string | null
    }) {
      filtroAsesor.value = null
      filtroPerteneceA.value = null
      filtroResultado.value = filtro.resultado
      filtroDesde.value = filtro.desde
      filtroHasta.value = null
      filtrar(async () => {
        await listar({ ...filtros.fields, paginate: 1 })
      })
      // La tabla está justo debajo del resumen
      const tabla = (dashboard.value?.$el as HTMLElement | undefined)
        ?.nextElementSibling
      tabla?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Impresión / "Guardar como PDF" (estilos en imprimir.scss)
    const imprimir = () => window.print()

    return {
      mixin,
      imprimir,
      configuracionColumnasRevisionesCredito,
      cedula,
      forzarEquifax,
      revision,
      procesando,
      dialogoDetenida,
      errorContinuar,
      revisar,
      continuar,
      filtroResultado,
      filtroAsesor,
      filtroPerteneceA,
      puedeVerTodas,
      puedeAsignarAsesor,
      asesores,
      asesorId,
      opcionesPerteneceA,
      filtroDesde,
      filtroHasta,
      opcionesResultado,
      filtrar,
      filtrarFecha,
      dashboard,
      verEnHistorial,
    }
  },
})
