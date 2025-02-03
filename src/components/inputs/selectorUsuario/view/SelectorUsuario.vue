<template>
  <div class="col-12 col-md-12 q-mt-md">
    <label class="q-mb-sm block">Seleccionar usuario</label>
    <div class="row q-col-gutter-x-xs">
      <div class="col-12 col-md-10 q-mb-md">
        <q-input
          v-model="criterioBusqueda"
          placeholder="Escriba la cédula o nombre del usuario"
          hint="También puede presionar Enter para buscar"
          @keydown.enter="listar"
          @blur="criterioBusqueda === '' ? limpiar() : null"
          :disable="disable"
          outlined
          dense
        >
        </q-input>
      </div>
      <div class="col-12 col-md-2">
        <q-btn
          @click="listar"
          icon="search"
          color="primary"
          class="full-width"
          :disable="disable"
          unelevated
          no-caps
          rounded
          no-wrap
          >Buscar
        </q-btn>
      </div>
    </div>
  </div>

  <!-- Tabla -->
  <div class="col-12 q-mt-md">
    <essential-table
      v-if="entidad.usuarios.length"
      titulo="Usuario seleccionado"
      :configuracion-columnas="columnas"
      :datos="entidad.usuarios"
      :disable="disable"
      :mostrarBotones="false"
      ajustar-celdas
      :permitir-buscar="false"
      :mostrar-header="false"
      :mostrar-footer="false"
      :altoFijo="false"
    ></essential-table>
  </div>

  <!-- Modal de seleccion de detalles -->
  <essential-selectable-table
    ref="refListadoSeleccionable"
    :configuracion-columnas="configuracionColumnasUsuarios"
    :datos="listado"
    @selected="
      (d) => {
        seleccionar(d)
        $emit('selected', d)
      }
    "
    tipo-seleccion="multiple"
  ></essential-selectable-table>
</template>

<script lang="ts" setup>
import { useOrquestadorSelectorUsuarios } from 'components/inputs/selectorUsuario/application/OrquestadorSelectorUsuarios'
import { configuracionColumnasUsuariosSeleccionados } from '../domain/configuracionColumnasUsuariosSeleccionadosAccion'
import { configuracionColumnasUsuarios } from 'pages/usuarios/domain/configuracionColumnasUsuarios'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

// Uso de defineProps con la interface
const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<any>,
    required: true,
  },
  propietario: Number,
  configuracionColumnas: Object as () => ColumnConfig<any>[],
  disable: Boolean,
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
})

defineEmits(['selected'])

/********
 * Mixin
 ********/
const { entidad } = props.mixin.useReferencias()

/************
 * Variables
 ************/
const columnas = configuracionColumnasUsuariosSeleccionados //props.configuracionColumnas ?? configuracionColumnasUsuarios

/***************
 * Orquestador
 ***************/
const {
  refListadoSeleccionable,
  criterioBusqueda,
  listado,
  listar,
  limpiar,
  seleccionar,
} = useOrquestadorSelectorUsuarios(entidad, 'usuarios')
</script>
