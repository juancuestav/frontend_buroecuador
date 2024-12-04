import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasArchivoReporte } from '../domain/configuracionColumnasArchivoReporte'
import { computed, defineComponent, reactive, ref } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EstadosComponent from 'components/tables/view/EstadosComponent.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import PdfViewer from 'src/components/pdfViewer/PdfViewer.vue'
// import PdfViewer2 from 'components/pdfViewer/PdfViewer2.vue'

import { useAuthenticationStore } from 'stores/authentication'
import { ArchivoReporte } from '../domain/ArchivoReporte'
import { ArchivoReporteController } from '../infraestructure/ArchivoReporteController'
import { UsuarioController } from 'pages/usuarios/infraestructure/UsuarioController'
import { useFiltrosGenerales } from 'shared/filtrosGenerales'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { accionesTabla } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
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
      entidad: verificaCuenta,
      listado,
      listadosAuxiliares,
    } = mixin.useReferencias()

    const { listar, cargarVista, obtenerListados, editarParcial, eliminar } =
      mixin.useComportamiento()

    /*************
     * Variables
     ************/
    const refPdfViewer = ref()
    const puedeSubirArchivos = computed(
      () =>
        authenticationStore.esAdministrador || authenticationStore.esEmpleado
    )

    const tipoSeleccionUsuario = {
      POR_IDENTIFICATION: 'Buscar usuario por su identificación',
      POR_NOMBRES: 'Buscar usuario por sus nombres o apellidos',
    }
    const filtroUsuario = reactive<any>({
      user_id: null,
      identificacion: null,
      tipo_seleccion: tipoSeleccionUsuario.POR_IDENTIFICATION,
    })

    const refArchivo = ref()
    const id = ref()
    const { prompt, confirmar, notificarInformacion } = useNotificaciones()
    const esCliente = authenticationStore.esCliente

    /************
     * Funciones
     ************/
    const { usuarios, filtrarUsuarios } =
      useFiltrosGenerales(listadosAuxiliares)

    async function subirArchivos() {
      await refArchivo.value.subir({
        titulo: 'Titulo',
        user: filtroUsuario.user_id,
        reporte: 1,
      })
    }

    /* const seleccionarTabEmpleados = (tipoSeleccion) => {
      filtroUsuario.user_id = null
      if (tipoSeleccion === tipoSeleccionUsuario.POR_NOMBRES && listadosAuxiliares.empleados?.length === 0)
        cargarVista(async () => {
          await obtenerListados({
            empleados: {
              controller: new UsuarioController(),
              params: {
                campos: 'id,name,apellidos',
                estado: 1,
              },
            },
          })
        })
    } */

    const consultarUsuarios = async () => {
      await cargarVista(async () => {
        await obtenerListados({
          usuarios: {
            controller: new UsuarioController(),
            params: {
              campos: 'id,name,apellidos,identificacion',
              estado: 1,
            },
          },
        })
      })
    }

    const listarArchivos = async () => {
      await listar({
        user_id:
          filtroUsuario.tipo_seleccion === tipoSeleccionUsuario.POR_NOMBRES
            ? filtroUsuario.user_id
            : null,
        identificacion:
          filtroUsuario.tipo_seleccion ===
          tipoSeleccionUsuario.POR_IDENTIFICATION
            ? filtroUsuario.identificacion
            : null,
      })

      if (
        filtroUsuario.tipo_seleccion === tipoSeleccionUsuario.POR_IDENTIFICATION
      ) {
        filtroUsuario.user_id = listado.value.length
          ? listado.value[0].user
          : buscarIdUsuarioPorIdentificacion(filtroUsuario.identificacion)
      }

      if (listado.value.length === 0)
        notificarInformacion('Este usuario no tiene archivos subidos aún')
    }

    const listarMisArchivos = async () => {
      filtroUsuario.user_id = authenticationStore.user.id
      await listar({
        user_id: filtroUsuario.user_id,
      })

      if (listado.value.length === 0)
        notificarInformacion('Este usuario no tiene archivos subidos aún')
    }

    const buscarIdUsuarioPorIdentificacion = (identificacion: string) =>
      listadosAuxiliares.usuarios.find(
        (u: Usuario) => u.identificacion === identificacion
      )?.id

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
          () => eliminar(entidad)
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

    /*************
     * Validaciones
     **************/
    /* const reglas = {
      documento_identidad_anverso: { required },
      documento_identidad_reverso: { required },
      documento_identidad_selfie: { required },
      user_id: { required },
    }

    const v$ = useVuelidate(reglas, verificaCuenta)
    setValidador(v$.value) */

    /*******
     * Init
     *******/
    if (!puedeSubirArchivos.value) {
      filtroUsuario.user_id = authenticationStore.user.id
      listar({
        user_id: filtroUsuario.user_id ?? '',
      })
    } else consultarUsuarios()

    return {
      id,
      refPdfViewer,
      refArchivo,
      mixin,
      listado,
      verificaCuenta,
      configuracionColumnasArchivoReporte,
      filtroUsuario,
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
      /* columnas: puedeSubirArchivos.value
        ? [...configuracionColumnasArchivoReporte, accionesTabla]
        : configuracionColumnasArchivoReporte, */
      columnas: [...configuracionColumnasArchivoReporte, accionesTabla],
      puedeSubirArchivos,
      tipoSeleccionUsuario,
      consultarUsuarios,
      // seleccionarTabEmpleados,
      listarMisArchivos,
      btnActualizarMisArchivos,
      titulo: authenticationStore.esCliente
        ? 'Mi buró'
        : 'Compartir archivos a clientes',
    }
  },
})
