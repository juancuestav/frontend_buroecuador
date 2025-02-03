import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasArchivoReporte } from '../domain/configuracionColumnasArchivoReporte'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosGenerales } from 'shared/filtrosGenerales'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, ref } from 'vue'
import { accionesTabla } from 'config/utils'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EstadosComponent from 'components/tables/view/EstadosComponent.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import PdfViewer from 'src/components/pdfViewer/PdfViewer.vue'
import SelectorUsuario from 'components/inputs/selectorUsuario/view/SelectorUsuario.vue'
// import PdfViewer2 from 'components/pdfViewer/PdfViewer2.vue'

import { useAuthenticationStore } from 'stores/authentication'
import { ArchivoReporte } from '../domain/ArchivoReporte'
import { ArchivoReporteController } from '../infraestructure/ArchivoReporteController'
import { Usuario } from 'pages/usuarios/domain/Usuario'

export default defineComponent({
  name: 'archivo_reporte',
  components: {
    SimpleLayout,
    SelectorImagen,
    EstadosComponent,
    EssentialTable,
    GestorArchivos,
    PdfViewer,
    SelectorUsuario,
    // PdfViewer2,
  },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      ArchivoReporte,
      new ArchivoReporteController()
    )

    const {
      entidad: archivoReporte,
      listado,
      listadosAuxiliares,
    } = mixin.useReferencias()

    const { listar, editarParcial, eliminar, guardar } =
      mixin.useComportamiento()

    const { onGuardado, onReestablecer } = mixin.useHooks()

    /*************
     * Variables
     ************/
    const refPdfViewer = ref()
    const puedeSubirArchivos = computed(
      () =>
        authenticationStore.esAdministrador || authenticationStore.esEmpleado
    )

    const refArchivo = ref()
    const id = ref()
    const { prompt, confirmar, notificarInformacion } = useNotificaciones()
    const esCliente = authenticationStore.esCliente
    let idUsuario: number | null = null
    let usuariosSeleccionados: Usuario[] = []

    /************
     * Funciones
     ************/
    const { usuarios, filtrarUsuarios } =
      useFiltrosGenerales(listadosAuxiliares)

    const subirArchivos = async (id: number) =>
      await refArchivo.value.subir({ id })

    async function guardarArchivos() {
      archivoReporte.user = archivoReporte.user
      archivoReporte.reporte = 1
      guardar(archivoReporte)
    }

    const listarArchivos = async () => {
      await listar({
        user_id: archivoReporte.user,
      })

      if (listado.value.length === 0)
        notificarInformacion('Este usuario no tiene archivos subidos aún')
    }

    const listarMisArchivos = async () => {
      archivoReporte.user = authenticationStore.user.id
      await listar({
        user_id: archivoReporte.user,
      })

      if (listado.value.length === 0)
        notificarInformacion('Este usuario no tiene archivos subidos aún')
    }

    /*****************
     * Botones tabla
     *****************/
    const btnRenombrar: CustomActionTable<ArchivoReporte> = {
      titulo: 'Renombrar',
      icono: 'bi-cursor-text',
      color: 'primary',
      visible: () => puedeSubirArchivos.value,
      accion: async ({ entidad }) => {
        const data: CustomActionPrompt = {
          titulo: 'Renombrar',
          mensaje: 'Ingrese el nuevo nombre',
          accion: async (novedad) => {
            console.log(novedad)
            console.log(entidad.id)
            await editarParcial(entidad.id, {
              titulo: novedad,
            })
          },
        }

        prompt(data)
      },
    }

    const btnEliminar: CustomActionTable<ArchivoReporte> = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      visible: () => puedeSubirArchivos.value,
      accion: async ({ entidad }) => {
        confirmar(
          'Esta operación es irreversible. El archivo se eliminará de manera inmediata.',
          () => {
            idUsuario = archivoReporte.user
            usuariosSeleccionados = archivoReporte.usuarios
            eliminar(entidad)
          }
        )
      },
    }

    const btnVisualizar: CustomActionTable<ArchivoReporte> = {
      titulo: 'Visualizar',
      icono: 'bi-eye',
      color: 'primary',
      accion: ({ entidad }) => {
        refPdfViewer.value.abrir(
          entidad.archivos[0].ruta
          // 'https://www.uv.mx/pozarica/caa-conta/files/2016/02/REGULAR-AND-IRREGULAR-VERBS.pdf'
        )
      },
    }

    const btnActualizarListado: CustomActionTable<ArchivoReporte> = {
      titulo: 'Actualizar listado de archivos',
      icono: 'bi-arrow-clockwise',
      color: 'positive',
      visible: () => puedeSubirArchivos.value,
      accion: () => listarArchivos(),
    }

    const btnActualizarMisArchivos: CustomActionTable<ArchivoReporte> = {
      titulo: 'Actualizar mis archivos',
      icono: 'bi-arrow-clockwise',
      color: 'positive',
      visible: () => authenticationStore.esCliente,
      accion: () => listarMisArchivos(),
    }

    /********
     * Hooks
     ********/
    onGuardado((id, responseData) => {
      if (id) setTimeout(async () => await subirArchivos(id), 1)
      idUsuario = responseData.modelo.user
      usuariosSeleccionados = archivoReporte.usuarios
      listarArchivos()
    })

    onReestablecer(() => {
      archivoReporte.user = idUsuario
      archivoReporte.usuarios = usuariosSeleccionados
    })

    /*******
     * Init
     *******/
    if (!puedeSubirArchivos.value) {
      archivoReporte.user = authenticationStore.user.id
      listar({
        user_id: archivoReporte.user ?? '',
      })
    }

    return {
      id,
      archivoReporte,
      refPdfViewer,
      refArchivo,
      mixin,
      listado,
      guardarArchivos,
      configuracionColumnasArchivoReporte,
      listadosAuxiliares,
      subirArchivos,
      usuarios,
      filtrarUsuarios,
      listarArchivos,
      btnRenombrar,
      btnEliminar,
      btnActualizarListado,
      btnVisualizar,
      esCliente,
      columnas: [...configuracionColumnasArchivoReporte, accionesTabla],
      puedeSubirArchivos,
      listarMisArchivos,
      btnActualizarMisArchivos,
      titulo: authenticationStore.esCliente
        ? 'Mi buró'
        : 'Compartir archivos a clientes',
      puedeCrear: authenticationStore.can('crear.archivos_reportes'),
    }
  },
})
