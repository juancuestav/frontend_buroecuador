// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { computed, defineComponent, reactive, ref } from 'vue'
import { gestionarNotificacionError } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import loginJson from 'src/assets/lottie/login_work.json' // trabajos ecuador
// import loginJson from 'src/assets/lottie/login.json'
import { endpoints } from 'config/api'
import { useRouter } from 'vue-router'
import { required, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

// Componentes
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

// Logica y controladores
import { RegisterController } from '../infraestructure/RegisterController'
import { Usuario } from 'pages/usuarios/domain/Usuario'
import { loginRedirect } from 'shared/authentication/shared/utils'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'

export default defineComponent({
  components: {
    LottiePlayer: Vue3Lottie,
  },
  setup() {
    /*********
     * Stores
     *********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()

    /************
     * Variables
     ************/
    const appName = ref()
    const usuario = reactive(new Usuario())

    const registerController = new RegisterController()
    const notificaciones = useNotificaciones()

    const tiposIdentificaciones = ref([])

    const enviando = ref(false)
    const router = useRouter()

    const dirigirLoginBuroCreditoEcuador = process.env.APP_ID === '1'
    const dirigirLoginTrabajosEcuador = process.env.APP_ID === '2'

    // Reglas de validacion
    const reglas = {
      name: { required },
      apellidos: { required },
      edad: { required },
      direccion: { required },
      celular: { required },
      email: { required, email },
      identificacion: { required },
      tipo_identificacion: { required },
      password: { required },
      password_confirmation: { required },
    }

    const v$ = useVuelidate(reglas, usuario)

    const registrar = async () => {
      if (!(await v$.value.$validate())) {
        return notificaciones.notificarAdvertencia('Verifique el formulario')
      }
      registerController
        .registrarUsuario(usuario)
        .then((user: any) => {
          notificaciones.notificarCorrecto(
            'El usuario ha sido registrado con éxito!'
          )

          if (dirigirLoginBuroCreditoEcuador) loginRedirect([user.rol], router)
          if (dirigirLoginTrabajosEcuador)
            router.replace({ name: 'verifica_cuenta' })
        })
        .catch((error: any) => {
          // const mensajes: string[] = error.erroresValidacion
          gestionarNotificacionError(error, notificaciones)
        })
      // .finally(() => (enviando.value = false))
    }

    async function obtenerTiposIdentificaciones() {
      const axios = AxiosHttpRepository.getInstance()
      const response: any = await axios.get(
        axios.getEndpoint(endpoints.tipos_identificaciones)
      )
      tiposIdentificaciones.value = response.data.results
    }

    const enableLoginButton = computed(
      () =>
        usuario.name !== '' &&
        usuario.apellidos !== '' &&
        usuario.email !== '' &&
        usuario.password !== '' &&
        usuario.password === usuario.password_confirmation
    )

    /*******
     * Init
     *******/
    const cargarConfiguracion = async () => {
      await configuracionGeneralStore.consultarConfiguracion()
      configuracionGeneralStore.cambiarFavicon()
      appName.value = configuracionGeneralStore.configuracion?.nombre_empresa
    }

    cargarConfiguracion()
    obtenerTiposIdentificaciones()

    return {
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
      appName,
      v$,
      isPwd: ref(true),
      usuario,
      enviando,
      loginJson,
      tiposIdentificaciones,
      // computed
      enableLoginButton,
      // functions
      registrar,
    }
  },
})
