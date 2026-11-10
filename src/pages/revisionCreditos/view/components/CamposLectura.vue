<template>
  <!-- Campos de solo lectura con el mismo formato de las pantallas de bases de datos -->
  <div class="row q-col-gutter-md">
    <div
      v-for="campo in campos"
      :key="campo.etiqueta"
      :class="campo.clase ?? 'col-12 col-sm-6 col-md-4'"
    >
      <label class="block q-mb-sm">{{ campo.etiqueta }}</label>
      <q-input
        :model-value="campo.valor ?? '—'"
        :input-class="campo.resaltar ? 'text-bold' : ''"
        outlined
        disable
        dense
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CampoLectura } from '../../domain/RevisionCredito'

defineProps<{ campos: CampoLectura[] }>()
</script>
