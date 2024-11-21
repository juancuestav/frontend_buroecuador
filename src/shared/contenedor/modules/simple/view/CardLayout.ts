// Dependencias
import { defineComponent, ref } from 'vue'

// Componentes
import CardImage from 'components/cards/cardImage/view/CardImage.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { ContenedorSimpleMixin } from '../application/ContenedorSimpleMixin'
import { acciones } from 'config/utils'

// Logica y controladores

export default defineComponent({
  name: 'CardTransaccionesSimples',
  components: {
    ButtonSubmits,
    CardImage,
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
    tituloModal: {
      type: String,
      required: false,
      default: 'Modal',
    },
    customAction: {
      type: Function,
      required: false,
    },
    customAction2: {
      type: Function,
      required: false,
    },
    /* cbSeleccionarCard: {
      type: Function,
      required: true,
    }, */
  },

  setup(props) {
    // const refFormularioModal = ref()
    // const codigoRegistro = ref()
    // let modal: UnwrapRef<any>

    const mostrarDialog = ref(false)

    // onMounted(() => (modal = new Modal(refFormularioModal.value)))

    // mixin
    // const mixin = props.mixin
    const { listar, guardar, reestablecer, consultar, eliminar, editar } =
      props.mixin.useComportamiento()

    const { entidad, listado, accion } = props.mixin.useReferencias()

    listar()
    /* const negociosPropietarioListado = computed(() =>
      listado.value.filter(
        (negocio: MiNegocio) => negocio.es_propietario === true
      )
    )

    const negociosAsociadoListado = computed(() =>
      listado.value.filter(
        (negocio: MiNegocio) => negocio.es_propietario === false
      )
    ) */

    /* const asociarme = () => {
      notificaciones.notificarAdvertencia('El código ingresado no es válido')
    } */

    // Mostra / ocultar modal
    const mostrar = () => (mostrarDialog.value = true)
    const ocultar = () => {
      reestablecer()
      mostrarDialog.value = false
    }

    const eliminarCard = async (id: number) => {
      console.log(id)
      await consultar({ id })
      await eliminar(entidad)
    }

    const cardSeleccionado = async (id: number) => {
      await consultar({ id })
      mostrar()
      accion.value = acciones.editar
    }

    return {
      // refFormularioModal,
      // Referencias del mixin
      entidad,
      listado,
      accion,
      // Comportamiento del mixin
      listar,
      guardar,
      editar,
      // reestablecer,
      // Propiedades del componente
      // codigoRegistro,
      /* negociosPropietarioListado,
      negociosAsociadoListado,
      asociarme, */
      ocultar,
      mostrar,
      mostrarDialog,
      cardSeleccionado,
      eliminarCard,
    }
  },
})
