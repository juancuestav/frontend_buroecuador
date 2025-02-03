// Dependencias
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useCargandoStore } from 'stores/cargando'
import { useRouter } from 'vue-router'
import { acciones } from 'config/utils'

// Componentes
import EssentialTablePagination from 'components/tables/view/EssentialTablePagination.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

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
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: false,
    },
    tituloPagina: {
      type: String,
    },
    subtituloPagina: {
      type: String,
      default: 'SISTEMA',
    },
    mostrarFormulario: {
      type: Boolean,
      default: true,
    },
    mostrarListado: {
      type: Boolean,
      default: true,
    },
    mostrarCustomListado: {
      type: Boolean,
      default: false,
    },
    permitirGuardar: {
      type: Boolean,
      default: true,
    },
    permitirConsultar: {
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
    puedeFiltrar: {
      type: Boolean,
      default: false,
    },
    puedeExportar: {
      type: Boolean,
      default: true,
    },
    mostrarAcciones: {
      type: Boolean,
      default: true,
    },
    accion1: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion2: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion3: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion4: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion5: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion6: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion7: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion8: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion9: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion10: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion1Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion2Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion3Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion4Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    labelGuardar: {
      type: String,
      default: 'Guardar',
    },
    listar: {
      type: Boolean,
      default: true,
    },
    ajustarCeldas: {
      //valor que se envia para que el contenido de la celda se autoaujuste al tamaño de la celda en lugar de aumentar su tamaño
      type: Boolean,
      default: false,
    },
    paginate: {
      type: Boolean,
      default: false,
    },
  },
  components: { EssentialTable, ButtonSubmits, EssentialTablePagination },
  setup(props) {
    const {
      listar,
      filtrar,
      guardar,
      editar,
      eliminar,
      consultar,
      reestablecer,
    } = props.mixin.useComportamiento()

    const { entidad, listado, accion, filtros, tabs } =
      props.mixin.useReferencias()

    const Router = useRouter()
    let columnas: any = props.configuracionColumnas ?? []

    if (props.mostrarAcciones) {
      columnas = [
        ...columnas,
        {
          name: 'acciones',
          field: 'acciones',
          label: 'Acciones',
          align: 'center',
          style: 'width:200px',
        },
      ]
    }

    /* if (!listadoCargado && props.mostrarListado && props.listar) {
      listar()
      listadoCargado = true
    } */

    if (props.mostrarListado) {
      if (props.paginate) {
        listar({ paginate: 1 })
      } else {
        listar()
      }
    }

    const seleccionado = ref()

    watchEffect(() => {
      tabs.value = props.mostrarFormulario ? 'formulario' : 'listado'
    })

    const nombre =
      Router.currentRoute.value.name?.toString().replaceAll('_', ' ') ?? ''
    const tituloTabla =
      nombre.toLowerCase().substring(0, 1).toUpperCase() +
      nombre.toLowerCase().substring(1, nombre.length)

    const accionTabla = {
      consultar: ({ entidad }) => {
        accion.value = acciones.consultar
        consultar(entidad)
      },
      editar: ({ entidad }) => {
        accion.value = acciones.editar
        consultar(entidad)
      },
      eliminar: ({ entidad }) => {
        accion.value = acciones.eliminar
        consultar(entidad)
      },
    }

    // const router = useRoute()
    // const store = useAuthenticationStore()

    // const currentInstance = getCurrentInstance()
    // const componentName = currentInstance?.parent?.type.name

    const puedeVer = computed(
      () =>
        // store.can(`puede.ver.${router.name?.toString()}`) &&
        props.permitirConsultar
    )
    const puedeCrear = computed(
      () => props.permitirGuardar
      // store.can(`puede.crear.${router.name?.toString()}`)
      // store.can(`puede.crear.${componentName ?? router.name?.toString()}`) // componentName: priorisa el nombre del componente (usualmente se utiliza en un modal).
    )
    const puedeEditar = computed(
      () =>
        // store.can(`puede.editar.${router.name?.toString()}`) &&
        props.permitirEditar
    )
    const puedeEliminar = computed(
      () =>
        // store.can(`puede.eliminar.${router.name?.toString()}`) &&
        props.permitirEliminar
    )

    /*function cargarListado() {
      if (nextPageUrl.value)
        listar()
    }*/

    function filtrarTodos(filtros) {
      if (props.mostrarListado) filtrar(filtros)
    }

    /* const aplicarFiltros = (filtros: any) => {
      filtrosBusqueda.value = filtros
    }

    const obtenerListadoFiltros = () => {
      filtros.search = busqueda.value === "" ? null : busqueda.value
      const newParams = {...filtrosBusqueda.value}
      newParams.limit = 100
      listar({...filtros, ...newParams}, false)
    }
    const obtenerTodoListadoFiltros = () => {
      filtros.search = busqueda.value === "" ? null : busqueda.value
      listar({...filtros, ...filtrosBusqueda.value}, false)
    } */

    return {
      filtrarTodos,
      tabs,
      tituloTabla,
      guardar,
      reestablecer,
      entidad,
      listado,
      accion,
      filtros,
      accionTabla,
      // tituloPagina: tituloTabla[0].toUpperCase() + tituloTabla.substring(1),
      seleccionado,
      columnas,
      // acciones tabla
      consultar,
      editar,
      eliminar,
      puedeVer,
      puedeCrear,
      puedeEditar,
      puedeEliminar,
      storeCargando: useCargandoStore(),
    }
  },
})
