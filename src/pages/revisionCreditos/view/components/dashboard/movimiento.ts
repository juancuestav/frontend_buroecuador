/**
 * Respeta la preferencia del sistema de reducir animaciones.
 */
export function movimientoReducido(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}
