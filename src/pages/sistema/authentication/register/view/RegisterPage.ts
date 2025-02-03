// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
import { gestionarNotificacionError } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import loginJson from 'src/assets/lottie/login_work.json' // trabajos ecuador
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
import { UsuarioController } from 'pages/usuarios/infraestructure/UsuarioController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ProvinciaController } from 'shared/ubicacion/provincia/infraestructure/ProvinciaController'
import { TipoIdentificacionController } from 'pages/sistema/tiposIdentificaciones/infraestructure/TipoIdentificacionController'
import { useFiltrosGenerales } from 'shared/filtrosGenerales'
import { CantonController } from 'shared/ubicacion/canton/infraestructure/CantonController'
import { tiposClientes } from 'config/utils'

export default defineComponent({
  components: {
    LottiePlayer: Vue3Lottie,
  },
  setup() {
    /*********
     * Stores
     *********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(Usuario, new UsuarioController())
    const { obtenerListados, cargarVista } = mixin.useComportamiento()
    const { listadosAuxiliares } = mixin.useReferencias()

    cargarVista(async () => {
      await obtenerListados({
        tiposIdentificaciones: new TipoIdentificacionController(),
        provincias: new ProvinciaController(),
      })
    })

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
      // direccion: { required },
      celular: { required },
      email: { required, email },
      identificacion: { required },
      tipo_identificacion: { required },
      password: { required },
      password_confirmation: { required },
      tipo_cliente: { required },
    }

    const v$ = useVuelidate(reglas, usuario)

    /*************
     * Funciones
     *************/
    const { provincias, filtrarProvincias, cantones, filtrarCantones } =
      useFiltrosGenerales(listadosAuxiliares)

    const obtenerCantones = (idProvincia: number) => {
      cargarVista(async () => {
        await obtenerListados({
          cantones: {
            controller: new CantonController(),
            params: { provincia: idProvincia },
          },
        })
      })
    }

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
      provincias,
      filtrarProvincias,
      cantones,
      filtrarCantones,
      obtenerCantones,
      listadosAuxiliares,
      tiposClientes,
    }
  },
})
