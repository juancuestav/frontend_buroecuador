<template>
  <q-page class="bg-white">
    <div class="row items-center empresa">
      <q-avatar square>
        <img src="~assets/logo_socio_empleo.png" />
      </q-avatar>
      <span class="q-ml-md text-h5">Trabajos Ecuador</span>
    </div>
    <div class="row items-center">
      <!-- Left side -->
      <!-- <div
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
      </div> -->

      <!-- Right side -->
      <div
        class="col-12 col-md-4 row items-center q-mx-auto justify-center bg-white window-height" style="height: 900px;"
      >
        <form @submit.prevent="login" class="full-width q-px-lg">
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

          <div class="q-mb-sm">
            <h2>Bienvenidos a Trabajos Ecuador</h2>
            <span>Inicie sesión con su cuenta</span>
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
            <q-toggle v-model="loginUser.remember_session" label="Recuérdame" />
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
