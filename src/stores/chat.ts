import { Notificacion } from 'pages/notificaciones/domain/Notificacion'
import { Chat } from 'components/chat/domain/Chat'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  // State
  const mostrar = ref(false)
  const notificacion = ref()
  const chat = ref(new Chat())

  // Actions
  function mostrarChat() {
    mostrar.value = true
  }

  function ocultarChat() {
    mostrar.value = false
  }

  function resetChat() {
    chat.value = new Chat()
  }

  function setChat(valor: Chat) {
    chat.value = valor
  }

  function setNotificacion(valor: Notificacion) {
    notificacion.value = valor
  }

  return {
    // State
    mostrar,
    notificacion,
    chat,
    // Actions
    mostrarChat,
    ocultarChat,
    resetChat,
    setChat,
    setNotificacion,
  }
})
