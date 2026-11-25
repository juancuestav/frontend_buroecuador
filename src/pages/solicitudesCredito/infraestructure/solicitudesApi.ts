import { endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import {
  DatosCliente,
  ParametrosSolicitud,
  RevisionParaSolicitud,
  SolicitudCredito,
} from '../domain/SolicitudCredito'
import { ResumenSolicitudes } from '../domain/ResumenSolicitudes'

/**
 * Llamadas del módulo Ingreso de créditos que no son el CRUD del historial.
 * Las que modifican la solicitud devuelven { modelo, mensaje }.
 */
const axios = AxiosHttpRepository.getInstance()

type Respuesta = { modelo: SolicitudCredito; mensaje: string | null }

const base = () => axios.getEndpoint(endpoints.solicitudes_credito)
const de = (id: number) => `${base()}/${id}`

async function datos<T>(promesa: Promise<any>): Promise<T> {
  const response = await promesa
  return response.data as T
}

export const solicitudesApi = {
  revisar: (identificacion: string, forzarEquifax = false) =>
    datos<RevisionParaSolicitud>(
      axios.post(axios.getEndpoint(endpoints.solicitudes_credito_revisar), {
        identificacion,
        forzar_equifax: forzarEquifax,
      })
    ),
  /** Autoriza (con permiso) o reintenta una revisión detenida, en Revisión de créditos */
  continuarRevision: (revisionId: number) =>
    axios.post(
      axios.getEndpoint({ endpoint: endpoints.revision_creditos, id: revisionId }) +
        '/continuar',
      { forzar_equifax: false }
    ),
  crear: (revisionId: number, cliente: DatosCliente) =>
    datos<Respuesta>(axios.post(base(), { revision_credito_id: revisionId, ...cliente })),
  obtener: (id: number) => datos<Respuesta>(axios.get(de(id))),
  guardarPaso: (id: number, paso: number, cuerpo: Record<string, any>) =>
    datos<Respuesta>(axios.put(`${de(id)}/pasos/${paso}`, cuerpo)),
  enviar: (id: number) => datos<Respuesta>(axios.post(`${de(id)}/enviar`)),
  /** Asesores para "Pertenece a" */
  asesores: () =>
    datos<{ asesores: { id: number; nombre: string }[] }>(axios.get(`${base()}/asesores`)),

  subirDocumento: (id: number, documentoId: number, archivo: File) => {
    const formulario = new FormData()
    formulario.append('archivo', archivo)
    return datos<Respuesta>(
      axios.post(`${de(id)}/documentos/${documentoId}/archivo`, formulario, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
  },
  quitarDocumento: (id: number, documentoId: number) =>
    datos<Respuesta>(axios.delete(`${de(id)}/documentos/${documentoId}/archivo`)),
  noTiene: (id: number, documentoId: number, noTiene: boolean) =>
    datos<Respuesta>(axios.put(`${de(id)}/documentos/${documentoId}/no-tiene`, { no_tiene: noTiene })),
  /** PDF privado: se descarga con el token y se abre como blob */
  verDocumento: async (id: number, documentoId: number) => {
    const response: any = await axios.get(`${de(id)}/documentos/${documentoId}/archivo`, {
      responseType: 'blob',
    })
    return URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  },
  /** Descarga el PDF con su nombre original */
  descargarDocumento: async (id: number, documentoId: number, nombre: string) => {
    const response: any = await axios.get(`${de(id)}/documentos/${documentoId}/archivo?descargar=1`, {
      responseType: 'blob',
    })
    const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = nombre.toLowerCase().endsWith('.pdf') ? nombre : `${nombre}.pdf`
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000)
  },
  pedirDocumento: (id: number, nombre: string, detalle: string | null) =>
    datos<Respuesta>(axios.post(`${de(id)}/documentos`, { nombre, detalle })),
  rechazarDocumento: (id: number, documentoId: number, motivo: string) =>
    datos<Respuesta>(axios.post(`${de(id)}/documentos/${documentoId}/rechazar`, { motivo })),
  pedidoDocumento: (id: number, documentoId: number, abierto: boolean) =>
    datos<Respuesta>(axios.put(`${de(id)}/documentos/${documentoId}/pedido`, { abierto })),

  cambiarEstado: (id: number, cuerpo: Record<string, any>) =>
    datos<Respuesta>(axios.post(`${de(id)}/estado`, cuerpo)),
  comentar: (id: number, comentario: string) =>
    datos<Respuesta>(axios.post(`${de(id)}/comentarios`, { comentario })),
  comentariosAsesor: (id: number, habilitado: boolean) =>
    datos<Respuesta>(axios.put(`${de(id)}/comentarios-asesor`, { habilitado })),

  resumen: () =>
    datos<ResumenSolicitudes>(axios.get(axios.getEndpoint(endpoints.solicitudes_credito_resumen))),
  parametros: () =>
    datos<{ modelo: ParametrosSolicitud }>(
      axios.get(axios.getEndpoint(endpoints.solicitudes_credito_parametros))
    ),
  guardarParametros: (parametros: ParametrosSolicitud) =>
    datos<{ modelo: ParametrosSolicitud; mensaje: string }>(
      axios.put(axios.getEndpoint(endpoints.solicitudes_credito_parametros), parametros)
    ),
}
