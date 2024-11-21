import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Pedido } from './Pedido'

export const configuracionColumnasPedidos: ColumnConfig<Pedido>[] = [
  {
    name: 'fecha_emision',
    field: 'fecha_emision',
    label: 'Fecha de emisión',
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
    name: 'estado_pago',
    field: 'estado_pago',
    label: 'Estado del pago',
    align: 'left',
    sortable: true,
  },
]
