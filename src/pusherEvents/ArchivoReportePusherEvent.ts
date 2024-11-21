import { pushEventMesaggeServiceWorker } from 'components/notificaciones/application/PusherEventMessageServceWorker'
import { Notificacion } from 'components/notificaciones/domain/Notificacion'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { useAuthenticationStore } from 'stores/authentication'

export class ArchivoReportePusherEvent {
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  /**
   * It subscribes to a channel and listens for events.
   */
  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    // Suscripcion al canal del pedido creado
    pusher.subscribe('archivo-reporte-tracker-' + this.store.user.id)
    pusher.bind(
      'archivo-reporte-event',
      function (e: { notificacion: Notificacion }) {
        notificacionStore.agregar(e.notificacion)

        pushEventMesaggeServiceWorker({
          titulo: e.notificacion.tipo_notificacion,
          mensaje: e.notificacion.mensaje,
          link: e.notificacion.link,
        })
      }
    )
  }
}
