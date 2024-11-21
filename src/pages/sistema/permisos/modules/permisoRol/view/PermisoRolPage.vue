<template>
  <q-page padding class="q-pa-lg">
    <div class="text-h6 q-mb-md">
      <label class="q-mb-sm block">Roles</label>
      <q-select
        v-model="rol"
        :options="roles"
        transition-show="jump-up"
        transition-hide="jump-down"
        options-dense
        dense
        outlined
        @update:model-value="obtenerPermisoRol"
        error-message="Debes seleccionar un rol"
        use-input
        input-debounce="0"
        @filter="filtrarRol"
        :option-value="(v) => v.id"
        :option-label="(v) => v.name"
        emit-value
        map-options
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:after>
          <q-btn class="block" color="secondary" @click="crearRol()"
            ><q-icon name="bi-plus"></q-icon
          ></q-btn>
        </template>
      </q-select>
    </div>

    <div class="row q-col-gutter-sm q-mb-md q-mt-xs">
      <div class="col-12 col-md-5 q-gutter-y-sm">
        <div>No Asignados</div>
        <essential-table
          :configuracionColumnas="configuracionColumnasPermisos"
          :datos="permisosSinAsignar"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrarFooter="true"
          :mostrarColumnasVisibles="false"
          :mostrarExportar="true"
          ref="refPermisosSinAsignar"
          @selected="asignarPermiso"
          tipo-seleccion="multiple"
        >
        </essential-table>
      </div>

      <div class="col-md-2 column justify-center q-gutter-y-sm">
        <q-btn
          class="full-width block"
          color="positive"
          @click="crear_permiso()"
          unelevated
          square
          ><q-icon name="bi-plus"></q-icon
        ></q-btn>
        <q-btn
          v-if="rol !== undefined"
          class="full-width block"
          color="primary"
          @click="botonAsignarPermisos()"
          unelevated
          square
          ><q-icon name="bi-arrow-right"></q-icon
        ></q-btn>
        <q-btn
          v-if="rol !== undefined"
          class="full-width block"
          color="negative"
          @click="botonEliminarPermisos()"
          unelevated
          square
          ><q-icon name="bi-arrow-left"></q-icon
        ></q-btn>
      </div>

      <div class="col-12 col-md-5 q-mb-md">
        <div class="q-mb-sm">Asignados</div>
        <essential-table
          :configuracionColumnas="configuracionColumnasPermisos"
          :mostrarColumnasVisibles="false"
          :datos="listado"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrarExportar="true"
          ref="refPermisosAsignados"
          @selected="eliminarPermiso"
          tipo-seleccion="multiple"
        >
        </essential-table>
      </div>
    </div>
    <modal-entidad :comportamiento="modales"></modal-entidad>
  </q-page>
</template>

<script src="./PermisoRolPage.ts"></script>
