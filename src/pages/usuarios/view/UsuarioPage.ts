// Dependencias
import { configuracionColumnasUsuarios } from '../domain/configuracionColumnasUsuarios'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { UsuarioController } from '../infraestructure/UsuarioController'
import { Usuario } from '../domain/Usuario'
import { TipoIdentificacionController } from 'pages/sistema/tiposIdentificaciones/infraestructure/TipoIdentificacionController'
import { RolController } from 'pages/sistema/roles_old/infraestructure/RolController'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Usuario, new UsuarioController())

    const {
      entidad: usuario,
      disabled,
      listadosAuxiliares,
      accion,
    } = mixin.useReferencias()

    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    // Reglas de validacion
    const reglas = {
      name: { required },
      apellidos: { required },
      edad: { required },
      direccion: { required },
      celular: { required },
      email: { required },
      identificacion: { required },
      tipo_identificacion: { required },
      rol: { required },
    }

    const v$ = useVuelidate(reglas, usuario)
    setValidador(v$.value)

    cargarVista(async () => {
      await obtenerListados({
        tiposIdentificaciones: new TipoIdentificacionController(),
        roles: new RolController(),
      })
    })

    return {
      mixin,
      usuario,
      accion,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasUsuarios,
      listadosAuxiliares,
      isPwd: ref(true),
    }
  },
})
