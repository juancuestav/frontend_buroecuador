<template>
  <div
    class="anillo"
    :style="{ width: `${tamano}px`, height: `${tamano}px` }"
    role="img"
    :aria-label="etiqueta"
  >
    <svg :viewBox="`0 0 ${tamano} ${tamano}`" :width="tamano" :height="tamano">
      <circle
        class="anillo__pista"
        :cx="centro"
        :cy="centro"
        :r="radio"
        :stroke-width="grosor"
      />
      <circle
        class="anillo__valor"
        :cx="centro"
        :cy="centro"
        :r="radio"
        :stroke="color"
        :stroke-width="grosor"
        :stroke-dasharray="circunferencia"
        :stroke-dashoffset="desplazamiento"
        :transform="`rotate(-90 ${centro} ${centro})`"
      />
    </svg>
    <div class="anillo__centro">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Anillo de progreso en SVG; el arco crece con una transición CSS
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    // 0–100; null = sin datos (pista vacía)
    porcentaje: number | null
    color: string
    tamano?: number
    grosor?: number
    etiqueta?: string
  }>(),
  { tamano: 96, grosor: 9, etiqueta: '' }
)

const centro = computed(() => props.tamano / 2)
const radio = computed(() => (props.tamano - props.grosor) / 2)
const circunferencia = computed(() => 2 * Math.PI * radio.value)

// Arranca vacío y se llena al montarse, para que la entrada sea animada
const montado = ref(false)
onMounted(() => requestAnimationFrame(() => (montado.value = true)))

const desplazamiento = computed(() => {
  const p = montado.value
    ? Math.max(0, Math.min(100, props.porcentaje ?? 0))
    : 0
  return circunferencia.value * (1 - p / 100)
})
</script>

<style scoped>
.anillo {
  position: relative;
  flex-shrink: 0;
}

.anillo__pista {
  fill: none;
  stroke: var(--dash-pista, rgba(26, 25, 46, 0.08));
}

.anillo__valor {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    stroke 0.3s ease;
}

.anillo__centro {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.1;
}

@media (prefers-reduced-motion: reduce) {
  .anillo__valor {
    transition: none;
  }
}
</style>
