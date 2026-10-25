import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { EVENTO_SESION_EXPIRADA } from 'shared/http/infraestructure/AxiosHttpRepository'

const LIMITE_INACTIVIDAD_MS = 30 * 60 * 1000
const DURACION_AVISO_MS = 60 * 1000
// No se escribe la marca en cada mousemove, basta con una vez cada pocos segundos
const INTERVALO_REGISTRO_MS = 5 * 1000
const CLAVE_ULTIMA_ACTIVIDAD = 'ultima_actividad'
const EVENTOS_ACTIVIDAD = [
  'mousemove',
  'keydown',
  'click',
  'scroll',
  'touchstart',
] as const

/**
 * Cierra la sesión tras 30 min sin actividad, avisando un minuto antes.
 * La última actividad se guarda en localStorage para que todas las pestañas
 * abiertas compartan el mismo contador, y se compara contra el reloj (no
 * contra timers) para que funcione también al volver de segundo plano en
 * la app móvil, donde los intervalos se pausan.
 */
export function useCierrePorInactividad() {
  const router = useRouter()
  const authenticationStore = useAuthenticationStore()
  const { notificarAdvertencia } = useNotificaciones()

  const mostrarAviso = ref(false)
  const segundosRestantes = ref(Math.round(DURACION_AVISO_MS / 1000))

  let ultimaActividadLocal = Date.now()
  let ultimoRegistro = 0
  let intervalo: ReturnType<typeof setInterval> | undefined
  let cerrando = false

  function leerUltimaActividad(): number {
    try {
      const guardada = Number(localStorage.getItem(CLAVE_ULTIMA_ACTIVIDAD))
      return guardada || ultimaActividadLocal
    } catch {
      return ultimaActividadLocal
    }
  }

  function guardarUltimaActividad(marca: number) {
    ultimaActividadLocal = marca
    try {
      localStorage.setItem(CLAVE_ULTIMA_ACTIVIDAD, String(marca))
    } catch {
      // Sin acceso a localStorage solo se pierde la sincronización entre pestañas
    }
  }

  function registrarActividad() {
    // Con el aviso abierto solo cuenta el botón "Seguir conectado"
    if (mostrarAviso.value) return

    const ahora = Date.now()
    if (ahora - ultimoRegistro < INTERVALO_REGISTRO_MS) return
    ultimoRegistro = ahora
    guardarUltimaActividad(ahora)
  }

  function seguirConectado() {
    ultimoRegistro = Date.now()
    guardarUltimaActividad(ultimoRegistro)
    mostrarAviso.value = false
  }

  async function cerrarSesion(mensaje: string, avisarBackend: boolean) {
    if (cerrando) return
    cerrando = true
    detener()
    mostrarAviso.value = false

    if (avisarBackend) await authenticationStore.logout()
    else await authenticationStore.limpiarSesionLocal()

    await router.replace({ name: 'Login' })
    notificarAdvertencia(mensaje)
  }

  function revisar() {
    const inactivoMs = Date.now() - leerUltimaActividad()

    if (inactivoMs >= LIMITE_INACTIVIDAD_MS) {
      cerrarSesion('Tu sesión se cerró por inactividad.', true)
      return
    }

    if (inactivoMs >= LIMITE_INACTIVIDAD_MS - DURACION_AVISO_MS) {
      segundosRestantes.value = Math.ceil(
        (LIMITE_INACTIVIDAD_MS - inactivoMs) / 1000
      )
      mostrarAviso.value = true
    } else {
      // Otra pestaña pudo haber registrado actividad
      mostrarAviso.value = false
    }
  }

  function alCambiarVisibilidad() {
    if (document.visibilityState === 'visible') revisar()
  }

  function alExpirarSesion() {
    cerrarSesion('Tu sesión expiró. Vuelve a iniciar sesión.', false)
  }

  function detener() {
    if (intervalo) clearInterval(intervalo)
    intervalo = undefined
    EVENTOS_ACTIVIDAD.forEach((evento) =>
      window.removeEventListener(evento, registrarActividad)
    )
    document.removeEventListener('visibilitychange', alCambiarVisibilidad)
    window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirarSesion)
  }

  onMounted(() => {
    // Al montar el layout la sesión acaba de iniciarse o recargarse
    guardarUltimaActividad(Date.now())

    EVENTOS_ACTIVIDAD.forEach((evento) =>
      window.addEventListener(evento, registrarActividad, { passive: true })
    )
    document.addEventListener('visibilitychange', alCambiarVisibilidad)
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirarSesion)
    intervalo = setInterval(revisar, 1000)
  })

  onBeforeUnmount(detener)

  return { mostrarAviso, segundosRestantes, seguirConectado }
}
