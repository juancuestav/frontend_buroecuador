import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasUsuariosDashboardPrecalifica: ColumnConfig<any>[] =
  [
    {
      name: 'usuario',
      field: 'usuario',
      label: 'Usuario',
      align: 'left',
    },
    {
      name: 'total_consultas',
      field: 'total_consultas',
      label: 'Cantidad total de consultas',
      align: 'left',
    },
  ]
