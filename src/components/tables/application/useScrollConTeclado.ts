import { nextTick, onMounted, onUpdated, Ref } from 'vue'

/**
 * Permite desplazar las filas de una q-table con las flechas del teclado.
 *
 * El área de filas (.q-table__middle) es la que tiene el scroll, pero no
 * recibe el foco: al hacer clic en la tabla el foco se iba al layout y las
 * flechas no la movían. Con tabindex="0" se enfoca al hacer clic en
 * cualquier parte de la tabla (celdas, encabezado) o al llegar con Tab, y el
 * navegador desplaza con ←/→ (horizontal) y ↑/↓ (vertical).
 *
 * Se vuelve a aplicar tras cada actualización porque q-table puede recrear el
 * área de filas (p. ej. al pasar a la vista de tarjetas en el celular).
 *
 * @param refTabla ref al componente q-table
 */
export function useScrollConTeclado(refTabla: Ref) {
  function hacerEnfocable() {
    const el: HTMLElement | undefined = refTabla.value?.$el
    const filas = el?.querySelector<HTMLElement>('.q-table__middle')
    if (filas && !filas.hasAttribute('tabindex')) {
      filas.setAttribute('tabindex', '0')
    }
  }

  onMounted(() => nextTick(hacerEnfocable))
  onUpdated(() => nextTick(hacerEnfocable))
}
