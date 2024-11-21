// Dependencias
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useAuthenticationStore } from 'stores/authentication'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: true,
    },
    mostrarButtonSubmits: {
      type: Boolean,
      default: true,
    },
    permitirConsultar: {
      type: Boolean,
      default: true,
    },
    permitirGuardar: {
      type: Boolean,
      default: true,
    },
    permitirEditar: {
      type: Boolean,
      default: true,
    },
    permitirEliminar: {
      type: Boolean,
      default: true,
    },
    permitirCancelar: {
      type: Boolean,
      default: true,
    },
    full: {
      type: Boolean,
      default: false,
    },
    labelGuardar: {
      type: String,
      default: 'Guardar',
    },
    titulo: String,
  },
  components: { ButtonSubmits },
  setup(props) {
    /********
     * Mixin
     ********/
    const { guardar, editar, eliminar, consultar, reestablecer } =
      props.mixin.useComportamiento()
    const { entidad, accion, filtros } = props.mixin.useReferencias()

    /************
     * Variables
     ************/
    const router = useRoute()
    const store = useAuthenticationStore()

    // const currentInstance = getCurrentInstance()
    // const componentName = currentInstance?.parent?.type.name

    const puedeVer = computed(
      () =>
        store.can(`puede.ver.${router.name?.toString()}`) &&
        props.permitirConsultar
    )
    const puedeCrear = computed(
      () =>
        // store.can(`puede.crear.${componentName ?? router.name?.toString()}`) &&
        props.permitirGuardar
    )
    const puedeEditar = computed(
      () =>
        // store.can(`puede.editar.${componentName ?? router.name?.toString()}`) &&
        props.permitirEditar
    )
    const puedeEliminar = computed(
      () =>
        // store.can(`puede.eliminar.${componentName ?? router.name?.toString()}`) &&
        props.permitirEliminar
    )
    const puedeCancelar = computed(
      () =>
        // store.can(`puede.eliminar.${componentName ?? router.name?.toString()}`) &&
        props.permitirCancelar
    )

    return {
      guardar,
      reestablecer,
      entidad,
      accion,
      filtros,
      // acciones tabla
      consultar,
      editar,
      eliminar,
      puedeVer,
      puedeCrear,
      puedeEditar,
      puedeEliminar,
      puedeCancelar,
      storeCargando: useCargandoStore(),
    }
  },
})
