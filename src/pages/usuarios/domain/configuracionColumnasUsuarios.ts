import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Usuario } from './Usuario'

export const configuracionColumnasUsuarios: ColumnConfig<Usuario>[] = [
  {
    name: 'identificacion',
    field: 'identificacion',
    label: 'Identificación',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    field: 'email',
    label: 'Correo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    field: 'name',
    label: 'Nombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'apellidos',
    field: 'apellidos',
    label: 'Apellidos',
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
    name: 'provincia',
    field: 'provincia',
    label: 'Provincia',
    align: 'left',
    sortable: true,
  },
  {
    name: 'canton',
    field: 'canton',
    label: 'Cantón',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tipo_cliente',
    field: 'tipo_cliente',
    label: 'Tipo de cliente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'rol',
    field: 'rol',
    label: 'Rol',
    align: 'left',
    sortable: true,
  },
  {
    name: 'verificado',
    field: 'verificado',
    label: 'Verificado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha y hora creación',
    align: 'left',
    sortable: true,
  },
]
