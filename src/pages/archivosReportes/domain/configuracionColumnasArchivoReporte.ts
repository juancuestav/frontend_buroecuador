import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ArchivoReporte } from './ArchivoReporte'

export const configuracionColumnasArchivoReporte: ColumnConfig<ArchivoReporte>[] =
  [
    {
      name: 'titulo',
      field: 'titulo',
      label: 'Titulo',
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
      name: 'archivos',
      field: 'archivos',
      label: 'Archivos',
      align: 'left',
      sortable: true,
    },
  ]
