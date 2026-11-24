import { ActualizarNotificacionesPusherEvent } from 'src/pusherEvents/ActualizarNotificacionesPusherEvent'
import { ArchivoReportePusherEvent } from 'src/pusherEvents/ArchivoReportePusherEvent'
import { NotificacionClientePusherEvent } from 'src/pusherEvents/NotificacionClientePusherEvent'
import { SolicitudCreditoPusherEvent } from 'src/pusherEvents/SolicitudCreditoPusherEvent'

export class NotificacionesSistema {
  init() {
    // Actualizar Notificaciones
    const actualizarNotificacionesPusherEvent =
      new ActualizarNotificacionesPusherEvent()
    actualizarNotificacionesPusherEvent.start()

    // Sistema
    const notificacionClientePusherEvent = new NotificacionClientePusherEvent()
    notificacionClientePusherEvent.start()

    const archivoReportePusherEvent = new ArchivoReportePusherEvent()
    archivoReportePusherEvent.start()

    // Novedades de las solicitudes de crédito (asesor y administradores)
    new SolicitudCreditoPusherEvent().start()
  }
}
