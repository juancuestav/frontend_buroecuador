import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Archivo } from './Archivo'

export const configuracionColumnasArchivo: ColumnConfig<Archivo>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'tamanio_bytes',
    field: 'tamanio_bytes',
    label: 'Tamaño',
    align: 'left',
    editable: false,
  },
]
