<template>
  <q-tabs
    v-if="mostrarTabs"
    v-model="tabSeleccionado"
    no-caps
    dense
    indicator-color="primary"
    active-class="tab-active"
    class="tab-inactive"
    align="justify"
    @click="emit('tab-seleccionado', tabSeleccionado)"
  >
    <!--
  :class="{ 'borde-header-tabla': !$q.screen.xs }"
    class="bg-white"
  active-color="white"
    active-bg-color="primary" -->
    <q-tab
      v-for="opcion in tabOptions"
      :key="opcion.label"
      :label="opcion.label"
      :name="opcion.value"
    ></q-tab>
    <!-- :class="{ 'rounded shadow-chip q-mx-xs q-my-md': $q.screen.xs }" -->
    <!-- class="q-mx-xs q-my-md rounded" -->
  </q-tabs>

  <essential-table-pagination
    v-if="paginate"
    ref="refTabla"
    :titulo="titulo"
    :configuracionColumnas="configuracionColumnas"
    :datos="datos"
    :permitirConsultar="permitirConsultar"
    :permitirEditar="permitirEditar"
    :permitirEliminar="permitirEliminar"
    :mostrar-botones="mostrarBotones"
    :accion1="accion1"
    :accion2="accion2"
    :accion3="accion3"
    :accion4="accion4"
    :accion5="accion5"
    :accion6="accion6"
    :accion7="accion7"
    :accion8="accion8"
    :accion9="accion9"
    :accion10="accion10"
    :accion11="accion11"
    :accion1Header="accion1Header"
    :accion2Header="accion2Header"
    :accion3Header="accion3Header"
    :accion4Header="accion4Header"
    :accion5Header="accion5Header"
    :accion6Header="accion6Header"
    :alto-fijo="altoFijo"
    :mostrarFooter="mostrarFooter"
    :mostrarExportar="mostrarExportar"
    @consultar="consultar"
    @editar="editar"
    @eliminar="eliminar"
    @accion1="emitAccion1"
    @accion2="emitAccion2"
    @accion3="emitAccion3"
    @accion4="emitAccion4"
    @accion5="emitAccion5"
    @accion6="emitAccion6"
    @accion7="emitAccion7"
    @accion8="emitAccion8"
    @accion9="emitAccion9"
    @accion10="emitAccion10"
    @accion11="emitAccion11"
    :permitir-filtrar="permitirFiltrar"
    :permitir-buscar="permitirBuscar"
    :primeraColumnaFija="primeraColumnaFija"
    @filtrar="consultarTodos"
    @toggle-filtros="toggleFiltros"
    :ajustarCeldas="ajustarCeldas"
    :separador="separador"
    :tipoSeleccion="tipoSeleccion"
    @selected="itemSeleccionado"
    :mixin="mixin"
  ></essential-table-pagination>

  <essential-table
    v-else
    ref="refTabla"
    :titulo="titulo"
    :configuracionColumnas="configuracionColumnas"
    :datos="datos"
    :permitirConsultar="permitirConsultar"
    :permitirEditar="permitirEditar"
    :permitirEliminar="permitirEliminar"
    :mostrar-botones="mostrarBotones"
    :accion1="accion1"
    :accion2="accion2"
    :accion3="accion3"
    :accion4="accion4"
    :accion5="accion5"
    :accion6="accion6"
    :accion7="accion7"
    :accion8="accion8"
    :accion9="accion9"
    :accion10="accion10"
    :accion11="accion11"
    :accion1Header="accion1Header"
    :accion2Header="accion2Header"
    :accion3Header="accion3Header"
    :accion4Header="accion4Header"
    :accion5Header="accion5Header"
    :accion6Header="accion6Header"
    :alto-fijo="altoFijo"
    :mostrarFooter="mostrarFooter"
    :mostrarExportar="mostrarExportar"
    @consultar="consultar"
    @editar="editar"
    @eliminar="eliminar"
    @accion1="emitAccion1"
    @accion2="emitAccion2"
    @accion3="emitAccion3"
    @accion4="emitAccion4"
    @accion5="emitAccion5"
    @accion6="emitAccion6"
    @accion7="emitAccion7"
    @accion8="emitAccion8"
    @accion9="emitAccion9"
    @accion10="emitAccion10"
    @accion11="emitAccion11"
    :permitir-filtrar="permitirFiltrar"
    :permitir-buscar="permitirBuscar"
    :primeraColumnaFija="primeraColumnaFija"
    @filtrar="consultarTodos"
    @toggle-filtros="toggleFiltros"
    :ajustarCeldas="ajustarCeldas"
    :separador="separador"
    :tipoSeleccion="tipoSeleccion"
    @selected="itemSeleccionado"
  ></essential-table>
</template>

<script lang="ts" setup>
// Dependencias
import { CustomActionTable } from '../domain/CustomActionTable'
import { TabOption } from 'components/tables/domain/TabOption'
import { ColumnConfig } from '../domain/ColumnConfig'
import { TipoSeleccion } from 'config/utils'
import { ref } from 'vue'

// Componentes
import EssentialTablePagination from './EssentialTablePagination.vue'
import EssentialTable from './EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
    required: true,
  },
  titulo: {
    type: String,
    default: 'Listado',
  },
  separador: {
    type: String,
    default: 'horizontal',
  },
  configuracionColumnas: {
    type: Object as () => ColumnConfig<EntidadAuditable>[],
    required: true,
  },
  datos: {
    type: Array,
    required: true,
  },
  permitirEditarCeldas: {
    type: Boolean,
    default: false,
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
  tipoSeleccion: {
    type: String as () => TipoSeleccion,
    default: 'none',
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
  accion11: {
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
  accion5Header: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion6Header: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  mostrarBotones: {
    type: Boolean,
    default: true,
  },
  altoFijo: {
    type: Boolean,
    default: true,
  },
  mostrarHeader: {
    type: Boolean,
    default: true,
  },
  mostrarFooter: {
    type: Boolean,
    default: true,
  },
  tabOptions: {
    type: Array as () => TabOption[],
    required: true,
  },
  tabDefecto: [String, Number],
  mostrarExportar: {
    type: Boolean,
    default: false,
  },
  ajustarCeldas: {
    type: Boolean,
    default: false,
  },
  paginate: {
    type: Boolean,
    default: false,
  },
  permitirFiltrar: {
    type: Boolean,
    default: false,
  },
  permitirBuscar: {
    type: Boolean,
    default: true,
  },
  primeraColumnaFija: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'consultar',
  'editar',
  'eliminar',
  'accion1',
  'accion2',
  'accion3',
  'accion4',
  'accion5',
  'accion6',
  'accion7',
  'accion8',
  'accion9',
  'accion10',
  'accion11',
  'tab-seleccionado',
  'selected-item',
  'filtrar',
  'limpiar-listado',
])

/************
 * Variables
 ************/
const tabSeleccionado = ref(props.tabDefecto)
const mostrarTabs = ref(true)
const refTabla = ref()

const consultar = (data) => emit('consultar', data)
const editar = (data) => emit('editar', data)
const eliminar = (data) => emit('eliminar', data)
const emitAccion1 = (data) => emit('accion1', data)
const emitAccion2 = (data) => emit('accion2', data)
const emitAccion3 = (data) => emit('accion3', data)
const emitAccion4 = (data) => emit('accion4', data)
const emitAccion5 = (data) => emit('accion5', data)
const emitAccion6 = (data) => emit('accion6', data)
const emitAccion7 = (data) => emit('accion7', data)
const emitAccion8 = (data) => emit('accion8', data)
const emitAccion9 = (data) => emit('accion9', data)
const emitAccion10 = (data) => emit('accion10', data)
const emitAccion11 = (data) => emit('accion11', data)

function itemSeleccionado(seleccionado) {
  emit('selected-item', seleccionado)
}

function consultarTodos(uri) {
  emit('filtrar', uri)
}

function toggleFiltros(mostrarFiltros: boolean) {
  mostrarTabs.value = !mostrarFiltros
  if (mostrarTabs.value) emit('tab-seleccionado', tabSeleccionado.value)
  else emit('limpiar-listado')
}

defineExpose({
  getSearchValue: () => refTabla.value.filter,
  toSearch: () => refTabla.value.toSearch(),
})
</script>
