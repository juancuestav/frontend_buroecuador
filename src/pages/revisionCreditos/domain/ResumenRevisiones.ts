// Respuesta de GET api/revision-creditos/resumen (ResumenRevisionesCredito del backend)

export type PeriodoResumen = 'hoy' | 'semana' | 'mes' | 'total'
export type AtribucionAsesor = 'consulto' | 'pertenece'

// Mismos valores que el filtro "Resultado" del historial
export type EstadoResultado =
  | 'califica'
  | 'no_califica'
  | 'detenida'
  | 'pendiente_equifax'

export interface MetricasPeriodo {
  // Cada revisión cuenta, aunque se repita la cédula (estado actual)
  revisiones: Record<EstadoResultado | 'total', number>
  // Cada cédula una vez, con el resultado de su última revisión del periodo.
  // No califican incluye las detenidas; sin resultado = pendiente de Equifax.
  cedulas: {
    unicas: number
    califican: number
    no_califican: number
    no_califican_detenidas: number
    sin_resultado: number
  }
  equifax: {
    // Llamadas reales (bitácora): las exitosas son las que consumen el servicio
    consultas_exitosas: number
    intentos_fallidos: number
    // Revisiones que reutilizaron una respuesta de menos de 30 días (sin costo)
    reutilizadas: number
  }
}

export type MetricasPorPeriodo = Record<PeriodoResumen, MetricasPeriodo>

export type FilaAsesor = {
  asesor_id: number
  asesor: string
} & MetricasPorPeriodo

export interface DiaSerie {
  fecha: string
  califica: number
  no_califica: number
  detenida: number
  pendiente_equifax: number
  equifax: number
}

export interface ResumenRevisiones {
  generado_at: string
  periodos: Record<PeriodoResumen, { desde: string | null }>
  resumen: MetricasPorPeriodo
  // null sin permiso para ver todas las revisiones
  por_asesor: Record<AtribucionAsesor, FilaAsesor[]> | null
  serie_mes: DiaSerie[]
}

export const PERIODOS: PeriodoResumen[] = ['hoy', 'semana', 'mes', 'total']

export interface DefinicionEstado {
  clave: EstadoResultado
  label: string
  icono: string
  ayuda: string
}

export const ESTADOS_RESULTADO: DefinicionEstado[] = [
  {
    clave: 'califica',
    label: 'Califica',
    icono: 'bi-check-circle',
    ayuda: 'Cumplió edad, relación laboral (IESS o RUC) y score de Equifax.',
  },
  {
    clave: 'no_califica',
    label: 'No califica',
    icono: 'bi-x-circle',
    ayuda:
      'Revisión finalizada que no cumplió todas las validaciones (las detenidas se cuentan aparte, como en el historial).',
  },
  {
    clave: 'detenida',
    label: 'Detenida',
    icono: 'bi-pause-circle',
    ayuda:
      'Falló la edad o la relación laboral y no se continuó con las siguientes validaciones. No puede calificar.',
  },
  {
    clave: 'pendiente_equifax',
    label: 'Pendiente Equifax',
    icono: 'bi-hourglass-split',
    ayuda: 'La consulta a Equifax falló y la revisión no se ha reintentado.',
  },
]

// Orden de apilado del gráfico: verde y rojo nunca quedan contiguos
export const ORDEN_APILADO: EstadoResultado[] = [
  'califica',
  'pendiente_equifax',
  'detenida',
  'no_califica',
]

/**
 * Colores de los resultados, alineados con la marca (índigo/lavanda) y
 * validados para daltonismo y contraste en cada tema (ver ORDEN_APILADO).
 * El texto nunca usa estos colores: van en una muestra junto a la etiqueta.
 */
export const COLORES_RESULTADO: Record<
  'claro' | 'oscuro',
  Record<EstadoResultado | 'equifax', string>
> = {
  claro: {
    califica: '#13876a',
    no_califica: '#d3405e',
    detenida: '#e6a540',
    pendiente_equifax: '#9599b6',
    equifax: '#4f52b3',
  },
  oscuro: {
    califica: '#1fa07c',
    no_califica: '#e0506e',
    detenida: '#c4862a',
    pendiente_equifax: '#666a85',
    equifax: '#7f83d6',
  },
}

/**
 * Porcentaje entero (o null si no hay base, para mostrar "—" en vez de 0 %).
 */
export function porcentaje(parte: number, base: number): number | null {
  return base > 0 ? Math.round((parte / base) * 100) : null
}

/**
 * % que califica sobre las cédulas con resultado (excluye las pendientes de Equifax).
 */
export function porcentajeCalifica(
  c: MetricasPeriodo['cedulas']
): number | null {
  return porcentaje(c.califican, c.califican + c.no_califican)
}

/**
 * % de revisiones que llegaron a Equifax sin pagar una consulta nueva.
 */
export function porcentajeAhorro(e: MetricasPeriodo['equifax']): number | null {
  return porcentaje(e.reutilizadas, e.reutilizadas + e.consultas_exitosas)
}
