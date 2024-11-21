import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Servicio } from './Servicio'

export const configuracionColumnasServicios: ColumnConfig<Servicio>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'precio_unitario',
    field: 'precio_unitario',
    label: 'Precio',
    align: 'left',
    sortable: true,
  },
  {
    name: 'gravable',
    field: 'gravable',
    label: 'Gravable',
    align: 'left',
    sortable: true,
  },
  {
    name: 'iva',
    field: 'iva',
    label: 'Iva',
    align: 'left',
    sortable: true,
  },
]
