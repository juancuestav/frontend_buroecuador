<template>
  <div ref="contenedor">
    <div v-if="sinDatos" class="vacio-grafico">
      <q-icon name="bi-bar-chart" size="28px" class="q-mb-sm" />
      <div>Aún no hay solicitudes este mes.</div>
    </div>
    <VueApexCharts
      v-else-if="visible"
      :key="instanciaId"
      type="bar"
      height="260"
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
import { useGraficoVisible } from 'pages/revisionCreditos/view/composables/useGraficoVisible'
import { ResumenSolicitudes } from '../../domain/ResumenSolicitudes'

const props = defineProps<{ serie: ResumenSolicitudes['serie_mes'] }>()

const $q = useQuasar()
const contenedor = ref<HTMLElement | null>(null)
const { visible, instanciaId } = useGraficoVisible(contenedor)

const sinDatos = computed(() => props.serie.every((d) => d.ingresadas + d.aprobadas === 0))

const series = computed(() => [
  { name: 'Ingresadas', data: props.serie.map((d) => d.ingresadas) },
  { name: 'Aprobadas', data: props.serie.map((d) => d.aprobadas) },
])

const opciones = computed<ApexOptions>(() => {
  const oscuro = $q.dark.isActive
  return {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit', background: 'transparent' },
    theme: { mode: oscuro ? 'dark' : 'light' },
    colors: ['#1e88e5', '#43a047'],
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 4, borderRadiusApplication: 'end' } },
    dataLabels: { enabled: false },
    legend: { position: 'top', horizontalAlign: 'left' },
    grid: { borderColor: oscuro ? 'rgba(255,255,255,0.07)' : '#eceef4', strokeDashArray: 4 },
    xaxis: {
      categories: props.serie.map((d) => d.fecha),
      labels: { formatter: (fecha: string) => (fecha ? String(Number(fecha.slice(8))) : ''), rotate: 0 },
      axisTicks: { show: false },
    },
    yaxis: { labels: { formatter: (v: number) => String(Math.round(v)) }, forceNiceScale: true, min: 0 },
    tooltip: { x: { formatter: (_: number, o: any) => props.serie[o.dataPointIndex]?.fecha.split('-').reverse().join('/') ?? '' } },
  }
})
</script>

<style scoped>
.vacio-grafico {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8a8ca5;
  font-size: 0.85rem;
}
</style>
