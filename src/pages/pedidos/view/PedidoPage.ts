// Dependencias
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent } from 'vue'
import { configuracionColumnasPedidos } from '../domain/configuracionColumnasPedidos'
import { estadosPago } from 'config/utils'
// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { PedidoController } from '../infraestructure/PedidoController'
import { Pedido } from '../domain/Pedido'

export default defineComponent({
  components: {
    TabLayout,
  },
  setup() {
    const controller = new PedidoController()
    const mixin = new ContenedorSimpleMixin(Pedido, controller)
    const { entidad: pedido, listado } = mixin.useReferencias()
    const { confirmar, notificarCorrecto } = useNotificaciones()
    const { eliminar } = mixin.useComportamiento()

    // const store = useStore()

    // const mostrarPanelDevolucion = ref(false)
    // const existenDevolucionesPendientes = ref(false)
    // const permitirPrepararDevolucion = ref(false)

    // const refListadoDevolucion = ref()

    // const notificaciones = useNotificaciones()

    // onMounted(async () => {
    // pedido.hydrate(store.state.pedido.pedido)

    // tabIndex.value = store.state.pedido.tabIndex

    /*watchEffect(() => {
                permitirPrepararDevolucion.value =
                    pedido.estado_devolucion !== "DEVUELTO"

                if (!permitirPrepararDevolucion.value) {
                    refListadoDevolucion.value?.ocultarColumna(3)
                } else {
                    refListadoDevolucion.value?.mostrarColumna(3)
                }
            })*/
    // })

    async function registrarPago() {
      confirmarPagoEfectivo()
    }

    function confirmarPagoEfectivo() {
      confirmar(
        'Esta operación no es reversible.\n¿Desea continuar?',
        async () => {
          const { response, result } = await controller.editar(pedido)
          notificarCorrecto(response.data.mensaje)
          console.log(response)
          pedido.hydrate(result)
        }
      )
    }

    const mostrarFormulario = computed(() => pedido.id !== null)

    /* const guardarTabIndexStore = () => {
      store.commit('pedido/SET_TABINDEX', 0)
    } */

    /* const verListado = () => {
      tabIndex.value = 1
    }
 */
    /* const consultarPago = () => {
      guardarTabIndexStore()
      const ruta =
        getEndpoint(endpoints.depositos_transferencias) +
        pedido.deposito_transferencia +
        '/edit'
      Inertia.get(ruta)
    } */

    return {
      // refListadoDevolucion,
      mixin,
      pedido,
      registrarPago,
      configuracionColumnasPedidos,
      mostrarFormulario,
      /* eliminarPedido,
      mostrarFormulario,
      guardarTabIndexStore,
      verListado, */
      eliminar,
      listado,
      estadosPago,
      /* mostrarPanelDevolucion,
      existenDevolucionesPendientes,
      consultarPago,
      permitirPrepararDevolucion,
      metodosPago,
      estadosPreparacion,
      estadosPago,
      configuracionColumnas, */
    }
  },
})
