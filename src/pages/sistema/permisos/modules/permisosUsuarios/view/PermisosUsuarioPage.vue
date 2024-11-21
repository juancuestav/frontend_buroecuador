<template>
  <q-page padding class="q-pa-lg">
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Empleado -->
      <div class="col-12 col-md-5">
        <div class="col-12 col-md-5 q-mb-md">
          <label class="q-mb-sm block">Seleccione un usuario</label>
          <q-select
            v-model="empleado"
            :options="usuarios"
            options-dense
            dense
            outlined
            error-message="Debe seleccionar un usuario"
            use-input
            input-debounce="0"
            @filter="filtrarUsuarios"
            @update:model-value="filtrarRolesEmpleados"
            :option-value="(v) => v.id"
            :option-label="(v) => v.name + ' ' + v.apellidos"
            emit-value
            map-options
          ></q-select>
        </div>
        <!-- Roles -->
        <div class="col-12 col-md-5 q-mb-md" v-if="roles">
          <q-card>
            <q-card-section>
              <div class="text-h6">Roles</div>
              <q-scroll-area style="height: 100px">
                <div class="row">
                  <q-item dense v-for="(rol, index) in roles" :key="index">
                    <q-item-section avatar>
                      <q-icon
                        name="bi-check-circle-fill"
                        size="xs"
                        color="positive"
                      ></q-icon>
                    </q-item-section>
                    <q-item-section>{{ rol }}</q-item-section>
                  </q-item>
                </div>
              </q-scroll-area>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="col-12 col-md-2"></div>
      <!-- Permisos -->
      <div class="col-12 col-md-5" v-if="permisos">
        <div class="col-12 col-md-5 q-mb-md" v-if="listado">
          <q-card>
            <q-card-section>
              <div class="text-h6">
                Todos los permisos asignados (roles y directamente)
              </div>
              <q-scroll-area style="height: 164px">
                <div class="q-py-xs">
                  <q-item
                    dense
                    v-for="(permiso, index) in permisos"
                    :key="index"
                  >
                    <q-item-section avatar>
                      <q-icon
                        name="bi-check-circle-fill"
                        size="xs"
                        color="positive"
                      >
                        &nbsp;{{ index + 1 }}
                      </q-icon>
                    </q-item-section>
                    <q-item-section>{{ permiso.name }}</q-item-section>
                  </q-item>
                </div>
              </q-scroll-area>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-sm q-mb-md q-mt-xs">
      <div class="col-12 col-md-5 q-gutter-y-sm">
        <div class="q-mb-md">No Asignados</div>
        <essential-table
          :configuracionColumnas="configuracionColumnasPermisos"
          :datos="permisosSinAsignar"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrarHeader="true"
          :mostrarFooter="true"
          :mostrarColumnasVisibles="false"
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
          class="full-width block"
          color="primary"
          @click="botonAsignarPermisos()"
          unelevated
          square
          ><q-icon name="bi-arrow-right"></q-icon
        ></q-btn>
        <q-btn
          class="full-width block"
          color="accent"
          @click="botonEliminarPermisos()"
          unelevated
          square
          ><q-icon name="bi-arrow-left"></q-icon
        ></q-btn>
      </div>

      <div class="col-12 col-md-5 q-mb-md">
        <div class="q-mb-md">Asignados directamente</div>
        <essential-table
          :configuracionColumnas="configuracionColumnasPermisos"
          :mostrarColumnasVisibles="false"
          :datos="listado"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
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

<script src="./PermisosUsuarioPage.ts"></script>
