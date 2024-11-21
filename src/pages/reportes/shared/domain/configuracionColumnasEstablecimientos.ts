import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Establecimiento } from './Establecimiento'

export const configuracionColumnasEstablecimientos: ColumnConfig<Establecimiento>[] =
  [
    {
      name: 'establecimiento',
      field: 'establecimiento',
      label: 'No. Establecimiento',
      align: 'left',
    },
    {
      name: 'nombre_comercial',
      field: 'nombre_comercial',
      label: 'Nombre comercial',
      align: 'left',
    },
    {
      name: 'ubicacion',
      field: 'ubicacion',
      label: 'Ubicación',
      align: 'left',
    },
    {
      name: 'estado',
      field: 'estado',
      label: 'Estado',
      align: 'left',
    },
  ]
