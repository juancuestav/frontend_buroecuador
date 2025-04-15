import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DashboardPrecalifica } from './DashboardPrecalifica'

export const configuracionColumnasDashboardPrecalifica: ColumnConfig<DashboardPrecalifica>[] =
  [
    {
      name: 'usuario',
      field: 'usuario',
      label: 'Usuario',
      align: 'left',
    },
    {
      name: 'tipo',
      field: 'tipo',
      label: 'Tipo',
      align: 'left',
    },
    {
      name: 'parametros',
      field: 'parametros',
      label: 'Búsqueda',
      align: 'left',
    },
    {
      name: 'created_at',
      field: 'created_at',
      label: 'Fecha',
      align: 'left',
    },
    {
      name: 'ip_usuario',
      field: 'ip_usuario',
      label: 'Origen',
      align: 'left',
    },
  ]
