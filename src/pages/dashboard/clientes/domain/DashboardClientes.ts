export type ColorAcento = 'purple' | 'orange' | 'teal' | 'blue' | 'gold' | 'indigo'

export const MESES_ES: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export const PALETA_AVATARES: ColorAcento[] = [
  'purple',
  'teal',
  'orange',
  'blue',
  'gold',
  'indigo',
]

export type TipoEventoCalendario = 'reunion' | 'corte'

export interface PeriodoDashboardClientes {
  mes: string
  anio: number
  diaActual: number
}

export interface EventoCalendarioDashboard {
  dia: number
  tipo: TipoEventoCalendario
}

export interface AsesorDashboardClientes {
  id: number
  nombre: string
  colorAvatar?: ColorAcento
  cedulasRevisadas: number
  cedulasIngresadas: number
  montoAprobado: number
}

/** Secciones del dashboard que pueden mostrarse u ocultarse de forma independiente. */
export interface VisibilidadSecciones {
  estadisticas: boolean
  resumenDiario: boolean
  indicadoresClave: boolean
  calendario: boolean
  detalleAsesores: boolean
  comparativoAsesores: boolean
  tendenciaMonto: boolean
  asesorDestacado: boolean
  novedades: boolean
}

/** Factor aleatorio de un punto de la serie diaria, relativo al promedio diario del mes. */
export interface RatioDiaria {
  ingresadosFactor: number
  aprobadosFraccion: number
}

/** Factores aleatorios de un mes histórico, relativos a los totales del mes vigente. */
export interface RatioEquipoMensual {
  revisadasRatio: number
  ingresadasRatio: number
  aprobadasRatio: number
}

/**
 * Estructura de datos del dashboard. Los campos de esta interfaz son la fuente
 * manual/editable vía el modal "Editar datos". Lo derivable (porcentajes de
 * Indicadores clave, asesor destacado, sumas de la tabla, coordenadas SVG, etc.)
 * se calcula en la página con `computed()`, nunca se guarda por duplicado.
 */
export interface DashboardClientesData {
  periodo: PeriodoDashboardClientes
  totalClientesPool: number
  perfilApto: number
  clientesIngresados: number
  clientesAprobados: number
  montoAprobadoTotal: number
  /** Denominador de la dona "Cédulas revisadas" (meta/objetivo asignado del mes). */
  cedulasAsignadas: number
  asesores: AsesorDashboardClientes[]
  eventosCalendario: EventoCalendarioDashboard[]
  novedades: string[]
  /** Factores para los 8 puntos del gráfico de área (índice 0 = "Hoy"). */
  serieDiariaRatios: RatioDiaria[]
  /** Factores para los meses previos al vigente en "Comparativo de asesores". */
  serieEquipoHistoricaRatios: RatioEquipoMensual[]
  /** Factores para los meses previos al vigente en "Tendencia de monto aprobado". */
  serieTendenciaHistoricaRatios: number[]
  visibilidad: VisibilidadSecciones
}

export function obtenerIniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/)
  const primera = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? '') : ''
  return (primera + ultima).toUpperCase()
}

// 'en-US' a propósito: el diseño usa comas como separador de miles ($186,450),
// no puntos, aunque el resto de la interfaz esté en español.
export function agruparMiles(valor: number): string {
  return valor.toLocaleString('en-US')
}

export function formatearMonto(valor: number): string {
  return '$' + agruparMiles(Math.round(valor))
}

export function calcularPorcentaje(
  numerador: number,
  denominador: number,
): number {
  return denominador ? Math.round((numerador / denominador) * 100) : 0
}

export const RADIO_DONUT = 15.5
export const CIRCUNFERENCIA_DONUT = 2 * Math.PI * RADIO_DONUT

export function calcularDashoffset(pct: number): number {
  return CIRCUNFERENCIA_DONUT * (1 - pct / 100)
}

/** Cantidad de días del mes indicado (mesIndice 0=Enero..11=Diciembre). Maneja bisiestos. */
export function diasEnMes(mesIndice: number, anio: number): number {
  return new Date(anio, mesIndice + 1, 0).getDate()
}

/**
 * Etiquetas cortas (3 letras) de los `cantidad` meses inmediatamente anteriores
 * a `mesIndice`, en orden cronológico (más antiguo primero), cruzando el límite
 * de año si hace falta.
 */
export function mesesCortosAnteriores(
  mesIndice: number,
  cantidad: number,
): string[] {
  const resultado: string[] = []
  for (let i = cantidad; i >= 1; i--) {
    const indice = (((mesIndice - i) % 12) + 12) % 12
    resultado.push(MESES_ES[indice].slice(0, 3))
  }
  return resultado
}

export function crearAsesorVacio(
  idsExistentes: number[],
): AsesorDashboardClientes {
  const siguienteId = idsExistentes.length ? Math.max(...idsExistentes) + 1 : 1
  return {
    id: siguienteId,
    nombre: '',
    cedulasRevisadas: 0,
    cedulasIngresadas: 0,
    montoAprobado: 0,
  }
}

/** Ratio entre 0 y 1, creciente con `indice` (0=más antiguo), con variación aleatoria. */
function generarRatioAscendente(
  indice: number,
  total: number,
  min: number,
  max: number,
): number {
  const progreso = total <= 1 ? 1 : indice / (total - 1)
  const base = min + (max - min) * progreso
  const ruido = (Math.random() - 0.5) * 0.06
  return Math.min(0.99, Math.max(0.05, base + ruido))
}

/** Genera factores "siempre a beneficio": crecientes hacia "Hoy", nunca negativos. */
export function generarSerieDiariaRatios(): RatioDiaria[] {
  return Array.from({ length: 8 }, (_, i) => {
    const progreso = (7 - i) / 7
    const factorBase = 0.78 + (1.08 - 0.78) * progreso
    const ruido = (Math.random() - 0.5) * 0.1
    return {
      ingresadosFactor: Math.max(0.5, factorBase + ruido),
      aprobadosFraccion: 0.55 + Math.random() * 0.13,
    }
  })
}

export function generarSerieEquipoHistoricaRatios(): RatioEquipoMensual[] {
  return Array.from({ length: 3 }, (_, i) => ({
    revisadasRatio: generarRatioAscendente(i, 3, 0.68, 0.93),
    ingresadasRatio: generarRatioAscendente(i, 3, 0.65, 0.92),
    aprobadasRatio: generarRatioAscendente(i, 3, 0.6, 0.9),
  }))
}

export function generarSerieTendenciaHistoricaRatios(): number[] {
  return Array.from({ length: 6 }, (_, i) =>
    generarRatioAscendente(i, 6, 0.5, 0.93),
  )
}

function seccionesVisiblesPorDefecto(): VisibilidadSecciones {
  return {
    estadisticas: true,
    resumenDiario: true,
    indicadoresClave: true,
    calendario: true,
    detalleAsesores: true,
    comparativoAsesores: true,
    tendenciaMonto: true,
    asesorDestacado: true,
    novedades: true,
  }
}

/**
 * Crea un dataset de ejemplo nuevo cada vez que se llama (fuente manual con
 * valores ilustrativos + series "de fondo" generadas al azar, siempre a
 * beneficio, para los gráficos que no se editan manualmente).
 */
export function crearDatosEjemploDashboardClientes(): DashboardClientesData {
  return {
    periodo: { mes: 'Julio', anio: 2026, diaActual: 28 },
    totalClientesPool: 1250,
    perfilApto: 890,
    clientesIngresados: 670,
    clientesAprobados: 402,
    montoAprobadoTotal: 198000,
    cedulasAsignadas: 1000,
    asesores: [
      {
        id: 1,
        nombre: 'Andrea Paredes',
        cedulasRevisadas: 198,
        cedulasIngresadas: 151,
        montoAprobado: 46800,
      },
      {
        id: 2,
        nombre: 'Fernando Vélez',
        cedulasRevisadas: 176,
        cedulasIngresadas: 132,
        montoAprobado: 37950,
      },
      {
        id: 3,
        nombre: 'Gabriela Ponce',
        cedulasRevisadas: 205,
        cedulasIngresadas: 158,
        montoAprobado: 51200,
      },
      {
        id: 4,
        nombre: 'Ricardo Salazar',
        cedulasRevisadas: 149,
        cedulasIngresadas: 108,
        montoAprobado: 28400,
      },
      {
        id: 5,
        nombre: 'Mónica Iza',
        cedulasRevisadas: 162,
        cedulasIngresadas: 121,
        montoAprobado: 33650,
      },
    ],
    eventosCalendario: [
      { dia: 9, tipo: 'reunion' },
      { dia: 31, tipo: 'corte' },
    ],
    novedades: [
      'Meta mensual de monto aprobado actualizada a $210,000.',
      'Se incorporaron 2 nuevos asesores este mes.',
      'Corte de cédulas pendientes: 31 de julio.',
    ],
    serieDiariaRatios: generarSerieDiariaRatios(),
    serieEquipoHistoricaRatios: generarSerieEquipoHistoricaRatios(),
    serieTendenciaHistoricaRatios: generarSerieTendenciaHistoricaRatios(),
    visibilidad: seccionesVisiblesPorDefecto(),
  }
}
