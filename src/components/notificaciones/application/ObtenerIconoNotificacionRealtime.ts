import { iconos } from 'config/iconosNotificacionesRealtime'

export class ObtenerIconoNotificacionRealtime {
  obtener(tipoNotificacion: string) {
    switch (tipoNotificacion) {
      case iconos.NOVEDADES.label:
        return iconos.NOVEDADES.icono
    }
  }
}
