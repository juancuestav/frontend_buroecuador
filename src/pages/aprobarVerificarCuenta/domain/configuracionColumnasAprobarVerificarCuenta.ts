import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { AprobarVerificarCuenta } from './AprobarVerificarCuenta'

export const configuracionColumnasAprobarVerificarCuenta: ColumnConfig<AprobarVerificarCuenta>[] =
  [
    {
      name: 'usuario',
      field: 'usuario',
      label: 'Usuario',
      align: 'left',
      sortable: true,
    },
    {
      name: 'created_at',
      field: 'created_at',
      label: 'Fecha hora subida archivos',
      align: 'left',
      sortable: true,
    },
    {
      name: 'estado_verificacion',
      field: 'estado_verificacion',
      label: 'Estado de verificación',
      align: 'left',
      sortable: true,
    },
  ]
