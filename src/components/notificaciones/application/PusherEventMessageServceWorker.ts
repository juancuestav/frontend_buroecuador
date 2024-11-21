import { ServiceWorkerClass } from '../domain/ServiceWorkerClass'

export function pushEventMesaggeServiceWorker(data: ServiceWorkerClass) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.active!.postMessage({
        action: 'notificacionPush',
        titulo: data.titulo,
        mensaje: data.mensaje,
        icono: data.icono,
        link: data.link,
        badge: data.badge,
      })
    })
  }
}
