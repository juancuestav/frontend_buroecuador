import { onActivated, onBeforeUnmount, onMounted, Ref, ref } from 'vue'

/**
 * Los gráficos de esta pantalla pueden montarse dentro de una pestaña oculta
 * o mientras el panel entra con la transición de escala de q-tab-panels.
 * ApexCharts mide con getBoundingClientRect, que incluye esa transformación,
 * y dibujaría el gráfico diminuto. Por eso se crean (o recrean) solo cuando
 * el contenedor es visible y su tamaño en pantalla coincide con el del layout
 * (transición terminada).
 *
 * Uso: `v-if="visible"` y `:key="instanciaId"` en cada gráfico del contenedor.
 */
export function useGraficoVisible(contenedor: Ref<HTMLElement | null>) {
  const visible = ref(false)
  const instanciaId = ref(0)
  let observador: ResizeObserver | null = null
  let esperando = 0

  function sinTransformacion(el: HTMLElement): boolean {
    return (
      el.offsetWidth > 0 &&
      Math.abs(el.getBoundingClientRect().width - el.offsetWidth) < 1
    )
  }

  function mostrarCuandoEsteEstable() {
    cancelAnimationFrame(esperando)
    let intentos = 0
    const revisar = () => {
      const el = contenedor.value
      if (!el || el.offsetWidth === 0) return
      if (sinTransformacion(el) || ++intentos > 90) {
        visible.value = true
        instanciaId.value++
      } else esperando = requestAnimationFrame(revisar)
    }
    esperando = requestAnimationFrame(revisar)
  }

  onMounted(() => {
    observador = new ResizeObserver(([entrada]) => {
      if (entrada.contentRect.width === 0) visible.value = false
      else if (!visible.value) mostrarCuandoEsteEstable()
    })
    if (contenedor.value) observador.observe(contenedor.value)
  })
  onBeforeUnmount(() => {
    observador?.disconnect()
    cancelAnimationFrame(esperando)
  })
  // Al volver a la página (keep-alive) o a la pestaña, se redibujan
  onActivated(() => {
    visible.value = false
    mostrarCuandoEsteEstable()
  })

  return { visible, instanciaId }
}
