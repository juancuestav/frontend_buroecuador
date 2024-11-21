/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'

export class ApiError extends Error {
  erroresValidacion: string[]
  mensaje: string
  status?: number

  constructor(error: AxiosError) {
    super()
    this.mensaje = (error.response?.data as { mensaje: string }).mensaje

    this.erroresValidacion = this.obtenerMensajesError(error)
    this.status = error.response?.status
  }

  private obtenerMensajesError(error: AxiosError): string[] {
    const mensajes: any[] = []
    if ((error.response?.data as { errors: any }).errors) {
      const errores = Object.values(
        (error?.response?.data as { errors: any }).errors
      )
      mensajes.push(...errores.flat())
    }
    return mensajes
  }
}
