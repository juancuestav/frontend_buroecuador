<template>
  <span class="numero-animado">{{ texto }}</span>
</template>

<script setup lang="ts">
// Número que cuenta hasta su nuevo valor con una transición suave
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { movimientoReducido } from './movimiento'

const props = withDefaults(
  defineProps<{
    valor: number | null
    // Texto cuando no hay valor (p. ej. un % sin base)
    vacio?: string
    sufijo?: string
    duracion?: number
  }>(),
  { vacio: '—', sufijo: '', duracion: 700 }
)

const formato = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 0 })
const mostrado = ref(0)
let cuadro = 0

const texto = computed(() =>
  props.valor === null
    ? props.vacio
    : formato.format(Math.round(mostrado.value)) + props.sufijo
)

// easeOutCubic: arranca rápido y se asienta suave
const suavizar = (t: number) => 1 - Math.pow(1 - t, 3)

function animarHasta(destino: number) {
  cancelAnimationFrame(cuadro)
  const origen = mostrado.value
  if (movimientoReducido() || origen === destino) {
    mostrado.value = destino
    return
  }
  const inicio = performance.now()
  const paso = (ahora: number) => {
    const t = Math.min(1, (ahora - inicio) / props.duracion)
    mostrado.value = origen + (destino - origen) * suavizar(t)
    if (t < 1) cuadro = requestAnimationFrame(paso)
  }
  cuadro = requestAnimationFrame(paso)
}

onMounted(() => animarHasta(props.valor ?? 0))
watch(
  () => props.valor,
  (valor) => animarHasta(valor ?? 0)
)
onBeforeUnmount(() => cancelAnimationFrame(cuadro))
</script>

<style scoped>
.numero-animado {
  font-variant-numeric: tabular-nums;
}
</style>
