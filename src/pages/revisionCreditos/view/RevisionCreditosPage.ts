// Dependencias
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useQuasar } from 'quasar'
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
import PestanasConteo, { OpcionPestana } from 'components/filtros/PestanasConteo.vue'

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
import { COLORES_RESULTADO, EstadoResultado } from '../domain/ResumenRevisiones'

export default defineComponent({
  components: {
    TabLayout,
    ResultadoValidacion,
    DatosCliente,
    RelacionLaboral,
    DialogoRevisionDetenida,
    GenerarReporte,
    DashboardRevisiones,
    PestanasConteo,
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
    // (listado-diferido) y el resumen se carga al abrir la pestaña Dashboard.
    // Después solo se recargan si hubo revisiones nuevas.
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

      // Sin la revisión anterior en pantalla: mientras se consulta, o si la
      // nueva consulta falla, se veía la cédula nueva con datos del cliente
      // anterior
      limpiarResultado()

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

    /** Quita de pantalla la revisión mostrada y el diálogo de revisión detenida */
    function limpiarResultado() {
      revision.value = null
      dialogoDetenida.value = false
      errorContinuar.value = null
    }

    /** Botón "Limpiar": deja el formulario como al abrir la pantalla */
    function limpiar() {
      if (procesando.value) return
      cedula.value = ''
      forzarEquifax.value = false
      asesorId.value = usuarioActual.id
      limpiarResultado()
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
    // El listado trae la cantidad de cada pestaña (con los demás filtros aplicados)
    const conteos = ref<Record<string, number>>({})
    onListado((respuesta) => {
      historialDesactualizado = false
      if (respuesta?.conteos) conteos.value = respuesta.conteos
    })

    /** Pestañas sobre la tabla: una por resultado, con su color del dashboard */
    const $q = useQuasar()
    const grupo = ref('todos')
    const pestanas = computed<OpcionPestana[]>(() => {
      const colores = COLORES_RESULTADO[$q.dark.isActive ? 'oscuro' : 'claro']
      return [
        { valor: 'todos', etiqueta: 'Todos', color: colores.equifax, icono: 'bi-list-ul' },
        { valor: 'califica', etiqueta: 'Califica', color: colores.califica, icono: 'bi-check-circle' },
        { valor: 'no_califica', etiqueta: 'No califica', color: colores.no_califica, icono: 'bi-x-circle' },
        { valor: 'detenida', etiqueta: 'Detenida', color: colores.detenida, icono: 'bi-pause-circle' },
        { valor: 'pendiente_equifax', etiqueta: 'Pendiente Equifax', color: colores.pendiente_equifax, icono: 'bi-cloud-slash' },
      ].map((p) => ({ ...p, total: conteos.value[p.valor] ?? null }))
    })

    function cambiarGrupo(valor: string) {
      grupo.value = valor
      filtrar(async () => {
        await listar({ ...filtros.fields, paginate: 1 })
      })
    }

    // El resumen se carga al montarse (primera apertura de su pestaña)
    const dashboard = ref<InstanceType<typeof DashboardRevisiones> | null>(null)

    watch(tabs, (tab) => {
      if (tab === 'dashboard') {
        if (resumenDesactualizado && dashboard.value) dashboard.value.cargar()
        resumenDesactualizado = false
        return
      }
      if (tab !== 'listado') return
      if (!historialAbierto) {
        historialAbierto = true
        return
      }
      if (historialDesactualizado) listar({ ...filtros.fields, paginate: 1 })
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
        grupo: grupo.value === 'todos' ? undefined : grupo.value,
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
      grupo.value = 'todos'
      filtroAsesor.value = null
      filtroPerteneceA.value = null
      filtroResultado.value = filtro.resultado
      filtroDesde.value = filtro.desde
      filtroHasta.value = null
      // Primera apertura del historial: TabLayout lo carga con estos filtros
      const yaAbierto = historialAbierto
      filtrar(async () => {
        if (yaAbierto) await listar({ ...filtros.fields, paginate: 1 })
      })
      tabs.value = 'listado'
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
      limpiar,
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
      grupo,
      pestanas,
      cambiarGrupo,
      filtrar,
      filtrarFecha,
      dashboard,
      verEnHistorial,
    }
  },
})
