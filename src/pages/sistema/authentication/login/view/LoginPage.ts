// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
// import loginJson from 'src/assets/lottie/login.json'
import loginJson from 'src/assets/lottie/login_work.json' //Ofertas empleos

// Componentes
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { useRouter } from 'vue-router'
import { loginRedirect } from 'shared/authentication/shared/utils'

export default defineComponent({
  name: 'LoginPage',
  components: {
    LottiePlayer: Vue3Lottie,
  },
  setup() {
    /*********
     * Stores
     *********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    const store = useAuthenticationStore()

    /*************
     * Variables
     *************/
    const appName = ref()
    const loginUser = reactive(new UserLogin())
    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    const dirigirLoginBuroCreditoEcuador = process.env.APP_ID === '1'
    const dirigirLoginTrabajosEcuador = process.env.APP_ID === '2'

    const Router = useRouter()

    const login = async () => {
      try {
        cargando.activar()

        const usuario: any = await store.login(loginUser)

        const roles = [usuario.rol]

        if (dirigirLoginBuroCreditoEcuador) return loginBuroCredito(roles)
        if (dirigirLoginTrabajosEcuador) return loginTrabajosEcuador()
      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
      }
    }

    const enableLoginButton = computed(
      () => loginUser.email !== '' && loginUser.password !== ''
    )

    const loginBuroCredito = (roles) => {
      /****************************
       * Seccion Buro (si funciona)
       ****************************/
      /* if (store.extraerRol(roles, 'CLIENTE')) {
        if (!store.planPagado) {
          Router.replace('/activar-app')
        } else {
          Router.replace('/archivos-reportes')
        }
      } else {
        Router.replace('/')
      } */
      loginRedirect(roles, Router)
      notificaciones.notificarCorrecto('Bienvenido a Buró de Crédito Ecuador!')
    }

    const loginTrabajosEcuador = () => {
      Router.replace('/verificar-cuenta')
      notificaciones.notificarCorrecto('Bienvenido a Trabajos Ecuador!')
    }

    /*******
     * Init
     *******/
    const cargarConfiguracion = async () => {
      await configuracionGeneralStore.consultarConfiguracion()
      configuracionGeneralStore.cambiarFavicon()
      appName.value = configuracionGeneralStore.configuracion?.nombre_empresa
    }

    cargarConfiguracion()

    return {
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
      appName,
      store,
      isPwd: ref(true),
      loginUser,
      loginJson,
      // computed
      enableLoginButton,
      // functions
      login,
    }
  },
})
