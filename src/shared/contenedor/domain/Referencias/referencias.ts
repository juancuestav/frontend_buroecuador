import { computed, ComputedRef, reactive, Ref, ref, UnwrapRef } from 'vue'
import { acciones } from 'config/utils'
import { MetaPagination } from './MetaPagination'


// Define el tipo de valores de `acciones`
type AccionType = typeof acciones[keyof typeof acciones];
export class Referencias {
  tabs: Ref
  validador: Ref
  filtros: { [key: string]: any }
  listadoActividades: Ref<any[]>
  listadoArchivos: Ref<any[]>
  listado: Ref<any[]>
  currentPageListado: Ref<number>
  nextPageUrl: Ref<string | undefined | null>
  // fields!: Ref<ColumnConfig<T>[]>
  accion: Ref<AccionType>
  disabled: ComputedRef<boolean>
  listadosAuxiliares: UnwrapRef<any>
  errors: Ref
  metaPagination: Ref<MetaPagination | undefined>
  pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 3, // props.altoFijo ? 15 : 0,
    rowsNumber: 10,
    last_page: 2,
    total: 0,
  })

  constructor() {
    this.errors = ref()

    // Para manipular los tabs
    this.tabs = ref()

    // Para ejecutar las validaciones
    this.validador = ref()

    // Para obtener listados y autocompletar los formularios
    this.listadosAuxiliares = reactive({})

    // filtros por defecto
    this.filtros = reactive({
      search: null,
      fields: null,
    })

    this.listado = ref([])
    this.listadoArchivos = ref([])
    this.listadoActividades = ref([])
    this.currentPageListado = ref(1)
    this.nextPageUrl = ref()
    this.accion = ref(acciones.nuevo)
    this.metaPagination = ref()

    // Boolean para desactivar la edicion en formularios
    this.disabled = computed(() => {
      const accionesEsperadas = [acciones.eliminar, acciones.consultar] as AccionType[];
      return accionesEsperadas.includes(this.accion.value)
    })
  }
}
