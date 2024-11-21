import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ItemMiReporte } from './ItemMiReporte'

export const configuracionColumnasMiReporte: ColumnConfig<ItemMiReporte>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre de reporte',
    align: 'left',
  },
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha y hora del reporte',
    align: 'left',
  },
  {
    name: 'acciones',
    field: 'acciones',
    label: 'Acciones',
    align: 'left',
  },
]
