// Dependencias
import { configuracionColumnasPermisos } from '../../../domain/configuracionColumnasPermisos'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesPermisoNuevo } from '../../../application/ComportamientoModalesPermisoNuevo'
import { AsignarPermisosController } from '../../../infrestructure/AsignarPermisosController'
import { PermisoController } from 'pages/sistema/permisos/infrestructure/PermisoController'
import { RolController } from 'pages/sistema/roles/infraestructure/RolController'
import { Permiso } from '../../../domain/Permiso'

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())

    /*********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Permiso, new PermisoController())
    const {
      entidad: permiso,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' },
        },
      })
    })

    /*************
     * Variables
     *************/
    const Router = useRouter()
    const rol = ref()
    const roles = ref([])

    const controller = new PermisoController()
    const asignarPermisoController = new AsignarPermisosController()
    const permisosSinAsignar: Ref<Permiso[]> = ref([])
    const refPermisosSinAsignar = ref()
    const refPermisosAsignados = ref()
    const modales = new ComportamientoModalesPermisoNuevo()

    roles.value = listadosAuxiliares.roles

    /*************
     * Funciones
     *************/
    async function obtenerPermisoRol(val) {
      if (val) {
        listar({ rol_id: val, tipo: 'ASIGNADOS', tipo_filtro: 'POR ROL' })
        permisosSinAsignar.value = (
          await controller.listar({ rol_id: val, tipo: 'NO ASIGNADOS', tipo_filtro: 'POR ROL' })
        ).result
      }
    }

    async function botonAsignarPermisos() {
      await refPermisosSinAsignar.value.seleccionar()
      await refPermisosSinAsignar.value.clearSelection()
    }

    async function botonEliminarPermisos() {
      await refPermisosAsignados.value.seleccionar()
      await refPermisosAsignados.value.clearSelection()
    }

    async function asignarPermiso(permisos: any) {
      const permisosName = permisos.map((permiso: Permiso) => permiso.id)
      await asignarPermisoController.guardar({
        id_rol: rol.value,
        permisos: permisosName,
        tipo_sincronizacion: 'ASIGNAR',
      })
      await obtenerPermisoRol(rol.value)
    }

    function eliminarPermiso(permisos: any) {
      const permisosName = permisos.map((permiso: Permiso) => permiso.id)
      asignarPermisoController.guardar({
        id_rol: rol.value,
        permisos: permisosName,
        tipo_sincronizacion: 'ELIMINAR',
      })
      obtenerPermisoRol(rol.value)
    }

    function crear_permiso() {
      modales.abrirModalEntidad('PermisoNuevoPage')
    }

    const crearRol = () => {
      Router.replace('/roles')
    }

    return {
      mixin,
      permiso,
      modales,
      configuracionColumnasPermisos,
      rol,
      listado,
      permisosSinAsignar,
      crearRol,
      crear_permiso,
      obtenerPermisoRol,
      asignarPermiso,
      eliminarPermiso,
      botonAsignarPermisos,
      botonEliminarPermisos,
      listadosAuxiliares,
      roles,
      refPermisosSinAsignar,
      refPermisosAsignados,
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
