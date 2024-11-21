import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Usuario } from 'pages/usuarios/domain/Usuario'
import { Ref, ref } from 'vue'

export function useOrquestadorUsuario(
  cliente: any,
  endpoint: keyof typeof endpoints
) {
  const refListadoSeleccionable = ref() // referencia para llamar a los metodos del listado
  const listado: Ref<any[]> = ref([]) // listado resultado de búsqueda
  const criterioBusqueda = ref() //: UnwrapRef<string | null> = null;

  const singleSelector = {
    refListadoSeleccionable: refListadoSeleccionable,
    listadoSeleccionable: listado,
    endpoint: endpoint,
    limpiar: () => {
      cliente.id = null
      cliente.nombres = null
      cliente.identificacion = null
      criterioBusqueda.value = null
    },
    seleccionar: (usuario: Usuario) => {
      cliente.id = usuario.id
      cliente.nombres = usuario.name + ' ' + (usuario.apellidos ?? '')
      criterioBusqueda.value = usuario.identificacion
      cliente.identificacion = usuario.identificacion
    },
  }

  const selector = useSelector(singleSelector)

  const listar = () => selector.listar(criterioBusqueda.value)

  const limpiar = () => singleSelector.limpiar()

  const seleccionar = (id: number) => selector.seleccionar(id)

  return {
    refListadoSeleccionableUsuario: refListadoSeleccionable,
    listadoUsuarios: listado,
    listarUsuarios: listar,
    limpiarUsuario: limpiar,
    seleccionarUsuario: seleccionar,
    criterioBusquedaUsuario: criterioBusqueda,
  }
}
