<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="rounded-card bg-solid q-pa-xs rounded mb-3 q-pa-md">
    <div class="row q-col-gutter-sm">
      <!-- Puntaje actual -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Puntaje actual</label>
        <q-input v-model="mejoramiento.puntaje_actual" disable outlined dense>
        </q-input>
      </div>

      <!-- Deudas vencidas -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Deudas vencidas</label>
        <q-input v-model="mejoramiento.deudas_vencidas" disable outlined dense>
        </q-input>
      </div>

      <!-- Puntaje a subir -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Puntaje a subir</label>
        <q-input v-model="mejoramiento.puntaje_subir" disable outlined dense>
        </q-input>
      </div>

      <!-- Maximo a subir -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Máximo a subir</label>
        <q-input v-model="mejoramiento.maximo_subir" disable outlined dense>
        </q-input>
      </div>

      <!-- Observacion -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Observación</label>
        <q-input
          v-model="mejoramiento.observacion"
          type="textarea"
          autogrow
          disable
          outlined
          dense
        >
        </q-input>
      </div>

      <!-- Estado -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Estado</label>
        <q-input v-model="mejoramiento.estado" disable outlined dense>
        </q-input>
      </div>

      <!-- Fecha de solicitud -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Fecha de solicitud</label>
        <q-input v-model="mejoramiento.fecha" disable outlined dense> </q-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps(['mejoramiento'])
</script>
