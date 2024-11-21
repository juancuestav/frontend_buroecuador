import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { FacturacionPlan } from './FacturacionPlan'

export const configuracionColumnasFacturacion: ColumnConfig<FacturacionPlan>[] =
  [
    {
      name: 'identificacion',
      field: 'identificacion',
      label: 'Identificación',
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
      name: 'pagado',
      field: 'pagado',
      label: 'Mes pagado',
      align: 'left',
      sortable: true,
    },
    {
      name: 'fecha_pago',
      field: 'fecha_pago',
      label: 'Fecha de último pago',
      align: 'left',
      sortable: true,
    },
    {
      name: 'proximo_pago',
      field: 'proximo_pago',
      label: 'Fecha de próximo pago',
      align: 'left',
      sortable: true,
    },
    {
      name: 'acciones',
      field: 'acciones',
      label: 'Acciones',
      align: 'center',
    },
  ]
