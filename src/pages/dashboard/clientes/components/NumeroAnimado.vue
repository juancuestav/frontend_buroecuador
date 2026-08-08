<template>{{ textoMostrado }}</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// Cuenta desde 0 hasta `valor` cada vez que este componente se monta (el
// padre controla CUÁNDO "reiniciar" el conteo con su propio :key, igual que
// ya se hace con los gráficos y las filas de asesores — así el número
// vuelve a animarse en cada refresco periódico de 30s, consistente con el
// resto del dashboard).
const props = withDefaults(
  defineProps<{
    valor: number
    formatear?: (valor: number) => string
    duracionMs?: number
  }>(),
  { duracionMs: 800 }
)

const valorMostrado = ref(0)
// Se redondea antes de formatear (no solo al final): `formatear` puede ser
// algo como `agruparMiles`, que no redondea por su cuenta, y sin esto los
// cuadros intermedios de la animación mostrarían decimales sin sentido
// (p. ej. "645.329" clientes) aunque el valor final sí sea un entero.
const valorRedondeado = computed(() => Math.round(valorMostrado.value))
const textoMostrado = computed(() =>
  props.formatear
    ? props.formatear(valorRedondeado.value)
    : String(valorRedondeado.value)
)

// Ease-out cúbico: arranca rápido y se suaviza al llegar al valor final.
function suavizar(t: number): number {
  return 1 - (1 - t) ** 3
}

let idFrame: number | null = null

function animar() {
  const inicio = performance.now()
  const hasta = props.valor

  function paso(ahora: number) {
    const progreso = Math.min((ahora - inicio) / props.duracionMs, 1)
    valorMostrado.value = hasta * suavizar(progreso)
    if (progreso < 1) {
      idFrame = requestAnimationFrame(paso)
    } else {
      valorMostrado.value = hasta
      idFrame = null
    }
  }
  idFrame = requestAnimationFrame(paso)
}

onMounted(animar)
onBeforeUnmount(() => {
  if (idFrame !== null) cancelAnimationFrame(idFrame)
})
</script>
