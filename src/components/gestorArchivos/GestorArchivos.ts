/**
 * @author Juan Cuesta
 * @description Este componente trabaja con la tabla archivos y es polimorfica para otros modelos
 * A nivel de backend hacer los métodos correspondientes en el controlador y la relación en el modelo.
 *
 */
// Dependencias
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { descargarArchivoUrl } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosError } from 'axios'
import { accionesTabla } from 'config/utils'
import { defineComponent, onMounted, ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ParamsType } from 'config/types'
import { configuracionColumnasArchivo } from './domain/configuracionColumnasArchivo'

export default defineComponent({
  components: {
    EssentialTable,
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
    permitirEliminar: {
      type: Boolean,
      default: true,
    },
    listarAlGuardar: {
      type: Boolean,
      default: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    permitirSubir: {
      type: Boolean,
      default: true,
    },
    quieroSubirArchivos: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['inicializado'],
  setup(props, { emit }) {
    /********
     * Mixin
     *********/
    const { listadoArchivos } = props.mixin.useReferencias()
    const { eliminarArchivo, listarArchivos, guardarFormData } =
      props.mixin.useComportamiento()

    const { notificarError, notificarAdvertencia, confirmar } =
      useNotificaciones()

    function listarArchivosAlmacenados(id: number, params: ParamsType) {
      listarArchivos(id, params)
    }

    const cantElementos = ref(0)
    const tamanioListado = ref(0)
    let paramsForm

    /***************
     * Botones tabla
     ***************/
    const btnEliminar: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash3',
      color: 'negative',
      visible: () => props.permitirEliminar,
      accion: async ({ entidad }) => {
        confirmar(
          'Esta operación es irreversible. El archivo se eliminará de forma instantánea.',
          () => eliminarArchivo(entidad)
        )
      },
    }

    const btnDescargar: CustomActionTable = {
      titulo: 'Ver/Descargar',
      icono: 'bi-eye',
      color: 'positive',
      accion: ({ entidad }) => {
        // console.log(entidad)
        descargarArchivoUrl(entidad.ruta)
      },
    }

    const refGestor = ref()

    onMounted(() => {
      emit('inicializado')
    })

    /************
     * Funciones
     *************/
    const quiero_subir_archivos = ref(props.quieroSubirArchivos)

    async function factoryFn(files) {
      const fd = new FormData()
      fd.append('file', files[0])

      for (const key in paramsForm) {
        fd.append(key, paramsForm[key])
      }

      try {
        await guardarFormData(fd)

        files.value = []
        // if (props.listarAlGuardar) listadoArchivos.value.push(response.data.modelo)
        quiero_subir_archivos.value = false
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        notificarError(
          (axiosError.response?.data as { mensaje: string }).mensaje
        )
      }
    }

    function subir(params: ParamsType) {
      paramsForm = params
      if (refGestor.value) {
        refGestor.value.upload()
        refGestor.value.reset()
        refGestor.value.removeUploadedFiles()
        refGestor.value.removeQueuedFiles()
      }
    }

    function onRejected() {
      notificarAdvertencia(
        'El tamaño total de los archivos no deben exceder los 10mb.'
      )
    }

    function limpiarListado() {
      listadoArchivos.value = []
      // console.log('limpiado...')
    }

    function onFileAdded(files) {
      for (let index = 0; index < files.length; index++) {
        cantElementos.value += 1
      }
      tamanioListado.value += obtenerSumatoriaTamanio(files)
    }
    function onFileRemoved(file) {
      cantElementos.value -= 1
      tamanioListado.value -= obtenerSumatoriaTamanio(file)
    }
    function obtenerSumatoriaTamanio(files) {
      const sumatoria = files.reduce((total, file) => total + file.size, 0)
      return sumatoria
    }

    return {
      listadoArchivos,
      refGestor,
      // extraerExtension: (nombre: string) => nombre.split('.').at(-1),
      // formatBytes,
      quiero_subir_archivos,
      columnas: [...configuracionColumnasArchivo, accionesTabla],
      onRejected,
      btnEliminar,
      btnDescargar,
      onFileAdded,
      onFileRemoved,
      tamanioListado,
      cantElementos,
      factoryFn,
      subir,
      limpiarListado,
      listarArchivosAlmacenados,
    }
  },
})
