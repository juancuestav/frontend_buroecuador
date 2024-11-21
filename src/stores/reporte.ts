/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reporte } from 'pages/reportes/shared/domain/Reporte'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useReporteStore = defineStore('reporte', () => {
  // State
  const verFormulario = ref(true)
  const verMiReporte = ref(true)
  const verConsultarReporte = ref(true)
  const reporte = ref(new Reporte())
  const idReporteActual = ref()

  // Consultar reporte
  const reportesConsultados: Ref<any> = ref([])
  const cliente = ref()

  const formularioConsultarReporte = ref('ConsultarReporte')

  // Actions
  function mostrarFormulario() {
    verFormulario.value = true
  }

  function mostrarReportePDF() {
    verFormulario.value = false
  }

  function mostrarEditarReporteConsultar() {
    formularioConsultarReporte.value = 'FormularioReporte'
  }

  function mostrarConsultarReporte() {
    formularioConsultarReporte.value = 'ConsultarReporte'
  }

  function mostrarReportePDFConsultar() {
    formularioConsultarReporte.value = 'ReportePDF'
  }

  function setReporte(valor: any) {
    reporte.value = valor
  }

  function setReportesConsultados(listado: []) {
    reportesConsultados.value = listado
  }

  function resetReporte() {
    reporte.value = new Reporte()
  }

  // Mis reportes
  function mostrarFormularioMiReporte() {
    verMiReporte.value = true
  }

  function mostrarReportePDFMiReporte() {
    verMiReporte.value = false
  }

  return {
    // State
    idReporteActual,
    mostrarFormulario,
    verConsultarReporte,
    verMiReporte,
    formularioConsultarReporte,
    reporte,
    reportesConsultados,
    cliente,
    resetReporte,
    // Crear reporte
    verFormulario,
    mostrarReportePDF,
    mostrarReportePDFConsultar,
    // Consultar reporte
    mostrarConsultarReporte,
    mostrarEditarReporteConsultar,
    setReporte,
    setReportesConsultados,
    // sss
    mostrarFormularioMiReporte,
    mostrarReportePDFMiReporte,
  }
})
