const moneda = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

const numero = new Intl.NumberFormat('es-EC', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// 42488.85 → "42.488,85" (sin símbolo, como en el reporte de Equifax)
export function formatearNumero(valor: number | null | undefined): string {
  return valor === null || valor === undefined ? '—' : numero.format(valor)
}

export function formatearMoneda(valor: number | null | undefined): string {
  return valor === null || valor === undefined ? '—' : moneda.format(valor)
}

// "2020-10-27" → "27-10-2020" (sin pasar por Date para no correr la zona horaria)
export function formatearFecha(fecha: string | null | undefined): string {
  if (!fecha) return '—'
  const [anio, mes, dia] = fecha.substring(0, 10).split('-')
  return dia && mes && anio ? `${dia}-${mes}-${anio}` : fecha
}

// "2020-10-27" → "27/10/2020"
export function formatearFechaBarra(fecha: string | null | undefined): string {
  return formatearFecha(fecha).replace(/-/g, '/')
}

export function textoAnios(anios: number | null | undefined): string {
  if (anios === null || anios === undefined) return '—'
  return `${anios} ${anios === 1 ? 'año' : 'años'}`
}

export function obtenerMensajeError(error: any, porDefecto: string): string {
  const errores = error?.response?.data?.errors
  if (errores) return (Object.values(errores)[0] as string[])[0]
  return error?.response?.data?.message || porDefecto
}

// Bandas de color del score (mismas que PlanetScoreAnimation)
export function colorScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return '#90a4ae'
  if (score >= 930) return '#00a86b'
  if (score >= 850) return '#7cb342'
  if (score >= 700) return '#c0ca33'
  if (score >= 400) return '#fdd835'
  return '#e53935'
}

export function calificacionScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'Sin información'
  if (score >= 930) return 'Excelente'
  if (score >= 850) return 'Bueno'
  if (score >= 700) return 'Regular'
  if (score >= 400) return 'Bajo'
  return 'Malo'
}

export function colorSobreendeudamiento(segmentacion: string | null): string {
  switch (segmentacion) {
    case 'BAJO':
      return '#43a047'
    case 'MEDIO':
      return '#fb8c00'
    case 'ALTO':
      return '#f4511e'
    case 'MUY ALTO':
      return '#e53935'
    default:
      return '#78909c'
  }
}

/**
 * Estilo del chip moderno (fondo tenue, borde y texto del mismo tono) para un
 * color hex calculado en tiempo de ejecución. El texto se oscurece para que
 * los tonos claros (amarillos) sigan siendo legibles.
 */
export function estiloChip(hex: string): Record<string, string> {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const oscuro = (c: number) => Math.round(c * 0.62)
  return {
    color: `rgb(${oscuro(r)}, ${oscuro(g)}, ${oscuro(b)})`,
    background: `rgba(${r}, ${g}, ${b}, 0.12)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.45)`,
  }
}
