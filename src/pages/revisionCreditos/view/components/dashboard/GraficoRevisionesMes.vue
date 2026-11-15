<template>
  <div ref="contenedor" class="grafico-mes">
    <div v-if="sinDatos" class="vacio-dash">
      <q-icon name="bi-bar-chart" size="28px" class="q-mb-sm" />
      <div>Aún no hay revisiones este mes.</div>
    </div>
    <VueApexCharts
      v-else-if="visible"
      :key="instanciaId"
      type="line"
      height="300"
      :options="opciones"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
// Se carga de forma diferida (defineAsyncComponent): ApexCharts pesa.
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import VueApexCharts from 'vue3-apexcharts'
import { ApexOptions } from 'apexcharts'
import {
  COLORES_RESULTADO,
  DiaSerie,
  ESTADOS_RESULTADO,
  ORDEN_APILADO,
} from '../../../domain/ResumenRevisiones'
import { useGraficoVisible } from '../../composables/useGraficoVisible'
import { movimientoReducido } from './movimiento'

const props = defineProps<{ serie: DiaSerie[] }>()

const $q = useQuasar()
const contenedor = ref<HTMLElement | null>(null)
const { visible, instanciaId } = useGraficoVisible(contenedor)

const sinDatos = computed(() =>
  props.serie.every(
    (d) =>
      d.califica + d.no_califica + d.detenida + d.pendiente_equifax === 0 &&
      d.equifax === 0
  )
)

const etiqueta = (clave: string) =>
  ESTADOS_RESULTADO.find((e) => e.clave === clave)?.label ?? clave

// Un solo eje: revisiones y consultas a Equifax son conteos en la misma escala
const series = computed(() => [
  ...ORDEN_APILADO.map((clave) => ({
    name: etiqueta(clave),
    type: 'column',
    data: props.serie.map((d) => d[clave]),
  })),
  {
    name: 'Consultas reales a Equifax',
    type: 'line',
    data: props.serie.map((d) => d.equifax),
  },
])

const opciones = computed<ApexOptions>(() => {
  const oscuro = $q.dark.isActive
  const colores = COLORES_RESULTADO[oscuro ? 'oscuro' : 'claro']
  const texto = oscuro ? '#a9abbe' : '#6b6e8a'
  const superficie = oscuro ? '#1b1b2a' : '#ffffff'

  return {
    chart: {
      stacked: true,
      stackOnlyBar: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'inherit',
      foreColor: texto,
      background: 'transparent',
      animations: {
        enabled: !movimientoReducido(),
        speed: 700,
        animateGradually: { enabled: true, delay: 40 },
        dynamicAnimation: { enabled: true, speed: 450 },
      },
    },
    theme: { mode: oscuro ? 'dark' : 'light' },
    colors: [...ORDEN_APILADO.map((clave) => colores[clave]), colores.equifax],
    plotOptions: {
      bar: {
        columnWidth: '58%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    // Separación de 2 px entre segmentos apilados; línea de 2 px
    stroke: {
      width: [2, 2, 2, 2, 2.5],
      colors: [superficie, superficie, superficie, superficie, colores.equifax],
      curve: 'monotoneCubic',
    },
    markers: {
      size: [0, 0, 0, 0, 4],
      strokeWidth: 2,
      strokeColors: superficie,
      hover: { sizeOffset: 2 },
    },
    states: {
      hover: { filter: { type: 'darken' } },
    },
    dataLabels: { enabled: false },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      fontWeight: 500,
      itemMargin: { horizontal: 10, vertical: 4 },
      markers: { size: 6, offsetX: -3 },
    },
    grid: {
      borderColor: oscuro ? 'rgba(255,255,255,0.07)' : '#eceef4',
      strokeDashArray: 4,
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      categories: props.serie.map((d) => d.fecha),
      labels: {
        formatter: (fecha: string) =>
          fecha ? String(Number(fecha.slice(8))) : '',
        rotate: 0,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      crosshairs: {
        fill: { type: 'solid', color: oscuro ? '#ffffff10' : '#1a192e0d' },
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: { formatter: (v: number) => String(Math.round(v)) },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: oscuro ? 'dark' : 'light',
      x: {
        formatter: (_: number, { dataPointIndex }: any) => {
          const fecha = props.serie[dataPointIndex]?.fecha
          if (!fecha) return ''
          const [a, m, d] = fecha.split('-').map(Number)
          const texto = new Date(a, m - 1, d).toLocaleDateString('es-EC', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })
          return texto.charAt(0).toUpperCase() + texto.slice(1)
        },
      },
    },
  }
})
</script>

<style scoped>
.grafico-mes {
  min-height: 140px;
}
</style>
