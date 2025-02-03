import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { Usuario } from 'pages/usuarios/domain/Usuario'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'

export function useOrquestadorSelectorUsuarios(
  entidad: any,
  endpoint: keyof typeof endpoints
) {
  const refListadoSeleccionable = ref()
  const listado: Ref<EntidadAuditable[]> = ref([])
  const criterioBusqueda = ref()

  const singleSelector = {
    refListadoSeleccionable: refListadoSeleccionable,
    listadoSeleccionable: listado,
    endpoint: endpoint,
    limpiar: () => {
      entidad.user = null
      entidad.usuarios = []
      criterioBusqueda.value = null
    },
    seleccionar: (items: Usuario[]) => {
      console.log(items)
      entidad.user = items[0].id
      entidad.usuarios = [...items]
    },
  }

  const selector = useSelector(singleSelector)
  const listar = () => selector.listar(criterioBusqueda.value)
  const limpiar = () => singleSelector.limpiar()

  const seleccionar = (items: Usuario[]) => {
    let ids: any = []
    console.log(items)
    ids = entidad.usuarios.map((entidad: Usuario) => entidad.id)
    const datos = items.filter((v) => !ids.includes(v.id))

    singleSelector.seleccionar(datos)
  }

  return {
    refListadoSeleccionable,
    listado,
    listar,
    limpiar,
    seleccionar,
    criterioBusqueda,
  }
}
