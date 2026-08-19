<template>
  <q-page class="glass-page-v2 flex flex-center q-pa-md">
    <div class="glass-dots">
      <div class="glass-orb glass-orb--1"></div>
      <div class="glass-orb glass-orb--2"></div>
      <div class="glass-orb glass-orb--3"></div>
    </div>

    <div v-if="!$q.screen.xs" class="glass-chip absolute-top-left q-ma-md">
      <q-avatar size="32px">
        <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
      </q-avatar>
      <span class="q-ml-sm text-subtitle2 text-weight-medium">{{
        appName
      }}</span>
    </div>

    <div
      class="row items-center justify-center full-width register-content q-gutter-y-lg"
    >
      <!-- Panel izquierdo - Hero (solo desde md en adelante) -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-12 col-md-6 flex flex-center text-center"
      >
        <div class="hero-content">
          <lottie-player
            :animationData="loginJson"
            background="transparent"
            :speed="0.8"
            style="width: 100%; max-width: 320px"
            loop
            autoplay
          ></lottie-player>

          <h1 class="text-h5 text-weight-medium q-mb-sm q-mt-md">
            {{
              mostrarRegistrarPagar
                ? 'Completa tu registro'
                : 'Únete a nosotros'
            }}
          </h1>
          <p class="text-body2 text-grey-8 q-mb-lg">
            {{
              mostrarRegistrarPagar
                ? 'Finaliza tu compra en minutos'
                : 'Crea tu cuenta fácil y rápido'
            }}
          </p>

          <div class="row justify-center q-gutter-md">
            <div class="text-center">
              <q-icon name="verified" color="positive" size="20px" />
              <div class="text-caption text-grey-8">Seguro</div>
            </div>
            <div class="text-center">
              <q-icon name="speed" color="primary" size="20px" />
              <div class="text-caption text-grey-8">Rápido</div>
            </div>
            <div class="text-center">
              <q-icon name="support" color="secondary" size="20px" />
              <div class="text-caption text-grey-8">24/7</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Formulario -->
      <div class="col-12 col-md-6 flex flex-center">
        <div class="register-form-wrapper">
          <!-- Encabezado móvil -->
          <div v-if="$q.screen.xs" class="text-center q-mb-md">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
            </q-avatar>
            <h2 class="text-h6 text-weight-medium q-mb-xs">
              {{
                mostrarRegistrarPagar ? 'Finaliza tu compra' : 'Crear cuenta'
              }}
            </h2>
            <p class="text-caption text-grey-8 q-mb-none">
              {{
                mostrarRegistrarPagar
                  ? 'Completa tu información'
                  : 'Rápido y seguro'
              }}
            </p>
          </div>

          <q-form @submit.prevent>
            <!-- Capa exterior: acciones (más sólida, contiene a la otra capa) -->
            <div class="glass-layer glass-layer--actions q-pa-md">
              <!-- Capa interior: campos del formulario (más clara, anidada debajo) -->
              <div class="glass-layer glass-layer--inputs q-pa-lg q-mb-md">
                <div class="text-center q-mb-md">
                  <h2 class="text-h6 text-weight-medium text-primary q-mb-xs">
                    {{
                      mostrarRegistrarPagar
                        ? 'Registrate antes de continuar con la compra'
                        : 'Registrate'
                    }}
                  </h2>
                  <p class="text-caption q-mb-none">
                    Estás a un paso de crear una cuenta
                  </p>
                </div>

                <div class="row q-col-gutter-sm">
                  <!-- Código reclutador -->
                  <div class="col-12">
                    <q-input
                      v-model="usuario.codigo_reclutador"
                      label="Código de reclutador (Opcional)"
                      placeholder="Ingrese su código de reclutador (Opcional)"
                      class="glass-input"
                      hide-bottom-space
                      outlined
                      dense
                    />
                  </div>

                  <!-- Nombre -->
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="usuario.name"
                      label="Nombres"
                      placeholder="Ingrese su nombre"
                      :error="!!v$.name.$errors.length"
                      class="glass-input"
                      hide-bottom-space
                      outlined
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" color="primary" size="18px" />
                      </template>
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
                      class="glass-input"
                      hide-bottom-space
                      outlined
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon
                          name="person_outline"
                          color="primary"
                          size="18px"
                        />
                      </template>
                      <template v-slot:error>
                        <div
                          v-for="error of v$.apellidos.$errors"
                          :key="error.$uid"
                        >
                          <div class="error-msg">{{ error.$message }}</div>
                        </div>
                      </template>
                    </q-input>
                  </div>

                  <!-- Celular -->
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="usuario.celular"
                      label="Celular"
                      placeholder="Ingrese su celular"
                      :error="!!v$.celular.$errors.length"
                      class="glass-input"
                      hide-bottom-space
                      type="tel"
                      mask="##########"
                      outlined
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" color="secondary" size="18px" />
                      </template>
                      <template v-slot:error>
                        <div
                          v-for="error of v$.celular.$errors"
                          :key="error.$uid"
                        >
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
                      class="glass-input"
                      hide-bottom-space
                      outlined
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" color="secondary" size="18px" />
                      </template>
                      <template v-slot:error>
                        <div
                          v-for="error of v$.email.$errors"
                          :key="error.$uid"
                        >
                          <div class="error-msg">{{ error.$message }}</div>
                        </div>
                      </template>
                    </q-input>
                  </div>

                  <!-- Provincia -->
                  <div class="col-12 col-md-6">
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
                      class="glass-input"
                      hide-bottom-space
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
                    >
                      <template v-slot:prepend>
                        <q-icon name="location_on" color="orange" size="18px" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <!-- Cantón -->
                  <div class="col-12 col-md-6">
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
                      class="glass-input"
                      hide-bottom-space
                      input-debounce="0"
                      @filter="filtrarCantones"
                      :option-value="(v) => v.id"
                      :option-label="(v) => v.nombre"
                      emit-value
                      map-options
                    >
                      <template v-slot:prepend>
                        <q-icon name="place" color="orange" size="18px" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <!-- Tipo de identificación -->
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
                      class="glass-input"
                      hide-bottom-space
                      :option-label="(item) => item.descripcion"
                      :option-value="(item) => item.id"
                      emit-value
                      map-options
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" color="deep-orange" size="18px" />
                      </template>
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

                  <!-- Identificación -->
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="usuario.identificacion"
                      label="Identificación"
                      placeholder="Ingrese su identificación"
                      :error="!!v$.identificacion.$errors.length"
                      class="glass-input"
                      hide-bottom-space
                      :type="identificacionInputType"
                      :mask="identificacionMask"
                      outlined
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon
                          name="credit_card"
                          color="deep-orange"
                          size="18px"
                        />
                      </template>
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
                      class="glass-input"
                      hide-bottom-space
                      outlined
                      dense
                      :type="isPwd ? 'password' : 'text'"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" color="red" size="18px" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          size="18px"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                      <template v-slot:error>
                        <div
                          v-for="error of v$.password.$errors"
                          :key="error.$uid"
                        >
                          <div class="error-msg">{{ error.$message }}</div>
                        </div>
                      </template>
                    </q-input>
                  </div>

                  <!-- Confirmación de contraseña -->
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="usuario.password_confirmation"
                      label="Confirme la contraseña"
                      :error="!!v$.password_confirmation.$errors.length"
                      class="glass-input"
                      hide-bottom-space
                      outlined
                      dense
                      :type="isPwd ? 'password' : 'text'"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock_outline" color="red" size="18px" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          size="18px"
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
                </div>
              </div>

              <div class="q-px-md q-pb-md">
                <q-btn
                  v-if="mostrarRegistrarPagar"
                  label="Registrarme y continuar con el pago"
                  class="full-width q-mb-sm"
                  color="primary"
                  no-caps
                  unelevated
                  icon="bi-credit-card"
                  rounded
                  @click="registrarPagar()"
                />

                <q-btn
                  v-else
                  label="Registrar"
                  class="full-width q-mb-sm"
                  color="primary"
                  no-caps
                  unelevated
                  rounded
                  @click="registrar()"
                />

                <q-btn
                  v-if="!mostrarRegistrarPagar"
                  :to="{ name: 'Login' }"
                  label="Iniciar sesión"
                  class="glass-btn-ghost full-width"
                  rounded
                  no-caps
                  replace
                  flat
                  size="sm"
                />
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script src="./RegisterPage.ts"></script>

<style lang="scss" scoped>
.register-content {
  position: relative;
  z-index: 1;
  max-width: 1100px;
}

.hero-content {
  max-width: 420px;
}

.register-form-wrapper {
  width: 100%;
  max-width: 480px;
}
</style>
