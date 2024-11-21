import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { OperacionCredito } from './OperacionCredito'

export const configuracionColumnasOperacionesCredito: ColumnConfig<OperacionCredito>[] =
  [
    {
      name: 'institucion',
      field: 'institucion',
      label: 'Institución',
      align: 'left',
    },
    {
      name: 'fecha_corte',
      field: 'fecha_corte',
      label: 'Fecha corte',
      align: 'left',
    },
    {
      name: 'tipo_riesgo',
      field: 'tipo_riesgo',
      label: 'Tipo riesgo',
      align: 'left',
    },
    {
      name: 'tipo_credito',
      field: 'tipo_credito',
      label: 'Tipo crédito',
      align: 'left',
    },
    {
      name: 'cupo_monto_original',
      field: 'cupo_monto_original',
      label: 'Cupo monto original',
      align: 'left',
    },
    {
      name: 'fecha_apertura',
      field: 'fecha_apertura',
      label: 'Fecha apertura',
      align: 'left',
    },
    {
      name: 'fecha_vencimiento',
      field: 'fecha_vencimiento',
      label: 'Fecha vencimiento',
      align: 'left',
    },
    {
      name: 'total_vencer',
      field: 'total_vencer',
      label: 'Total vencer',
      align: 'left',
    },
    {
      name: 'ndi',
      field: 'ndi',
      label: 'NDI',
      align: 'left',
    },
    {
      name: 'total_vencido',
      field: 'total_vencido',
      label: 'Total vencido',
      align: 'left',
    },
    {
      name: 'demanda_judicial',
      field: 'demanda_judicial',
      label: 'Demanda judicial',
      align: 'left',
    },
    {
      name: 'cartera_castigada',
      field: 'cartera_castigada',
      label: 'Cartera castigada',
      align: 'left',
    },
    {
      name: 'saldo_deuda',
      field: 'saldo_deuda',
      label: 'Saldo deuda',
      align: 'left',
    },
    {
      name: 'cuota_mensual',
      field: 'cuota_mensual',
      label: 'Cuota mensual',
      align: 'left',
    },
  ]
