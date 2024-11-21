import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Mejoramiento } from './Mejoramiento'

export const configuracionColumnasMejoramiento: ColumnConfig<Mejoramiento>[] = [
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
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
    name: 'celular',
    field: 'celular',
    label: 'Celular',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha de solicitud',
    align: 'left',
    sortable: true,
  },
  {
    name: 'puntaje_actual',
    field: 'puntaje_actual',
    label: 'Puntaje actual',
    align: 'left',
    sortable: true,
  },
  {
    name: 'puntaje_subir',
    field: 'puntaje_subir',
    label: 'Puntaje a subir',
    align: 'left',
    sortable: true,
  },
]
