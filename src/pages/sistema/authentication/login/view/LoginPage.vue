<template>
  <q-page class="bg-grey-2f">
    <div class="row items-center empresa">
      <q-avatar square>
        <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
      </q-avatar>
      <span class="q-ml-md text-h5">{{ appName }}</span>
    </div>
    <div class="row items-center">
      <!-- Left side -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-12 col-md-8 text-center q-pa-lg"
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
        class="col-12 bg-grey-2 col-md-4 column items-center justify-center bg-white window-height q-px-sm"
      >
        <div class="rounded full-width q-mb-lg">
          <form
            @submit.prevent="login"
            class="rounded bg-grey-2 q-pa-md q-py-lg"
          >
            <div class="q-mb-sm">
              <!-- <h2>Bienvenidos a {{ appName  }}</h2> -->
              <div class="text-center text-bold q-mb-md">
                Inicie sesión con su cuenta
              </div>
            </div>

            <!-- Correo -->
            <div class="col-12 q-mb-sm">
              <q-input
                v-model="loginUser.email"
                type="email"
                label="Correo"
                outlined
                dense
                @keyup.enter="login()"
              />
            </div>

            <!-- Contraseña -->
            <div class="col-12 q-mb-sm">
              <q-input
                v-model="loginUser.password"
                label="Contraseña"
                outlined
                dense
                :type="isPwd ? 'password' : 'text'"
                hint="No comparta su contraseña con nadie"
                @keyup.enter="login()"
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

            <!-- Recuerdame -->
            <div class="col-12 q-mb-sm">
              <q-toggle
                v-model="loginUser.remember_session"
                label="Recuérdame"
              />
            </div>

            <div class="col-12">
              <!-- Botones -->
              <q-btn
                color="primary"
                label="Iniciar sesión"
                class="full-width q-mb-sm"
                :disabled="!enableLoginButton"
                no-caps
                unelevated
                square
                @click="login()"
              >
              </q-btn>

              <q-btn
                :to="{ name: 'register' }"
                label="Crear cuenta"
                class="full-width"
                replace
                no-caps
                flat
              >
              </q-btn>
            </div>
          </form>
        </div>

        <div class="text-center">
          <div class="text-primary text-h5 q-mb-md">
            ¿Quieres conocer tu situación crediticia personal?
          </div>
          <div class="q-mb-md">
            El reporte de crédito te permite saber el estado de tus deudas y
            ordenar tus finanzas personales
          </div>
          <q-btn
            color="positive"
            href="https://www.burodecredito.ec/servicios"
            target="_blank"
            no-caps
            unelevated
            square
            icon="bi-stars"
            >Conoce todos nuestros servicios</q-btn
          >
        </div>
      </div>
    </div>
    <!-- {{ store }} -->
    <!-- {{ userData }}
    <div class="bg-purple">Antes de logear: {{ antesLogeo }}</div>
    <div class="bg-negative">Hay errores: {{ errores }}</div>
    <div class="bg-positive">
      Inicio de sesion correcto: {{ logeadoCorrecto }}
    </div>
    <div class="bg-info">Notificacion: {{ notificacionMostrada }}</div>
    <div class="bg-lime q-mb-xl">Response: {{ respuesta }}</div> -->
  </q-page>
</template>

<script src="./LoginPage.ts"></script>

<style scope>
h2 {
  line-height: 1.2;
  font-size: 1.714rem;
}

.empresa {
  position: fixed;
  top: 16px;
  left: 16px;
}

/* .q-field .q-field__inner {
  text-transform: none !important;
} */
</style>
