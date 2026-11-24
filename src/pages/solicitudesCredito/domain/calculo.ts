/**
 * Vista previa del cálculo de capacidad de pago (el servidor recalcula al
 * guardar; misma fórmula que CalcularCapacidadPago del backend):
 *
 *   ingreso neto      = ingresos − cuota buró
 *   capacidad de pago = porcentaje × ingreso neto
 *   monto sugerido    = capacidad × (1 − (1 + i)^−n) / i,  i = tasa anual / 12
 *   cuota             = monto × i / (1 − (1 + i)^−n)
 */
export interface Calculo {
  ingresoNeto: number
  capacidad: number
  montoSugerido: number | null
  cuota: number | null
  nuevaCuotaBuro: number | null
}

const redondear = (valor: number) => Math.round(valor * 100) / 100

export function valorPresente(cuota: number, tasaAnual: number, meses: number) {
  const i = tasaAnual / 100 / 12
  if (i === 0) return cuota * meses
  return (cuota * (1 - Math.pow(1 + i, -meses))) / i
}

export function cuotaPrestamo(monto: number, tasaAnual: number, meses: number) {
  const i = tasaAnual / 100 / 12
  if (i === 0) return monto / meses
  return (monto * i) / (1 - Math.pow(1 + i, -meses))
}

export function calcular(
  ingresos: number,
  cuotaBuro: number,
  porcentaje: number,
  tasaAnual: number,
  plazo: number | null,
  monto: number | null
): Calculo {
  const ingresoNeto = ingresos - cuotaBuro
  const capacidad = (Math.max(0, ingresoNeto) * porcentaje) / 100
  const montoSugerido = plazo ? valorPresente(capacidad, tasaAnual, plazo) : null
  const cuota = plazo && monto ? cuotaPrestamo(monto, tasaAnual, plazo) : null

  return {
    ingresoNeto: redondear(ingresoNeto),
    capacidad: redondear(capacidad),
    montoSugerido: montoSugerido === null ? null : redondear(montoSugerido),
    cuota: cuota === null ? null : redondear(cuota),
    nuevaCuotaBuro: cuota === null ? null : redondear(cuotaBuro + cuota),
  }
}
