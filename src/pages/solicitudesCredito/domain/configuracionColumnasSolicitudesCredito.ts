import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudCreditoHistorial } from './SolicitudCreditoHistorial'

export const configuracionColumnasSolicitudesCredito: ColumnConfig<SolicitudCreditoHistorial>[] =
  [
    { name: 'created_at', field: 'created_at', label: 'Fecha de ingreso', align: 'left' },
    { name: 'identificacion', field: 'identificacion', label: 'Cédula', align: 'left' },
    { name: 'nombres', field: 'nombres', label: 'Cliente', align: 'left' },
    { name: 'asesor', field: 'asesor', label: 'Asesor', align: 'left' },
    { name: 'banco_nombre', field: 'banco_nombre', label: 'Banco', align: 'left' },
    { name: 'monto_texto', field: 'monto_texto', label: 'Monto solicitado', align: 'right' },
    { name: 'plazo_texto', field: 'plazo_texto', label: 'Plazo', align: 'center' },
    { name: 'score', field: 'score', label: 'Puntaje', align: 'center' },
    {
      name: 'estado_texto',
      field: 'estado_texto',
      label: 'Estado',
      align: 'left',
      // Colores en SolicitudesCreditoPage.vue (estilos globales de la tabla)
      classes: (fila: SolicitudCreditoHistorial) => `estado-solicitud estado-solicitud--${fila.estado}`,
    },
    { name: 'observacion', field: 'observacion', label: 'Observación', align: 'left' },
  ]
