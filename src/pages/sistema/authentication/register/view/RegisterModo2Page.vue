<template>
  <q-page class="register-page full-height overflow-hidden">
    <!-- Fondo animado minimalista -->
    <div class="animated-background">
      <div class="gradient-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <!-- Header flotante compacto -->
    <div v-if="!$q.screen.xs" class="header-float slide-in-down">
      <div class="header-content">
        <q-avatar size="40px" class="logo-avatar q-mr-sm">
          <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
        </q-avatar>
        <div class="brand-info">
          <div class="text-body1 text-white text-weight-medium">
            {{ appName }}
          </div>
        </div>
      </div>
    </div>

    <div class="main-container row items-center full-height">
      <!-- Panel izquierdo - Hero compacto -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-6 hero-section flex flex-center text-center q-pa-lg"
      >
        <div class="hero-content slide-in-left">
          <!-- Animación Lottie más pequeña -->
          <div class="animation-container q-mb-lg">
            <lottie-player
              :animationData="loginJson"
              background="transparent"
              :speed="0.8"
              style="width: 300px; height: 300px"
              loop
              autoplay
            ></lottie-player>
          </div>

          <!-- Contenido hero compacto -->
          <div class="hero-text fade-in-up">
            <h1 class="text-h4 text-white text-weight-light q-mb-sm">
              {{
                mostrarRegistrarPagar
                  ? 'Completa tu registro'
                  : 'Únete a nosotros'
              }}
            </h1>
            <p
              class="text-body1 text-white opacity-90 text-weight-light q-mb-lg"
            >
              {{
                mostrarRegistrarPagar
                  ? 'Finaliza tu compra en minutos'
                  : 'Crea tu cuenta fácil y rápido'
              }}
            </p>

            <!-- Stats compactos -->
            <div class="stats-row flex justify-center q-gutter-md">
              <div class="stat-mini text-center">
                <q-icon name="verified" color="positive" size="20px" />
                <div class="text-caption text-white">Seguro</div>
              </div>
              <div class="stat-mini text-center">
                <q-icon name="speed" color="primary" size="20px" />
                <div class="text-caption text-white">Rápido</div>
              </div>
              <div class="stat-mini text-center">
                <q-icon name="support" color="secondary" size="20px" />
                <div class="text-caption text-white">24/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Formulario compacto -->
      <div
        class="col-12 col-md-6 form-section flex items-center justify-center q-pa-sm"
      >
        <div class="form-wrapper slide-in-right">
          <!-- Header móvil compacto -->
          <div
            v-if="$q.screen.xs"
            class="mobile-header text-center q-mb-md fade-in-up"
          >
            <q-avatar size="60px" class="q-mb-sm">
              <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
            </q-avatar>
            <h2 class="text-h5 text-white text-weight-light q-mb-xs">
              {{
                mostrarRegistrarPagar ? 'Finaliza tu compra' : 'Crear cuenta'
              }}
            </h2>
            <p class="text-caption text-white opacity-90">
              {{
                mostrarRegistrarPagar
                  ? 'Completa tu información'
                  : 'Rápido y seguro'
              }}
            </p>
          </div>

          <!-- Tarjeta compacta -->
          <div class="register-card-container">
            <q-card class="register-card-compact glass-effect">
              <!-- Header compacto -->
              <q-card-section class="card-header-compact q-pa-md">
                <div class="text-center">
                  <h2 class="text-h5 text-weight-light text-primary q-mb-xs">
                    {{
                      mostrarRegistrarPagar
                        ? 'Registrate antes de continuar con la compra'
                        : 'Registrate'
                    }}
                  </h2>
                  <p class="text-caption text-grey-7 q-mb-none">
                    Estás a un paso de crear una cuenta
                  </p>
                </div>
              </q-card-section>

              <!-- Formulario compacto -->
              <q-card-section class="form-content-compact q-pa-md">
                <form
                  @submit.prevent="enviarCorreoRecuperacion"
                  class="register-form-compact"
                >
                  <div class="row q-col-gutter-sm q-px-sm">
                    <!-- Código reclutador -->
                    <div class="col-12 q-mb-md">
                      <q-input
                        v-model="usuario.codigo_reclutador"
                        label="Código de reclutador (Opcional)"
                        placeholder="Ingrese su código de reclutador (Opcional)"
                        outlined
                        dense
                      >
                      </q-input>
                    </div>

                    <!-- Nombre -->
                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="usuario.name"
                        label="Nombres"
                        placeholder="Ingrese su nombre"
                        :error="!!v$.name.$errors.length"
                        outlined
                        dense
                        class="compact-input"
                      >
                        <template v-slot:prepend>
                          <q-icon name="person" color="primary" size="18px" />
                        </template>
                        <template v-slot:error>
                          <div
                            v-for="error of v$.name.$errors"
                            :key="error.$uid"
                          >
                            <div class="error-msg">{{ error.$message }}</div>
                          </div>
                        </template>
                      </q-input>
                    </div>

                    <!-- Apellidos -->
                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="usuario.apellidos"
                        label="Apellidos"
                        placeholder="Ingrese su apellidos"
                        :error="!!v$.apellidos.$errors.length"
                        outlined
                        dense
                        class="compact-input"
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
                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="usuario.celular"
                        label="Celular"
                        placeholder="Ingrese su celular"
                        :error="!!v$.celular.$errors.length"
                        outlined
                        dense
                        class="compact-input"
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
                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="usuario.email"
                        label="Correo"
                        type="email"
                        placeholder="Ingrese su correo"
                        :error="!!v$.email.$errors.length"
                        outlined
                        dense
                        class="compact-input"
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

                    <!-- Tipo de cliente -->
                    <!-- <div class="col-12 col-md-6 q-mb-xs">
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
                        class="compact-input"
                      >
                        <template v-slot:prepend>
                          <q-icon name="business" color="accent" size="18px" />
                        </template>
                        <template v-slot:error>
                          <div
                            v-for="error of v$.tipo_cliente.$errors"
                            :key="error.$uid"
                          >
                            <div class="error-msg">{{ error.$message }}</div>
                          </div>
                        </template>
                      </q-select>
                    </div> -->

                    <!-- Provincia -->
                    <div class="col-12 col-md-6 q-mb-xs">
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
                        class="compact-input"
                        @update:model-value="
                          () => {
                            obtenerCantones(usuario.provincia)
                            usuario.canton = null
                          }
                        "
                        input-debounce="0"
                        @filter="filtrarProvincias"
                        :option-value="(v) => v.id"
                        :option-label="(v) => v.descripcion"
                        emit-value
                        map-options
                      >
                        <template v-slot:prepend>
                          <q-icon
                            name="location_on"
                            color="orange"
                            size="18px"
                          />
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
                    <div class="col-12 col-md-6 q-mb-xs">
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
                        class="compact-input"
                        input-debounce="0"
                        @filter="filtrarCantones"
                        :option-value="(v) => v.id"
                        :option-label="(v) => v.descripcion"
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
                    <div class="col-12 col-md-6 q-mb-xs">
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
                        class="compact-input"
                        :option-label="(item) => item.descripcion"
                        :option-value="(item) => item.id"
                        emit-value
                        map-options
                      >
                        <template v-slot:prepend>
                          <q-icon
                            name="badge"
                            color="deep-orange"
                            size="18px"
                          />
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
                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="usuario.identificacion"
                        label="Identificación"
                        placeholder="Ingrese su identificación"
                        :error="!!v$.identificacion.$errors.length"
                        outlined
                        dense
                        class="compact-input"
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
                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="usuario.password"
                        label="Contraseña"
                        :error="!!v$.password.$errors.length"
                        outlined
                        dense
                        class="compact-input"
                        :type="isPwd ? 'password' : 'text'"
                      >
                        <template v-slot:prepend>
                          <q-icon name="lock" color="red" size="18px" />
                        </template>
                        <template v-slot:append>
                          <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer password-toggle"
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
                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="usuario.password_confirmation"
                        label="Confirme la contraseña"
                        :error="!!v$.password_confirmation.$errors.length"
                        outlined
                        dense
                        class="compact-input"
                        :type="isPwd ? 'password' : 'text'"
                      >
                        <template v-slot:prepend>
                          <q-icon name="lock_outline" color="red" size="18px" />
                        </template>
                        <template v-slot:append>
                          <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer password-toggle"
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

                    <!-- Botones compactos -->
                    <div class="col-12 q-mt-sm">
                      <q-btn
                        v-if="mostrarRegistrarPagar"
                        color="primary"
                        label="Registrarme y continuar con el pago"
                        class="compact-btn full-width q-mb-xs"
                        no-caps
                        unelevated
                        icon="bi-credit-card"
                        rounded
                        size="md"
                        @click="registrarPagar()"
                      />

                      <q-btn
                        v-else
                        color="primary"
                        label="Registrar"
                        class="compact-btn full-width q-mb-xs"
                        no-caps
                        unelevated
                        rounded
                        size="md"
                        @click="registrar()"
                      />

                      <q-btn
                        v-if="!mostrarRegistrarPagar"
                        :to="{ name: 'Login' }"
                        label="Iniciar sesión"
                        class="compact-btn-secondary full-width"
                        rounded
                        no-caps
                        replace
                        flat
                        size="sm"
                      />
                    </div>
                  </div>
                </form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script src="./RegisterPage.ts">
// Datos adicionales para el componente (solo para referencia)
// Puedes agregar estas funciones a tu archivo RegisterPage.ts si quieres efectos adicionales:
//
// const onInputFocus = (event) => {
//   event.target.closest('.compact-input')?.classList.add('focused');
// };
//
// const onInputBlur = (event) => {
//   event.target.closest('.compact-input')?.classList.remove('focused');
// };
</script>

<style lang="scss" scoped>
// Animaciones básicas
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes orbMove {
  0%,
  100% {
    transform: translateX(0px) translateY(0px);
  }
  50% {
    transform: translateX(-10px) translateY(-10px);
  }
}

// Página principal
.register-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  min-height: 100vh;
}

// Fondo animado minimalista
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.gradient-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.04)
  );
  animation: orbMove 15s ease-in-out infinite;

  &.orb-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }

  &.orb-2 {
    width: 150px;
    height: 150px;
    top: 30%;
    right: -75px;
    animation-delay: 5s;
  }

  &.orb-3 {
    width: 120px;
    height: 120px;
    bottom: -60px;
    left: 30%;
    animation-delay: 10s;
  }
}

// Header flotante compacto
.header-float {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  align-items: center;
}

.logo-avatar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.slide-in-down {
  animation: slideInDown 0.6s ease-out;
}

// Contenedor principal
.main-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

// Hero section compacto
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 400px;
}

.slide-in-left {
  animation: slideInLeft 0.6s ease-out;
}
.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.stats-row {
  .stat-mini {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(10px);
    min-width: 60px;
  }
}

// Sección del formulario
.form-section {
  padding: 1rem;
  position: relative;
}

.form-wrapper {
  width: 100%;
  max-width: 480px;
  position: relative;
}

.slide-in-right {
  animation: slideInRight 0.6s ease-out;
}

// Header móvil compacto
.mobile-header {
  padding: 1rem 0.5rem;
}

// Tarjeta compacta
.register-card-compact {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.glass-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(25, 118, 210, 0.6),
    transparent
  );
  z-index: 1;
}

// Header compacto
.card-header-compact {
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.05) 0%,
    rgba(156, 39, 176, 0.05) 100%
  );
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
}

// Formulario compacto
.form-content-compact {
  position: relative;
}

.register-form-compact {
  position: relative;
}

// Inputs compactos
.compact-input {
  .q-field__control {
    min-height: 36px !important;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
    }
  }

  &.q-field--focused .q-field__control {
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  }

  .q-field__label {
    font-size: 12px;
  }

  .q-field__native {
    font-size: 14px;
    padding: 4px 8px;
  }
}

// Password toggle compacto
.password-toggle {
  transition: all 0.3s ease;

  &:hover {
    color: #1976d2;
    transform: scale(1.1);
  }
}

// Mensajes de error compactos
.error-msg {
  color: #f44336;
  font-size: 10px;
  font-weight: 500;
  animation: fadeInUp 0.3s ease;
}

// Botones compactos
.compact-btn {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 13px;
  min-height: 36px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
  }
}

.compact-btn-secondary {
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 12px;
  min-height: 28px;

  &:hover {
    background: rgba(25, 118, 210, 0.1);
  }
}

// Responsive design
@media (max-width: 1023px) {
  .hero-section {
    display: none;
  }

  .header-float {
    display: none;
  }

  .col-md-6 {
    width: 100% !important;
  }
}

@media (max-width: 768px) {
  .register-card-compact {
    margin: 0 0.25rem;
    border-radius: 12px;
  }

  .form-content-compact {
    padding: 0.75rem !important;
  }

  .card-header-compact {
    padding: 0.75rem !important;
  }
}

@media (max-width: 480px) {
  .form-content-compact,
  .card-header-compact {
    padding: 0.5rem !important;
  }

  .mobile-header {
    padding: 0.5rem;
  }

  .compact-input .q-field__control {
    min-height: 32px !important;
  }
}

// Modo oscuro
.body--dark {
  .register-card-compact {
    background: rgba(30, 30, 30, 0.95);
    color: white;
  }

  .card-header-compact {
    background: linear-gradient(
      135deg,
      rgba(45, 45, 45, 0.5) 0%,
      rgba(60, 60, 60, 0.8) 100%
    );
  }
}

// Estilos heredados
h2 {
  line-height: 1.2;
  font-size: 1.2rem;
  margin: 0;
}

// Efectos de hover mínimos
.register-card-compact {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
}

// Accesibilidad
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
