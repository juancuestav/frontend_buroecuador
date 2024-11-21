import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Actividad } from './Actividad'

export const configuracionColumnasActividades: ColumnConfig<Actividad>[] = [
  {
    name: 'actividad',
    field: 'actividad',
    label: 'Actividad económica principal',
    align: 'left',
  },
]
