<template>
  <q-dialog
    :model-value="mostrarAviso"
    persistent
    transition-show="scale"
    transition-hide="fade"
  >
    <q-card class="aviso-inactividad q-pa-lg text-center">
      <q-circular-progress
        show-value
        :value="segundosRestantes"
        :max="60"
        size="72px"
        :thickness="0.12"
        color="warning"
        track-color="grey-3"
        class="q-mb-md"
      >
        <span class="text-subtitle1 text-bold">{{ segundosRestantes }}</span>
      </q-circular-progress>

      <div class="text-subtitle1 text-bold">¿Sigues ahí?</div>
      <div class="text-body2 text-blue-grey-7 q-mt-xs">
        Por seguridad, tu sesión se cerrará en
        <b>{{ segundosRestantes }} s</b> por inactividad.
      </div>

      <q-btn
        label="Seguir conectado"
        color="primary"
        unelevated
        no-caps
        class="full-width q-mt-lg"
        @click="seguirConectado"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useCierrePorInactividad } from 'shared/sesion/useCierrePorInactividad'

const { mostrarAviso, segundosRestantes, seguirConectado } =
  useCierrePorInactividad()
</script>

<style scoped>
.aviso-inactividad {
  width: 340px;
  max-width: 92vw;
  border-radius: 20px;
}
</style>
