<template>
  <!-- Resultado del cálculo del monto máximo (valor presente de una anualidad),
       con el mismo callout que el resultado de la revisión: verde si el monto
       cabe, rojo si supera la capacidad de pago, gris sin monto -->
  <div class="callout row items-start no-wrap" :class="`callout--${tono.clase}`">
    <q-icon :name="tono.icono" size="20px" class="callout__icono" />
    <div class="col">
      <div class="text-subtitle1 text-bold">Análisis</div>
      <div class="callout__texto">
        Con una <b>capacidad de pago de {{ moneda(capacidad) }} mensuales</b>, una
        <b>tasa del {{ porcentaje(tasaAnual) }} anual</b> y un <b>plazo de {{ textoPlazo }}</b>,
        el monto máximo aproximado a financiar es: <b>{{ moneda(montoSugerido) }}</b>.
      </div>
      <div v-if="montoSolicitado && cuota !== null" class="callout__texto">
        El monto solicitado de <b>{{ moneda(montoSolicitado) }}</b> genera una cuota de
        <b>{{ moneda(cuota) }}</b>, que
        {{ excede ? 'supera' : 'está dentro de' }} la capacidad de pago de {{ moneda(capacidad) }}.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatearMoneda } from 'pages/revisionCreditos/domain/formato'
import { cuotaPrestamo, valorPresente } from '../../domain/calculo'

const props = defineProps<{
  capacidad: number
  tasaAnual: number
  plazoMeses: number
  montoSolicitado?: number | null
}>()

const montoSugerido = computed(() => valorPresente(props.capacidad, props.tasaAnual, props.plazoMeses))
const cuota = computed(() =>
  props.montoSolicitado ? cuotaPrestamo(props.montoSolicitado, props.tasaAnual, props.plazoMeses) : null
)
const excede = computed(() => !!props.montoSolicitado && props.montoSolicitado > montoSugerido.value + 0.005)

const tono = computed(() => {
  if (!props.montoSolicitado) return { clase: 'neutro', icono: 'bi-info-circle-fill' }
  return excede.value
    ? { clase: 'error', icono: 'bi-x-circle-fill' }
    : { clase: 'exito', icono: 'bi-check-circle-fill' }
})

// 60 → "5 años (60 meses)"
const textoPlazo = computed(() => {
  const anios = props.plazoMeses / 12
  if (!Number.isInteger(anios)) return `${props.plazoMeses} meses`
  return `${anios} ${anios === 1 ? 'año' : 'años'} (${props.plazoMeses} meses)`
})

const porcentaje = (valor: number) =>
  `${new Intl.NumberFormat('es-EC', { maximumFractionDigits: 3 }).format(valor)}%`
const moneda = (valor: number | null | undefined) =>
  formatearMoneda(valor === null || valor === undefined ? null : Math.round(valor * 100) / 100)
</script>

<style scoped lang="scss">
// Mismo callout que ResultadoValidacion (Revisión de créditos)
.callout {
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid;

  &__icono {
    margin-top: 2px;
  }

  &__texto {
    font-size: 0.85rem;
    color: #455a64;
    margin-top: 2px;
  }

  $tonos: (
    exito: #2e7d32,
    error: #c62828,
    neutro: #546e7a,
  );

  @each $nombre, $color in $tonos {
    &--#{$nombre} {
      color: $color;
      background: rgba($color, 0.045);
      border-color: rgba($color, 0.22);
    }
  }
}

.body--dark .callout__texto {
  color: #b0bec5;
}
</style>
