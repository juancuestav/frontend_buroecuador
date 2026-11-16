import { nextTick, onActivated, onBeforeUnmount, onMounted, Ref, ref } from 'vue'

/** Alto mínimo para que la tabla no quede inutilizable en pantallas bajas */
const ALTO_MINIMO = 400
/** Espacio bajo la tabla: padding del panel de pestañas y de la página */
const MARGEN_INFERIOR = 40
/** Algo más que la transición de las pestañas de TabLayout (~300 ms) */
const DURACION_TRANSICION = 600

/**
 * Calcula el alto de una q-table para que termine dentro de la ventana.
 *
 * La barra de scroll horizontal de q-table está al pie de su área de filas;
 * con un alto fijo (100vh - 100px) quedaba por debajo de la ventana cuando
 * la tabla empieza más abajo (título, pestañas, buscador), así que no se
 * podía desplazar la tabla hacia los lados sin antes bajar la página.
 *
 * @param refTabla ref al componente q-table
 * @returns `alto` en px, o null si la tabla aún no es visible
 */
export function useAltoTablaVisible(refTabla: Ref) {
  const alto = ref<number | null>(null)

  function ajustarAlto() {
    const el: HTMLElement | undefined = refTabla.value?.$el
    // offsetParent es null mientras la pestaña del listado está oculta
    if (!el || !el.offsetParent) return

    const inicio = el.getBoundingClientRect().top + window.scrollY
    alto.value = Math.max(
      ALTO_MINIMO,
      window.innerHeight - inicio - MARGEN_INFERIOR
    )
  }

  // Las pestañas de TabLayout entran con una transición (scale) y mientras dura
  // la posición de la tabla no es la final: se mide en cada frame hasta que
  // termine.
  let frame = 0
  function ajustarTrasRender() {
    cancelAnimationFrame(frame)
    const fin = performance.now() + DURACION_TRANSICION
    const medir = () => {
      ajustarAlto()
      if (performance.now() < fin) frame = requestAnimationFrame(medir)
    }
    nextTick(medir)
  }

  onMounted(() => {
    ajustarTrasRender()
    window.addEventListener('resize', ajustarAlto)
  })
  onActivated(ajustarTrasRender)
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', ajustarAlto)
  })

  return { alto, ajustarAlto: ajustarTrasRender }
}
