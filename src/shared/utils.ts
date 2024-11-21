/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { date } from 'quasar'
import { ColumnConfig } from 'src/components/tables/domain/ColumnConfig'
import { EntidadAuditable } from './entidad/domain/entidadAuditable'
import { ApiError } from './error/domain/ApiError'
import { apiConfig } from 'config/api'

export function limpiarListado<T>(listado: T[]): void {
  listado.splice(0, listado.length)
}

export function reemplazarListado<T>(listado: T[], elementos: T[]): void {
  listado.splice(0, listado.length, ...elementos)
}

export function compararObjetos(
  data_inicial?: EntidadAuditable,
  data_final?: EntidadAuditable
): boolean {
  return JSON.stringify(data_inicial) !== JSON.stringify(data_final)
}

export function validarKeyBuscar(keyCode?: number): boolean {
  return keyCode === 9 || keyCode === 13
}

export function validarEmail(email?: string): boolean {
  const validador =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return validador.test(String(email).toLowerCase())
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function descargarArchivo(
  data: any,
  titulo: string,
  formato: string
): void {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(
    new Blob([data], { type: `application/${formato}` })
  )
  link.setAttribute('download', `${titulo}.${formato}`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function descargarArchivoUrl(url: string): void {
  const link = document.createElement('a')
  link.href = apiConfig.URL_BASE + url
  link.target = '_blank'
  link.click()
  link.remove()
}

export async function downloadFile(data, titulo, formato) {
  const fileURL = URL.createObjectURL(
    new Blob([data], { type: `appication/${formato}` })
  )
  const link = document.createElement('a')
  link.href = fileURL
  link.target = '_blank'
  link.setAttribute('download', `${titulo}.${formato}`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function agregarCerosIzquierda(
  num: string | number,
  size: number
): string {
  const parse = typeof num === 'string' ? parseInt(num === '' ? '1' : num) : num
  return (Math.pow(10, size) + parse).toString().substring(1)
}

/* imprimirArchivo(data: any, formato: PrintTypes) {
    const objectUrl = URL.createObjectURL(
      new Blob([data], {type: `application/${formato}`})
    )
    PrintJS({
      printable: objectUrl,
      type: formato
    })
  } */

export function clonar(data: EntidadAuditable): any {
  return JSON.parse(JSON.stringify(data))
}

export function crearIconoHtml(icon: string): any {
  const iconHTML = document.createElement('i')
  iconHTML.classList.add('bi', icon)
  return iconHTML
}

export function quitarComasNumero(num: string): string {
  let formateo = '0'
  if (num !== undefined) {
    num = `${num}`
    formateo = num.toString()
    formateo = formateo.replace(/,/gi, '')
  }
  return formateo
}

export function convertirDecimalFloat(num: string): number {
  return typeof num === 'undefined' ||
    num === null ||
    num === '' ||
    num === '.' ||
    num.toString() === 'NaN'
    ? 0
    : parseFloat(quitarComasNumero(num))
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function redondear(numero: any, decimales = 6): number {
  numero = numero ? numero : 0
  numero = convertirDecimalFloat(numero)
  return +`${Math.round(parseFloat(`${numero}e+${decimales}`))}e-${decimales}`
}

/**
 *
 * @param entidad: Instancia de entidad
 * @param atributos: Array de atributos que se desean redondear
 * @param decimales: Cantidad de decimales
 */
export function redondearAtributos<R = Record<string, number>>(
  entidad: R,
  atributos: (keyof R)[],
  decimales: number
): void {
  for (const atributo of atributos) {
    entidad[atributo] = redondear(entidad[atributo], decimales) as any
  }
}

export function formatoNumeroTexto(
  amount: number,
  decimalCount: number
): string {
  return amount
    .toFixed(decimalCount)
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

export function resaltarCampoNoValido(errors: string[]): boolean | null {
  return errors.length > 0 ? false : null
}

export function mensajeCampoNoValido(errors: string[]): string {
  return errors[0]
}

export function obtenerStringCerosUno(cantidadCeros: number): string {
  return (Math.pow(10, cantidadCeros) + 1).toString().substring(1)
}

export function generarFilters<T>(
  listaIDs: number[],
  campoFiltrado: keyof T
): string | null {
  let res = ''
  listaIDs.forEach((id: number, index: number) => {
    res += `${index > 0 ? '|' : ''}(${campoFiltrado.toString()}=${id})`
  })
  if (listaIDs.length === 0) return null
  return res
}

export function partirNumeroDocumento(numeroDocumento: string): string[] {
  return numeroDocumento.split('-')
}

export function construirNumeroDocumento(
  establecimiento: string,
  punto_emision: string,
  secuencial: string
): string {
  return `${establecimiento}-${punto_emision}-${secuencial}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

export function isAxiosError(candidate: any): candidate is ApiError {
  return candidate instanceof ApiError === true
}

export async function notificarMensajesError(
  mensajes: string[],
  notificaciones: any
): Promise<void> {
  for (let i = 0; i < mensajes.length; i++) {
    notificaciones.notificarAdvertencia(mensajes[i])
  }
}

export function gestionarNotificacionError(
  error: any,
  notificaciones: any
): void {
  if (isAxiosError(error)) {
    const mensajes: string[] = error.erroresValidacion
    if (mensajes.length > 0) {
      notificarMensajesError(mensajes, notificaciones)
    } else {
      if (error.status === 413) {
        notificaciones.notificarAdvertencia(
          'El tamaño del archivo es demasiado grande.'
        )
      } else {
        notificaciones.notificarAdvertencia(error.mensaje)
      }
    }
  } else {
    notificaciones.notificarAdvertencia(error.message)
  }
}

export function wrap(el: HTMLElement, wrapper: HTMLElement) {
  el.parentNode?.insertBefore(wrapper, el)
  wrapper.appendChild(el)
}

export function resetInput(input: HTMLElement) {
  const form = document.createElement('form')
  wrap(input, form)
  form.reset()
}

export function getVisibleColumns<T>(
  configuracionColumnas: ColumnConfig<T>[]
): string[] {
  const columnas: string[] = []
  for (const columna of configuracionColumnas) {
    if (!columna.hasOwnProperty('visible') || columna.visible)
      columnas.push(columna.field.toString())
  }

  return columnas
}

export function getIndexOf(listado: any[], id: number) {
  return listado.findIndex((item: any) => item.id === id)
}

export function obtenerFechaActual() {
  const timeStamp = Date.now()
  const formattedString = date.formatDate(timeStamp, 'DD-MM-YYYY')
  return formattedString
}

export function obtenerMensajesError() {
  //
}

export function findIndexById(listado: any[], id: number) {
  return listado.findIndex((item: any) => item.id === id)
}

export function textToCapitalize(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

export function obtenerMesesAnteriores(cantidadMesesRestar: number): string[] {
  let endDate = new Date(Date.now())
  const startDate = date.subtractFromDate(endDate, {
    months: cantidadMesesRestar,
  })

  const meses: string[] = []

  while (endDate > startDate) {
    meses.push(textToCapitalize(date.formatDate(endDate, 'MMMM YYYY')))
    endDate = date.subtractFromDate(endDate, { months: 1 })
  }

  return meses
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function ordenarLista(lista, clave: string) {
  lista.sort((a, b) => ordernarListaString(a[clave], b[clave]))
}

/**
 *  Función de comparación para ordenar dos strings, se debe usar de la siguiente manera:
 * (a,b)=>ordenarListaString(a.propiedad, b.propiedad)
 * @param a primer string
 * @param b segundo string
 * @returns el valor de ordenación segun sea menor, mayor o igual la comparación dada
 */
export function ordernarListaString(a: string, b: string) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

