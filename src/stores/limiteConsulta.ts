import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthenticationStore } from './authentication'

export const useLimiteConsultaStore = defineStore('limiteConsulta', () => {
  // Store
  const authenticationStore = useAuthenticationStore()

  // State
  const consultasRealizadas = ref(0)
  const consultasPermitidas = ref(0)

  async function consultarCantidadesRealizadasPermitidas() {
    await authenticationStore.getUser()
    consultasRealizadas.value = authenticationStore.user.consultas_realizadas
    consultasPermitidas.value = authenticationStore.user.limite_consultas
  }

  function incrementarConsultasRealizadas() {
    consultasRealizadas.value++
  }

  return {
    // State
    consultasRealizadas,
    consultasPermitidas,
    // Actions
    consultarCantidadesRealizadasPermitidas,
    incrementarConsultasRealizadas,
  }
})
