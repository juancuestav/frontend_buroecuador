import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Banco } from 'pages/basesDeDatos/banco/domain/Banco'

export const configuracionColumnasBanco: ColumnConfig<Banco>[] = [
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha',
    align: 'left',
  },
  {
    name: 'tipo',
    field: 'tipo',
    label: 'Tipo',
    align: 'left',
  },
  /*{
    name: 'cedula_ruc',
    field: 'cedula_ruc',
    label: 'Cédula/RUC',
    align: 'left',
  },
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },*/
  {
    name: 'cod_entida',
    field: 'cod_entida',
    label: 'Código entidad',
    align: 'left',
  },
  {
    name: 'banco',
    field: 'banco',
    label: 'Banco',
    align: 'left',
  },
  {
    name: 'entnombre',
    field: 'entnombre',
    label: 'Entidad',
    align: 'left',
  },
  {
    name: 'enttipo',
    field: 'enttipo',
    label: 'Tipo entidad',
    align: 'left',
  },
  {
    name: 'vinculacio',
    field: 'vinculacio',
    label: 'Vinculación',
    align: 'left',
  },
  {
    name: 'riesgo',
    field: 'riesgo',
    label: 'Riesgo',
    align: 'left',
  },
  {
    name: 'campo_1',
    field: 'campo_1',
    label: 'Campo 1',
    align: 'left',
  },
  {
    name: 'calificaci',
    field: 'calificaci',
    label: 'Calificación',
    align: 'left',
  },
  {
    name: 'saldo_vige',
    field: 'saldo_vige',
    label: 'Saldo vigente',
    align: 'left',
  },
  {
    name: 'no_dvenga',
    field: 'no_dvenga',
    label: 'No devenga intereses',
    align: 'left',
  },
  {
    name: 'saldo_0_1',
    field: 'saldo_0_1',
    label: 'Saldo 0 a 1 años',
    align: 'left',
  },
  {
    name: 'saldo_1_2',
    field: 'saldo_1_2',
    label: 'Saldo 1 a 2 años',
    align: 'left',
  },
  {
    name: 'saldo_2_3',
    field: 'saldo_2_3',
    label: 'Saldo 2 a 3 años',
    align: 'left',
  },
  {
    name: 'saldo_3_6',
    field: 'saldo_3_6',
    label: 'Saldo 3 a 6 años',
    align: 'left',
  },
  {
    name: 'saldo_6_9',
    field: 'saldo_6_9',
    label: 'Saldo 6 a 9 años',
    align: 'left',
  },
  {
    name: 'saldo_9_12',
    field: 'saldo_9_12',
    label: 'Saldo 9 a 12 años',
    align: 'left',
  },
  {
    name: 'saldo_12_2',
    field: 'saldo_12_2',
    label: 'Saldo 12 a 24 años',
    align: 'left',
  },
  {
    name: 'saldo_24_3',
    field: 'saldo_24_3',
    label: 'Saldo 24 a 36 años',
    align: 'left',
  },
  {
    name: 'mas_36',
    field: 'mas_36',
    label: 'Más de 36 años',
    align: 'left',
  },
  {
    name: 'judicial',
    field: 'judicial',
    label: 'Judicial',
    align: 'left',
  },
  {
    name: 'castigo',
    field: 'castigo',
    label: 'Castigo',
    align: 'left',
  },
  {
    name: 'mora',
    field: 'mora',
    label: 'Mora',
    align: 'left',
  },
  {
    name: 'saldo_mora',
    field: 'saldo_mora',
    label: 'Saldo mora',
    align: 'left',
  },
  {
    name: 'tipo_banco',
    field: 'tipo_banco',
    label: 'Tipo banco',
    align: 'left',
  },
]
