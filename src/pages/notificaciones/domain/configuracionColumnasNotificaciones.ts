import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Notificacion } from './Notificacion'

export const configuracionColumnasNotificaciones: ColumnConfig<Notificacion>[] =
  [
    {
      name: 'tiempo',
      field: 'tiempo',
      label: 'Tiempo',
      align: 'left',
      sortable: true,
    },
    {
      name: 'cliente',
      field: 'cliente',
      label: 'Cliente',
      align: 'left',
      sortable: true,
    },
    {
      name: 'correo',
      field: 'correo',
      label: 'Correo',
      align: 'left',
      sortable: true,
    },
    {
      name: 'acciones',
      field: 'acciones',
      label: 'Acciones',
      align: 'left',
      sortable: true,
    },
  ]
