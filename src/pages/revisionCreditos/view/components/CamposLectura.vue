<template>
  <!-- Campos de solo lectura: como input deshabilitado (formato de las
       pantallas de bases de datos) o, con solo-texto, como texto plano -->
  <div
    class="row"
    :class="
      soloTexto ? 'q-col-gutter-x-md q-col-gutter-y-sm' : 'q-col-gutter-md'
    "
  >
    <div
      v-for="campo in campos"
      :key="campo.etiqueta"
      :class="campo.clase ?? 'col-12 col-sm-6 col-md-4'"
    >
      <template v-if="soloTexto">
        <div class="campo-texto__etiqueta">{{ campo.etiqueta }}</div>
        <div
          class="campo-texto__valor"
          :class="{ 'text-bold': campo.resaltar }"
        >
          {{ campo.valor ?? '—' }}
        </div>
      </template>
      <template v-else>
        <label class="block q-mb-sm">{{ campo.etiqueta }}</label>
        <q-input
          :model-value="campo.valor ?? '—'"
          :input-class="campo.resaltar ? 'text-bold' : ''"
          outlined
          disable
          dense
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CampoLectura } from '../../domain/RevisionCredito'

defineProps<{ campos: CampoLectura[]; soloTexto?: boolean }>()
</script>

<style scoped>
.campo-texto__etiqueta {
  font-size: 0.75rem;
  color: #78909c;
}

.campo-texto__valor {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}
</style>
