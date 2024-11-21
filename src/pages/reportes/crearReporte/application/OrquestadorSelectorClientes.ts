import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'
import { Usuario } from 'pages/usuarios/domain/Usuario'

export function useOrquestadorSelectorClientes(
  entidad: any,
  endpoint: keyof typeof endpoints
) {
  const refListadoSeleccionable = ref() // referencia para llamar a los metodos del listado
  const listado: Ref<EntidadAuditable[]> = ref([]) // listado con resultados de búsqueda
  const criterioBusqueda = ref()

  const singleSelector = {
    refListadoSeleccionable: refListadoSeleccionable,
    listadoSeleccionable: listado,
    endpoint: endpoint,
    limpiar: () => {
      entidad.usuario = null
      entidad.identificacion_cliente = null
      entidad.nombres_cliente = null
      entidad.edad_cliente = null
      entidad.celular_cliente = null
      entidad.correo_cliente = null
      entidad.direccion_cliente = null
      criterioBusqueda.value = null
    },
    seleccionar: (cliente: Usuario) => {
      entidad.usuario = cliente.id
      entidad.identificacion_cliente = cliente.identificacion
      entidad.nombres_cliente = cliente.name + (cliente.apellidos ?? '')
      entidad.edad_cliente = cliente.edad
      entidad.celular_cliente = cliente.celular
      entidad.correo_cliente = cliente.email
      entidad.direccion_cliente = cliente.direccion
      criterioBusqueda.value = cliente.identificacion
    },
  }

  const selector = useSelector(singleSelector)

  const listar = () => selector.listar(criterioBusqueda.value)

  const limpiar = () => singleSelector.limpiar()

  const seleccionar = (id: number) => selector.seleccionar(id)

  return {
    refListadoSeleccionable,
    listado,
    listar,
    limpiar,
    seleccionar,
    criterioBusqueda,
  }
}
