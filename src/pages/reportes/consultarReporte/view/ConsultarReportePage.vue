<template>
  <component
    :is="verConsultarReporte"
    :permitir-editar="permitirEditar"
  ></component>
</template>

<script lang="ts" setup>
// Dependencias
import { useReporteStore } from 'stores/reporte'
import { computed } from 'vue'

// Componentes
import FormularioReporte from '../../shared/view/FormularioReporte.vue'
import ReportePDF from '../../shared/view/ReportePDF.vue'
import ConsultarReporte from './ConsultarReporte.vue'

const store = useReporteStore()
store.resetReporte()
const verConsultarReporte = computed(() => {
  switch (store.formularioConsultarReporte) {
    case 'FormularioReporte':
      return FormularioReporte
    case 'ConsultarReporte':
      return ConsultarReporte
    case 'ReportePDF':
      return ReportePDF
    default:
      return ConsultarReporte
  }
})

const permitirEditar = computed(() =>
  ['FormularioReporte', 'ReportePDF'].includes(store.formularioConsultarReporte)
)
</script>
