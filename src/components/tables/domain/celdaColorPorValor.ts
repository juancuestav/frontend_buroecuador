/**
 * Crea una función `classes` para una columna de `ColumnConfig` (QTable)
 * que pinta el fondo completo de la celda según el valor de la fila.
 *
 * Reutilizable en cualquier tabla del sistema: basta con indicar cómo
 * obtener el valor de la fila y un mapa de valor -> clase(s) utilitarias
 * de Quasar (p.ej. `bg-positive text-white`, `bg-warning text-dark`).
 * Esas clases ya vienen con `!important` en el CSS de Quasar, por lo que
 * pintan la celda de forma confiable sin depender de estilos `scoped` (que
 * no llegan de forma fiable a las celdas internas del QTable de
 * EssentialTablePagination, al vivir en otro componente).
 *
 * @example
 * const colorPorEstado = celdaColorPorValor<CompraReporte>(
 *   (row) => row.estado,
 *   {
 *     pago_recibido: 'bg-blue-grey-3 text-white',
 *     reporte_generado: 'bg-warning text-dark',
 *     reporte_entregado: 'bg-positive text-white',
 *     error: 'bg-negative text-white',
 *   }
 * )
 * // configuracionColumnas: [{ name: 'estado', ..., classes: colorPorEstado }]
 */
export function celdaColorPorValor<T = any>(
  obtenerValor: (row: T) => string | null | undefined,
  mapaColores: Record<string, string>,
  colorPorDefecto = ''
): (row: T) => string {
  return (row: T) => {
    const valor = obtenerValor(row)
    if (valor == null) return colorPorDefecto
    return mapaColores[valor] ?? colorPorDefecto
  }
}
