// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesPermisoNuevo } from './../../../application/ComportamientoModalesPermisoNuevo'
import { AsignarPermisosIndividualController } from '../infraestructure/AsignarPermisosIndividualController'
import { PermisosUsuarioController } from '../infraestructure/PermisosUsuarioController'
import { Permiso } from 'pages/sistema/permisos/domain/Permiso'
import { UsuarioController } from 'pages/usuarios/infraestructure/UsuarioController'
import { configuracionColumnasPermisos } from 'pages/sistema/permisos/domain/configuracionColumnasPermisos'
import { useFiltrosGenerales } from 'shared/filtrosGenerales'
import { PermisoController } from 'pages/sistema/permisos/infrestructure/PermisoController'

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())

    /*************
     * Variables
     *************/
    const Router = useRouter()

    const roles = ref()
    const permisos = ref()
    const empleado = ref()

    const controller = new PermisoController()
    const asignarPermisoController = new AsignarPermisosIndividualController()
    const essentialLoading = new StatusEssentialLoading()
    const permisosSinAsignar: Ref<Permiso[]> = ref([])
    const permisosAsignados: Ref<Permiso[]> = ref([])
    const refPermisosSinAsignar = ref()
    const refPermisosAsignados = ref()
    const modales = new ComportamientoModalesPermisoNuevo()

    /*********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      Permiso,
      new PermisosUsuarioController()
    )
    const {
      entidad: permiso,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        // empleados: new EmpleadoController(),
        usuarios: {
          controller: new UsuarioController(),
          params: { campos: 'id,name,apellidos,identificacion', estado: 1 },
        },
      })
    })
    // empleados.value = listadosAuxiliares.empleados

    /*************
     * Funciones
     *************/
    const { usuarios, filtrarUsuarios } =
      useFiltrosGenerales(listadosAuxiliares)

    async function obtenerPermisoRol(id_rol: number) {
      listar({ id_rol: id_rol, tipo: 'ASIGNADOS', tipo_filtro: 'POR ROL' })
      const { result } = await controller.listar({
        id_rol: id_rol,
        tipo: 'NO ASIGNADOS',
        tipo_filtro: 'POR ROL',
      })
      permisosSinAsignar.value = result
    }

    function botonAsignarPermisos() {
      refPermisosSinAsignar.value.seleccionar()
      refPermisosSinAsignar.value.clearSelection()
    }

    function botonEliminarPermisos() {
      refPermisosAsignados.value.seleccionar()
      refPermisosAsignados.value.clearSelection()
    }

    function asignarPermiso(permisos: any) {
      const permisosIds = permisos.map((permiso: Permiso) => permiso.id)
      asignarPermisoController.guardar({
        empleado_id: empleado.value,
        permisos: permisosIds,
        tipo_sincronizacion: 'ASIGNAR',
      })
      filtrarRolesEmpleados()
    }

    function eliminarPermiso(permisos: any) {
      const permisosIds = permisos.map((permiso: Permiso) => permiso.id)
      asignarPermisoController.guardar({
        empleado_id: empleado.value,
        permisos: permisosIds,
        tipo_sincronizacion: 'ELIMINAR',
      })
      filtrarRolesEmpleados()
    }

    function crear_permiso() {
      modales.abrirModalEntidad('PermisoNuevoPage')
    }

    const crearRol = () => {
      Router.replace('/roles')
    }

    async function filtrarRolesEmpleados() {
      essentialLoading.activar()
      const { result } = await new UsuarioController().consultar(empleado.value)
      roles.value = result.roles
      permisos.value = [...result.permisos]

      //Buscar los permisos no asignados a un empleado
      const { response } = await new PermisosUsuarioController().listar({
        empleado_id: empleado.value,
        tipo: 'NO ASIGNADOS',
      })

      permisosSinAsignar.value = response.data.results
      listado.value = [...response.data.permisos_usuario]
      essentialLoading.desactivar()
    }

    return {
      fecha: ref(),
      mixin,
      permiso,
      modales,
      configuracionColumnasPermisos,
      empleado,
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
      permisos,
      usuarios,
      permisosAsignados,
      refPermisosSinAsignar,
      refPermisosAsignados,
      filtrarUsuarios,
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
      filtrarRolesEmpleados,
    }
  },
})
