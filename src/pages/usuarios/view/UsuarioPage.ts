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
import { ProvinciaController } from 'shared/ubicacion/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'shared/ubicacion/canton/infraestructure/CantonController'
import { useFiltrosGenerales } from 'shared/filtrosGenerales'
import { tiposClientes } from 'config/utils'

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
    const { onConsultado } = mixin.useHooks()

    // Reglas de validacion
    const reglas = {
      name: { required },
      apellidos: { required },
      edad: { required },
      // direccion: { required },
      celular: { required },
      email: { required },
      identificacion: { required },
      tipo_identificacion: { required },
      rol: { required },
      tipo_cliente: { required },
    }

    const v$ = useVuelidate(reglas, usuario)
    setValidador(v$.value)

    cargarVista(async () => {
      await obtenerListados({
        tiposIdentificaciones: new TipoIdentificacionController(),
        roles: new RolController(),
        provincias: new ProvinciaController(),
        // cantones: new CantonController(),
      })
    })

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
        cantones.value = listadosAuxiliares.cantones
      })
    }

    /********
     * Hooks
     ********/
    onConsultado(() => {
      if (usuario.provincia) obtenerCantones(usuario.provincia)
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
      provincias,
      filtrarProvincias,
      cantones,
      filtrarCantones,
      obtenerCantones,
      tiposClientes,
    }
  },
})
