<template>
  <!-- Pestañas sobre una tabla: cada una filtra un grupo, con su ícono, color y cantidad.
       La activa toma su color en el texto y en el indicador inferior. -->
  <q-tabs
    :model-value="modelValue"
    align="justify"
    class="pestanas-conteo"
    :style="{ '--color-activo': activa?.color }"
    active-class="pestana--activa"
    outside-arrows
    mobile-arrows
    inline-label
    dense
    no-caps
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-tab
      v-for="opcion in opciones"
      :key="opcion.valor"
      :name="opcion.valor"
      class="pestana"
      :style="{ '--color': opcion.color }"
    >
      <div class="row items-center no-wrap">
        <q-icon v-if="opcion.icono" :name="opcion.icono" size="18px" class="pestana__icono" />
        <span class="pestana__etiqueta">{{ opcion.etiqueta }}</span>
        <span class="pestana__total">{{ opcion.total ?? '–' }}</span>
      </div>
    </q-tab>
  </q-tabs>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface OpcionPestana {
  valor: string
  etiqueta: string
  /** Color representativo (hex) */
  color: string
  /** Ícono (bi-* o Material) */
  icono?: string
  /** null mientras no se conoce */
  total: number | null
}

const props = defineProps<{ modelValue: string; opciones: OpcionPestana[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', valor: string): void }>()

const activa = computed(() => props.opciones.find((o) => o.valor === props.modelValue))
</script>

<style scoped lang="scss">
.pestanas-conteo {
  border: 1px solid rgba(127, 127, 127, 0.25);

  // El indicador inferior toma el color de la pestaña activa
  :deep(.q-tab__indicator) {
    height: 3px;
    background: var(--color-activo, currentColor);
  }
}

.pestana {
  min-height: 44px;
  padding: 0 14px;
  opacity: 0.75;
  transition: opacity 0.2s, color 0.2s;

  // Separador vertical entre pestañas
  & + & {
    border-left: 1px solid rgba(127, 127, 127, 0.25);
  }

  &:hover {
    opacity: 1;
  }

  &__icono {
    margin-right: 6px;
    color: var(--color);
  }

  &__etiqueta {
    font-size: 0.9rem;
    font-weight: 500;
  }

  &__total {
    margin-left: 8px;
    min-width: 22px;
    padding: 0 7px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
    background: color-mix(in srgb, var(--color) 18%, transparent);
  }

  &--activa {
    opacity: 1;
    color: var(--color);

    .pestana__etiqueta {
      font-weight: 600;
    }

    .pestana__total {
      background: color-mix(in srgb, var(--color) 28%, transparent);
    }
  }
}
</style>
