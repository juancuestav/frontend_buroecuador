<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Usuarios"
    paginate
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="usuario.name"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.name.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.name.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Apellidos -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Apellidos</label>
            <q-input
              v-model="usuario.apellidos"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.apellidos.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.apellidos.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Edad-->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Edad</label>
            <q-input
              v-model="usuario.edad"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.edad.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.edad.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Direccion -->
          <!-- <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="usuario.direccion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.direccion.$errors.length"
              @update:model-value="(v) => (usuario.direccion = v.toUpperCase())"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.direccion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div> -->

          <!--Provincia -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Provincia</label>
            <q-select
              v-model="usuario.provincia"
              :options="provincias"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              @update:model-value="
                () => {
                  obtenerCantones(usuario.provincia)
                  usuario.canton = null
                }
              "
              input-debounce="0"
              @filter="filtrarProvincias"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!--Canton -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Cantón</label>
            <q-select
              v-model="usuario.canton"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarCantones"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Celular -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              v-model="usuario.celular"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.celular.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.celular.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Correo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              v-model="usuario.email"
              placeholder="Obligatorio"
              type="email"
              :disable="disabled"
              :error="!!v$.email.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.email.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Tipo de cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo cliente</label>
            <q-select
              v-model="usuario.tipo_cliente"
              :options="tiposClientes"
              :error="!!v$.tipo_cliente.$errors.length"
              transition-show="flip-up"
              transition-hide="flip-down"
              options-dense
              dense
              outlined
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_identificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Tipo de identificacion -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo de identificación</label>
            <q-select
              v-model="usuario.tipo_identificacion"
              :options="listadosAuxiliares.tiposIdentificaciones"
              :error="!!v$.tipo_identificacion.$errors.length"
              :disable="disabled"
              transition-show="flip-up"
              transition-hide="flip-down"
              :option-label="(item) => item.descripcion"
              :option-value="(item) => item.id"
              options-dense
              emit-value
              map-options
              dense
              outlined
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_identificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Identificacion -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Identificación</label>
            <q-input
              v-model="usuario.identificacion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.identificacion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.identificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Contrasena -->
          <div class="col-12 col-md-3 q-mb-md">
            <label v-if="accion === 'MODIFICAR'" class="q-mb-sm block"
              >Nueva contraseña</label
            >
            <label v-else class="q-mb-sm block">Contraseña</label>
            <q-input
              v-model="usuario.password"
              :placeholder="accion === 'NUEVO' ? 'Obligatorio' : 'Opcional'"
              :disable="disabled"
              outlined
              dense
              :type="isPwd ? 'password' : 'text'"
              autocomplete="off"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <!-- Confirmar contrasena -->
          <div
            v-show="accion !== 'ELIMINAR' || accion !== 'CONSULTAR'"
            class="col-12 col-md-3 q-mb-md"
          >
            <label v-if="accion === 'MODIFICAR'" class="q-mb-sm block"
              >Nueva contraseña</label
            >
            <label v-else class="q-mb-sm block">Confirmar contraseña</label>
            <q-input
              v-model="usuario.password_confirmation"
              :placeholder="accion === 'NUEVO' ? 'Obligatorio' : 'Opcional'"
              :disable="disabled"
              outlined
              dense
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <!-- Roles -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Rol</label>
            <q-select
              v-model="usuario.rol"
              :options="listadosAuxiliares.roles"
              :error="!!v$.rol.$errors.length"
              :disable="disabled"
              transition-show="flip-up"
              transition-hide="flip-down"
              :option-label="(item) => item.name"
              :option-value="(item) => item.id"
              options-dense
              emit-value
              map-options
              dense
              multiple
              use-chips
              outlined
            >
              <template v-slot:error>
                <div v-for="error of v$.rol.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Código verificación</label>
            <q-input
              v-model="usuario.codigo_verificacion"
              readonly
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Código reclutador</label>
            <q-input
              v-model="usuario.codigo_reclutador"
              readonly
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarLimiteConsultas" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Limite de consultas permitidas</label>
            <q-input v-model="usuario.limite_consultas" disable outlined dense>
              <template #after>
                <q-btn
                  color="grey-4"
                  @click="ampliarLimiteConsultas()"
                  outline
                  no-caps
                  unelevated
                >
                  <q-icon name="bi-plus" class="text-grey-8"></q-icon>
                  <span class="text-grey-8">Ampliar</span>
                </q-btn>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Consultas realizadas</label>
            <q-input
              v-model="usuario.consultas_realizadas"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./UsuarioPage.ts"></script>
