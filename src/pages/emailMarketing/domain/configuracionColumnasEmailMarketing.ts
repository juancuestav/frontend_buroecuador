import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { EmailMarketing } from './EmailMarketing'

export const configuracionColumnasEmailMarketing: ColumnConfig<EmailMarketing>[] =
  [
    {
      name: 'tipo_identificacion',
      field: 'tipo_identificacion',
      label: 'Tipo identificación',
      align: 'left',
      sortable: true,
    },
    {
      name: 'identificacion',
      field: 'identificacion',
      label: 'Identificación',
      align: 'left',
      sortable: true,
    },
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Nombre',
      align: 'left',
      sortable: true,
    },
    /* {
      name: 'edad',
      field: 'edad',
      label: 'Edad',
      align: 'left',
      sortable: true,
    },
    {
      name: 'provincia',
      field: 'provincia',
      label: 'Provincia',
      align: 'left',
      sortable: true,
    },
    {
      name: 'ciudad',
      field: 'ciudad',
      label: 'Ciudad',
      align: 'left',
      sortable: true,
    }, */
    {
      name: 'correo',
      field: 'correo',
      label: 'Correo',
      align: 'left',
      sortable: true,
    },
    {
      name: 'celular',
      field: 'celular',
      label: 'Celular',
      align: 'left',
      sortable: true,
    },
    {
      name: 'direccion',
      field: 'direccion',
      label: 'Dirección',
      align: 'left',
      sortable: true,
    },
  ]
