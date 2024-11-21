import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ItemConsultasCliente } from './ItemConsultasCliente'

export const configuracionColumnasConsultasCliente: ColumnConfig<ItemConsultasCliente>[] =
  [
    {
      name: 'mes',
      field: 'mes',
      label: 'Mes',
      align: 'left',
    },
    {
      name: 'entidad_financiera',
      field: 'entidad_financiera',
      label: 'Entidad financiera',
      align: 'left',
    },
  ]
