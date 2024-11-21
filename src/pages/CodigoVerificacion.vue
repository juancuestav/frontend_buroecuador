<template>
  <q-page padding>
    <div class="column text-center">
      <div class="text-h3 q-mb-xl" style="opacity: 0.6">
        Código de verificación
      </div>

      <p class="full-width justify-center block q-md-lg">
        Se ha enviado el código de verificación a tu correo <b>{{ correo }}</b>
      </p>

      <div class="row q-mb-md">
        <q-input
          v-model="codigo1"
          class="text-h3 col-12"
          type="number"
          outlined
          label="Ingrese el código de verificación"
        ></q-input>

        <!--<q-input
        v-model="codigo2"
        class="text-h3 col-3"
        type="number"
        outlined
      ></q-input>

      <q-input
        v-model="codigo3"
        class="text-h3 col-3"
        type="number"
        outlined
      ></q-input>

      <q-input
        v-model="codigo4"
        class="text-h3 col-3"
        type="number"
        outlined
      ></q-input> -->
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-btn
            color="primary"
            class="full-width"
            no-caps
            @click="verificar()"
          >
            <q-icon
              name="bi-check-circle-fill"
              size="xs"
              class="q-mr-xs"
            ></q-icon
            >Verificar
          </q-btn>
        </div>

        <div class="col-12 col-md-6">
          <q-btn
            color="grey-3"
            class="full-width"
            no-caps
            @click="abrirWhatsapp()"
          >
            <q-icon
              name="bi-whatsapp"
              size="xs"
              class="q-mr-xs"
              color="positive"
            ></q-icon
            ><span class="text-positive"
              >¿Necesitas ayuda con el código de verificación?</span
            >
          </q-btn>
        </div>

        <div class="col-12">
          <q-btn
            color="secondary"
            class="full-width"
            no-caps
            @click="reenviar()"
          >
            <q-icon name="bi-envelope" size="xs" class="q-mr-xs"></q-icon
            >Reenviar el código a mi correo
          </q-btn>
        </div>

        <q-btn
          color="dark"
          class="full-width q-mb-md boton-abajo"
          flat
          no-caps
          @click="logout()"
        >
          <q-icon name="bi-box-arrow-left" class="q-mr-sm"></q-icon>Cerrar
          sesión
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ErrorNotFound',
  setup() {
    const codigo1 = ref()
    /* const codigo2 = ref()
    const codigo3 = ref()
    const codigo4 = ref() */

    /* const codigo = computed(
      () => `${codigo1.value}${codigo2.value}${codigo3.value}${codigo4.value}`
    ) */
    const store = useAuthenticationStore()

    const correo = computed(() => store.user?.email)

    const axios = AxiosHttpRepository.getInstance()
    const router = useRouter()
    const { notificarAdvertencia, notificarCorrecto, notificarError } =
      useNotificaciones()

    /*const authentication = useAuthenticationStore()
      function iniciarSesion() {
        const sessionIniciada = await authentication.isUserLoggedIn()
        if (!sessionIniciada) authentication.login()
      }*/

    async function verificar() {
      const response: any = await axios.post(
        axios.getEndpoint(endpoints.verificar_codigo, { codigo: codigo1.value })
      )

      if (response.data) {
        await store.getUser()
        if (store.hasRole('CLIENTE')) {
          router.replace('/activar-app')
        } else {
          router.replace('/')
        }
      } else {
        notificarAdvertencia('El código ingresado no es correcto!')
      }
    }

    async function reenviar() {
      try {
        const response: any = await axios.get(
          axios.getEndpoint(endpoints.reenviar_codigo)
        )
        notificarCorrecto(response.data.mensaje)
      } catch (e: any) {
        notificarError(e)
      }
    }

    async function logout() {
      await store.logout()
      router.replace({ name: 'Login' })
    }

    function abrirWhatsapp() {
      const celular = store.configuracion.whatsapp

      const phone = '593' + celular.substring(1, celular.length)
      let url: string

      if (window.innerWidth < 768) {
        url = `https://api.whatsapp.com/send?phone=${phone}`
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}`
      }

      window.open(url, '_blank')
    }

    return {
      correo,
      codigo1,
      /* codigo2,
      codigo3,
      codigo4, */
      verificar,
      reenviar,
      logout,
      abrirWhatsapp,
    }
  },
})
</script>
