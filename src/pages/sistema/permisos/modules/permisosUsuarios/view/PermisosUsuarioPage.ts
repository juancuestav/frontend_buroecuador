// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, Ref, ref } from 'vue'
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
import { useNotificaciones } from 'shared/notificaciones'
import { ApiError } from 'shared/error/domain/ApiError'

type TipoSincronizacion = 'ASIGNAR' | 'ELIMINAR'

interface UsuarioOpcion {
  id: number
  name: string | null
  apellidos: string | null
  identificacion: string | null
  rol: string | null
}

interface RespuestaPermisosUsuario {
  results: Permiso[]
  permisos_usuario: Permiso[]
  permisos: Permiso[]
  roles: string[]
}

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const { notificarCorrecto, notificarError } = useNotificaciones()

    /*************
     * Variables
     *************/
    const usuario = ref<number | null>(null)
    const roles: Ref<string[] | null> = ref(null)
    const permisos: Ref<Permiso[] | null> = ref(null)
    const permisosSinAsignar: Ref<Permiso[]> = ref([])
    const refPermisosSinAsignar = ref()
    const refPermisosAsignados = ref()

    const permisosUsuarioController = new PermisosUsuarioController()
    const asignarPermisoController = new AsignarPermisosIndividualController()
    const essentialLoading = new StatusEssentialLoading()
    const modales = new ComportamientoModalesPermisoNuevo()

    /*********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Permiso, permisosUsuarioController)
    const { listado } = mixin.useReferencias()

    /*************
     * Funciones
     *************/
    // Hay decenas de miles de usuarios (clientes): se buscan en el servidor
    // en lugar de cargarlos todos en el select.
    const usuarioController = new UsuarioController()
    const usuarios = ref<UsuarioOpcion[]>([])

    async function filtrarUsuarios(
      val: string,
      update: (fn: () => void) => void,
      abort: () => void
    ) {
      const termino = val.trim()
      if (termino.length < 3) return abort()
      try {
        const { result } = await usuarioController.listar<UsuarioOpcion>({
          search: termino,
          paginate: 1,
          campos: 'id,name,apellidos,identificacion,rol',
        })
        update(() => (usuarios.value = result))
      } catch (e) {
        notificarError('No se pudo buscar usuarios')
        abort()
      }
    }

    function limpiar() {
      roles.value = null
      permisos.value = null
      permisosSinAsignar.value = []
      listado.value = []
    }

    async function consultarPermisosUsuario() {
      if (!usuario.value) return limpiar()

      essentialLoading.activar()
      try {
        const { response } = await permisosUsuarioController.listar({
          usuario_id: usuario.value,
        })
        const data = response.data as unknown as RespuestaPermisosUsuario
        roles.value = data.roles
        permisos.value = data.permisos
        permisosSinAsignar.value = data.results
        listado.value = data.permisos_usuario
      } catch (e) {
        limpiar()
        notificarError(
          (e as ApiError).mensaje ??
            'No se pudieron obtener los permisos del usuario'
        )
      } finally {
        essentialLoading.desactivar()
      }
    }

    async function sincronizarPermisos(
      seleccionados: Permiso[],
      tipo: TipoSincronizacion
    ) {
      if (!usuario.value || !seleccionados?.length) return

      essentialLoading.activar()
      try {
        const { response } = await asignarPermisoController.guardar({
          usuario_id: usuario.value,
          permisos: seleccionados.map((permiso) => permiso.id),
          tipo_sincronizacion: tipo,
        })
        notificarCorrecto(response.data.mensaje)
      } catch (e) {
        const error = e as ApiError
        notificarError(
          error.erroresValidacion?.length
            ? error.erroresValidacion
            : error.mensaje ?? 'No se pudieron actualizar los permisos'
        )
      } finally {
        essentialLoading.desactivar()
      }
      await consultarPermisosUsuario()
    }

    const asignarPermiso = (seleccionados: Permiso[]) =>
      sincronizarPermisos(seleccionados, 'ASIGNAR')

    const eliminarPermiso = (seleccionados: Permiso[]) =>
      sincronizarPermisos(seleccionados, 'ELIMINAR')

    function botonAsignarPermisos() {
      refPermisosSinAsignar.value.seleccionar()
      refPermisosSinAsignar.value.clearSelection()
    }

    function botonEliminarPermisos() {
      refPermisosAsignados.value.seleccionar()
      refPermisosAsignados.value.clearSelection()
    }

    function crearPermiso() {
      modales.abrirModalEntidad('PermisoNuevoPage')
    }

    const nombreUsuario = (v: UsuarioOpcion) =>
      [v.name, v.apellidos].filter(Boolean).join(' ') +
      (v.identificacion ? ` - ${v.identificacion}` : '') +
      (v.rol ? ` (${v.rol})` : '')

    return {
      mixin,
      modales,
      configuracionColumnasPermisos,
      usuario,
      usuarios,
      roles,
      permisos,
      listado,
      permisosSinAsignar,
      refPermisosSinAsignar,
      refPermisosAsignados,
      filtrarUsuarios,
      nombreUsuario,
      consultarPermisosUsuario,
      asignarPermiso,
      eliminarPermiso,
      botonAsignarPermisos,
      botonEliminarPermisos,
      crearPermiso,
    }
  },
})
