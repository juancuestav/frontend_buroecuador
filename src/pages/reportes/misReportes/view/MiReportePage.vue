<template>
  <component
    :is="verMiReporte ? MiReporte : ReportePDF"
    :consultar-reporte="true"
  ></component>
</template>

<script lang="ts" setup>
// Dependencias
import { useReporteStore } from 'stores/reporte'
import { computed } from 'vue'

// Componentes
import ReportePDF from '../../shared/view/ReportePDF.vue'
import MiReporte from './MiReporte.vue'

const store = useReporteStore()
store.resetReporte()
const verMiReporte = computed(() => store.verMiReporte)
</script>
