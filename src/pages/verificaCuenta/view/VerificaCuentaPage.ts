import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { computed, defineComponent, ref } from 'vue'
import { VerificaCuenta } from '../domain/VerificaCuenta'
import { VerificaCuentaController } from '../infraestructure/VerificaCuentaController'
import { required } from 'shared/i18n-validators'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EstadosComponent from 'components/tables/view/EstadosComponent.vue'

import useVuelidate from '@vuelidate/core'
import { useAuthenticationStore } from 'stores/authentication'
import { estadosVerificarCuenta } from 'config/verificarCuenta/utils'

export default defineComponent({
  name: 'verificar_cuenta',
  components: { SimpleLayout, SelectorImagen, EstadosComponent },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      VerificaCuenta,
      new VerificaCuentaController()
    )

    const { entidad: verificaCuenta } = mixin.useReferencias()

    const { setValidador } = mixin.useComportamiento()

    const { onGuardado } = mixin.useHooks()

    /*************
     * Variables
     *************/
    const estadoVerificacion = ref(authenticationStore.user.estado_verificacion)
    const permitirGuardar = computed(
      () =>
        estadoVerificacion.value ===
        estadosVerificarCuenta.SUBIDA_ARCHIVOS_PENDIENTE
    )

    /*************
     * Validaciones
     **************/
    const reglas = {
      documento_identidad_anverso: { required },
      documento_identidad_reverso: { required },
      documento_identidad_selfie: { required },
      user_id: { required },
    }

    const v$ = useVuelidate(reglas, verificaCuenta)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onGuardado(() => {
      estadoVerificacion.value = estadosVerificarCuenta.EN_ESPERA_VERIFICACION
      // listar({ user_id: authenticationStore.user.id })
    })

    // onListado(() => verificaCuenta.hydrate(listado.value[0]))

    /*******
     * Init
     *******/
    verificaCuenta.user_id = authenticationStore.user.id

    /*if (!permitirGuardar.value) {
      listar({ user_id: authenticationStore.user.id }).then((result) =>
        console.log(result)
      )
    }*/

    return {
      v$,
      mixin,
      verificaCuenta,
      estadoVerificacion,
      permitirGuardar,
    }
  },
})
