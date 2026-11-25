<template>
  <!-- Día del mes en que se pagan las cuotas: calendario de un mes con solo
       los días 3 a 28 habilitados -->
  <div class="selector-dia" :class="{ 'selector-dia--error': error }" role="radiogroup" aria-label="Día de pago">
    <button
      v-for="dia in 31"
      :key="dia"
      type="button"
      class="selector-dia__dia"
      :class="{ 'selector-dia__dia--activo': dia === modelValue }"
      :disabled="disable || dia < minimo || dia > maximo"
      role="radio"
      :aria-checked="dia === modelValue"
      @click="emit('update:modelValue', dia)"
    >
      {{ dia }}
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ modelValue: number | null; minimo?: number; maximo?: number; disable?: boolean; error?: boolean }>(),
  { minimo: 3, maximo: 28 }
)
const emit = defineEmits<{ (e: 'update:modelValue', dia: number): void }>()
</script>

<style scoped lang="scss">
.selector-dia {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 4px;
  max-width: 320px;

  &--error {
    border-color: var(--q-negative);
  }

  &__dia {
    appearance: none;
    font: inherit;
    font-size: 0.85rem;
    height: 34px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: rgba(30, 99, 214, 0.1);
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }

    &--activo {
      background: var(--q-primary) !important;
      color: #fff;
      font-weight: 700;
    }
  }
}
</style>
