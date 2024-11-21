<template>
  <component :is="verFormulario ? FormularioReporte : ReportePDF"></component>
</template>

<script lang="ts" setup>
// Dependencias
import { useReporteStore } from 'stores/reporte'
import { computed } from 'vue'

// Componentes
import FormularioReporte from '../../shared/view/FormularioReporte.vue'
import ReportePDF from '../../shared/view/ReportePDF.vue'

const store = useReporteStore()
store.resetReporte()
const verFormulario = computed(() => store.verFormulario)
</script>
