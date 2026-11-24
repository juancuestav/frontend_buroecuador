import { pushEventMesaggeServiceWorker } from 'components/notificaciones/application/PusherEventMessageServceWorker'
import { Notificacion } from 'components/notificaciones/domain/Notificacion'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { useAuthenticationStore } from 'stores/authentication'

/** Evento que emite la pantalla abierta para recargar la solicitud que cambió */
export const EVENTO_SOLICITUD_CREDITO_ACTUALIZADA = 'solicitud-credito-actualizada'

/**
 * Novedades de una solicitud de crédito (cambio de estado, comentarios,
 * documentos): canal por usuario, como los archivos de reportes.
 */
export class SolicitudCreditoPusherEvent {
  store = useAuthenticationStore()
  notificacionesPusherStore = useNotificationRealtimeStore()

  start() {
    const notificacionStore = this.notificacionesPusherStore
    const pusher = notificacionStore.pusher

    pusher.subscribe('solicitud-credito-tracker-' + this.store.user.id)
    pusher.bind(
      'solicitud-credito-event',
      function (e: { notificacion: Notificacion; solicitudId: number }) {
        notificacionStore.agregar(e.notificacion)
        window.dispatchEvent(
          new CustomEvent(EVENTO_SOLICITUD_CREDITO_ACTUALIZADA, {
            detail: { id: e.solicitudId },
          })
        )

        pushEventMesaggeServiceWorker({
          titulo: e.notificacion.tipo_notificacion,
          mensaje: e.notificacion.mensaje,
          link: e.notificacion.link,
        })
      }
    )
  }
}
