<template>
  <q-page class="glass-page-v2 flex flex-center q-pa-md">
    <div class="glass-dots">
      <div class="glass-orb glass-orb--1"></div>
      <div class="glass-orb glass-orb--2"></div>
      <div class="glass-orb glass-orb--3"></div>
    </div>

    <div class="glass-chip absolute-top-left q-ma-md">
      <q-avatar size="32px">
        <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
      </q-avatar>
      <span class="q-ml-sm text-subtitle2 text-weight-medium">{{
        appName
      }}</span>
    </div>

    <div class="login-content full-width">
      <div class="row items-center justify-center full-width q-gutter-y-lg">
        <!-- Ilustración (solo desde md en adelante) -->
        <div
          v-if="!$q.screen.xs && !$q.screen.sm"
          class="col-12 col-md-6 flex flex-center"
        >
          <lottie-player
            :animationData="loginJson"
            background="transparent"
            :speed="1"
            style="width: 100%; max-width: 380px"
            loop
            autoplay
          ></lottie-player>
        </div>

        <!-- Formulario -->
        <div class="col-12 col-md-5">
          <q-form class="login-card" @submit.prevent="login">
            <!-- Capa exterior: acciones (más sólida, contiene a la otra capa) -->
            <div class="glass-layer glass-layer--actions">
              <!-- Capa interior: campos del formulario (más clara, anidada debajo) -->
              <div class="glass-layer glass-layer--inputs q-pa-lg q-mb-md">
                <div class="text-h6 text-weight-medium text-center q-mb-lg">
                  Inicie sesión con su cuenta
                </div>

                <div class="q-gutter-y-md">
                  <q-input
                    v-model="loginUser.email"
                    type="email"
                    label="Correo"
                    class="glass-input"
                    outlined
                    dense
                    hide-bottom-space
                    @keyup.enter="login()"
                  >
                    <template v-slot:prepend>
                      <q-icon name="mail" color="primary" size="18px" />
                    </template>
                  </q-input>

                  <q-input
                    v-model="loginUser.password"
                    label="Contraseña"
                    class="glass-input"
                    outlined
                    dense
                    :type="isPwd ? 'password' : 'text'"
                    hint="No comparta su contraseña con nadie"
                    @keyup.enter="login()"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" color="primary" size="18px" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>

                  <q-toggle
                    v-model="loginUser.remember_session"
                    label="Recuérdame"
                    color="primary"
                  />
                </div>
              </div>

              <div class="q-px-md q-pb-md">
                <q-btn
                  label="Iniciar sesión"
                  class="full-width q-mb-sm"
                  :disabled="!enableLoginButton"
                  color="primary"
                  no-caps
                  unelevated
                  rounded
                  @click="login()"
                />

                <q-btn
                  :to="{ name: 'register' }"
                  label="Crear cuenta"
                  class="glass-btn-ghost full-width"
                  replace
                  rounded
                  no-caps
                  flat
                />
              </div>
            </div>
          </q-form>
        </div>
      </div>

      <div class="text-center login-cta q-mt-lg">
        <div class="text-h6 text-weight-medium q-mb-sm">
          ¿Quieres conocer tu situación crediticia personal?
        </div>
        <p class="text-body2 text-grey-8 q-mb-md">
          El reporte de crédito te permite saber el estado de tus deudas y
          ordenar tus finanzas personales
        </p>
        <q-btn
          class="glass-btn-outline"
          href="https://www.burodecredito.ec/servicios"
          target="_blank"
          no-caps
          unelevated
          rounded
          icon="bi-stars"
          >Conoce todos nuestros servicios</q-btn
        >
      </div>
    </div>
  </q-page>
</template>

<script src="./LoginPage.ts"></script>

<style lang="scss" scoped>
.login-content {
  position: relative;
  z-index: 1;
  max-width: 1100px;
}

.login-card {
  width: 100%;
}

.login-cta {
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}
</style>
