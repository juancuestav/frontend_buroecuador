// Dependencias
import { configuracionColumnasCategoria } from '../domain/configuracionColumnasCategorias'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { TipoIdentificacionController } from 'pages/sistema/tiposIdentificaciones/infraestructure/TipoIdentificacionController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolController } from 'pages/sistema/roles_old/infraestructure/RolController'
import { CategoriaController } from '../infraestructure/CategoriaController'
import { Categoria } from '../domain/Categoria'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Categoria,
      new CategoriaController()
    )

    const {
      entidad: categoria,
      disabled,
      listadosAuxiliares,
      accion,
    } = mixin.useReferencias()

    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    // Reglas de validacion
    const reglas = {
      nombre: { required },
      orden: { required },
    }

    const v$ = useVuelidate(reglas, categoria)
    setValidador(v$.value)

    cargarVista(async () => {
      await obtenerListados({
        tiposIdentificaciones: new TipoIdentificacionController(),
        roles: new RolController(),
      })
    })

    return {
      mixin,
      categoria,
      accion,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasCategoria,
      listadosAuxiliares,
      isPwd: ref(true),
    }
  },
})
