import { nextTick, onActivated, onBeforeUnmount, onMounted, Ref, ref } from 'vue'

/**
 * Alto mínimo del área de filas (sin buscador, filtros ni paginación): unas
 * 3 filas. En 1366x768 Usuarios deja ~186px y cabe en la primera pantalla;
 * el historial de Revisión de créditos empieza bajo el resumen, fuera de la
 * primera pantalla, y pasa a pantalla completa.
 */
const ALTO_MINIMO_FILAS = 150
/** Espacio bajo la tabla: padding del panel de pestañas y de la página */
const MARGEN_INFERIOR = 40
/** Algo más que la transición de las pestañas de TabLayout (~300 ms) */
const DURACION_TRANSICION = 600

/**
 * Calcula el alto de una q-table para que su área de filas, con la barra de
 * scroll horizontal al pie, quede dentro de la ventana.
 *
 * - Si la tabla cabe en la primera pantalla con al menos ALTO_MINIMO_FILAS de
 *   filas, termina justo al borde inferior de la ventana.
 * - Si empieza muy abajo (p. ej. debajo de un resumen), ocupa una pantalla
 *   completa: al bajar hasta ella se ve entera.
 *
 * El alto lo comparten las filas con el buscador, los filtros avanzados y la
 * paginación (están dentro de la q-table), así que se mide lo que ocupan y se
 * recalcula cuando cambian (al abrir o cerrar los filtros).
 *
 * @param refTabla ref al componente q-table
 * @returns `alto` en px, o null si la tabla aún no es visible
 */
export function useAltoTablaVisible(refTabla: Ref) {
  const alto = ref<number | null>(null)

  /** Alto de lo que no son filas: barra superior (buscador, filtros) e inferior */
  function altoSinFilas(el: HTMLElement) {
    const arriba = el.querySelector<HTMLElement>('.q-table__top')
    const abajo = el.querySelector<HTMLElement>('.q-table__bottom')
    return (arriba?.offsetHeight ?? 0) + (abajo?.offsetHeight ?? 0)
  }

  function ajustarAlto() {
    const el: HTMLElement | undefined = refTabla.value?.$el
    // offsetParent es null mientras la pestaña del listado está oculta
    if (!el || !el.offsetParent) return

    const sinFilas = altoSinFilas(el)
    const inicio = el.getBoundingClientRect().top + window.scrollY
    const hastaElBorde = window.innerHeight - inicio - MARGEN_INFERIOR
    const pantallaCompleta = window.innerHeight - 2 * MARGEN_INFERIOR

    const preferido =
      hastaElBorde - sinFilas >= ALTO_MINIMO_FILAS
        ? hastaElBorde
        : pantallaCompleta
    alto.value = Math.max(preferido, sinFilas + ALTO_MINIMO_FILAS)
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

  // Abrir o cerrar los filtros avanzados cambia el alto de la barra superior
  const observador =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => ajustarAlto())
  function observarBarras() {
    const el: HTMLElement | undefined = refTabla.value?.$el
    if (!el || !observador) return
    observador.disconnect()
    el.querySelectorAll('.q-table__top, .q-table__bottom').forEach((barra) =>
      observador.observe(barra)
    )
  }

  onMounted(() => {
    ajustarTrasRender()
    nextTick(observarBarras)
    window.addEventListener('resize', ajustarAlto)
  })
  onActivated(ajustarTrasRender)
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    observador?.disconnect()
    window.removeEventListener('resize', ajustarAlto)
  })

  return { alto, ajustarAlto: ajustarTrasRender }
}
