<template>
  <q-page class="gradiente-azul-morado h-100">
    <div v-if="!$q.screen.xs" class="row items-center empresa">
      <q-avatar class="rounded-card">
        <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
      </q-avatar>
      <span class="q-ml-md text-h5 text-white text-thin">{{ appName }}</span>
    </div>

    <div class="row items-center">
      <!-- Left side -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-12 col-md-7 text-center q-pa-lg"
      >
        <div class="imagen d-flex align-items-center justify-content-center">
          <lottie-player
            :animationData="loginJson"
            background="transparent"
            :speed="1"
            style="width: 400px; height: 400px"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>

      <!-- Right side -->
      <div
        class="col-12 col-md-5 row items-center justify-center window-height q-pa-sm"
      >
        <div class="gradiente-blanco rounded-card full-width q-mb-lg">
          <form
            @submit.prevent="enviarCorreoRecuperacion"
            class="row q-col-gutter-sm q-px-lg"
          >
            <div class="col-12 q-mb-sm">
              <h2>Registrate</h2>
              <span>Estás a un paso de crear una cuenta</span>
            </div>

            <!-- Código reclutador -->
            <!-- <div class="col-12 q-mb-md">
              <q-input
                v-model="usuario.codigo_reclutador"
                label="Código de reclutador (Opcional)"
                placeholder="Ingrese su código de reclutador (Opcional)"
                outlined
                dense
              >
              </q-input>
            </div> -->

            <!-- Nombre -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.name"
                label="Nombre"
                placeholder="Ingrese su nombre"
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
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.apellidos"
                label="Apellidos"
                placeholder="Ingrese su apellidos"
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

            <!-- Edad -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.edad"
                label="Edad"
                type="number"
                placeholder="Ingrese su edad"
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
            <!-- <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.direccion"
                label="Dirección"
                placeholder="Ingrese su dirección"
                :error="!!v$.direccion.$errors.length"
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

            <!-- Celular -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.celular"
                label="Celular"
                placeholder="Ingrese su celular"
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
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.email"
                label="Correo"
                type="email"
                placeholder="Ingrese su correo"
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
            <div class="col-12 col-md-6">
              <q-select
                v-model="usuario.tipo_cliente"
                label="Tipo de cliente"
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

            <!--Provincia -->
            <div class="col-12 col-md-6 q-mb-md">
              <q-select
                v-model="usuario.provincia"
                :options="provincias"
                label="Provincia (Opcional)"
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
            <div class="col-12 col-md-6 q-mb-md">
              <q-select
                v-model="usuario.canton"
                :options="cantones"
                label="Cantón (Opcional)"
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

            <!-- Tipo de identificacion -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="usuario.tipo_identificacion"
                label="Tipo de identificación"
                :options="listadosAuxiliares.tiposIdentificaciones"
                :error="!!v$.tipo_identificacion.$errors.length"
                transition-show="flip-up"
                transition-hide="flip-down"
                options-dense
                dense
                outlined
                :option-label="(item) => item.descripcion"
                :option-value="(item) => item.id"
                emit-value
                map-options
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
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.identificacion"
                label="Identificación"
                placeholder="Ingrese su identificación"
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

            <!-- Contraseña -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.password"
                label="Contraseña"
                :error="!!v$.password.$errors.length"
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

                <template v-slot:error>
                  <div v-for="error of v$.password.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Confirmacion de contraseña -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.password_confirmation"
                label="Confirme la contraseña"
                :error="!!v$.password_confirmation.$errors.length"
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

                <template v-slot:error>
                  <div
                    v-for="error of v$.password_confirmation.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Botones -->
            <div class="col-12 q-mb-xl">
              <q-btn
                color="primary"
                label="Registrar"
                class="full-width q-mb-sm"
                no-caps
                unelevated
                rounded
                @click="registrar()"
              >
              </q-btn>

              <q-btn
                :to="{ name: 'Login' }"
                label="Iniciar sesión"
                class="full-width"
                rounded
                no-caps
                replace
                flat
              >
              </q-btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script src="./RegisterPage.ts"></script>

<style>
h2 {
  line-height: 1.2;
  font-size: 1.714rem;
}

.empresa {
  position: fixed;
  top: 16px;
  left: 16px;
}
</style>
