import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { opcionesVerificarCuenta } from 'src/config/verificarCuenta/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'
import TabLayout from 'src/shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { AprobarVerificarCuentaController } from '../infraestructure/AprobarVerificarCuentaController'
import { AprobarVerificarCuenta } from '../domain/AprobarVerificarCuenta'
import { configuracionColumnasAprobarVerificarCuenta } from '../domain/configuracionColumnasAprobarVerificarCuenta'

export default defineComponent({
  name: 'verificar_cuenta',
  components: { TabLayout, SelectorImagen },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      AprobarVerificarCuenta,
      new AprobarVerificarCuentaController()
    )

    const { entidad: verificaCuenta } = mixin.useReferencias()

    const { setValidador } = mixin.useComportamiento()

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

    /*******
     * Init
     *******/
    verificaCuenta.user_id = authenticationStore.user.id

    return {
      v$,
      mixin,
      verificaCuenta,
      configuracionColumnasAprobarVerificarCuenta,
      opcionesVerificarCuenta,
    }
  },
})
