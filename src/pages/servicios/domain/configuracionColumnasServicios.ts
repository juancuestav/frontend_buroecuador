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
    name: 'nombre_categoria',
    field: 'nombre_categoria',
    label: 'Categoría',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tipo_servicio',
    field: 'tipo_servicio',
    label: 'Tipo de servicio',
    align: 'left',
    sortable: true,
  },
  {
    name: 'precio_unitario',
    field: 'precio_unitario',
    label: 'Precio',
    align: 'right',
    sortable: true,
  },
  {
    name: 'gravable',
    field: 'gravable',
    label: 'IVA incluido',
    align: 'left',
    sortable: true,
  },
]
