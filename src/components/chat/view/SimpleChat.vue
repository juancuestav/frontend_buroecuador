<template>
  <div v-if="mostrarChat" class="chat">
    <div class="header-chat">
      <span>{{
        `${notificacion.data.nombre} ${notificacion.data.apellidos}`
      }}</span>
      <q-icon
        @click="ocultarChat()"
        name="bi-x"
        size="sm"
        class="cursor-pointer"
      >
        <q-tooltip class="bg-dark" :disable="$q.platform.is.mobile">{{
          'Cerrar chat'
        }}</q-tooltip>
      </q-icon>
    </div>
    <div class="body-chat">
      <small class="block q-py-sm"
        >Responder mensaje al Whatsapp del contacto</small
      >

      <!-- Informacion de telefono destino -->
      <div class="q-mb-md">
        <label class="block q-mb-sm">
          <q-icon name="bi-whatsapp" class="q-mr-sm" color="grey-10"></q-icon
          >Whatsapp del contacto
        </label>
        <q-input
          class="q-pb-md"
          v-model="notificacion.data.celular"
          disable
          outlined
          dense
        />

        <label class="block q-mb-sm">
          <q-icon
            name="bi-envelope-open"
            class="q-mr-sm"
            color="grey-10"
          ></q-icon
          >Mensaje recibido
        </label>
      </div>

      <q-input
        class="text-start"
        type="textarea"
        autogrow
        outlined
        disable
        dense
        v-model="notificacion.data.mensaje"
      >
      </q-input>
    </div>

    <div class="input-chat">
      <textarea
        v-model="chat.mensaje"
        @keyup="gestionarLineas"
        class="input-message"
        placeholder="Responder..."
      ></textarea>
      <button class="boton-enviar" @click="enviarMensaje()">
        <i class="bi-send"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, computed } from 'vue'
import { useChatStore } from 'stores/chat'
import { Chat } from '../domain/Chat'

export default defineComponent({
  setup() {
    const store = useChatStore()

    const mostrarChat = computed(() => store.mostrar)
    const notificacion = computed(() => store.notificacion)

    const chat = computed({
      get: () => store.chat,
      set: (value: Chat) => store.setChat(value),
    })

    function gestionarLineas(e: any) {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.style.height = '40px'
        let scHeight = (e.target as any)?.scrollHeight
        textarea.style.height = `${scHeight}px`
      }
    }

    function ocultarChat() {
      store.ocultarChat()
      store.resetChat()
    }

    function enviarMensaje() {
      const { notificarAdvertencia } = useNotificaciones()

      // Mensaje vacio
      if (!chat.value.mensaje) {
        return notificarAdvertencia('No puede enviar un mensaje vacio.')
      }

      const celular = notificacion.value.data.celular

      const phone = '593' + celular.substring(1, celular.length)
      let url: string

      if (window.innerWidth < 768) {
        url = `https://api.whatsapp.com/send?phone=${phone}`
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}`
      }

      window.open(url, '_blank')

      ocultarChat()
    }

    return {
      chat,
      mostrarChat,
      ocultarChat,
      gestionarLineas,
      notificacion,
      enviarMensaje,
    }
  },
})
</script>

<style lang="scss" scoped>
.chat {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 24px;
  border: none;
  border-radius: 4px;
  width: 350px;
  overflow: hidden;
  background-color: #fff;
  z-index: 50;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;

  .header-chat {
    background-color: $light-green-8;
    padding: 12px 16px;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 1px, rgba(0, 0, 0, 0.02) 0px 2px 2px,
      rgba(0, 0, 0, 0.02) 0px 4px 4px, rgba(0, 0, 0, 0.02) 0px 8px 8px,
      rgba(0, 0, 0, 0.02) 0px 16px 16px;
    color: #fff;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }

  .body-chat {
    height: 300px;
    padding: 8px;
    overflow: auto;
  }

  .input-chat {
    padding: 8px;
    display: flex;
    align-items: flex-end;
    gap: 4px;

    .input-message {
      padding: 8px 16px;
      background-color: #f7f7f7;
      border-radius: 16px;
      display: block;
      border: none;
      width: 100%;
      outline: none;
      resize: none;
      max-height: 140px;
      height: 40px;

      &::-webkit-scrollbar {
        width: 0;
      }
    }

    .boton-enviar {
      background-color: $light-green-8;
      color: #fff;
      border-radius: 50%;
      border: none;
      outline: none;
      padding: 8px 12px;
      cursor: pointer;
    }
  }
}
</style>
