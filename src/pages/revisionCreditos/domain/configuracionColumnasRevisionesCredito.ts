import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RevisionCreditoHistorial } from './RevisionCreditoHistorial'

const CLASES_RESULTADO: Record<string, string> = {
  CALIFICA: 'text-positive text-bold',
  'NO CALIFICA': 'text-negative text-bold',
  DETENIDA: 'text-orange-9 text-bold',
  'PENDIENTE EQUIFAX': 'text-blue-grey-7 text-bold',
}

export const configuracionColumnasRevisionesCredito: ColumnConfig<RevisionCreditoHistorial>[] =
  [
    {
      name: 'created_at',
      field: 'created_at',
      label: 'Fecha',
      align: 'left',
    },
    {
      name: 'identificacion',
      field: 'identificacion',
      label: 'Identificación',
      align: 'left',
    },
    {
      name: 'nombres',
      field: 'nombres',
      label: 'Nombres',
      align: 'left',
    },
    {
      name: 'resultado',
      field: 'resultado',
      label: 'Resultado',
      align: 'left',
      classes: (fila: RevisionCreditoHistorial) =>
        CLASES_RESULTADO[fila.resultado ?? ''] ?? '',
    },
    {
      name: 'score',
      field: 'score',
      label: 'Score',
      align: 'left',
    },
    {
      name: 'equifax',
      field: 'equifax',
      label: 'Equifax',
      align: 'left',
    },
    {
      name: 'asesor',
      field: 'asesor',
      label: 'Asesor',
      align: 'left',
    },
    {
      name: 'pertenece_a',
      field: 'pertenece_a',
      label: 'Pertenece a',
      align: 'left',
    },
  ]
