// Dependencias
import { defineComponent, ref } from 'vue'
import { required } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolController } from 'pages/sistema/roles/infraestructure/RolController'
import { Permiso } from '../../domain/Permiso'
import { PermisoController } from '../../infrestructure/PermisoController'

export default defineComponent({
  components: { TabLayout, ButtonSubmits },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const notificaciones = useNotificaciones()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Permiso, new PermisoController())
    const {
      entidad: permiso,
      disabled,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados } = mixin.useComportamiento()

    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' },
        },
      })
      roles.value = listadosAuxiliares.roles
    })

    /*************
     * Variables
     *************/
    const { notificarError } = useNotificaciones()
    const roles = ref([])

    /*************
     * Validaciones
     **************/
    const reglas = {
      name: { required },
      roles: { required },
    }
    const v$ = useVuelidate(reglas, permiso)

    /*************
     * Funciones
     *************/
    async function crear() {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.crear_permiso)
        await axios
          .post(ruta, permiso)
          .then(function (response: any) {
            notificaciones.notificarCorrecto(response.data.mensaje)
            emit('cerrar-modal', false)
          })
          .catch((error) => {
            notificarError(error)
          })
      }
    }

    return {
      mixin,
      isPwdCurent: ref(true),
      isPwd: ref(true),
      isPwdConfirmation: ref(true),
      permiso,
      disabled,
      v$,
      roles,
      listadosAuxiliares,
      crear,
      filtrarRol(val, update) {
        if (val === '') {
          update(() => {
            roles.value = listadosAuxiliares.roles
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          roles.value = listadosAuxiliares.roles.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
    }
  },
})
