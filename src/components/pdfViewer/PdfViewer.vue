<template>
  <q-dialog
    v-model="mostrar"
    maximized
    full-width
    full-height
    class="q-pa-none"
  >
    <q-card style="background-color: #d1d1d1" class="q-pa-none">
      <q-toolbar>
        <q-toolbar-title>{{ 'Visor de archivos' }}</q-toolbar-title>

        <q-btn
          square
          dense
          unelevated
          color="negative"
          icon="close"
          @click="cerrar()"
        />
      </q-toolbar>

      <div class="q-px-sm bg-yellow-1 rounded q-mx-sm">
        <q-icon name="bi-exclamation-diamond" color="orange"></q-icon>
        En caso de no mostrarse, cierre y vuelva a abrir el visor.
      </div>

      <q-card-section class="q-pa-none">
        <div class="flotante-back">
          <div class="cargando">Cargando...</div>
        </div>

        <!-- Abre de todo pero a veces falla -->
        <iframe
          :src="`https://docs.google.com/viewer?embedded=true&url=${src}`"
          style="width: 100%; height: 90vh; border: none; padding: none"
          class="flotante"
        ></iframe>

        <!-- No abre pdf -->
        <!-- <iframe
          :src="`https://view.officeapps.live.com/op/view.aspx?src=${src}`"
          style="width: 100%; height: 90vh; border: none"
          class="flotante"
        ></iframe> -->

        <!-- Solo funciona en web -->
        <!-- <iframe
          :src="src"
          style="width: 100%; height: 90vh; border: none"
          class="flotante"
        >
        </iframe> -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

/* defineProps({
  src: String,
}) */

const mostrar = ref(false)
const src = ref()

const abrir = (url: string) => {
  src.value = url
  mostrar.value = true
}

const cerrar = () => {
  mostrar.value = false
}

defineExpose({ mostrar, abrir, cerrar })
</script>

<style lang="scss" scoped>
.flotante {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.flotante-back {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  width: 100%;
  height: 90vh;

  .cargando {
    position: absolute;
    font-size: 1.6rem;
    left: 50%;
    height: 90vh;
    transform: translateY(40%);
  }
}
</style>
