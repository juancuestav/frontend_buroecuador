import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Categoria } from './Categoria'

export const configuracionColumnasCategoria: ColumnConfig<Categoria>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'orden',
    field: 'orden',
    label: 'Orden',
    align: 'left',
    sortable: true,
  },
]
