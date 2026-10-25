import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CodigoVerificacion } from './CodigoVerificacion'

export const configuracionColumnasCodigosVerificacion: ColumnConfig<CodigoVerificacion>[] =
  [
    {
      name: 'descripcion',
      field: 'descripcion',
      label: 'Descripción',
      align: 'left',
      sortable: true,
    },
    {
      name: 'codigo_enmascarado',
      field: 'codigo_enmascarado',
      label: 'Código',
      align: 'left',
    },
    {
      name: 'activo',
      field: 'activo',
      label: 'Activo',
      align: 'left',
      type: 'boolean',
      sortable: true,
    },
    {
      name: 'un_solo_uso',
      field: 'un_solo_uso',
      label: 'Un solo uso',
      align: 'left',
      type: 'boolean',
      sortable: true,
    },
    {
      name: 'ultimo_uso_at',
      field: 'ultimo_uso_at',
      label: 'Último uso',
      align: 'left',
      sortable: true,
    },
    {
      name: 'creado_por',
      field: 'creado_por',
      label: 'Creado por',
      align: 'left',
    },
    {
      name: 'created_at',
      field: 'created_at',
      label: 'Fecha de creación',
      align: 'left',
      sortable: true,
    },
  ]
