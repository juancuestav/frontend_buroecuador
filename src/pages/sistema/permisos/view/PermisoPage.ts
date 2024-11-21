// Dependencias
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasPermisos } from '../domain/configuracionColumnasPermisos'
import { PermisoController } from '../infrestructure/PermisoController'
import { Permiso } from '../domain/Permiso'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Permiso, new PermisoController())
    const { entidad: permiso, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    //Reglas de validacion
    const reglas = {
      name: { required },
    }

    const v$ = useVuelidate(reglas, permiso)
    setValidador(v$.value)

    return {
      mixin,
      permiso,
      v$,
      disabled,
      configuracionColumnasPermisos,
    }
  },
})
